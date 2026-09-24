"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useLoopCursor } from "@/components/sections/agentic/collage-live-hooks";

type Locale = "id" | "en";
type L10n = Record<Locale, string>;

type ChatLine = {
  id: string;
  side: "user" | "ai";
  text: L10n;
  /** Optional metric chips under an AI reply. */
  chips?: { label: L10n; value: L10n; tone?: "emerald" | "cyan" | "amber" | "indigo" }[];
  delay: number;
};

/**
 * Consulting Agent chat — owner ↔ Cekat.AI about the real business.
 *
 * Separate loop from the WhatsApp sales thread: this is “ask how the
 * business is doing” — kondisi bisnis, penjualan, ROAS iklan, ads yang
 * works, complain, langkah berikutnya.
 */
const THREAD: ChatLine[] = [
  {
    id: "q1",
    side: "user",
    text: {
      id: "Gimana kondisi bisnis sekarang?",
      en: "How is the business doing right now?",
    },
    delay: 1500,
  },
  {
    id: "a1",
    side: "ai",
    text: {
      id: "Sehat. Omzet 30 hari Rp 248jt — naik 12% vs bulan lalu. 312 lead baru masuk, closing rate 31%.",
      en: "Healthy. 30-day revenue Rp 248M — up 12% vs last month. 312 new leads, close rate 31%.",
    },
    chips: [
      { label: { id: "Omzet", en: "Revenue" }, value: { id: "Rp 248jt", en: "Rp 248M" }, tone: "emerald" },
      { label: { id: "Lead", en: "Leads" }, value: { id: "312", en: "312" }, tone: "cyan" },
      { label: { id: "Closing", en: "Close" }, value: { id: "31%", en: "31%" }, tone: "emerald" },
    ],
    delay: 2400,
  },
  {
    id: "q2",
    side: "user",
    text: { id: "Gimana penjualan?", en: "How are sales?" },
    delay: 1400,
  },
  {
    id: "a2",
    side: "ai",
    text: {
      id: "96 deal won minggu ini. Top seller: Paket Family + Omega-3. AOV naik ke Rp 312rb — bundling mulai jalan.",
      en: "96 deals won this week. Top: Family Pack + Omega-3. AOV up to Rp 312k — bundles are working.",
    },
    chips: [
      { label: { id: "Won", en: "Won" }, value: { id: "96 deal", en: "96 deals" }, tone: "emerald" },
      { label: { id: "AOV", en: "AOV" }, value: { id: "Rp 312rb", en: "Rp 312k" }, tone: "amber" },
    ],
    delay: 2300,
  },
  {
    id: "q3",
    side: "user",
    text: { id: "Gimana ROAS iklan?", en: "How is ad ROAS?" },
    delay: 1400,
  },
  {
    id: "a3",
    side: "ai",
    text: {
      id: "ROAS blend 3,4×. Meta Retarget A paling kuat di 4,1×. Broadcast WA menyumbang 28% penjualan.",
      en: "Blended ROAS 3.4×. Meta Retarget A leads at 4.1×. WhatsApp broadcasts drive 28% of sales.",
    },
    chips: [
      { label: { id: "ROAS", en: "ROAS" }, value: { id: "3,4×", en: "3.4×" }, tone: "cyan" },
      { label: { id: "Retarget A", en: "Retarget A" }, value: { id: "4,1×", en: "4.1×" }, tone: "emerald" },
    ],
    delay: 2400,
  },
  {
    id: "q4",
    side: "user",
    text: { id: "Ads mana yang paling works?", en: "Which ads work best?" },
    delay: 1400,
  },
  {
    id: "a4",
    side: "ai",
    text: {
      id: "1) Meta Retarget A — 62% revenue berbayar. 2) Lookalike WA click — CPL terendah. 3) Broadcast segment VIP — repeat order naik.",
      en: "1) Meta Retarget A — 62% of paid revenue. 2) Lookalike WA click — lowest CPL. 3) VIP broadcast — repeat orders up.",
    },
    delay: 2300,
  },
  {
    id: "q5",
    side: "user",
    text: { id: "Ada complain?", en: "Any complaints?" },
    delay: 1400,
  },
  {
    id: "a5",
    side: "ai",
    text: {
      id: "2 complain minggu ini — resi terlambat. Auto-handoff ke CS + follow-up H+1. CSAT masih 4,7.",
      en: "2 this week — late tracking numbers. Auto-handoff to CS + H+1 follow-up. CSAT still 4.7.",
    },
    chips: [
      { label: { id: "Complain", en: "Complaints" }, value: { id: "2", en: "2" }, tone: "amber" },
      { label: { id: "CSAT", en: "CSAT" }, value: { id: "4,7", en: "4.7" }, tone: "emerald" },
    ],
    delay: 2300,
  },
  {
    id: "q6",
    side: "user",
    text: { id: "Langkah berikutnya?", en: "What next?" },
    delay: 1400,
  },
  {
    id: "a6",
    side: "ai",
    text: {
      id: "Naikkan budget Retarget A +20%, push bundle Vit C+Omega, aktifkan reminder H+2 untuk cart yang belum bayar. Mau saya jalankan?",
      en: "Raise Retarget A budget +20%, push Vit C+Omega bundle, enable H+2 reminders for unpaid carts. Want me to run it?",
    },
    chips: [
      { label: { id: "Prioritas", en: "Priority" }, value: { id: "Retarget A", en: "Retarget A" }, tone: "indigo" },
      { label: { id: "Aksi", en: "Action" }, value: { id: "3 langkah", en: "3 steps" }, tone: "indigo" },
    ],
    delay: 2600,
  },
];

