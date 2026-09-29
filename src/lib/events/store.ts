import "server-only";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { EventItem, EventSection, EventSectionType } from "./types";

const DIR = join(process.cwd(), "src", "content", "events");
const FILE = join(DIR, "events.json");

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Minimal shape guard — content is authored by the team, not the public. */
export function isValidEvent(value: unknown): value is EventItem {
  if (!isPlainObject(value)) return false;
  const { slug, status, title, sections, startsAt } = value;
  return (
    typeof slug === "string" &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) &&
    (status === "draft" || status === "published") &&
    typeof title === "string" &&
    typeof startsAt === "string" &&
    Array.isArray(sections) &&
    sections.every(
      (s) =>
        isPlainObject(s) &&
        typeof s.id === "string" &&
        typeof s.type === "string" &&
        typeof s.visible === "boolean",
    )
  );
}

export function readEvents(): EventItem[] {
  if (!existsSync(FILE)) return [];
  try {
    const parsed: unknown = JSON.parse(readFileSync(FILE, "utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEvent);
  } catch {
    return [];
  }
}

export function readEventBySlug(slug: string): EventItem | null {
  return readEvents().find((event) => event.slug === slug) ?? null;
}

export function writeEvents(events: EventItem[]): void {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(FILE, `${JSON.stringify(events, null, 2)}\n`, "utf8");
}

/**
 * Insert or replace an event. `originalSlug` is the slug it currently lives
 * under, so a rename can move the record instead of cloning it.
 */
export function upsertEvent(
  event: EventItem,
  originalSlug?: string,
): { ok: true; event: EventItem } | { ok: false; error: string } {
  if (!isValidEvent(event)) {
    return { ok: false, error: "Event tidak valid." };
  }
  const events = readEvents();
  const from = originalSlug ?? event.slug;
  const fromIndex = events.findIndex((e) => e.slug === from);
  const clashIndex = events.findIndex((e) => e.slug === event.slug);
  if (clashIndex !== -1 && clashIndex !== fromIndex) {
    return { ok: false, error: `Slug "${event.slug}" sudah dipakai.` };
  }
  const saved: EventItem = { ...event, updatedAt: new Date().toISOString() };
  if (fromIndex === -1) events.push(saved);
  else events[fromIndex] = saved;
  writeEvents(events);
  return { ok: true, event: saved };
}

export function deleteEvent(slug: string): boolean {
  const events = readEvents();
  const next = events.filter((e) => e.slug !== slug);
  if (next.length === events.length) return false;
  writeEvents(next);
  return true;
}

/** Listing view model: published events, upcoming first, each with `isPast`. */
export type ListedEvent = EventItem & { isPast: boolean };

/**
 * True once the start time has passed. Kept out of component code so render
 * stays pure (Date.now() inline in a page trips react-hooks/purity).
 */
export function isPastEvent(event: EventItem): boolean {
  return new Date(event.startsAt).getTime() < Date.now();
}

export function readListedEvents(): ListedEvent[] {
  return readEvents()
    .filter((e) => e.status === "published")
    .map((e) => ({ ...e, isPast: isPastEvent(e) }))
    .sort((a, b) => {
      if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
      const ta = new Date(a.startsAt).getTime();
      const tb = new Date(b.startsAt).getTime();
      return a.isPast ? tb - ta : ta - tb;
    });
}

/** Fresh id for sections/items authored in the admin editor. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function defaultSections(type: EventSectionType): EventSection[] {
  const id = newId(type);
  switch (type) {
    case "hero":
      return [
        {
          id,
          type: "hero",
          visible: true,
          eyebrow: "",
          quote: "",
          headline: "",
          body: "",
          ctaLabel: "Daftar Sekarang",
          image: "",
          imageAlt: "",
        },
      ];
    case "problems":
      return [
        {
          id,
          type: "problems",
          visible: true,
          eyebrow: "KENALI SITUASIMU",
          heading: "",
          intro: "",
          items: [],
        },
      ];
    case "takeaways":
      return [
        {
          id,
          type: "takeaways",
          visible: true,
          eyebrow: "YANG AKAN KAMU BAWA PULANG",
          heading: "",
          intro: "",
          items: [],
        },
      ];
    case "speakers":
      return [
        {
          id,
          type: "speakers",
          visible: true,
          eyebrow: "PEMBICARA",
          heading: "",
          intro: "",
          items: [],
        },
      ];
    case "stats":
      return [
        {
          id,
          type: "stats",
          visible: true,
          eyebrow: "HASIL",
          heading: "",
          items: [],
        },
      ];
    case "faq":
      return [
        {
          id,
          type: "faq",
          visible: true,
          eyebrow: "PERTANYAAN UMUM",
          heading: "",
          items: [],
        },
      ];
    case "register":
      return [
        {
          id,
          type: "register",
          visible: true,
          eyebrow: "DAFTAR",
          heading: "",
          quote: "",
          submitLabel: "Daftar Sekarang, Gratis",
          successTitle: "Kamu terdaftar!",
          successBody: "",
          disclaimer: "Dengan mendaftar, kamu setuju untuk dihubungi oleh tim kami.",
          fields: [
            {
              id: newId("field"),
              name: "name",
              label: "Nama lengkap",
              type: "text",
              required: true,
              options: "",
            },
            {
              id: newId("field"),
              name: "email",
              label: "Email",
              type: "email",
              required: true,
              options: "",
            },
            {
              id: newId("field"),
              name: "whatsapp",
              label: "Nomor WhatsApp",
              type: "tel",
              required: true,
              options: "",
            },
          ],
        },
      ];
  }
}
