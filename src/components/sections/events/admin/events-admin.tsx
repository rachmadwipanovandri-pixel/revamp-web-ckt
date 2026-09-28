"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventItem } from "@/lib/events/types";
import { EventEditor } from "./event-editor";

type Status = "idle" | "loading" | "saving" | "error";

interface ListResponse {
  authed: boolean;
  sheetAccountEmail: string | null;
  events: EventItem[];
}

/** Newest start date first so the current campaign sits at the top. */
function sortEvents(events: EventItem[]): EventItem[] {
  return [...events].sort((a, b) =>
    a.startsAt === b.startsAt
      ? a.title.localeCompare(b.title)
      : a.startsAt < b.startsAt
        ? 1
        : -1,
  );
}

/**
 * Admin shell for the events feature: shared-password login, event list,
 * and the drag & drop editor for the selected event.
 */
export function EventsAdmin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [sheetAccountEmail, setSheetAccountEmail] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ListResponse;
      setAuthed(data.authed);
      setSheetAccountEmail(data.sheetAccountEmail ?? null);
      setEvents(sortEvents(data.events));
      setStatus("idle");
      setMessage("");
      return data;
    } catch {
      setStatus("error");
      setMessage("Gagal memuat data event.");
      return null;
    }
  }, []);

  useEffect(() => {
    // Inline fetch + setState-after-await (same shape as the wireframe editor);
    // `load` stays for the post-login/logout/create refreshes.
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as ListResponse;
        if (cancelled) return;
        setAuthed(data.authed);
        setSheetAccountEmail(data.sheetAccountEmail ?? null);
        setEvents(sortEvents(data.events));
        setStatus("idle");
        setMessage("");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Gagal memuat data event.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogin(password: string): Promise<string | null> {
    const res = await fetch("/api/events/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (!res) return "Tidak bisa terhubung ke server.";
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      return data?.error || "Login gagal.";
    }
    await load();
    return null;
  }

  async function handleLogout() {
    await fetch("/api/events/logout", { method: "POST" }).catch(() => null);
    setSelectedSlug(null);
    await load();
  }

  async function handleCreate() {
    setStatus("saving");
    const res = await fetch("/api/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Event baru" }),
    }).catch(() => null);
    if (res?.ok) {
      const data = (await res.json()) as { event?: EventItem };
      await load();
      if (data.event) setSelectedSlug(data.event.slug);
      setStatus("idle");
    } else {
      const data = res ? ((await res.json().catch(() => null)) as { error?: string } | null) : null;
      setStatus("error");
      setMessage(data?.error || "Gagal membuat event.");
    }
  }

  if (status === "loading" && authed === null) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] px-4 py-16 font-numeric text-slate-600">
        Memuat admin event…
      </div>
    );
  }

  if (authed === false) {
    return <LoginCard onLogin={handleLogin} />;
  }

  const selected = events.find((e) => e.slug === selectedSlug) ?? null;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-24">
      <header className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div>
            <p className="font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              Marketing · Events
            </p>
            <h1 className="font-numeric text-lg font-semibold text-slate-900">
              Admin Event
            </h1>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href="/events"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-numeric text-sm text-slate-700 hover:bg-slate-50"
            >
              Buka /events
            </a>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={status === "saving"}
              className="rounded-lg bg-primary px-4 py-1.5 font-numeric text-sm font-semibold text-white hover:bg-[#0f45a3] disabled:opacity-50"
            >
              ＋ Event baru
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-numeric text-sm text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
        {message && status === "error" && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 font-numeric text-sm text-red-700">
            {message}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <nav className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-2 font-numeric text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Semua event ({events.length})
          </p>
          <ul className="space-y-1.5">
            {events.map((event) => (
              <li key={event.slug}>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(event.slug)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    selectedSlug === event.slug
                      ? "border-primary bg-primary/8"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {event.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-numeric text-[11px] text-slate-500">
                    <span
                      className={`size-1.5 rounded-full ${
                        event.status === "published" ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                    />
                    {event.status === "published" ? "Tayang" : "Draft"}
                    <span>· {event.startsAt.slice(0, 10)}</span>
                  </span>
                </button>
              </li>
            ))}
            {events.length === 0 && (
              <li className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500">
                Belum ada event. Klik “＋ Event baru”.
              </li>
            )}
          </ul>
        </nav>

        <div>
          {selected ? (
            <EventEditor
              key={selected.slug}
              initial={selected}
              sheetAccountEmail={sheetAccountEmail}
              onChanged={(saved) =>
                setEvents((prev) =>
                  prev.map((e) => (e.slug === saved.slug ? saved : e)),
                )
              }
              onDeleted={(slug) => {
                setEvents((prev) => prev.filter((e) => e.slug !== slug));
                setSelectedSlug(null);
              }}
              onRenamed={(oldSlug, saved) => {
                setEvents((prev) =>
                  prev.map((e) => (e.slug === oldSlug ? saved : e)),
                );
                setSelectedSlug(saved.slug);
              }}
            />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center font-numeric text-sm text-slate-500">
              Pilih event di kiri, atau buat event baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginCard({
  onLogin,
}: {
  onLogin: (password: string) => Promise<string | null>;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await onLogin(password);
    if (err) setError(err);
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p className="font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
          Marketing · Events
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900">
          Login Admin Event
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Masukkan password bersama tim marketing.
        </p>

        <label
          htmlFor="admin-password"
          className="mt-6 block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-[#fafbfc] px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoFocus
        />

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-[#0f45a3] disabled:opacity-50"
        >
          {busy ? "Memeriksa…" : "Masuk"}
        </button>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Belum tahu password? Hubungi admin server — di-set lewat
          EVENTS_ADMIN_PASSWORD.
        </p>
      </form>
    </div>
  );
}
