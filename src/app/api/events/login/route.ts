import { NextResponse } from "next/server";
import {
  createSession,
  isPasswordConfigured,
  verifyPassword,
} from "@/lib/events/session";

/** Naive per-IP throttle so the shared password can't be stuffed. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { error: "EVENTS_ADMIN_PASSWORD belum di-set di server." },
      { status: 503 },
    );
  }
  const body = (await request.json().catch(() => null)) as
    | { password?: unknown }
    | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Password wajib diisi." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
      { status: 429 },
    );
  }
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
