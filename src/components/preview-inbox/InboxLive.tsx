"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live inbox table — the readme.com "request log" element, re-drawn for
 * Cekat.AI: instead of API calls it shows customer chats landing in the
 * inbox and being answered in seconds.
 *
 * Structure mirrors the reference: a hairline grid with "+" corner marks
 * outside the frame, a header row, rows that slide up one slot every tick
 * (a new chat enters from below the fold, the oldest exits clipped at the
 * top), and a floating contact card overlapping the top-right on desktop,
 * sitting below the table on mobile.
 *
 * Motion is one interval writing an offset; each row's slot is derived from
 * its index, so a tick moves every row by exactly one row-height via a CSS
 * transform. `prefers-reduced-motion` freezes the feed at rest — the table
 * reads the same either way.
 */

const ROW_H = 56; // px — h-14, must match the row height class below
const VISIBLE = 4; // rows inside the 224px clip window
const TICK_MS = 2800;

type Channel = { label: "WA" | "IG" | "TK" | "TG"; cls: string };

const WA: Channel = { label: "WA", cls: "bg-[#dcfce7] text-[#15803d]" };
const IG: Channel = { label: "IG", cls: "bg-[#f3e8ff] text-[#7e22ce]" };
const TK: Channel = { label: "TK", cls: "bg-[#fce7f3] text-[#be185d]" };
const TG: Channel = { label: "TG", cls: "bg-[#e0f2fe] text-[#0369a1]" };

type Chat = {
  id: string;
  /** Reply time, mono. `slow` renders the amber "handled by staff" dot. */
  s: string;
  slow?: boolean;
  ch: Channel;
  name: string;
  contact: string;
  msg: string;
};

/**
 * Illustrative pool — sample workspace data, labelled as such on the page.
 * The feed composes new rows from these parts on every tick, so it never
 * visibly loops the way a fixed row list does.
 */
const PEOPLE: { name: string; contact: string; ch: Channel }[] = [
  { name: "Sari Wijaya", contact: "8123 4555 2211", ch: WA },
  { name: "Budi Hartono", contact: "8121 0043 7781", ch: WA },
  { name: "Rani Pratiwi", contact: "ranipratiwi", ch: IG },
  { name: "Dewi Anggraini", contact: "dewi.an", ch: TK },
  { name: "Andi Saputra", contact: "8778 2201 9087", ch: WA },
  { name: "Maya Larasati", contact: "mayalaras", ch: TG },
  { name: "Rizal Firmansyah", contact: "8953 7712 0043", ch: WA },
  { name: "Tari Wulandari", contact: "tari.w", ch: IG },
  { name: "Bagus Nugroho", contact: "8112 9087 4456", ch: WA },
  { name: "Lina Kartika", contact: "lina.kartika", ch: TK },
];

const MESSAGES = [
  { id: "Navy size L masih ready, Kak?", en: "Is navy size L still in stock?" },
  { id: "Bisa kirim hari ini?", en: "Can you ship today?" },
  { id: "Ini ready warna cream?", en: "Is the cream colour available?" },
  { id: "Barang saya belum sampai", en: "My order hasn't arrived yet" },
  { id: "Minta invoice ya, bang", en: "Could I get an invoice?" },
  { id: "Jam berapa tutup?", en: "What time do you close?" },
  { id: "Sudah saya bayar ya", en: "I've already paid" },
  { id: "Kok stok habis terus?", en: "Why is it always out of stock?" },
  { id: "Boleh COD tidak?", en: "Do you offer cash on delivery?" },
  { id: "Yang size M ada?", en: "Do you have size M?" },
];

/** Reply times: mostly fast (the product's claim), occasionally staffed. */
const FAST_SEC = [1.2, 1.8, 2.4, 6, 8, 9, 12];
const SLOW_MIN = [2, 3, 5];

function fmtSec(n: number, en: boolean) {
  const v = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
  return en ? `${n} sec` : `${v} dtk`;
}

function makeChat(id: number, en: boolean, rand: () => number): Chat {
  const p = PEOPLE[Math.floor(rand() * PEOPLE.length)];
  const m = MESSAGES[Math.floor(rand() * MESSAGES.length)];
  const slow = rand() < 0.15;
  const s = slow
    ? `${SLOW_MIN[Math.floor(rand() * SLOW_MIN.length)]}${en ? " min" : " mnt"}`
    : fmtSec(FAST_SEC[Math.floor(rand() * FAST_SEC.length)], en);
  return {
    id: `c${id}`,
    s,
    slow,
    ch: p.ch,
    name: p.name,
    contact: p.contact,
    msg: en ? m.en : m.id,
  };
}

