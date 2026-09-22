"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

type FieldDef = {
  /** Dotted path under `home`, e.g. `hero.title` */
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

function f(path: string, label: string, multiline = false): FieldDef {
  return { path, label, multiline };
}

const SECTIONS: SectionDef[] = [
  {
    id: "hero",
    title: "01 · Hero",
    hint: "Judul utama, eyebrow, subcopy, tombol CTA",
    fields: [
      f("hero.eyebrow", "Eyebrow / badge"),
      f("hero.title", "Judul H1", true),
      f("hero.subtitle", "Subjudul", true),
      f("hero.ctaPrimary", "CTA utama"),
      f("hero.ctaSecondary", "CTA sekunder"),
    ],
  },
  {
    id: "trustedBy",
    title: "02 · Trusted By + Statistik",
    hint: "Heading social proof, angka statistik, kutipan partner",
    fields: [
      f("trustedBy.heading", "Heading"),
      f("trustedBy.stat1Value", "Stat 1 — nilai"),
      f("trustedBy.stat1Label", "Stat 1 — label"),
      f("trustedBy.stat2Value", "Stat 2 — nilai"),
      f("trustedBy.stat2Label", "Stat 2 — label"),
      f("trustedBy.partnersHeading", "Heading partner"),
      f("trustedBy.moreClients", "Teks “lainnya”"),
      f("trustedBy.quote", "Kutipan 1"),
      f("trustedBy.quoteAuthorName", "Kutipan 1 — nama"),
      f("trustedBy.quoteAuthorRole", "Kutipan 1 — role"),
      f("trustedBy.quoteAuthorCompany", "Kutipan 1 — perusahaan"),
      f("trustedBy.quoteWiji", "Kutipan 2"),
      f("trustedBy.quoteAuthorNameWiji", "Kutipan 2 — nama"),
      f("trustedBy.quoteAuthorRoleWiji", "Kutipan 2 — role"),
      f("trustedBy.quoteAuthorCompanyWiji", "Kutipan 2 — perusahaan"),
      f("trustedBy.quoteHargyo", "Kutipan 3"),
      f("trustedBy.quoteAuthorNameHargyo", "Kutipan 3 — nama"),
      f("trustedBy.quoteAuthorRoleHargyo", "Kutipan 3 — role"),
      f("trustedBy.quoteAuthorCompanyHargyo", "Kutipan 3 — perusahaan"),
    ],
  },
  {
    id: "testimonials",
    title: "03 · Testimoni video / hasil",
    hint: "Heading + body + 5 testimoni (quote, metrik, profil)",
    fields: [
      f("testimonials.heading", "Heading"),
      f("testimonials.body", "Body", true),
      ...(["natureCraft", "wallStreet", "putiih", "threeland", "rumahZakat"] as const).flatMap(
        (id) => [
          f(`testimonials.${id}.quote`, `${id} — quote`, true),
          f(`testimonials.${id}.industry`, `${id} — industry`),
          f(`testimonials.${id}.function`, `${id} — function`),
          f(`testimonials.${id}.name`, `${id} — nama`),
          f(`testimonials.${id}.role`, `${id} — role`),
          f(`testimonials.${id}.company`, `${id} — perusahaan`),
          f(`testimonials.${id}.metricValue`, `${id} — metrik nilai`),
          f(`testimonials.${id}.metricLabel`, `${id} — metrik label`, true),
        ],
      ),
    ],
  },
  {
    id: "featureAccordion",
    title: "04 · Empat produk (accordion)",
    hint: "Chat · CRM · Marketing · Order — title, lead, body, 3 pill",
    fields: [
      f("featureAccordion.heading", "Heading"),
      f("featureAccordion.body", "Body", true),
      ...(["chat", "crm", "marketing", "order"] as const).flatMap((id) => [
        f(`featureAccordion.${id}.title`, `${id} — title`),
        f(`featureAccordion.${id}.lead`, `${id} — lead`, true),
        f(`featureAccordion.${id}.body`, `${id} — body`, true),
        f(`featureAccordion.${id}.pill1`, `${id} — pill 1`),
        f(`featureAccordion.${id}.pill2`, `${id} — pill 2`),
        f(`featureAccordion.${id}.pill3`, `${id} — pill 3`),
      ]),
    ],
  },
  {
    id: "industries",
    title: "05 · Industri (carousel)",
    hint: "Heading, body, label navigasi",
    fields: [
      f("industries.heading", "Heading"),
      f("industries.body", "Body", true),
      f("industries.useCases", "Label use case"),
      f("industries.learnMore", "Link pelajari lebih lanjut"),
      f("industries.previous", "Tombol sebelumnya"),
      f("industries.next", "Tombol berikutnya"),
    ],
  },
  {
    id: "integrations",
    title: "06 · Integrasi",
    hint: "Eyebrow, heading, body, CTA",
    fields: [
      f("integrations.eyebrow", "Eyebrow"),
      f("integrations.heading", "Heading"),
      f("integrations.body", "Body", true),
      f("integrations.cta", "CTA"),
    ],
  },
  {
    id: "platformOverview",
    title: "07 · Platform overview",
    hint: "Tiga fitur unggulan",
    fields: [1, 2, 3].flatMap((n) => [
      f(`platformOverview.feature${n}.title`, `Fitur ${n} — judul`, true),
      f(`platformOverview.feature${n}.description`, `Fitur ${n} — deskripsi`, true),
    ]),
  },
  {
    id: "buildAiAgent",
    title: "08 · Buat AI Agent",
    hint: "Heading, body, tiga fitur",
    fields: [
      f("buildAiAgent.heading", "Heading"),
      f("buildAiAgent.body", "Body", true),
      ...[1, 2, 3].flatMap((n) => [
        f(`buildAiAgent.feature${n}.title`, `Fitur ${n} — judul`),
        f(`buildAiAgent.feature${n}.description`, `Fitur ${n} — deskripsi`, true),
      ]),
    ],
  },
  {
    id: "aiAgentFlow",
    title: "09 · AI Agent & alur chat",
    hint: "Heading, body, tiga fitur",
    fields: [
      f("aiAgentFlow.heading", "Heading"),
      f("aiAgentFlow.body", "Body", true),
      ...[1, 2, 3].flatMap((n) => [
        f(`aiAgentFlow.feature${n}.title`, `Fitur ${n} — judul`),
        f(`aiAgentFlow.feature${n}.description`, `Fitur ${n} — deskripsi`, true),
      ]),
    ],
  },
  {
    id: "pricingTeaser",
    title: "10 · Pricing teaser",
    hint: "Heading, body, CTA",
    fields: [
      f("pricingTeaser.heading", "Heading"),
      f("pricingTeaser.body", "Body", true),
      f("pricingTeaser.cta", "CTA"),
    ],
  },
  {
    id: "realResults",
    title: "11 · Real results / brand",
    hint: "Heading, body, label media",
    fields: [
      f("realResults.heading", "Heading"),
      f("realResults.body", "Body", true),
      f("realResults.brandTitle", "Label “Dipercaya oleh”"),
    ],
  },
  {
    id: "finalCta",
    title: "12 · CTA akhir",
    hint: "Heading, body, tiga bullet",
    fields: [
      f("finalCta.heading", "Heading"),
      f("finalCta.body", "Body", true),
      f("finalCta.item1", "Bullet 1"),
      f("finalCta.item2", "Bullet 2"),
      f("finalCta.item3", "Bullet 3"),
    ],
  },
];

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

type Status = "idle" | "loading" | "saving" | "saved" | "error";

export function WireframeEditor() {
  const t = useTranslations("wireframe");
  const [home, setHome] = useState<Record<string, Json> | null>(null);
  const [baseline, setBaseline] = useState<Record<string, Json> | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/home-copy", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { home: Record<string, Json> };
      setHome(data.home);
      setBaseline(data.home);
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
        const data = (await res.json()) as { home: Record<string, Json> };
        if (cancelled) return;
        setHome(data.home);
        setBaseline(data.home);
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
    if (!home || !baseline) return false;
    return JSON.stringify(home) !== JSON.stringify(baseline);
  }, [home, baseline]);

  const fieldCount = useMemo(
    () => SECTIONS.reduce((n, s) => n + s.fields.length, 0),
    [],
  );

  function updateField(path: string, value: string) {
    setHome((prev) => {
      if (!prev) return prev;
      const next: Record<string, Json> = JSON.parse(JSON.stringify(prev));
      setPath(next, path, value);
      return next;
    });
    setStatus("idle");
    setMessage("");
  }

  async function save() {
    if (!home) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/home-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home }),
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
      {/* Top bar — site navbar is hidden on this route; keep z above any chrome. */}
      <header className="sticky top-0 z-[60] border-b border-slate-300 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div>
            <p className="font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
              Wireframe · ID
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
              disabled={!home || !dirty || status === "saving"}
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

      {!home ? (
        <div className="mx-auto max-w-6xl px-4 py-10 font-numeric text-slate-600">
          {status === "error" ? message : "Memuat wireframe…"}
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[200px_1fr]">
          {/* Section nav */}
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

          {/* Wireframe sections */}
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
                    const value = getPath(home, field.path);
                    const inputId = `wf-${section.id}-${field.path.replace(/\./g, "-")}`;
                    return (
                      <div
                        key={field.path}
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
                            home.{field.path}
                          </code>
                        </label>
                        {field.multiline ? (
                          <textarea
                            id={inputId}
                            value={value}
                            rows={3}
                            onChange={(e) =>
                              updateField(field.path, e.target.value)
                            }
                            className="w-full rounded-md border border-slate-300 bg-[#fafbfc] px-3 py-2 font-numeric text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        ) : (
                          <input
                            id={inputId}
                            type="text"
                            value={value}
                            onChange={(e) =>
                              updateField(field.path, e.target.value)
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

      {/* Sticky save bar (mobile) — above WhatsApp float (z-50). */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-300 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => void save()}
          disabled={!home || !dirty || status === "saving"}
          className="w-full rounded-lg bg-primary py-2.5 font-numeric text-sm font-semibold text-white disabled:opacity-40"
        >
          {status === "saving" ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
}
