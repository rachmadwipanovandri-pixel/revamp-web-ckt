"use client";

import { useState } from "react";
import { Ico } from "./Icon";
import {
  solar_arrow_right_up_bold,
  solar_bag_3_bold,
  solar_case_minimalistic_bold,
  solar_chat_round_line_bold,
  solar_check_circle_bold,
  solar_users_group_rounded_bold,
} from "./icons";
import type { Copy3 } from "./content";

/**
 * The product.
 *
 * A wide data grid that dissolves into a fade on the right, with a detail card
 * dropped into the space the fade leaves. A grid with a hard edge reads as a
 * cropped table; one that fades reads as a surface continuing past the frame.
 * The card is a *sibling* of the masked grid, not a child, so it stays crisp over
 * the dissolving part.
 *
 * Each tab is a different table — not the same table with relabelled columns.
 * An inbox queue, a customer list, an order log and a campaign report share
 * nothing but the shape, which is the point: the product is four surfaces, and
 * switching tabs swaps the surface, not the header text over identical rows.
 *
 * Everything is positional. `AREAS[active]` and `copy.items[active]` are
 * parallel arrays, and nothing derives a lookup key from a translated label —
 * an earlier version keyed off `NAV_EN[i].toLowerCase()` and broke three of the
 * four tabs, because "Customers" is not "profile" and "Orders" is not "order".
 *
 * Rows stagger in on scroll via a CSS custom property, so the sequence costs
 * nothing to run and collapses to one frame under `prefers-reduced-motion`.
 */

/** One cell. `both` when the two locales read the same. */
type Cell = { id: string; en: string } | string;

const c = (id: string, en: string = id) => ({ id, en });

/** Row: a name, plus four cells that differ per row and per area. */
type Row = { name: string; b: Cell; c: Cell; d: Cell; e: Cell };

const INBOX_ROWS: Row[] = [
  { name: "Rani",     b: c("Instagram"), c: "92", d: c("Dewi"),  e: c("Ongkir + harga dikirim", "Shipping + price sent") },
  { name: "Bagus",    b: c("WhatsApp"),  c: "88", d: c("Dewi"),  e: c("Link bayar QRIS dibuat", "QRIS payment link made") },
  { name: "Sinta",    b: c("TikTok"),    c: "81", d: c("Andra"), e: c("Cek stok dua warna", "Stock for two colours checked") },
  { name: "Yosua",    b: c("WhatsApp"),  c: "76", d: c("Andra"), e: c("Eskalasi — komplain", "Escalated — complaint") },
  { name: "Maya",     b: c("Web chat"),  c: "97", d: c("Dewi"),  e: c("Katalog linen dikirim", "Linen catalogue sent") },
  { name: "Rangga",   b: c("Instagram"), c: "69", d: c("Andra"), e: c("Pengembalian diproses", "Return processed") },
  { name: "Tiara",    b: c("WhatsApp"),  c: "84", d: c("Dewi"),  e: c("Order #NC-2502 dicek", "Order #NC-2502 verified") },
];

const PROFILE_ROWS: Row[] = [
  { name: "Rani",   b: c("Bali"),      c: c("Gold"),  d: c("Rp 4,2 jt", "$268"),  e: c("Linen / navy", "Linen / navy") },
  { name: "Bagus",  b: c("Bandung"),   c: c("Silver"), d: c("Rp 1,9 jt", "$121"), e: c("Batik /Heritage", "Batik / heritage") },
  { name: "Sinta",  b: c("Jakarta"),   c: c("Gold"),  d: c("Rp 7,4 jt", "$472"),  e: c("Serum / Glow", "Serum / glow") },
  { name: "Yosua",  b: c("Surabaya"),  c: c("Bronze"), d: c("Rp 640 rb", "$41"),   e: c("Kopi / Arabica", "Coffee / arabica") },
  { name: "Maya",   b: c("Ubud"),      c: c("Gold"),  d: c("Rp 5,1 jt", "$325"),  e: c("Linen / Sage", "Linen / sage") },
  { name: "Rangga", b: c("Medan"),     c: c("Silver"), d: c("Rp 2,3 jt", "$147"), e: c("Kaos / Polos", "Tees / plain") },
  { name: "Tiara",  b: c("Makassar"),  c: c("Gold"),  d: c("Rp 3,8 jt", "$242"),  e: c("Sutra / Merah", "Silk / red") },
];

