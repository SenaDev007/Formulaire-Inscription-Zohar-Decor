import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyFeeXPayWebhook,
  checkFeeXPayStatus,
  mapFeeXPayStatus,
  FEEXPAY_DEMO_MODE,
} from "@/lib/feexpay";
import { sendConfirmationEmail } from "@/lib/email";

/**
 * FeeXPay webhook. FeeXPay calls this URL (passed as callback_url during
 * payment init) when a transaction reaches a final state.
 *
 * In DEMO mode, verification is bypassed.
 *
 * FeeXPay's webhook payload is informational — it does NOT include a
 * cryptographic signature. To be safe, when a webhook arrives we ALWAYS
 * re-poll the GET status endpoint to confirm the final state.
 *
 * Body shape (FeeXPay):
 * {
 *   "reference": "..." | "transref": "...",
 *   "status": "SUCCESS" | "FAILED" | "PENDING",
 *   "amount": 5000,
 *   "payer": { "partyId": "..." }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const { valid, reference } = verifyFeeXPayWebhook(raw);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Missing reference" },
        { status: 400 }
      );
    }

    // Find our payment by FeeXPay reference (or alias)
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { feexpayReference: reference },
          { feexpayOrderNumber: reference },
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

    // Re-poll FeeXPay for authoritative status (don't trust webhook payload alone)
    let finalStatus = mapFeeXPayStatus("PENDING");
    if (!FEEXPAY_DEMO_MODE) {
      const statusRes = await checkFeeXPayStatus(reference);
      finalStatus = mapFeeXPayStatus(statusRes.status);
    } else {
      // In demo mode, assume SUCCESS (the demo-confirm endpoint already set it)
      finalStatus = mapFeeXPayStatus("SUCCESS");
    }

    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: finalStatus,
        feexpayTransaction: reference,
      },
    });

    if (finalStatus === "SUCCESS") {
      const newStatus =
        payment.type === "COMPLET" ? "PAID_FULL" : "PAID_INSCRIPTION";
      await db.participant.update({
        where: { id: payment.participantId },
        data: { status: newStatus, paymentType: payment.type },
      });

      // Fire and forget — email confirmation
      sendConfirmationEmail(payment.participant.email, {
        participant: payment.participant,
        payment,
      }).catch((e) =>
        console.error("[webhook] email send error:", e?.message || e)
      );
    }

    return NextResponse.json({ success: true, status: finalStatus });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[payment/webhook] error:", msg);
    return NextResponse.json(
      { success: false, error: "Webhook error" },
      { status: 500 }
    );
  }
}

/**
 * GET — poll a payment's status. Used by the confirmation page client to
 * check if a Mobile Money payment has been confirmed.
 *
 * Query: ?paymentId=xxx  or  ?reference=xxx (FeeXPay reference)
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get("paymentId");
  const reference = url.searchParams.get("reference");

  if (!paymentId && !reference) {
    return NextResponse.json(
      { success: false, error: "Missing paymentId or reference" },
      { status: 400 }
    );
  }

  const payment = await db.payment.findFirst({
    where: {
      OR: [
        { id: paymentId || "" },
        { feexpayReference: reference || "" },
        { feexpayOrderNumber: reference || "" },
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

  // Optionally re-poll FeeXPay for fresh status (only if payment is still PENDING
  // and we have a reference, and not in demo mode)
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
          data: { status: mapped },
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
            console.error("[webhook GET] email error:", e?.message || e)
          );
        }
        return NextResponse.json({
          success: true,
          payment: { ...payment, status: mapped },
        });
      }
    } catch {
      // fall through to return current status
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
      paymentUrl: payment.paymentUrl,
      createdAt: payment.createdAt,
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
