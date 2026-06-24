import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Returns all participants who have paid the inscription fee
 * (status = PAID_INSCRIPTION) and are eligible to pay the formation fee.
 * Also includes those who already paid the formation (PAID_FULL) so the
 * user can see they're already done.
 *
 * Public endpoint — no auth required (used by the Formation page).
 */
export async function GET() {
  try {
    const participants = await db.participant.findMany({
      where: {
        status: { in: ["PAID_INSCRIPTION", "PAID_FULL"] },
      },
      select: {
        id: true,
        registrationId: true,
        nomComplet: true,
        prenoms: true,
        email: true,
        telWhatsApp: true,
        status: true,
      },
      orderBy: { nomComplet: "asc" },
    });

    return NextResponse.json({
      success: true,
      participants,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[participant/eligible] error:", msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