const ORDER_ROWS: Row[] = [
  { name: "#NC-2502", b: c("Rani"),    c: c("Lunas"),    d: c("Rp 428 rb", "$27"), e: c("Kirim 17 Jun", "Ships 17 Jun") },
  { name: "#NC-2501", b: c("Sinta"),   c: c("Lunas"),    d: c("Rp 1,24 jt", "$79"), e: c("Selesai 16 Jun", "Done 16 Jun") },
  { name: "#NC-2500", b: c("Rangga"),  c: c("Menunggu", "Pending"), d: c("Rp 310 rb", "$20"), e: c("Menunggu transfer", "Awaiting transfer") },
  { name: "#NC-2499", b: c("Yosua"),   c: c("Gagal",  "Failed"),  d: c("Rp 89 rb", "$6"),  e: c("Kartu ditolak", "Card declined") },
  { name: "#NC-2498", b: c("Maya"),    c: c("Lunas"),    d: c("Rp 612 rb", "$39"), e: c("Kirim 16 Jun", "Ships 16 Jun") },
  { name: "#NC-2497", b: c("Bagus"),   c: c("Lunas"),    d: c("Rp 275 rb", "$18"), e: c("Selesai 15 Jun", "Done 15 Jun") },
  { name: "#NC-2496", b: c("Tiara"),   c: c("Dikemas", "Packing"), d: c("Rp 940 rb", "$60"), e: c("Kirim 19 Jun", "Ships 19 Jun") },
];

const CAMPAIGN_ROWS: Row[] = [
  { name: "Diskon 10%",   b: c("Gold"),    c: "72%", d: c("1.284", "1,284"), e: c("9,4% beli", "9.4% bought") },
  { name: "Katalog baru", b: c("Semua"),  c: "68%", d: c("8.902", "8,902"), e: c("4,1% beli", "4.1% bought") },
  { name: "Loyalitas",     b: c("Gold"),    c: "81%", d: c("1.104", "1,104"), e: c("14% beli", "14% bought") },
  { name: "Flash sale",   b: c("Silver"),  c: "54%", d: c("2.410", "2,410"), e: c("2,8% beli", "2.8% bought") },
  { name: "Konfirmasi pesanan", b: c("Semua"), c: "91%", d: c("3.118", "3,118"), e: c("31% dibuka", "31% opened") },
  { name: "Ulang tahun", b: c("Gold"),    c: "76%", d: c("688", "688"),   e: c("18% beli", "18% bought") },
  { name: "Pengiriman ulang", b: c("Semua"), c: "64%", d: c("1.870", "1,870"), e: c("7,3% beli", "7.3% bought") },
];

