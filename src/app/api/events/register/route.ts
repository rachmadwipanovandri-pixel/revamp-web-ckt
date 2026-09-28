import { NextResponse } from "next/server";
import { readEventBySlug } from "@/lib/events/store";
import { deliverRegistration } from "@/lib/events/deliver";
import type { EventItem, RegisterSection } from "@/lib/events/types";

interface RegisterPayload {
  slug: string;
  values: Record<string, string>;
}

function isValidPayload(body: unknown): body is RegisterPayload {
  if (typeof body !== "object" || body === null) return false;
  const { slug, values } = body as Record<string, unknown>;
  return (
    typeof slug === "string" &&
    slug.length > 0 &&
    typeof values === "object" &&
    values !== null &&
    !Array.isArray(values) &&
    Object.values(values).every((v) => typeof v === "string")
  );
}

function registerSection(event: EventItem): RegisterSection | undefined {
  return event.sections.find(
    (s): s is RegisterSection => s.type === "register" && s.visible,
  );
}

/** Reject missing required fields before the row ever hits the sheet. */
function missingRequired(section: RegisterSection, values: Record<string, string>) {
  return section.fields
    .filter((f) => f.required)
    .filter((f) => !(values[f.name] ?? "").trim())
    .map((f) => f.label);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const event = readEventBySlug(body.slug);
  if (!event || event.status !== "published") {
    return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
  }

  const section = registerSection(event);
  if (!section) {
    return NextResponse.json(
      { error: "Form pendaftaran tidak aktif" },
      { status: 409 },
    );
  }

  const missing = missingRequired(section, body.values);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Wajib diisi: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  // Keep only the fields declared on the form — never echo arbitrary keys.
  const values: Record<string, string> = {};
  for (const field of section.fields) {
    values[field.name] = (body.values[field.name] ?? "").trim();
  }

  const result = await deliverRegistration({ event, section, values });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }
  return NextResponse.json({ ok: true });
}
