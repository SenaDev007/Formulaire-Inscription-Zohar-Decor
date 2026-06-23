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

  const total = await db.participant.count({
    where: { status: { not: "CANCELLED" } },
  });
  const paid = await db.participant.count({
    where: {
      status: { in: ["PAID_INSCRIPTION", "PAID_FULL", "VALIDATED"] },
    },
  });
  const pending = await db.participant.count({
    where: { status: "PENDING" },
  });
  const cancelled = await db.participant.count({
    where: { status: "CANCELLED" },
  });
  const remaining = Math.max(0, TRAINING_INFO.capacity - total);

  const payments = await db.payment.findMany({
    where: { status: "SUCCESS" },
    select: { amount: true, type: true },
  });
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const inscriptionAmount = payments
    .filter((p) => p.type === "INSCRIPTION")
    .reduce((s, p) => s + p.amount, 0);
  const completAmount = payments
    .filter((p) => p.type === "COMPLET")
    .reduce((s, p) => s + p.amount, 0);

  const fillRate =
    TRAINING_INFO.capacity > 0
      ? Math.round((total / TRAINING_INFO.capacity) * 100)
      : 0;

  return NextResponse.json({
    success: true,
    stats: {
      total,
      paid,
      pending,
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