/** Seeded PRNG — the first window must render identically on server and
    client, so the pre-hydration rows can't come from Math.random. */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const COPY = {
  id: {
    eyebrow: "Inbox langsung",
    heading: "Chat masuk, dibalas detik itu juga",
    sub: "Contoh tampilan inbox Cekat.AI — data di bawah ilustrasi.",
    cols: ["Status", "Kanal", "Pelanggan", "Kontak", "Pesan"],
    note: "Data contoh untuk ilustrasi",
    card: {
      active: "Aktif 12 mnt lalu",
      cta: "Balas di inbox",
      overview: "Ringkasan",
      rows: [
        ["Waktu balas pertama", "1,8 dtk"],
        ["Selesai tanpa tim", "87%"],
      ],
      intents: "Inten teratas",
      intentRows: [
        ["tanya-stok", "34%"],
        ["cek-ongkir", "21%"],
        ["komplain-kirim", "12%"],
      ],
      escalations: "Perlu eskalasi",
      escalationRows: [
        ["E401", "refund tertunda", "7"],
        ["429", "bahasa tak terbaca", "3"],
      ],
    },
  },
  en: {
    eyebrow: "Live inbox",
    heading: "Chats in, answered in seconds",
    sub: "A sample Cekat.AI inbox — the data below is illustrative.",
    cols: ["Status", "Channel", "Customer", "Contact", "Message"],
    note: "Sample data for illustration",
    card: {
      active: "Active 12 min ago",
      cta: "Reply in inbox",
      overview: "Overview",
      rows: [
        ["First reply", "1.8 sec"],
        ["Resolved without staff", "87%"],
      ],
      intents: "Top intents",
      intentRows: [
        ["ask-stock", "34%"],
        ["check-shipping", "21%"],
        ["delivery-complaint", "12%"],
      ],
      escalations: "Needs a person",
      escalationRows: [
        ["E401", "refund pending", "7"],
        ["429", "language unclear", "3"],
      ],
    },
  },
} as const;

/** The "+" corner marks. Decorative, drawn — no image assets. */
function CornerMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden={true}
      className={`pointer-events-none absolute z-30 text-[#1352bf] ${className}`}
    >
      <path
        d="M20 8v24M8 20h24"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function cell(cls: string) {
  return `flex h-14 items-center border-r border-b border-[#e2e8f0] px-5 text-[13px] ${cls}`;
}

