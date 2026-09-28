import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "events_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string | null {
  return process.env.EVENTS_ADMIN_PASSWORD || null;
}

function hmac(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

/** The shared marketing password comes from env; unset means admin is locked. */
export function verifyPassword(password: string): boolean {
  const expected = secret();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isPasswordConfigured(): boolean {
  return Boolean(secret());
}

/** Token = expiry + HMAC(expiry), so it can't be forged or extended. */
function issueToken(): string {
  const key = secret()!;
  const expiresAt = String(Date.now() + SESSION_TTL_MS);
  return `${expiresAt}.${hmac(expiresAt, key)}`;
}

function tokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  const key = secret();
  if (!key) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  const expected = hmac(expiresAt, key);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(expiresAt) > Date.now();
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return tokenIsValid(store.get(SESSION_COOKIE)?.value);
}
