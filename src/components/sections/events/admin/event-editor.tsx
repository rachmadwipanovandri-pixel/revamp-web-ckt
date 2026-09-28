"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import type { EventItem, EventSection, EventSectionType } from "@/lib/events/types";
import { SECTION_LABELS } from "@/lib/events/types";
import { SelectInput, TextArea, TextInput } from "./inputs";
import { SectionFields } from "./section-fields";

type Status = "idle" | "saving" | "saved" | "error";

const ADDABLE_TYPES: EventSectionType[] = [
  "problems",
  "takeaways",
  "speakers",
  "stats",
  "faq",
  "register",
  "hero",
];

/** Ready-to-paste Apps Script that appends each registration as a row. */
const APPS_SCRIPT_SNIPPET = [
  "function doPost(e) {",
  "  const data = JSON.parse(e.postData.contents);",
  "  const values = data.values || {};",
  "  const keys = Object.keys(values);",
  "  const sheet = SpreadsheetApp.getActive().getSheets()[0];",
  "  if (sheet.getLastRow() === 0) {",
  '    sheet.appendRow(["Waktu", "Judul Event"].concat(keys));',
  "  }",
  "  sheet.appendRow([data.submittedAt, data.eventTitle]",
  "    .concat(keys.map(function (k) { return values[k]; })));",
  "  return ContentService.createTextOutput(JSON.stringify({ ok: true }))",
  "    .setMimeType(ContentService.MimeType.JSON);",
  "}",
].join("\n");

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptySection(type: EventSectionType): EventSection {
  const id = localId(type);
  switch (type) {
    case "hero":
      return {
        id, type, visible: true, eyebrow: "", quote: "", headline: "",
        body: "", ctaLabel: "Daftar Sekarang", image: "", imageAlt: "",
      };
    case "problems":
      return { id, type, visible: true, eyebrow: "KENALI SITUASIMU", heading: "", intro: "", items: [] };
    case "takeaways":
      return {
        id, type, visible: true, eyebrow: "YANG AKAN KAMU BAWA PULANG",
        heading: "", intro: "", items: [],
      };
    case "speakers":
      return { id, type, visible: true, eyebrow: "PEMBICARA", heading: "", intro: "", items: [] };
    case "stats":
      return { id, type, visible: true, eyebrow: "HASIL", heading: "", items: [] };
    case "faq":
      return { id, type, visible: true, eyebrow: "PERTANYAAN UMUM", heading: "", items: [] };
    case "register":
      return {
        id, type, visible: true, eyebrow: "DAFTAR SEKARANG", heading: "", quote: "",
        submitLabel: "Daftar Sekarang, Gratis", successTitle: "Kamu terdaftar!",
        successBody: "", disclaimer: "", fields: [
          { id: localId("f"), name: "name", label: "Nama lengkap", type: "text", required: true, options: "" },
          { id: localId("f"), name: "email", label: "Email", type: "email", required: true, options: "" },
          { id: localId("f"), name: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true, options: "" },
        ],
      };
  }
}

/**
 * Editor for one event: meta fields on top, then the section stack —
 * each row drags to reorder and expands to edit its content.
 */
