import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { paymentId } = await req.json();
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
      { success: false, error: "Paiement introuvable" },
      { status: 404 }
    );
  }

  const txRef =
    payment.flexpayTransaction || `MANUAL-${session.id}-${Date.now()}`;
  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: "SUCCESS",
      manuallyValidated: true,
      validatedById: session.id,
      flexpayTransaction: txRef,
    },
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
  }).catch((e) =>
    console.error("[admin/validate] email error:", e?.message || e)
  );

  return NextResponse.json({ success: true });
}
