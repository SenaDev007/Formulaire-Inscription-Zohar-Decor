import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  buildWhatsAppLink,
  buildZoharToParticipantMessage,
} from "@/lib/whatsapp";

/**
 * Returns a WhatsApp link for Zohar Décor to confirm to the participant
 * that their fees have been received and their place is reserved.
 *
 * The message is addressed TO the participant's WhatsApp number.
 *
 * Query: ?registrationId=ZD-2026-001
 */
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
  });

  if (!participant) {
    return NextResponse.json(
      { success: false, error: "Inscription introuvable" },
      { status: 404 }
    );
  }

  // Message FROM Zohar Décor TO participant
  const message = buildZoharToParticipantMessage(participant);
  // Send TO the participant's WhatsApp number
  const link = buildWhatsAppLink(participant.telWhatsApp, message);

  return NextResponse.json({ success: true, link });
}
