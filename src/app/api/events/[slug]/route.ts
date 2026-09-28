import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hasSession } from "@/lib/events/session";
import { deleteEvent, isValidEvent, readEventBySlug, upsertEvent } from "@/lib/events/store";

/** Public listing + detail pages cache event content; bust both. */
function revalidateEvents() {
  revalidatePath("/[locale]/events", "page");
  revalidatePath("/[locale]/events/[slug]", "page");
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const event = readEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  const authed = await hasSession();
  if (!authed && event.status !== "published") {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ event });
}

/** Save an existing event (full replace; admin only). */
export async function PUT(request: Request, { params }: Params) {
  const authed = await hasSession();
  if (!authed) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as
    | { event?: unknown }
    | null;
  if (!body || !isValidEvent(body.event)) {
    return NextResponse.json({ error: "Event tidak valid" }, { status: 400 });
  }
  if (!readEventBySlug(slug)) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  const result = upsertEvent(body.event, slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }
  revalidateEvents();
  return NextResponse.json({ ok: true, event: result.event });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authed = await hasSession();
  if (!authed) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  const { slug } = await params;
  const removed = deleteEvent(slug);
  if (!removed) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  revalidateEvents();
  return NextResponse.json({ ok: true });
}
