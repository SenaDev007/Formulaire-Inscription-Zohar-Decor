import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bootstrapAdmin } from "@/lib/auth";
import { TRAINING_INFO } from "@/lib/email";

export async function POST() {
  try {
    await bootstrapAdmin();
    const count = await db.participant.count();
    return NextResponse.json({
      success: true,
      message: "Seed complete",
      participantCount: count,
      trainingInfo: TRAINING_INFO,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
