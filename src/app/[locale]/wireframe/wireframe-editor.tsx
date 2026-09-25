"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

type Ns = "home" | "agentic" | "pricing";

type FieldDef = {
  ns: Ns;
  /** Dotted path under the namespace, e.g. `hero.subtitle` */
  path: string;
  label: string;
  multiline?: boolean;
};

type SectionDef = {
  id: string;
  title: string;
  hint: string;
  fields: FieldDef[];
};

function f(ns: Ns, path: string, label: string, multiline = false): FieldDef {
  return { ns, path, label, multiline };
}

const PILLAR_IDS = ["independent", "integrated", "openApi"] as const;

const QUOTE_IDS = [
  "natureCraft",
  "wallStreet",
  "putiih",
  "threeland",
  "rumahZakat",
] as const;

const VIDEO_IDS = [
  "moir",
  "rumahZakat",
  "mnp",
  "vio",
  "dokterhub",
  "threeland",
] as const;

const CAP_IDS = ["cap1", "cap2", "cap3", "cap4"] as const;

/** Fields that appear on the production homepage (`/`). */
const SECTIONS: SectionDef[] = [
  {
    id: "hero",
    title: "01 · Hero",
    hint: "Judul keynote, subcopy, label hub, CTA header",
    fields: [
      f("agentic", "hero.eyebrow", "Eyebrow"),
      f("agentic", "hero.titleLead", "H1 — lead"),
      f("agentic", "hero.titleAccent", "H1 — accent"),
      f("agentic", "hero.subtitle", "Subjudul", true),
      f("agentic", "hero.hubLabel", "Label peta ekosistem"),
      f("home", "hero.ctaPrimary", "CTA utama (WhatsApp)"),
      f("home", "hero.ctaSecondary", "CTA sekunder (trial)"),
    ],
  },
  {
    id: "pillars",
    title: "02 · Mandiri · Terhubung · Terbuka",
    hint: "Tiga prinsip setelah hero",
    fields: [
      f("agentic", "pillars.eyebrow", "Eyebrow"),
      f("agentic", "pillars.headingLead", "Heading — lead"),
      f("agentic", "pillars.headingAccent", "Heading — accent"),
      f("agentic", "pillars.body", "Body", true),
      ...PILLAR_IDS.flatMap((id) => [
        f("agentic", `pillars.${id}.title`, `${id} — title`),
        f("agentic", `pillars.${id}.lead`, `${id} — lead`, true),
        f("agentic", `pillars.${id}.body`, `${id} — body`, true),
        f("agentic", `pillars.${id}.tag1`, `${id} — tag 1`),
        f("agentic", `pillars.${id}.tag2`, `${id} — tag 2`),
        f("agentic", `pillars.${id}.tag3`, `${id} — tag 3`),
      ]),
    ],
  },
  {
    id: "proof",
    title: "03 · Dipercaya bisnis di Asia",
    hint: "Strip 3 statistik",
    fields: [
      f("agentic", "proof.heading", "Heading"),
      f("agentic", "proof.stat1Value", "Stat 1 — nilai"),
      f("agentic", "proof.stat1Label", "Stat 1 — label"),
      f("agentic", "proof.stat2Value", "Stat 2 — nilai"),
      f("agentic", "proof.stat2Label", "Stat 2 — label"),
      f("agentic", "proof.stat3Value", "Stat 3 — nilai"),
      f("agentic", "proof.stat3Label", "Stat 3 — label"),
    ],
  },
  {
    id: "pricing",
    title: "05 · Harga",
    hint: "Intro paket + tombol CTA kartu harga",
    fields: [
      f("agentic", "pricing.eyebrow", "Eyebrow"),
      f("agentic", "pricing.headingLead", "Heading — lead"),
      f("agentic", "pricing.headingAccent", "Heading — accent"),
      f("agentic", "pricing.body", "Body", true),
      f("agentic", "pricing.cta", "Link “Lihat semua paket”"),
      f("pricing", "ctaSecondary", "Tombol kartu — trial"),
      f("pricing", "ctaPrimary", "Tombol kartu — sales"),
      f("pricing", "ctaWhatsApp", "Tombol kartu — WhatsApp"),
      f("pricing", "ctaCustom", "Tombol kartu — custom"),
    ],
  },
  {
    id: "results",
    title: "06 · Hasil & testimoni",
    hint: "Heading Results, kutipan wawancara, nama/role video",
    fields: [
      f("agentic", "results.eyebrow", "Eyebrow"),
      f("agentic", "results.headingLead", "Heading — lead"),
      f("agentic", "results.headingAccent", "Heading — accent"),
      f("agentic", "results.body", "Body", true),
      f("agentic", "results.brandTitle", "Label “Dipercaya oleh”"),
      f("home", "testimonials.heading", "Kutipan — heading"),
      f("home", "testimonials.body", "Kutipan — body", true),
      ...QUOTE_IDS.flatMap((id) => [
        f("home", `testimonials.${id}.quote`, `${id} — quote`, true),
        f("home", `testimonials.${id}.industry`, `${id} — industry`),
        f("home", `testimonials.${id}.function`, `${id} — function`),
        f("home", `testimonials.${id}.name`, `${id} — nama`),
        f("home", `testimonials.${id}.role`, `${id} — role`),
        f("home", `testimonials.${id}.company`, `${id} — perusahaan`),
        f("home", `testimonials.${id}.metricValue`, `${id} — metrik nilai`),
        f("home", `testimonials.${id}.metricLabel`, `${id} — metrik label`, true),
      ]),
      ...VIDEO_IDS.flatMap((id) => [
        f("home", `testimonials.videos.${id}.name`, `video ${id} — nama`),
        f("home", `testimonials.videos.${id}.role`, `video ${id} — role`),
      ]),
    ],
  },
  {
    id: "openApi",
    title: "07 · Open API",
    hint: "Bagian terbuka + 4 kapabilitas",
    fields: [
      f("agentic", "openApi.eyebrow", "Eyebrow"),
      f("agentic", "openApi.headingLead", "Heading — lead"),
      f("agentic", "openApi.headingAccent", "Heading — accent"),
      f("agentic", "openApi.body", "Body", true),
      f("agentic", "openApi.constellationLabel", "Label integrasi"),
      f("agentic", "openApi.cta", "CTA"),
      ...CAP_IDS.flatMap((id) => [
        f("agentic", `openApi.${id}.title`, `${id} — title`),
        f("agentic", `openApi.${id}.body`, `${id} — body`, true),
      ]),
    ],
  },
  {
    id: "finalCta",
    title: "08 · CTA akhir",
    hint: "Closer + 3 bullet trust",
    fields: [
      f("agentic", "finalCta.eyebrow", "Eyebrow"),
      f("agentic", "finalCta.headingLead", "Heading — lead"),
      f("agentic", "finalCta.headingAccent", "Heading — accent"),
      f("agentic", "finalCta.body", "Body", true),
      f("agentic", "finalCta.item1", "Bullet 1"),
      f("agentic", "finalCta.item2", "Bullet 2"),
      f("agentic", "finalCta.item3", "Bullet 3"),
      f("home", "hero.ctaPrimary", "CTA utama (dipakai lagi)"),
      f("home", "hero.ctaSecondary", "CTA sekunder (dipakai lagi)"),
    ],
  },
];

