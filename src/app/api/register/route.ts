import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { TRAINING_INFO, nextRegistrationId } from "@/lib/email";

const schema = z.object({
  nomComplet: z.string().min(2, "Nom complet requis"),
  prenoms: z.string().min(1, "Prénom(s) requis"),
  sexe: z.enum(["M", "F"]),
  dateNaissance: z.string().min(4, "Date de naissance requise"),
  telWhatsApp: z.string().min(8, "Téléphone WhatsApp requis"),
  telSecondaire: z.string().optional().nullable(),
  email: z.string().email("Email invalide"),
  ville: z.string().min(2, "Ville requise"),
  profession: z.string().min(2, "Profession requise"),
  niveauEtudes: z.string().min(1, "Niveau d'études requis"),
  sourceConnaissance: z.string().min(2, "Source requise"),
  acceptConditions: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json(
        { success: true, registrationId: "ZD-2026-000" },
        { status: 200 }
      );
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const count = await db.participant.count({
      where: { status: { not: "CANCELLED" } },
    });
    if (count >= TRAINING_INFO.capacity) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Désolé, les 10 places disponibles sont déjà prises. Vous pouvez nous contacter pour la prochaine session.",
        },
        { status: 409 }
      );
    }

    const existing = await db.participant.findFirst({
      where: {
        OR: [
          { email: parsed.data.email },
          { telWhatsApp: parsed.data.telWhatsApp },
        ],
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Un inscrit avec cet email ou ce téléphone WhatsApp existe déjà. Contactez-nous si vous pensez à une erreur.",
        },
        { status: 409 }
      );
    }

    const registrationId = await nextRegistrationId();

    const participant = await db.participant.create({
      data: {
        registrationId,
        nomComplet: parsed.data.nomComplet,
        prenoms: parsed.data.prenoms,
        sexe: parsed.data.sexe,
        dateNaissance: parsed.data.dateNaissance,
        telWhatsApp: parsed.data.telWhatsApp,
        telSecondaire: parsed.data.telSecondaire || null,
        email: parsed.data.email.toLowerCase(),
        ville: parsed.data.ville,
        profession: parsed.data.profession,
        niveauEtudes: parsed.data.niveauEtudes,
        sourceConnaissance: parsed.data.sourceConnaissance,
        acceptConditions: true,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, participant });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[register] error:", msg);
    return NextResponse.json(
      { success: false, error: "Erreur serveur. Réessayez." },
      { status: 500 }
    );
  }
}