const AREAS = [
  {
    key: "inbox",
    icon: solar_chat_round_line_bold,
    nav: { id: "Inbox", en: "Inbox" },
    path: "inbox",
    headings: {
      id: ["Pelanggan", "Kanal", "Resolusi", "PIC", "Aktivitas AI terakhir"],
      en: ["Customer", "Channel", "Resolved", "Owner", "Last AI action"],
    },
    rows: INBOX_ROWS,
    card: {
      title: "Rani — Bali",
      meta: { id: "Instagram · 12 order", en: "Instagram · 12 orders" },
      question: {
        id: "Set navy ukuran M ready? Berapa harga untuk 2 pcs?",
        en: "Navy set in medium? And the price for two, please.",
      },
      answer: {
        id: "Stok tersedia. 2 pcs diskon 10% — Rp 428.000. Saya kirim link bayar.",
        en: "Both in stock. Two takes 10% off — $27. Sending a payment link now.",
      },
      source: { id: "dari info stok & harga", en: "from stock & pricing" },
      action: { id: "Link bayar dikirim", en: "Payment link sent" },
    },
  },
  {
    key: "profile",
    icon: solar_users_group_rounded_bold,
    nav: { id: "Pelanggan", en: "Customers" },
    path: "customers",
    headings: {
      id: ["Pelanggan", "Kota", "Tier", "Nilai", "Preferensi"],
      en: ["Customer", "City", "Tier", "LTV", "Prefers"],
    },
    rows: PROFILE_ROWS,
    card: {
      title: "Rani — Bali",
      meta: { id: "Instagram · 12 order", en: "Instagram · 12 orders" },
      question: {
        id: "Dari 3 chat terakhir: linen navy,odi M, tagihan BRILINKA.",
        en: "From her last 3 chats: navy linen, size M, BRILINKA bill.",
      },
      answer: {
        id: "Profil terisi tanpa input manual. 4 dari 5 baris diambil dari percakapan.",
        en: "Profile filled with no manual entry. 4 of 5 rows came from conversation.",
      },
      source: { id: "diturunkan dari chat", en: "derived from chat" },
      action: { id: "Segments diperbarui", en: "Segments updated" },
    },
  },
  {
    key: "order",
    icon: solar_bag_3_bold,
    nav: { id: "Order", en: "Orders" },
    path: "orders",
    headings: {
      id: ["Pelanggan", "Pelanggan", "Status", "Total", "Pengiriman"],
      en: ["Order", "Customer", "Status", "Total", "Shipping"],
    },
    rows: ORDER_ROWS,
    card: {
      title: "#NC-2502",
      meta: { id: "Rani · Instagram", en: "Rani · Instagram" },
      question: {
        id: "“Kak, navy M dua ya. Kalau QRIS bisa?”",
        en: "“Two navy M please. Does QRIS work?”",
      },
      answer: {
        id: "Order dibuat, link QRIS dikirim, pembayaran masuk 4 menit kemudian.",
        en: "Order created, QRIS link sent, payment landed 4 minutes later.",
      },
      source: { id: "status tercatat otomatis", en: "status recorded automatically" },
      action: { id: "Kirim 17 Jun", en: "Ships 17 Jun" },
    },
  },
  {
    key: "campaign",
    icon: solar_case_minimalistic_bold,
    nav: { id: "Kampanye", en: "Campaigns" },
    path: "campaigns",
    headings: {
      id: ["Kampanye", "Segmen", "Dibuka", "Terkirim", "Hasil"],
      en: ["Campaign", "Segment", "Opened", "Sent", "Result"],
    },
    rows: CAMPAIGN_ROWS,
    card: {
      title: "Diskon 10%",
      meta: { id: "Pelanggan Gold · 3 bulan", en: "Gold customers · 3 months" },
      question: {
        id: "1.284 pelanggan Gold, 3 bulan tidak ada broadcast.",
        en: "1,284 Gold customers, 3 months without a broadcast.",
      },
      answer: {
        id: "72% dibuka, 9,4% direkt Purchase. 121 order dalam 48 jam.",
        en: "72% opened, 9.4% went to Purchase. 121 orders in 48 hours.",
      },
      source: { id: "dari 3 bulan riwayat", en: "from 3 months of history" },
      action: { id: "Broadcast terkirim", en: "Broadcast sent" },
    },
  },
] as const;

