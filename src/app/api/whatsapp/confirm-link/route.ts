import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  buildConfirmationWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/whatsapp";

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

  const message = buildConfirmationWhatsAppMessage(participant);
  const link = buildWhatsAppLink(participant.telWhatsApp, message);

  return NextResponse.json({ success: true, link });
}
