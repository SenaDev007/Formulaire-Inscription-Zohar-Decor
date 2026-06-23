import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "zd_admin_session";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: AdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAdminSessionCookie(
  payload: AdminSession
): Promise<void> {
  const cookieStore = await cookies();
  const token = signToken(payload);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function bootstrapAdmin(): Promise<void> {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!email || !password) return;

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await hashPassword(password);
  await db.adminUser.create({
    data: {
      email,
      name: "Administrateur Zohar Décor",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`[bootstrap] Admin user created: ${email}`);
}
