import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Search a participant by name (nomComplet or prenoms).
 * Used by the Formation page to find a participant and check their payment status.
 *
 * Query: ?name=Marie
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name") || "";

  if (name.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: "Entrez au moins 2 caractères" },
      { status: 400 }
    );
  }

  // Search by nomComplet, prenoms, or email (case-insensitive)
  const participant = await db.participant.findFirst({
    where: {
      OR: [
        { nomComplet: { contains: name, mode: "insensitive" } },
        { prenoms: { contains: name, mode: "insensitive" } },
        { email: { contains: name, mode: "insensitive" } },
        { telWhatsApp: { contains: name } },
      ],
      status: { notIn: ["CANCELLED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!participant) {
    return NextResponse.json({ success: false, error: "Aucun inscrit trouvé" });
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
    },
  });
}
