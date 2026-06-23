import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setAdminSessionCookie, verifyPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Identifiants invalides" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    await setAdminSessionCookie(payload);

    return NextResponse.json({ success: true, admin: payload });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/login] error:", msg);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
