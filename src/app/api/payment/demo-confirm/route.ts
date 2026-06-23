import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const token = process.env.FLEXPAY_MERCHANT_TOKEN;
  if (token) {
    return NextResponse.json(
      { success: false, error: "Demo endpoint disabled in production" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json(
      { success: false, error: "Missing paymentId" },
      { status: 400 }
    );
  }

  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: { participant: true },
  });

  if (!payment) {
    return NextResponse.json(
      { success: false, error: "Payment not found" },
      { status: 404 }
    );
  }

  const txRef = `DEMO-TX-${Date.now()}`;
  await db.payment.update({
    where: { id: payment.id },
    data: { status: "SUCCESS", flexpayTransaction: txRef },
  });

  const newStatus =
    payment.type === "COMPLET" ? "PAID_FULL" : "PAID_INSCRIPTION";
  await db.participant.update({
    where: { id: payment.participantId },
    data: { status: newStatus, paymentType: payment.type },
  });

  sendConfirmationEmail(payment.participant.email, {
    participant: payment.participant,
    payment: { ...payment, status: "SUCCESS", flexpayTransaction: txRef },
  }).catch((e) => console.error("[demo-confirm] email error:", e?.message || e));

  const redirectUrl = `/confirmation?registrationId=${encodeURIComponent(
    payment.participant.registrationId
  )}`;
  return NextResponse.redirect(new URL(redirectUrl, url.origin));
}

export const dynamic = "force-dynamic";
