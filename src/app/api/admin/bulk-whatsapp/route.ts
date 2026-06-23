import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";
import {
  buildWhatsAppLink,
  buildAdminWhatsAppBulkMessage,
} from "@/lib/whatsapp";

const schema = z.object({
  message: z.string().optional(),
  filter: z
    .enum(["all", "paid", "pending", "validated"])
    .optional()
    .default("all"),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let where: Record<string, unknown> = {};
  switch (parsed.data.filter) {
    case "paid":
      where = { status: { in: ["PAID_INSCRIPTION", "PAID_FULL", "VALIDATED"] } };
      break;
    case "pending":
      where = { status: "PENDING" };
      break;
    case "validated":
      where = { status: "VALIDATED" };
      break;
    default:
      where = { status: { not: "CANCELLED" } };
  }

  const participants = await db.participant.findMany({ where });
  const defaultMessage =
    parsed.data.message || buildAdminWhatsAppBulkMessage();

  const links = participants.map((p) => ({
    participantId: p.id,
    name: p.nomComplet,
    registrationId: p.registrationId,
    phone: p.telWhatsApp,
    link: buildWhatsAppLink(p.telWhatsApp, defaultMessage),
  }));

  return NextResponse.json({
    success: true,
    total: links.length,
    links,
  });
}
