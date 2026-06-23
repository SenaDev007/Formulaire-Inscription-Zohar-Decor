import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

  const lastPayment = participant.payments[0] || null;

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
          feexpayTransaction: lastPayment.feexpayTransaction,
          paymentUrl: lastPayment.paymentUrl,
          createdAt: lastPayment.createdAt,
        }
      : null,
  });
}