export function InboxLive({ locale }: { locale: string }) {
  const en = locale === "en";
  const t = en ? COPY.en : COPY.id;

  // The first window also renders on the server, so it comes from a seeded
  // PRNG — Math.random here would mismatch hydration. After mount each tick
  // appends one freshly composed chat and drops the oldest, so the feed
  // never repeats the same visible sequence.
  const [chats, setChats] = useState<Chat[]>(() => {
    const rand = lcg(20261013);
    return Array.from({ length: VISIBLE + 2 }, (_, i) => makeChat(i, en, rand));
  });
  const nextId = useRef(VISIBLE + 2);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setChats((prev) => [
        ...prev.slice(1),
        makeChat(nextId.current++, en, Math.random),
      ]);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [en]);

  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div data-ph4-enter={true} className="mb-10 flex flex-col gap-3">
        <p className="font-mono text-[11px] tracking-wide text-[#1352bf] uppercase">
          {t.eyebrow}
        </p>
        <h2 className="text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.1] font-semibold text-[#101828]">
          {t.heading}
        </h2>
        <p className="max-w-[34rem] text-[15px] leading-[1.6] text-[#4b5563]">
          {t.sub}
        </p>
      </div>

      {/* Table frame carries the marks; the card is a sibling so it can
          flow below the table on mobile without stretching the frame. */}
      <div className="relative xl:mt-[190px]">
        <div className="relative">
          <CornerMark className="-top-3 -left-3 h-6 w-6 xl:-top-5 xl:-left-5 xl:h-10 xl:w-10" />
          <CornerMark className="-top-3 -right-3 h-6 w-6 xl:-top-5 xl:-right-5 xl:h-10 xl:w-10" />
          <CornerMark className="-bottom-3 -left-3 h-6 w-6 xl:-bottom-5 xl:-left-5 xl:h-10 xl:w-10" />
          <CornerMark className="-right-3 -bottom-3 h-6 w-6 xl:-right-5 xl:-bottom-5 xl:h-10 xl:w-10" />

          <div className="overflow-x-auto">
            <div className="min-w-[840px] border-t border-l border-[#e2e8f0]">
              {/* Header */}
              <div className="flex">
                {t.cols.map((label, i) => (
                  <div
                    key={label}
                    className={`flex h-14 items-center border-r border-b border-[#e2e8f0] px-5 text-[13px] text-[#64748b] ${
                      i === 0
                        ? "w-[132px] shrink-0"
                        : i === 1
                          ? "w-[112px] shrink-0"
                          : "min-w-0 flex-1"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Feed */}
              <div
                className="relative overflow-hidden"
                style={{ height: VISIBLE * ROW_H }}
              >
                {chats.map((chat, i) => (
                  <div
                    key={chat.id}
                    className="absolute top-0 left-0 flex w-full motion-reduce:transition-none"
                    style={{
                      transform: `translateY(${(i - 1) * ROW_H}px)`,
                      transition:
                        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className={cell("w-[132px] shrink-0 gap-2.5")}>
                      <span
                        aria-hidden={true}
                        className={`h-3 w-3 shrink-0 rounded-full ring-[3px] ring-offset-2 ${
                          chat.slow
                            ? "bg-[#f59e0b] ring-[#f59e0b]/25 ring-offset-white"
                            : "bg-[#22c55e] ring-[#22c55e]/25 ring-offset-white"
                        }`}
                      />
                      <span className="font-mono text-[13px] text-[#0f172a] tabular-nums">
                        {chat.s}
                      </span>
                    </div>
                    <div className={cell("w-[112px] shrink-0")}>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${chat.ch.cls}`}
                      >
                        {chat.ch.label}
                      </span>
                    </div>
                    <div className={`${cell("min-w-0 flex-1")} truncate`}>
                      {chat.name}
                    </div>
                    <div className={`${cell("min-w-0 flex-1")} gap-1`}>
                      <span className="shrink-0 text-[#94a3b8]">
                        {/^\d/.test(chat.contact) ? "+62" : "@"}
                      </span>
                      <span className="truncate">{chat.contact}</span>
                    </div>
                    <div
                      className={`${cell("min-w-[200px] flex-[1.2] last:border-r-0")} truncate text-[#334155]`}
                    >
                      {chat.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact card — floats over the table's top-right on xl, rests
            below it on smaller screens. */}
        <div className="mx-auto mt-10 w-[296px] xl:absolute xl:-top-[168px] xl:right-0 xl:z-40 xl:mt-0">
          <div className="rounded-[20px] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="mx-auto mb-3.5 grid h-12 w-12 place-items-center rounded-full bg-[#f1f5f9] text-[15px] font-semibold text-[#475569]">
              S
            </div>
            <p className="text-center text-[15px] font-medium text-[#101828]">
              Sari Wijaya
            </p>
            <p className="mb-4 text-center text-[13px] text-[#64748b]">
              {t.card.active}
            </p>

            <button
              type="button"
              className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-[13px] font-medium text-[#101828] transition-colors hover:bg-[#f8fafc]"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden={true}
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
              {t.card.cta}
            </button>

            <p className="mb-2 text-[12px] text-[#94a3b8]">{t.card.overview}</p>
            <div className="mb-[18px]">
              {t.card.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-2 py-1"
                >
                  <span className="truncate text-[13px] text-[#334155]">
                    {k}
                  </span>
                  <span className="text-[13px] font-medium text-[#101828] tabular-nums">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <p className="mb-2 text-[12px] text-[#94a3b8]">{t.card.intents}</p>
            <div className="mb-[18px]">
              {t.card.intentRows.map(([k, v], i) => (
                <div key={k} className="flex items-center gap-2 py-1">
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      i === 2
                        ? "bg-[#fee2e2] text-[#b91c1c]"
                        : "bg-[#dcfce7] text-[#15803d]"
                    }`}
                  >
                    WA
                  </span>
                  <span className="min-w-0 truncate text-[13px] text-[#334155]">
                    {k}
                  </span>
                  <span className="ml-auto text-[13px] font-medium text-[#101828] tabular-nums">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <p className="mb-2 text-[12px] text-[#94a3b8]">
              {t.card.escalations}
            </p>
            <div>
              {t.card.escalationRows.map(([code, label, n]) => (
                <div
                  key={code}
                  className="flex items-center gap-2 py-1 font-mono text-[12px]"
                >
                  <span
                    aria-hidden={true}
                    className="h-2 w-2 shrink-0 rounded-full bg-[#ef4444]"
                  />
                  <span className="text-[#dc2626]">{code}</span>
                  <span className="min-w-0 flex-1 truncate text-[#64748b]">
                    — {label}
                  </span>
                  <span className="text-[#101828] tabular-nums">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-[#94a3b8] xl:mt-10">
        {t.note}
      </p>
    </section>
  );
}
