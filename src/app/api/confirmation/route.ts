import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  checkFeeXPayStatus,
  mapFeeXPayStatus,
  FEEXPAY_DEMO_MODE,
} from "@/lib/feexpay";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const registrationId = url.searchParams.get("registrationId");

  if (!registrationId) {
    return NextResponse.json(
      { success: false, error: "Missing registrationId" },
      { status: 400 }
    );
  }

  const participant = await db.participant.findUnique({
    where: { registrationId },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  if (!participant) {
    return NextResponse.json(
      { success: false, error: "Inscription introuvable" },
      { status: 404 }
    );
  }

  let lastPayment = participant.payments[0] || null;

  // In production (not demo), if there's a PENDING payment with a FeeXPay
  // reference, re-poll FeeXPay to check if the status has changed.
  // This is critical for Mobile Money flow where the user receives a USSD
  // push on their phone — there's no redirect, so we must poll.
  if (
    !FEEXPAY_DEMO_MODE &&
    lastPayment &&
    lastPayment.status === "PENDING" &&
    lastPayment.feexpayReference
  ) {
    try {
      const statusRes = await checkFeeXPayStatus(lastPayment.feexpayReference);
      const mapped = mapFeeXPayStatus(statusRes.status);

      if (mapped !== lastPayment.status) {
        await db.payment.update({
          where: { id: lastPayment.id },
          data: {
            status: mapped,
            feexpayTransaction: lastPayment.feexpayReference,
          },
        });

        if (mapped === "SUCCESS") {
          const newStatus =
            lastPayment.type === "FORMATION" ? "PAID_FULL" : "PAID_INSCRIPTION";
          await db.participant.update({
            where: { id: participant.id },
            data: { status: newStatus, paymentType: lastPayment.type },
          });

          // Reload participant to get fresh status
          const updatedParticipant = await db.participant.findUnique({
            where: { id: participant.id },
            include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } },
          });
          if (updatedParticipant) {
            lastPayment = updatedParticipant.payments[0] || lastPayment;

            // Send emails (fire and forget)
            sendConfirmationEmail(updatedParticipant.email, {
              participant: updatedParticipant,
              payment: { ...lastPayment, status: "SUCCESS" },
            }).catch((e) =>
              console.error("[confirmation] email error:", e?.message || e)
            );
            sendAdminNotification(
              "PAYMENT_CONFIRMED",
              updatedParticipant,
              { ...lastPayment, status: "SUCCESS" }
            ).catch((e) =>
              console.error(
                "[confirmation] admin notification error:",
                e?.message || e
              )
            );
          }
        }
      }
    } catch {
      // fall through to return current DB status
    }
  }

  return NextResponse.json({
    success: true,
    participant: {
      id: participant.id,
      registrationId: participant.registrationId,
      nomComplet: participant.nomComplet,
      prenoms: participant.prenoms,
      email: participant.email,
      telWhatsApp: participant.telWhatsApp,
      status: participant.status,
      paymentType: participant.paymentType,
      createdAt: participant.createdAt,
    },
    payment: lastPayment
      ? {
          id: lastPayment.id,
          status: lastPayment.status,
          amount: lastPayment.amount,
          type: lastPayment.type,
          provider: lastPayment.provider,
          providerPhone: lastPayment.providerPhone,
          feexpayTransaction: lastPayment.feexpayTransaction,
          paymentUrl: lastPayment.paymentUrl,
          createdAt: lastPayment.createdAt,
        }
      : null,
  });
}
