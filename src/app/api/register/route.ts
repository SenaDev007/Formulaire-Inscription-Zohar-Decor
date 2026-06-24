import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  TRAINING_INFO,
  nextRegistrationId,
  sendAdminNotification,
} from "@/lib/email";

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

    // No capacity restriction — "10 places" is marketing only.
    // The database accepts unlimited registrations.

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
        status: "UNPAID",
      },
    });

    // Send admin notification (email → auroretheodoraa@gmail.com)
    // Use await (not fire-and-forget) to ensure it actually sends
    console.log("[register] About to send admin notification...");
    console.log("[register] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("[register] RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length || 0);
    try {
      const result = await sendAdminNotification("NEW_REGISTRATION", participant);
      console.log("[register] admin notification result:", JSON.stringify(result));
    } catch (e) {
      console.error("[register] admin notification error:", e?.message || e);
    }

    return NextResponse.json({ success: true, participant });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[register] error:", msg, e);

    // Return the ACTUAL error message so the user can see what's wrong
    return NextResponse.json(
      {
        success: false,
        error: msg,
        hint:
          msg.includes("DATABASE_URL") || msg.includes("connect")
            ? "Vérifiez que DATABASE_URL est configuré dans Vercel"
            : msg.includes("does not exist") || msg.includes("no such")
            ? "La base de données n'est pas migrée. Le build Vercel doit exécuter prisma db push."
            : undefined,
      },
      { status: 500 }
    );
  }
}