type CopyState = Record<Ns, Record<string, Json>>;

function getPath(obj: Json, path: string): string {
  const parts = path.split(".");
  let cur: Json = obj;
  for (const part of parts) {
    if (typeof cur !== "object" || cur === null || Array.isArray(cur)) return "";
    cur = (cur as Record<string, Json>)[part];
    if (cur === undefined) return "";
  }
  return typeof cur === "string" ? cur : "";
}

function setPath(obj: Record<string, Json>, path: string, value: string): void {
  const parts = path.split(".");
  let cur: Record<string, Json> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      cur[key] = {};
    }
    cur = cur[key] as Record<string, Json>;
  }
  cur[parts[parts.length - 1]] = value;
}

function pickCopy(data: Partial<CopyState>): CopyState {
  return {
    home: data.home ?? {},
    agentic: data.agentic ?? {},
    pricing: data.pricing ?? {},
  };
}

type Status = "idle" | "loading" | "saving" | "saved" | "error";

export function WireframeEditor() {
  const t = useTranslations("wireframe");
  const [copy, setCopy] = useState<CopyState | null>(null);
  const [baseline, setBaseline] = useState<CopyState | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/home-copy", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Partial<CopyState>;
      const next = pickCopy(data);
      setCopy(next);
      setBaseline(next);
      setStatus("idle");
      setMessage("");
    } catch {
      setStatus("error");
      setMessage("Gagal memuat copy.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/home-copy", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Partial<CopyState>;
        if (cancelled) return;
        const next = pickCopy(data);
        setCopy(next);
        setBaseline(next);
        setStatus("idle");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Gagal memuat copy.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty = useMemo(() => {
    if (!copy || !baseline) return false;
    return JSON.stringify(copy) !== JSON.stringify(baseline);
  }, [copy, baseline]);

  const fieldCount = useMemo(
    () => SECTIONS.reduce((n, s) => n + s.fields.length, 0),
    [],
  );

  function updateField(ns: Ns, path: string, value: string) {
    setCopy((prev) => {
      if (!prev) return prev;
      const next: CopyState = JSON.parse(JSON.stringify(prev));
      setPath(next[ns], path, value);
      return next;
    });
    setStatus("idle");
    setMessage("");
  }

  async function save() {
    if (!copy) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/home-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copy),
      });
      if (!res.ok) throw new Error(String(res.status));
      await load();
      setStatus("saved");
      setMessage("Tersimpan. Beranda sudah di-revalidate.");
    } catch {
      setStatus("error");
      setMessage("Gagal menyimpan.");
    }
  }

  async function reset() {
    await load();
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-24">
      <header className="sticky top-0 z-[60] border-b border-slate-300 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div>
            <p className="font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              Wireframe · ID · Beranda /
            </p>
            <h1 className="font-numeric text-lg font-semibold text-slate-900">
              {t("title")}
            </h1>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <span className="font-numeric text-xs text-slate-500">
              {fieldCount} field · {SECTIONS.length} section
            </span>
            {dirty && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-numeric text-[11px] font-medium text-amber-800">
                belum disimpan
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-numeric text-sm text-slate-700 hover:bg-slate-50"
            >
              {t("openHome")}
            </Link>
            <button
              type="button"
              onClick={() => void reset()}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-numeric text-sm text-slate-700 hover:bg-slate-50"
            >
              {t("reset")}
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={!copy || !dirty || status === "saving"}
              className="rounded-lg bg-primary px-4 py-1.5 font-numeric text-sm font-semibold text-white disabled:opacity-40"
            >
              {status === "saving" ? t("saving") : t("save")}
            </button>
          </div>
        </div>
        {message && (
          <div
            className={`border-t px-4 py-2 font-numeric text-sm ${
              status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {message}{" "}
            {status === "saved" && (
              <Link href="/" className="underline">
                {t("openHome")}
              </Link>
            )}
          </div>
        )}
      </header>

      {!copy ? (
        <div className="mx-auto max-w-6xl px-4 py-10 font-numeric text-slate-600">
          {status === "error" ? message : "Memuat wireframe…"}
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
          <nav className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#sec-${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`block rounded-md px-2.5 py-1.5 font-numeric text-xs ${
                      activeSection === s.id
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6">
            <p className="font-numeric text-xs text-slate-500">{t("intro")}</p>
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={`sec-${section.id}`}
                className="scroll-mt-24 rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-slate-200 pb-3">
                  <h2 className="font-numeric text-sm font-semibold tracking-wide text-slate-800 uppercase">
                    {section.title}
                  </h2>
                  <p className="font-numeric text-[11px] text-slate-500">
                    {section.hint}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {section.fields.map((field) => {
                    const value = getPath(copy[field.ns], field.path);
                    const inputId = `wf-${section.id}-${field.ns}-${field.path.replace(/\./g, "-")}`;
                    return (
                      <div
                        key={`${field.ns}.${field.path}`}
                        className={field.multiline ? "sm:col-span-2" : ""}
                      >
                        <label
                          htmlFor={inputId}
                          className="mb-1 flex items-baseline justify-between gap-2"
                        >
                          <span className="font-numeric text-xs font-medium text-slate-700">
                            {field.label}
                          </span>
                          <code className="font-numeric text-[10px] text-slate-400">
                            {field.ns}.{field.path}
                          </code>
                        </label>
                        {field.multiline ? (
                          <textarea
                            id={inputId}
                            value={value}
                            rows={3}
                            onChange={(e) =>
                              updateField(field.ns, field.path, e.target.value)
                            }
                            className="w-full rounded-md border border-slate-300 bg-[#fafbfc] px-3 py-2 font-numeric text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        ) : (
                          <input
                            id={inputId}
                            type="text"
                            value={value}
                            onChange={(e) =>
                              updateField(field.ns, field.path, e.target.value)
                            }
                            className="w-full rounded-md border border-slate-300 bg-[#fafbfc] px-3 py-2 font-numeric text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-300 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!copy || !dirty || status === "saving"}
          className="w-full rounded-lg bg-primary py-2.5 font-numeric text-sm font-semibold text-white disabled:opacity-40"
        >
          {status === "saving" ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
