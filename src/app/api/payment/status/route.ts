import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  checkFeeXPayStatus,
  mapFeeXPayStatus,
  FEEXPAY_DEMO_MODE,
} from "@/lib/feexpay";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

/**
 * Poll a payment's status by paymentId.
 * Used by the confirmation page to check if a Mobile Money payment has been
 * confirmed (the user receives a USSD push on their phone, no redirect).
 *
 * Query: ?paymentId=xxx
 *
 * In production (not demo mode), this endpoint re-polls FeeXPay's GET status
 * endpoint to get the authoritative status, then updates our DB if it changed.
 */
export async function GET(req: NextRequest) {
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

  // If payment is still PENDING and we have a FeeXPay reference, re-poll
  // FeeXPay for the authoritative status (production mode only)
  if (
    !FEEXPAY_DEMO_MODE &&
    payment.status === "PENDING" &&
    payment.feexpayReference
  ) {
    try {
      const statusRes = await checkFeeXPayStatus(payment.feexpayReference);
      const mapped = mapFeeXPayStatus(statusRes.status);

      if (mapped !== payment.status) {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: mapped,
            feexpayTransaction: payment.feexpayReference,
          },
        });

        if (mapped === "SUCCESS") {
          const newStatus =
            payment.type === "COMPLET" ? "PAID_FULL" : "PAID_INSCRIPTION";
          await db.participant.update({
            where: { id: payment.participantId },
            data: { status: newStatus, paymentType: payment.type },
          });

          const updatedParticipant = await db.participant.findUnique({
            where: { id: payment.participantId },
          });
          if (updatedParticipant) {
            sendConfirmationEmail(updatedParticipant.email, {
              participant: updatedParticipant,
              payment: { ...payment, status: "SUCCESS" },
            }).catch((e) =>
              console.error("[payment/status] email error:", e?.message || e)
            );
            sendAdminNotification(
              "PAYMENT_CONFIRMED",
              updatedParticipant,
              { ...payment, status: "SUCCESS" }
            ).catch((e) =>
              console.error(
                "[payment/status] admin notification error:",
                e?.message || e
              )
            );
          }
        }

        return NextResponse.json({
          success: true,
          payment: {
            id: payment.id,
            status: mapped,
            amount: payment.amount,
            type: payment.type,
            provider: payment.provider,
            feexpayReference: payment.feexpayReference,
            feexpayTransaction: payment.feexpayReference,
          },
          participant: {
            id: payment.participant.id,
            registrationId: payment.participant.registrationId,
            status:
              mapped === "SUCCESS"
                ? payment.type === "COMPLET"
                  ? "PAID_FULL"
                  : "PAID_INSCRIPTION"
                : payment.participant.status,
          },
        });
      }
    } catch {
      // fall through to return current DB status
    }
  }

  return NextResponse.json({
    success: true,
    payment: {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      type: payment.type,
      provider: payment.provider,
      feexpayReference: payment.feexpayReference,
      feexpayTransaction: payment.feexpayTransaction,
    },
    participant: {
      id: payment.participant.id,
      registrationId: payment.participant.registrationId,
      status: payment.participant.status,
    },
  });
}