/**
 * Looping Consulting Agent chat window — owner asks about the business,
 * agent answers with live numbers. Independent of the WhatsApp sales loop.
 */
export function CollageConsultingChat() {
  const locale: Locale = useLocale() === "en" ? "en" : "id";
  const scrollRef = useRef<HTMLDivElement>(null);

  const delays = useMemo(() => THREAD.map((l) => l.delay), []);
  const delayFor = useMemo(
    () => (i: number) => delays[i] ?? 1600,
    [delays],
  );
  const cursor = useLoopCursor(THREAD.length, delayFor);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [cursor]);

  const visible = THREAD.slice(0, cursor);
  const typing =
    cursor > 0 &&
    cursor < THREAD.length &&
    THREAD[cursor]?.side === "ai";

  return (
    <div className="flex h-full w-full flex-col bg-[#0f172a] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-2.5 py-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-indigo-400 to-[#6366f1] text-[9px] font-bold">
          C
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-semibold">Consulting Agent</div>
          <div className="flex items-center gap-1 text-[8px] text-white/50">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
            Online · dari data bisnis Anda
          </div>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[7px] font-bold tracking-wide text-indigo-200 uppercase">
          Live
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2.5 py-2"
      >
        {visible.map((line) => (
          <div
            key={line.id}
            className={cn(
              "hero-collage-msg flex flex-col gap-1",
              line.side === "user" ? "items-end" : "items-start",
            )}
          >
            <div
              className={cn(
                "max-w-[92%] rounded-2xl px-2.5 py-1.5 text-[9px] leading-snug",
                line.side === "user"
                  ? "rounded-br-md bg-[#2563eb] text-white"
                  : "rounded-bl-md border border-white/10 bg-white/8 text-white/90",
              )}
            >
              {line.text[locale]}
            </div>
            {line.chips?.length ? (
              <div className="flex w-full flex-wrap gap-1">
                {line.chips.map((c) => (
                  <span
                    key={c.label.en}
                    className={cn(
                      "hero-collage-msg rounded-full px-1.5 py-0.5 text-[7.5px] font-semibold",
                      c.tone === "emerald" && "bg-emerald-400/15 text-emerald-300",
                      c.tone === "cyan" && "bg-cyan-400/15 text-cyan-300",
                      c.tone === "amber" && "bg-amber-400/15 text-amber-300",
                      c.tone === "indigo" && "bg-indigo-400/15 text-indigo-300",
                    )}
                  >
                    {c.label[locale]} {c.value[locale]}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {typing ? (
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-2.5 py-2 self-start">
            <span className="size-1 animate-bounce rounded-full bg-white/50 [animation-delay:0ms]" />
            <span className="size-1 animate-bounce rounded-full bg-white/50 [animation-delay:120ms]" />
            <span className="size-1 animate-bounce rounded-full bg-white/50 [animation-delay:240ms]" />
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 px-2.5 py-1.5">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[8px] text-white/35">
          <span className="flex-1">Tanya kondisi bisnis…</span>
          <span className="grid size-4 place-items-center rounded-full bg-[#2563eb] text-[8px] text-white">
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}
