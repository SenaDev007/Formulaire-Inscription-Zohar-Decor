import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { TRAINING_INFO } from "@/lib/email";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  // Total = only participants who have paid (exclude UNPAID and CANCELLED)
  const total = await db.participant.count({
    where: {
      status: { notIn: ["UNPAID", "CANCELLED"] },
    },
  });
  const paid = await db.participant.count({
    where: {
      status: { in: ["PAID_INSCRIPTION", "PAID_FULL", "VALIDATED"] },
    },
  });
  const unpaid = await db.participant.count({
    where: { status: "UNPAID" },
  });
  const cancelled = await db.participant.count({
    where: { status: "CANCELLED" },
  });
  // No capacity limit — "10 places" is marketing only
  const remaining = 999;

  const payments = await db.payment.findMany({
    where: { status: "SUCCESS" },
    select: { amount: true, type: true },
  });
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const inscriptionAmount = payments
    .filter((p) => p.type === "INSCRIPTION")
    .reduce((s, p) => s + p.amount, 0);
  const completAmount = payments
    .filter((p) => p.type === "FORMATION")
    .reduce((s, p) => s + p.amount, 0);

  // No fill rate cap — marketing says 10 but DB is unlimited
  const fillRate = total > 0 ? 100 : 0;

  return NextResponse.json({
    success: true,
    stats: {
      total,
      paid,
      unpaid,
      cancelled,
      remaining,
      capacity: TRAINING_INFO.capacity,
      fillRate,
      totalAmount,
      inscriptionAmount,
      completAmount,
    },
  });
}
