import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { nomComplet: { contains: search } },
      { prenoms: { contains: search } },
      { email: { contains: search } },
      { telWhatsApp: { contains: search } },
      { registrationId: { contains: search } },
      { ville: { contains: search } },
    ];
  }

  const participants = await db.participant.findMany({
    where,
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json({ success: true, participants });
}
