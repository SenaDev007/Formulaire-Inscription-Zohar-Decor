import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { buildParticipantsXlsx, buildParticipantsPdfAsync } from "@/lib/exports";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "xlsx";

  const participants = await db.participant.findMany({
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === "pdf") {
    const buf = await buildParticipantsPdfAsync(participants);
    return new NextResponse(buf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="zohar-decor-inscrits-${dateStr}.pdf"`,
      },
    });
  }

  const buf = buildParticipantsXlsx(participants);
  return new NextResponse(buf as unknown as BodyInit, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="zohar-decor-inscrits-${dateStr}.xlsx"`,
    },
  });
}
