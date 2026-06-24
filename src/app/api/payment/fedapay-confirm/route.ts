import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

/**
 * Confirm a FedaPay payment.
 *
 * FedaPay redirects to our site with ?payment=success after a successful
 * payment. The frontend calls this endpoint with the participantId to:
 * 1. Create/update a Payment record with status SUCCESS
 * 2. Update the participant status to PAID_INSCRIPTION or PAID_FULL
 * 3. Send confirmation email to the participant
 * 4. Send admin notification
 */
export async function POST(req: NextRequest) {
  try {
    const { participantId } = await req.json();

    if (!participantId) {
      return NextResponse.json(
        { success: false, error: "Missing participantId" },
        { status: 400 }
      );
    }

    const participant = await db.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Participant introuvable" },
        { status: 404 }
      );
    }

    // Determine payment type based on current status
    const paymentType =
      participant.status === "PAID_INSCRIPTION" ? "FORMATION" : "INSCRIPTION";
    const amount =
      paymentType === "FORMATION"
        ? 20000
        : 100; // TEMPORAIRE: 100 FCFA pour test (normal: 5000)

    // Create or update a payment record
    const payment = await db.payment.create({
      data: {
        participantId,
        amount,
        type: paymentType,
        provider: "FEDAPAY",
        providerPhone: participant.telWhatsApp,
        feexpayReference: `FEDAPAY-${Date.now()}`,
        feexpayTransaction: `FEDAPAY-TX-${Date.now()}`,
        status: "SUCCESS",
      },
    });

    // Update participant status
    const newStatus =
      paymentType === "FORMATION" ? "PAID_FULL" : "PAID_INSCRIPTION";
    await db.participant.update({
      where: { id: participantId },
      data: { status: newStatus, paymentType },
    });

    // Reload participant for fresh status
    const updatedParticipant = await db.participant.findUnique({
      where: { id: participantId },
    });

    // Send emails (fire and forget)
    if (updatedParticipant) {
      sendConfirmationEmail(updatedParticipant.email, {
        participant: updatedParticipant,
        payment,
      }).catch((e) =>
        console.error("[fedapay-confirm] email error:", e?.message || e)
      );

      sendAdminNotification("PAYMENT_CONFIRMED", updatedParticipant, payment).catch(
        (e) =>
          console.error("[fedapay-confirm] admin notification error:", e?.message || e)
      );
    }

    return NextResponse.json({
      success: true,
      registrationId: participant.registrationId,
      status: newStatus,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[fedapay-confirm] error:", msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