export function EventEditor({
  initial,
  sheetAccountEmail,
  onChanged,
  onDeleted,
  onRenamed,
}: {
  initial: EventItem;
  sheetAccountEmail: string | null;
  onChanged: (saved: EventItem) => void;
  onDeleted: (slug: string) => void;
  onRenamed: (oldSlug: string, saved: EventItem) => void;
}) {
  const [draft, setDraft] = useState<EventItem>(() => clone(initial));
  const [baseline, setBaseline] = useState<EventItem>(() => clone(initial));
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [testState, setTestState] = useState<"idle" | "busy" | "ok" | "error">(
    "idle",
  );
  const [testMsg, setTestMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  );

  function patch(p: Partial<EventItem>) {
    setDraft((prev) => ({ ...prev, ...p }));
    setStatus("idle");
    setMessage("");
  }

  function patchSection(id: string, next: EventSection) {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? next : s)),
    }));
    setStatus("idle");
    setMessage("");
  }

  function removeSection(id: string) {
    const section = draft.sections.find((s) => s.id === id);
    if (!section) return;
    if (
      !confirm(
        `Hapus section "${SECTION_LABELS[section.type]}"? Isinya ikut terhapus.`,
      )
    ) {
      return;
    }
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
    if (openId === id) setOpenId(null);
    setStatus("idle");
    setMessage("");
  }

  function toggleVisible(id: string) {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, visible: !s.visible } : s,
      ),
    }));
  }

  function addSection(type: EventSectionType) {
    const section = emptySection(type);
    setDraft((prev) => ({ ...prev, sections: [...prev.sections, section] }));
    setOpenId(section.id);
    setStatus("idle");
    setMessage("");
  }

  /** HTML5 drag & drop: drag a row onto another to move it. */
  function reorder(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setDraft((prev) => {
      const from = prev.sections.findIndex((s) => s.id === dragId);
      const to = prev.sections.findIndex((s) => s.id === targetId);
      if (from === -1 || to === -1) return prev;
      const sections = [...prev.sections];
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      return { ...prev, sections };
    });
    setStatus("idle");
    setMessage("");
  }

  async function save(): Promise<boolean> {
    if (!draft.slug.trim() || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug)) {
      setStatus("error");
      setMessage("Slug hanya boleh huruf kecil, angka, dan strip.");
      return false;
    }
    setStatus("saving");
    const res = await fetch(`/api/events/${encodeURIComponent(initial.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: draft }),
    }).catch(() => null);
    if (res?.ok) {
      const data = (await res.json()) as { event?: EventItem };
      if (data.event) {
        const saved = data.event;
        setBaseline(clone(saved));
        setDraft(clone(saved));
        if (saved.slug !== initial.slug) onRenamed(initial.slug, saved);
        else onChanged(saved);
      }
      setStatus("saved");
      setMessage("Tersimpan. Halaman publik sudah di-revalidate.");
      return true;
    }
    const data = res
      ? ((await res.json().catch(() => null)) as { error?: string } | null)
      : null;
    setStatus("error");
    setMessage(data?.error || "Gagal menyimpan.");
    return false;
  }

  async function remove() {
    if (!confirm(`Hapus event "${draft.title}" permanen?`)) return;
    const res = await fetch(`/api/events/${encodeURIComponent(initial.slug)}`, {
      method: "DELETE",
    }).catch(() => null);
    if (res?.ok) onDeleted(initial.slug);
    else {
      setStatus("error");
      setMessage("Gagal menghapus.");
    }
  }

  /** Sends one marked test row to the configured sheet webhook. */
  async function testSheet() {
    // The endpoint reads the stored event, so persist edits first.
    if (dirty && !(await save())) return;
    setTestState("busy");
    setTestMsg("");
    const res = await fetch(
      `/api/events/${encodeURIComponent(initial.slug)}/test-sheet`,
      { method: "POST" },
    ).catch(() => null);
    const data = res
      ? ((await res.json().catch(() => null)) as
          | { error?: string; message?: string }
          | null)
      : null;
    if (res?.ok) {
      setTestState("ok");
      setTestMsg(data?.message || "Terkirim!");
    } else {
      setTestState("error");
      setTestMsg(data?.error || "Test gagal — coba lagi.");
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const previewUrl = `/events/${draft.slug}`;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <section className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 border-b border-dashed border-slate-200 pb-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {draft.title || "(tanpa judul)"}
            </h2>
            <p className="font-numeric text-[11px] text-slate-400">
              /events/{draft.slug || "…"}
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-numeric text-[11px] font-medium text-amber-800">
                belum disimpan
              </span>
            )}
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-numeric text-sm text-slate-700 hover:bg-slate-50"
            >
              Preview ↗
            </a>
            <button
              type="button"
              onClick={() => void remove()}
              className="rounded-lg border border-red-200 px-3 py-1.5 font-numeric text-sm text-red-600 hover:bg-red-50"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={!dirty || status === "saving"}
              className="rounded-lg bg-primary px-4 py-1.5 font-numeric text-sm font-semibold text-white hover:bg-[#0f45a3] disabled:opacity-40"
            >
              {status === "saving" ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>
        {message && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm ${
              status === "error"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-800"
            }`}
            role="status"
          >
            {message}
          </p>
        )}

        {/* Event meta */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextInput
            label="Judul event (untuk listing & SEO)"
            value={draft.title}
            onChange={(v) => patch({ title: v })}
            className="sm:col-span-2"
          />
          <TextInput
            label="Slug (URL /events/…)"
            value={draft.slug}
            onChange={(v) => patch({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            hint="Huruf kecil, angka, strip. Ubah slug = URL lama mati."
          />
          <SelectInput
            label="Status"
            value={draft.status}
            onChange={(v) => patch({ status: v as EventItem["status"] })}
            options={[
              { value: "draft", label: "Draft (tidak tampil)" },
              { value: "published", label: "Tayang" },
            ]}
          />
          <TextInput
            label="Badge listing"
            value={draft.badge}
            onChange={(v) => patch({ badge: v })}
            placeholder="WEBINAR GRATIS"
          />
          <TextInput
            label="Waktu mulai (ISO)"
            type="datetime-local"
            value={draft.startsAt.slice(0, 16)}
            onChange={(v) => patch({ startsAt: `${v}:00+07:00` })}
          />
          <TextArea
            label="Ringkasan (excerpt listing & meta description)"
            value={draft.excerpt}
            onChange={(v) => patch({ excerpt: v })}
            rows={2}
            className="sm:col-span-2"
          />
          <TextInput
            label="URL gambar cover listing"
            value={draft.cover}
            onChange={(v) => patch({ cover: v })}
            placeholder="/images/events/… atau https://…"
            className="sm:col-span-2"
          />
          <TextInput
            label="Label tanggal (tampil di hero & kartu)"
            value={draft.dateLabel}
            onChange={(v) => patch({ dateLabel: v })}
            placeholder="Selasa, 29 September 2026"
          />
          <TextInput
            label="Label jam"
            value={draft.timeLabel}
            onChange={(v) => patch({ timeLabel: v })}
            placeholder="14.00 – 15.00 WIB"
          />
          <TextInput
            label="Lokasi / platform"
            value={draft.locationLabel}
            onChange={(v) => patch({ locationLabel: v })}
            placeholder="Google Meet"
          />
          <TextInput
            label="Harga"
            value={draft.priceLabel}
            onChange={(v) => patch({ priceLabel: v })}
            placeholder="Gratis"
          />
          <TextInput
            label="Link sheet pendaftaran"
            value={draft.registrationWebhook}
            onChange={(v) => patch({ registrationWebhook: v.trim() })}
            placeholder="https://docs.google.com/spreadsheets/d/…/edit"
            hint="Tempel link Google Sheet kamu — pendaftar otomatis jadi baris di sheet itu. URL webhook Apps Script juga tetap didukung."
            className="sm:col-span-2"
          />

          <div className="space-y-3 sm:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void testSheet()}
                disabled={testState === "busy"}
                className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 font-numeric text-xs font-semibold text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                {testState === "busy" ? "Mengirim tes…" : "⚡ Test koneksi"}
              </button>
              {testMsg && (
                <span
                  role="status"
                  className={`text-xs ${testState === "ok" ? "text-emerald-700" : "text-red-600"}`}
                >
                  {testMsg}
                </span>
              )}
            </div>

            <details className="rounded-lg border border-dashed border-slate-300 bg-[#fafbfc] p-3">
              <summary className="cursor-pointer font-numeric text-xs font-semibold text-slate-700">
                Panduan: hubungkan sheet kamu
              </summary>

              {sheetAccountEmail ? (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-slate-600">
                  <li>
                    Di sheet kamu, klik tombol <b>Bagikan</b> → tambahkan email
                    service account sebagai <b>Editor</b> (sekali per sheet):
                    <code className="mt-1 block rounded bg-white px-2 py-1 break-all">
                      {sheetAccountEmail}
                    </code>
                  </li>
                  <li>
                    Salin link sheet dari address bar (…/spreadsheets/d/…/edit)
                    dan tempel di kolom di atas.
                  </li>
                  <li>
                    Klik <b>⚡ Test koneksi</b> — baris “Test” langsung muncul di
                    sheet.
                  </li>
                </ol>
              ) : (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  Server belum punya akses Google (service account). Minta admin
                  isi <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> di <code>.env</code>{" "}
                  lalu restart; setelah itu cukup tempel link sheet. Sementara
                  itu pakai cara alternatif di bawah.
                </p>
              )}

              <details className="mt-3 border-t border-dashed border-slate-200 pt-3">
                <summary className="cursor-pointer font-numeric text-xs font-semibold text-slate-500">
                  Alternatif: Apps Script (tanpa service account)
                </summary>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-slate-600">
                  <li>
                    Buka sheet kamu → menu <b>Ekstensi → Apps Script</b>.
                  </li>
                  <li>
                    Hapus isi <code>Code.gs</code>, tempel kode di bawah, lalu
                    simpan (Ctrl/Cmd+S).
                  </li>
                  <li>
                    <b>Deploy → Deployment baru</b> → jenis <b>Aplikasi web</b> →
                    Jalankan sebagai: <b>Saya</b> → Akses: <b>Siapa saja</b> →{" "}
                    <b>Deploy</b> → salin URL yang diakhiri <code>/exec</code>.
                  </li>
                  <li>
                    Tempel URL <code>/exec</code> itu di kolom link di atas, lalu
                    klik <b>⚡ Test koneksi</b>.
                  </li>
                </ol>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-numeric text-[11px] text-slate-400">
                    Kode untuk Code.gs:
                  </span>
                  <button
                    type="button"
                    onClick={() => void copySnippet()}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 font-numeric text-[11px] text-slate-600 hover:border-primary hover:text-primary"
                  >
                    {copied ? "✓ Tersalin" : "Salin kode"}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100">
                  {APPS_SCRIPT_SNIPPET}
                </pre>
              </details>
            </details>
          </div>
        </div>
      </section>

      {/* Section stack */}
      <section className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-slate-200 pb-3">
          <h2 className="font-numeric text-sm font-semibold tracking-wide text-slate-800 uppercase">
            Urutan section
          </h2>
          <p className="font-numeric text-[11px] text-slate-500">
            Geser ⠿ untuk ubah urutan · klik baris untuk edit
          </p>
        </div>

        <ul className="space-y-2">
          {draft.sections.map((section, index) => {
            const open = openId === section.id;
            return (
              <li
                key={section.id}
                draggable
                onDragStart={() => setDragId(section.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragId && dragId !== section.id) setOverId(section.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  reorder(section.id);
                  setDragId(null);
                  setOverId(null);
                }}
                className={`rounded-lg border bg-white transition-colors ${
                  overId === section.id && dragId !== section.id
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-slate-200"
                } ${dragId === section.id ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span
                    aria-hidden
                    className="cursor-grab text-slate-300 active:cursor-grabbing"
                  >
                    <GripVertical className="size-4" />
                  </span>
                  <span className="font-numeric text-[11px] font-semibold text-slate-400 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : section.id)}
                    className="min-w-0 flex-1 truncate text-left text-sm font-medium text-slate-800 hover:text-primary"
                  >
                    {SECTION_LABELS[section.type]}
                  </button>
                  {!section.visible && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
                      disembunyikan
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={section.visible ? "Sembunyikan" : "Tampilkan"}
                    onClick={() => toggleVisible(section.id)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {section.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  <button
                    type="button"
                    aria-label="Hapus section"
                    onClick={() => removeSection(section.id)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {open && (
                  <div className="border-t border-dashed border-slate-200 bg-[#fafbfc] p-4">
                    <SectionFields
                      section={section}
                      onChange={(next) => patchSection(section.id, next)}
                    />
                  </div>
                )}
              </li>
            );
          })}
          {draft.sections.length === 0 && (
            <li className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500">
              Belum ada section. Tambahkan salah satu di bawah.
            </li>
          )}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-slate-200 pt-4">
          <span className="font-numeric text-xs text-slate-500">Tambah:</span>
          {ADDABLE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addSection(type)}
              className="rounded-full border border-slate-300 px-3 py-1 font-numeric text-xs text-slate-600 hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              ＋ {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      </section>

      {/* Sticky save for mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-300 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || status === "saving"}
          className="w-full rounded-lg bg-primary py-2.5 font-numeric text-sm font-semibold text-white disabled:opacity-40"
        >
          {status === "saving" ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </div>
    </div>
  );
}
