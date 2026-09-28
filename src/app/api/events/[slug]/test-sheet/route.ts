import { NextResponse } from "next/server";
import { hasSession } from "@/lib/events/session";
import { readEventBySlug } from "@/lib/events/store";
import { deliverRegistration } from "@/lib/events/deliver";
import type { EventItem, RegisterSection } from "@/lib/events/types";

type Params = { params: Promise<{ slug: string }> };

function registerSection(event: EventItem): RegisterSection | undefined {
  return event.sections.find(
    (s): s is RegisterSection => s.type === "register" && s.visible,
  );
}

/**
 * Sends one clearly-marked test row to the event's sheet link so the
 * marketing team can confirm the connection before publishing.
 */
export async function POST(_request: Request, { params }: Params) {
  const authed = await hasSession();
  if (!authed) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  const { slug } = await params;
  const event = readEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  // Same payload shape as a real submission, filled from the form's own
  // fields so the row lands in the right columns.
  const section = registerSection(event);
  const values: Record<string, string> = {};
  for (const field of section?.fields ?? []) {
    values[field.name] = "Test";
  }
  if (Object.keys(values).length === 0) {
    values.test = "Test";
  }

  const result = await deliverRegistration({
    event,
    section,
    values,
    submittedAt: new Date().toISOString(),
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }
  return NextResponse.json({
    ok: true,
    message: "Terkirim! Cek baris terbaru di sheet kamu.",
  });
}
