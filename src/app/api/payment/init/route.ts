import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  initFeeXPayPayment,
  mapProviderToReseau,
  FEEXPAY_DEMO_MODE,
} from "@/lib/feexpay";
import { TRAINING_INFO } from "@/lib/email";

const schema = z.object({
  participantId: z.string().min(1),
  paymentType: z.enum(["INSCRIPTION", "FORMATION"]),
  provider: z.enum(["MTN_MOMO", "MOOV_MONEY", "CELTIIS_CASH", "CARD"]),
  providerPhone: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { participantId, paymentType, provider, providerPhone } = parsed.data;

    // For INSCRIPTION (first payment), the participant may not exist yet
    // if we're using the new flow. Try to find them.
    const participant = await db.participant.findUnique({
      where: { id: participantId },
    });

    if (participant) {
      // Existing participant — enforce 2-step payment process
      if (paymentType === "INSCRIPTION" && participant.status !== "UNPAID") {
        return NextResponse.json(
          {
            success: false,
            error: "Vous avez déjà payé les frais d'inscription. Procédez au paiement des frais de formation (20 000 FCFA).",
            participant,
          },
          { status: 409 }
        );
      }
      if (paymentType === "FORMATION" && participant.status !== "PAID_INSCRIPTION") {
        return NextResponse.json(
          {
            success: false,
            error: "Vous devez d'abord payer les frais d'inscription (5 000 FCFA) avant de payer les frais de formation.",
            participant,
          },
          { status: 409 }
        );
      }
      if (participant.status === "PAID_FULL") {
        return NextResponse.json(
          { success: false, error: "Ce participant a déjà payé l'intégralité.", participant },
          { status: 409 }
        );
      }
    }

    // Card payments require a phone number
    if (!providerPhone || providerPhone.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: "Numéro de téléphone requis pour le paiement" },
        { status: 400 }
      );
    }

    // Prevent duplicate pending payments — if there's already a PENDING
    // payment, reuse it rather than creating a new one
    const existingPending = await db.payment.findFirst({
      where: { participantId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (existingPending) {
      // If the existing pending payment is the same type, return it
      if (existingPending.type === paymentType) {
        return NextResponse.json({
          success: true,
          payment: {
            ...existingPending,
            feexpayReference: existingPending.feexpayReference,
            paymentUrl: existingPending.paymentUrl,
            status: "PENDING",
          },
          demoMode: FEEXPAY_DEMO_MODE,
          redirectRequired: !!existingPending.paymentUrl,
          message: "Un paiement est déjà en cours pour ce participant.",
        });
      }
      // Otherwise, cancel the old pending payment before creating a new one
      await db.payment.update({
        where: { id: existingPending.id },
        data: { status: "CANCELLED" },
      });
    }

    // Card payments require a phone number too (FeeXPay uses it as customer phone)
    if (!providerPhone || providerPhone.trim().length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Numéro de téléphone requis pour le paiement",
        },
        { status: 400 }
      );
    }

    const amount =
      paymentType === "FORMATION"
        ? TRAINING_INFO.trainingFee
        : TRAINING_INFO.inscriptionFee;

    // Create the payment record first
    const payment = await db.payment.create({
      data: {
        participantId,
        amount,
        type: paymentType,
        provider,
        providerPhone,
        status: "PENDING",
      },
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/payment/webhook`;

    const init = await initFeeXPayPayment({
      amount,
      phoneNumber: providerPhone,
      provider: mapProviderToReseau(provider),
      fullName: participant ? `${participant.prenoms} ${participant.nomComplet}` : "Client",
      email: participant ? participant.email : "",
      reference: participant ? participant.registrationId : `ZD-${Date.now()}`,
      callbackUrl,
      cardFirstName: participant?.prenoms || "Client",
      cardLastName: participant?.nomComplet || "",
      country: "Bénin",
      address: participant?.ville || "Cotonou",
      district: participant?.ville || "Cotonou",
      currency: "XOF",
    });

    if (init.status !== "SUCCESS") {
      // Mark payment as failed
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      // Return a clear, user-friendly error message
      let userError = init.message || "Le paiement n'a pas pu être initié. Vérifiez votre numéro Mobile Money et réessayez.";
      if (userError.includes("Not Registered") || userError.includes("LOW_BALANCE")) {
        userError = "Ce numéro n'est pas enregistré au Mobile Money ou le solde est insuffisant. Vérifiez votre numéro et réessayez.";
      }

      return NextResponse.json(
        {
          success: false,
          error: userError,
        },
        { status: 200 }
      );
    }

    // Persist the FeeXPay reference + payment URL
    const feexpayReference = init.reference || init.transref || null;
    let paymentUrl = init.paymentUrl || null;

    // In DEMO mode, the paymentUrl returned by initFeeXPayPayment already
    // points to /api/payment/demo-confirm?reference=...&feexpayRef=...
    // We append our internal paymentId so demo-confirm can find the row.
    if (FEEXPAY_DEMO_MODE && paymentUrl) {
      const sep = paymentUrl.includes("?") ? "&" : "?";
      paymentUrl = `${paymentUrl}${sep}paymentId=${payment.id}`;
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        feexpayReference,
        feexpayOrderNumber: feexpayReference, // alias for compat
        paymentUrl,
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        ...payment,
        feexpayReference,
        paymentUrl,
        status: "PENDING",
      },
      demoMode: FEEXPAY_DEMO_MODE,
      // For card: user must be redirected to paymentUrl
      // For MoMo: user receives a push on their phone, we poll the status
      redirectRequired: !!paymentUrl,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[payment/init] error:", msg);
    return NextResponse.json(
      { success: false, error: `Erreur d'initialisation du paiement : ${msg}` },
      { status: 500 }
    );
  }
}