export function FeatureExperience({
  copy,
  locale,
}: {
  copy: Copy3["features"];
  locale: string;
}) {
  const en = locale === "en";
  const [active, setActive] = useState(0);
  const selected = copy.items[active];
  const area = AREAS[active] ?? AREAS[0];
  const card = area.card;

  return (
    <div className="mt-12 sm:mt-16">
      {/* ---- tabs ---- */}
      <div
        role="tablist"
        aria-label={en ? "Platform areas" : "Area platform"}
        className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
      >
        {copy.items.map((item, index) => {
          const entry = AREAS[index];
          if (!entry) return null;
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`ph3-tab-${index}`}
              aria-selected={active === index}
              aria-controls="ph3-app-panel"
              onClick={() => setActive(index)}
              className="ph3-tab shrink-0"
            >
              <Ico icon={entry.icon} size={15} />
              <span className="whitespace-nowrap">{item.title}</span>
              <span className="ph3-tab-num">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- the stage ---- */}
      <div
        id="ph3-app-panel"
        role="tabpanel"
        aria-labelledby={`ph3-tab-${active}`}
        data-ph3-enter
        className="ph3-stage mt-4"
      >
        <div className="ph3-grid-mask overflow-hidden rounded-[var(--ph3-r-md)] border border-[var(--ph3-line)] bg-[var(--ph3-white)]">
          <div className="flex items-center gap-2 border-b border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-3 py-2.5">
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
            </span>
            <span className="ph3-window-url">app.cekat.ai / {area.path}</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span
                aria-hidden
                className="ph3-pulse h-1.5 w-1.5 rounded-full bg-[var(--ph3-accent)] text-[var(--ph3-accent)]"
              />
              <span className="ph3-mono text-[0.5625rem]">
                {en ? "All systems normal" : "Semua sistem normal"}
              </span>
            </span>
          </div>

          <div className="ph3-grid-cols grid border-b border-[var(--ph3-line)] px-3 py-2">
            {(en ? area.headings.en : area.headings.id).map((cell) => (
              <span
                key={cell}
                className="ph3-mono truncate text-[0.5625rem] text-[var(--ph3-muted-3)]"
              >
                {cell}
              </span>
            ))}
          </div>

          <ul className="list-none">
            {area.rows.map((row, index) => (
              <li
                key={`${area.key}-${row.name}`}
                className="ph3-row-in ph3-grid-cols grid items-center border-b border-[var(--ph3-line)] px-3 py-2.5 last:border-b-0"
                style={{ ["--ph3-i" as string]: index }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] bg-[var(--ph3-surface)] text-[var(--ph3-muted-3)]"
                  >
                    <Ico icon={area.icon} size={11} />
                  </span>
                  <span className="truncate text-[0.8125rem] font-medium">
                    {row.name}
                  </span>
                </span>

                <span className="truncate text-[0.75rem] text-[var(--ph3-muted)]">
                  {typeof row.b === "string" ? row.b : en ? row.b.en : row.b.id}
                </span>

                <span>
                  <span className="ph3-score ph3-score-accent">
                    {typeof row.c === "string" ? row.c : en ? row.c.en : row.c.id}
                  </span>
                </span>

                <span className="truncate text-[0.75rem] font-medium tabular-nums text-[var(--ph3-ink)]">
                  {typeof row.d === "string" ? row.d : en ? row.d.en : row.d.id}
                </span>

                <span className="truncate text-[0.75rem] text-[var(--ph3-muted-2)]">
                  {typeof row.e === "string" ? row.e : en ? row.e.en : row.e.id}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- the card that drops into the space the fade leaves ---- */}
        <div className="ph3-float-card p-3.5">
          <div className="flex items-center gap-1.5">
            <Ico icon={area.icon} size={12} className="text-[var(--ph3-accent)]" />
            <span className="ph3-mono text-[0.5625rem] text-[var(--ph3-muted-3)]">
              {en ? area.nav.en : area.nav.id}
            </span>
          </div>

          <div className="mt-2.5 flex items-start gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] bg-[var(--ph3-surface)] text-[var(--ph3-muted-3)]"
            >
              <Ico icon={solar_users_group_rounded_bold} size={13} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-medium text-[var(--ph3-ink)]">
                {card.title}
              </p>
              <p className="ph3-mono mt-1 text-[0.5625rem]">
                {en ? card.meta.en : card.meta.id}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 border-t border-[var(--ph3-line)] pt-3">
            <p className="ph3-bubble ph3-bubble-in is-in">
              {en ? card.question.en : card.question.id}
            </p>
            <p className="ph3-bubble ph3-bubble-ai is-in">
              {en ? card.answer.en : card.answer.id}
              <span className="ph3-grounded flex items-center gap-1.5">
                <Ico icon={solar_check_circle_bold} size={11} />
                {en ? card.source.en : card.source.id}
              </span>
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--ph3-line)] pt-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[var(--ph3-r-xs)] bg-[var(--ph3-ink)] text-white">
              <Ico icon={solar_arrow_right_up_bold} size={11} />
            </span>
            <span className="truncate text-[0.6875rem] text-[var(--ph3-muted-2)]">
              {en ? card.action.en : card.action.id}
            </span>
          </div>
        </div>
      </div>

      {/* ---- caption ---- */}
      <div
        data-ph3-enter
        className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-10"
      >
        <p className="ph3-lede max-w-[44rem] text-[0.9375rem]">
          {selected.body}
        </p>
        <ul className="flex list-none flex-col gap-2">
          {selected.points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-[0.8125rem] text-[var(--ph3-muted)]"
            >
              <Ico
                icon={solar_check_circle_bold}
                size={14}
                className="text-[var(--ph3-accent)]"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
