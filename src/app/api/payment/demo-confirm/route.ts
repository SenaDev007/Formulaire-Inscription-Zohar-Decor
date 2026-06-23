import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

/**
 * DEMO MODE ONLY — simulates a FeeXPay success webhook.
 * Usage: GET /api/payment/demo-confirm?paymentId=xxx&reference=xxx&feexpayRef=xxx
 * Auto-marks the payment as SUCCESS and triggers confirmation flow.
 *
 * In production (FEEXPAY_API_TOKEN + FEEXPAY_SHOP_ID set), this endpoint
 * refuses to run.
 */
export async function GET(req: NextRequest) {
  const token = process.env.FEEXPAY_API_TOKEN;
  const shop = process.env.FEEXPAY_SHOP_ID;
  if (token && shop) {
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

  const txRef =
    payment.feexpayReference || `DEMO-TX-${Date.now()}`;
  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      feexpayTransaction: txRef,
    },
  });

  const newStatus =
    payment.type === "FORMATION" ? "PAID_FULL" : "PAID_INSCRIPTION";
  await db.participant.update({
    where: { id: payment.participantId },
    data: { status: newStatus, paymentType: payment.type },
  });

  // Reload participant to get updated status for emails
  const updatedParticipant = await db.participant.findUnique({
    where: { id: payment.participantId },
  });

  // Fire and forget emails
  if (updatedParticipant) {
    sendConfirmationEmail(updatedParticipant.email, {
      participant: updatedParticipant,
      payment: { ...payment, status: "SUCCESS", feexpayTransaction: txRef },
    }).catch((e) =>
      console.error("[demo-confirm] email error:", e?.message || e)
    );

    // Admin notification
    sendAdminNotification(
      "PAYMENT_CONFIRMED",
      updatedParticipant,
      { ...payment, status: "SUCCESS", feexpayTransaction: txRef }
    ).catch((e) =>
      console.error("[demo-confirm] admin notification error:", e?.message || e)
    );
  }

  // Redirect to confirmation page
  const redirectUrl = `/confirmation?registrationId=${encodeURIComponent(
    payment.participant.registrationId
  )}`;
  return NextResponse.redirect(new URL(redirectUrl, url.origin));
}

export const dynamic = "force-dynamic";
