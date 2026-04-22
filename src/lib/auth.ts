import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const SESSION_COOKIE = "overflo_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await prisma.session.create({ data: { token, userId, expiresAt } });
  const jwt = await new SignJWT({ token })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    try {
      const payload = await jwtVerify(raw, secret);
      const token = payload.payload.token as string;
      await prisma.session.deleteMany({ where: { token } });
    } catch {}
  }
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const payload = await jwtVerify(raw, secret);
    const token = payload.payload.token as string;
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
  } catch {
    return null;
  }
}

export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (!user || user.role !== role) return null;
  return user;
}
