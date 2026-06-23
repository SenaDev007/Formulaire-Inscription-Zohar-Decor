import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { initFlexpayPayment, FLEXPAY_DEMO_MODE } from "@/lib/flexpay";
import { TRAINING_INFO } from "@/lib/email";

const schema = z.object({
  participantId: z.string().min(1),
  paymentType: z.enum(["INSCRIPTION", "COMPLET"]),
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

    const participant = await db.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Participant introuvable" },
        { status: 404 }
      );
    }

    if (
      participant.status === "PAID_INSCRIPTION" ||
      participant.status === "PAID_FULL"
    ) {
      return NextResponse.json(
        { success: false, error: "Ce participant a déjà payé.", participant },
        { status: 409 }
      );
    }

    const amount =
      paymentType === "COMPLET"
        ? TRAINING_INFO.fullFee
        : TRAINING_INFO.inscriptionFee;

    const payment = await db.payment.create({
      data: {
        participantId,
        amount,
        type: paymentType,
        provider,
        providerPhone: providerPhone || null,
        status: "PENDING",
      },
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/payment/webhook`;

    const init = await initFlexpayPayment({
      merchant_phone: providerPhone || "",
      amount,
      currency: "XOF",
      reference: participant.registrationId,
      callback_url: callbackUrl,
      type: provider === "CARD" ? 2 : 1,
      description: `Inscription Zohar Décor — ${participant.registrationId} — ${paymentType}`,
    });

    let paymentUrl = init.payment_url;
    let flexpayOrderNumber = init.orderNumber;

    if (FLEXPAY_DEMO_MODE) {
      paymentUrl = `/api/payment/demo-confirm?paymentId=${payment.id}`;
      flexpayOrderNumber = `DEMO-${payment.id}`;
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        flexpayReference: init.reference || null,
        flexpayOrderNumber,
        paymentUrl,
      },
    });

    return NextResponse.json({
      success: true,
      payment: { ...payment, paymentUrl, flexpayOrderNumber },
      demoMode: FLEXPAY_DEMO_MODE,
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
