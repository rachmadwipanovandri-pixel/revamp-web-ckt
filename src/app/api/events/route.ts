import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasSession } from "@/lib/events/session";
import { sheetServiceAccountEmail } from "@/lib/events/sheets";
import { defaultSections, newId, readEvents, upsertEvent } from "@/lib/events/store";
import type { EventItem } from "@/lib/events/types";

/** List events: admins see drafts too, visitors only see published ones. */
export async function GET() {
  const authed = await hasSession();
  const events = readEvents();
  return NextResponse.json({
    authed,
    sheetAccountEmail: sheetServiceAccountEmail(),
    events: authed ? events : events.filter((e) => e.status === "published"),
  });
}

/** Create a fresh draft with a hero + registration skeleton to fill in. */
export async function PUT(request: Request) {
  const authed = await hasSession();
  if (!authed) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { title?: unknown }
    | null;
  const title =
    typeof body?.title === "string" && body.title.trim()
      ? body.title.trim()
      : "Event baru";
  const draft: EventItem = {
    slug: `event-${newId("e")}`,
    status: "draft",
    title,
    badge: "",
    excerpt: "",
    cover: "",
    startsAt: new Date().toISOString(),
    dateLabel: "",
    timeLabel: "",
    locationLabel: "",
    priceLabel: "",
    registrationWebhook: "",
    sections: [...defaultSections("hero"), ...defaultSections("register")],
    updatedAt: new Date().toISOString(),
  };
  const result = upsertEvent(draft);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  revalidatePath("/[locale]/events", "page");
  return NextResponse.json({ ok: true, event: result.event });
}
