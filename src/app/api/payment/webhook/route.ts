import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyFlexpayWebhook, mapFlexpayStatus } from "@/lib/flexpay";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-flexpay-signature");

    if (!verifyFlexpayWebhook(signature, raw)) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = JSON.parse(raw);
    const { orderNumber, reference, status, transaction, phone } = body || {};

    if (!orderNumber && !reference) {
      return NextResponse.json(
        { success: false, error: "Missing reference" },
        { status: 400 }
      );
    }

    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { flexpayOrderNumber: orderNumber as string },
          { flexpayReference: reference as string },
        ],
      },
      include: { participant: true },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    const mapped = mapFlexpayStatus(status as never);
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: mapped,
        flexpayTransaction: transaction || payment.flexpayTransaction || null,
        providerPhone: phone || payment.providerPhone || null,
      },
    });

    if (mapped === "SUCCESS") {
      const newStatus =
        payment.type === "COMPLET" ? "PAID_FULL" : "PAID_INSCRIPTION";
      await db.participant.update({
        where: { id: payment.participantId },
        data: { status: newStatus, paymentType: payment.type },
      });

      sendConfirmationEmail(payment.participant.email, {
        participant: payment.participant,
        payment,
      }).catch((e) =>
        console.error("[webhook] email send error:", e?.message || e)
      );
    }

    return NextResponse.json({ success: true, status: mapped });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[payment/webhook] error:", msg);
    return NextResponse.json(
      { success: false, error: "Webhook error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");
  const orderNumber = url.searchParams.get("orderNumber");

  if (!paymentId && !orderNumber) {
    return NextResponse.json(
      { success: false, error: "Missing paymentId or orderNumber" },
      { status: 400 }
    );
  }

  const payment = await db.payment.findFirst({
    where: {
      OR: [{ id: paymentId || "" }, { flexpayOrderNumber: orderNumber || "" }],
    },
    include: { participant: true },
  });

  if (!payment) {
    return NextResponse.json(
      { success: false, error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    payment: {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      type: payment.type,
      provider: payment.provider,
      participant: {
        id: payment.participant.id,
        registrationId: payment.participant.registrationId,
        name: payment.participant.nomComplet,
        email: payment.participant.email,
        status: payment.participant.status,
      },
    },
  });
}
