import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const participant = await db.participant.findUnique({
    where: { id },
    include: { payments: { orderBy: { createdAt: "desc" } } },
  });

  if (!participant) {
    return NextResponse.json(
      { success: false, error: "Participant introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, participant });
}

const updateSchema = z.object({
  nomComplet: z.string().min(2).optional(),
  prenoms: z.string().min(1).optional(),
  sexe: z.enum(["M", "F"]).optional(),
  dateNaissance: z.string().optional(),
  telWhatsApp: z.string().optional(),
  telSecondaire: z.string().nullable().optional(),
  email: z.string().email().optional(),
  ville: z.string().optional(),
  profession: z.string().optional(),
  niveauEtudes: z.string().optional(),
  sourceConnaissance: z.string().optional(),
  status: z
    .enum([
      "PENDING",
      "PAID_INSCRIPTION",
      "PAID_FULL",
      "VALIDATED",
      "CANCELLED",
    ])
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()!;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const participant = await db.participant.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, participant });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop()!;

  await db.participant.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
