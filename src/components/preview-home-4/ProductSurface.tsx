"use client";

import { Ico } from "./Icon";
import {
  solar_arrow_right_up_bold,
  solar_bag_3_bold,
  solar_case_minimalistic_bold,
  solar_chat_round_line_bold,
  solar_check_circle_bold,
  solar_users_group_rounded_bold,
} from "./icons";
import { cn } from "@/lib/utils";
import { useEffect, useState, type CSSProperties } from "react";
const c = (id: string, en: string): { id: string; en: string } => ({
  id,
  en,
});
const THREADS = [
  {
    who: "Rani",
    channel: c("Instagram", "Instagram"),
    preview: c(
      "Ready warna navy? Kalau ambil 2 dapat diskon berapa?",
      "Navy still in? What is the discount for two?",
    ),
    question: c(
      "Kak, navy size L ready? Kalau ambil 2 dapat diskon berapa?",
      "Navy in size L? And what is the discount for two?",
    ),
    answer: c(
      "Ready — navy masih ada, 2 pcs diskon 10% jadi Rp 428.000. Saya kunci stoknya 10 menit ya.",
      "Yes, navy is in stock. Two takes 10% off, so $27. I will hold both pieces for ten minutes.",
    ),
    source: c(
      "dijawab dari info stok & harga",
      "answered from stock & pricing",
    ),
    action: c("Link pembayaran dikirim", "Payment link sent"),
  },
  {
    who: "Bagus",
    channel: c("WhatsApp", "WhatsApp"),
    preview: c(
      "Ongkir ke Bandung berapa? Bisa bayar QRIS?",
      "Shipping to Bandung? Can I pay by QRIS?",
    ),
    question: c(
      "Ongkir ke Bandung berapa ya? Bisa bayar QRIS?",
      "How much is shipping to Bandung? Can I pay by QRIS?",
    ),
    answer: c(
      "Ongkir Bandung Rp 24.000, gratis di atas Rp 300.000. Ini link QRIS-nya.",
      "Shipping to Bandung is $1.60, free over $20. Here is your QRIS link.",
    ),
    source: c("ongkir dibaca dari kurir", "shipping read from the courier"),
    action: c("Order #NC-2484 dibuat", "Order #NC-2484 created"),
  },
  {
    who: "Dewi",
    channel: c("TikTok", "TikTok"),
    preview: c(
      "Sudah transfer ya, tolong dicek",
      "Transferred already, please check",
    ),
    question: c(
      "Pesanan saya sudah saya transfer ya, tolong dicek",
      "I have transferred my order already, please check",
    ),
    answer: c(
      "Sudah kami terima. Order #NC-2481 masuk diproses, dikirim besok pagi sebelum 15.00.",
      "Received. Order #NC-2481 is being prepared and ships tomorrow before 3pm.",
    ),
    source: c("status pembayaran dicocokkan", "payment status matched"),
    action: c("Jadwal kirim diisi otomatis", "Delivery date filled in"),
  },
];
const pick = (v: string | { id: string; en: string }, en: boolean): string =>
  typeof v === "string" ? v : en ? v.en : v.id;
const SURFACE_ICON = {
  inbox: solar_chat_round_line_bold,
  profile: solar_users_group_rounded_bold,
  order: solar_bag_3_bold,
  campaign: solar_case_minimalistic_bold,
};
/* --------------------------------------------------------------- the surfaces */ function Inbox({
  en,
}: {
  en: boolean;
}) {
  const [at, setAt] = useState(0);
  const thread = THREADS[at];
  // The queue page turns, so the surface reads as a live inbox rather than a
  // static row. Paused while the tab is hidden and under reduced motion, which
  // is also what stops it costing anything when nobody is looking.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.hidden) return;
    const id = window.setInterval(
      () => setAt((n) => (n + 1) % THREADS.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="grid gap-px bg-[var(--ph4-line)] sm:grid-cols-[1.1fr_1fr]">
      <div className="bg-[var(--ph4-white)]">
        <div className="flex items-center justify-between border-b border-[var(--ph4-line)] px-3 py-2">
          <span className="ph4-mono text-[0.5625rem]">
            {en ? "Assigned · 63" : "Ditugaskan · 63"}
          </span>
          <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-muted-3)]">
            {en ? "Unassigned · 12" : "Belum ditugaskan · 12"}
          </span>
        </div>
        <ul>
          {THREADS.map((row, i) => (
            <li
              key={row.who}
              className={cn(
                "flex items-center gap-2.5 border-b border-[var(--ph4-line)] px-3 py-2.5 last:border-b-0",
                i === at && "bg-[var(--ph4-accent-tint)]",
              )}
            >
              <span
                aria-hidden={true}
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.5625rem] font-semibold",
                  i === at
                    ? "border-[var(--ph4-accent-line)] bg-white text-[var(--ph4-accent)]"
                    : "border-[var(--ph4-line)] bg-[var(--ph4-surface)] text-[var(--ph4-muted-3)]",
                )}
              >
                {row.who.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8125rem] font-medium">
                  {row.who}
                  <span className="ml-1.5 font-normal text-[var(--ph4-muted-3)]">
                    {pick(row.channel, en)}
                  </span>
                </span>
                <span className="block truncate text-[0.6875rem] text-[var(--ph4-muted)]">
                  {pick(row.preview, en)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2.5 bg-[var(--ph4-white)] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[0.8125rem] font-medium">{thread.who}</span>
          <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-muted-3)]">
            {pick(thread.channel, en)}
          </span>
        </div>
        <p className="ph4-bubble ph4-bubble-in is-in">
          {pick(thread.question, en)}
        </p>
        <p className="ph4-bubble ph4-bubble-ai is-in">
          {pick(thread.answer, en)}
          <span className="ph4-grounded flex items-center gap-1.5">
            <Ico icon={solar_check_circle_bold} size={11} />
            {pick(thread.source, en)}
          </span>
        </p>
        <div className="mt-auto flex items-center gap-1.5 border-t border-[var(--ph4-line)] pt-2.5">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[var(--ph4-r-xs)] bg-[var(--ph4-ink)] text-white">
            <Ico icon={solar_arrow_right_up_bold} size={11} />
          </span>
          <span className="truncate text-[0.6875rem] text-[var(--ph4-muted)]">
            {pick(thread.action, en)}
          </span>
        </div>
      </div>
    </div>
  );
}
function Profile({ en }: { en: boolean }) {
  const rows = [
    {
      label: c("Tingkat", "Tier"),
      value: c("Gold", "Gold"),
      bar: 82,
    },
    {
      label: c("Total belanja", "Lifetime value"),
      value: c("Rp 4,2 jt", "$268"),
      bar: 68,
    },
    {
      label: c("Kota tetap", "Home city"),
      value: c("Ubud", "Ubud"),
    },
    {
      label: c("Disukai", "Prefers"),
      value: c("Linen / navy", "Linen / navy"),
    },
    {
      label: c("Pesan ulang", "Reorders"),
      value: c("setiap 11 hari", "every 11 days"),
      bar: 91,
    },
  ];
  const notes = [
    c("Suka warna navy dan sage", "Prefers navy and sage"),
    c("Sering chat malam hari", "Chats often at night"),
    c("Beralih dari iklan Instagram", "Came from Instagram ads"),
  ];
  return (
    <div>
      <div className="flex items-center gap-2.5 border-b border-[var(--ph4-line)] px-3 py-2.5">
        <span
          aria-hidden={true}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--ph4-line)] bg-[var(--ph4-surface)] text-[0.625rem] font-semibold text-[var(--ph4-muted-3)]"
        >
          RA
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] font-medium">
            Rani
          </span>
          <span className="ph4-mono block truncate text-[0.5625rem]">
            {en ? "Instagram · 12 orders" : "Instagram · 12 order"}
          </span>
        </span>
      </div>
      <dl>
        {rows.map((row) => (
          <div key={pick(row.label, en)} className="ph4-cell flex items-center gap-3">
            <dt className="ph4-mono w-[9rem] shrink-0 text-[0.5625rem]">
              {pick(row.label, en)}
            </dt>
            <dd className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] font-medium tabular-nums">
                {pick(row.value, en)}
              </span>
              {row.bar ? (
                <span className="ph4-meter mt-1.5 block">
                  <span
                    style={{
                      width: `${row.bar}%`,
                    }}
                  />
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-[var(--ph4-line)] px-3 py-2.5">
        <p className="ph4-mono mb-1.5 text-[0.5625rem] text-[var(--ph4-accent)]">
          {en ? "Learned from chat" : "Diptoh dari chat"}
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {notes.map((note) => (
            <li
              key={pick(note, en)}
              className="rounded-[var(--ph4-r-xs)] border border-[var(--ph4-line)] bg-[var(--ph4-surface)] px-2 py-1 text-[0.6875rem] text-[var(--ph4-muted)]"
            >
              {pick(note, en)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function Order({ en }: { en: boolean }) {
  const steps = [
    {
      label: c("Dibuat", "Created"),
      status: c("dari chat", "from chat"),
      done: true,
    },
    {
      label: c("Dibayar", "Paid"),
      status: c("QRIS masuk", "QRIS received"),
      done: true,
    },
    {
      label: c("Dikemas", "Packed"),
      status: c("gudang Jakarta", "Jakarta hub"),
      done: true,
    },
    {
      label: c("Dikirim", "Shipped"),
      status: c("JNE Reguler", "JNE Regular"),
      done: false,
    },
  ];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--ph4-line)] px-3 py-2.5">
        <span className="text-[0.8125rem] font-medium">#NC-2481</span>
        <span className="text-[0.875rem] font-semibold tabular-nums">
          {en ? "$27" : "Rp 428.000"}
        </span>
      </div>
      <ul>
        {steps.map((step) => (
          <li key={pick(step.label, en)} className="ph4-cell flex items-center gap-2.5">
            <span
              aria-hidden={true}
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                step.done ? "bg-[var(--ph4-accent)]" : "bg-[var(--ph4-line-2)]",
              )}
            />
            <span className="text-[0.8125rem] font-medium">
              {pick(step.label, en)}
            </span>
            <span className="ph4-mono ml-auto truncate text-[0.5625rem] text-[var(--ph4-muted-3)]">
              {pick(step.status, en)}
            </span>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-px border-t border-[var(--ph4-line)] bg-[var(--ph4-line)]">
        <div className="bg-[var(--ph4-white)] px-3 py-2">
          <p className="ph4-mono text-[0.5625rem]">{en ? "Items" : "Barang"}</p>
          <p className="mt-0.5 truncate text-[0.75rem]">
            {en ? "Linen set ×2" : "Linen set ×2"}
          </p>
        </div>
        <div className="bg-[var(--ph4-white)] px-3 py-2">
          <p className="ph4-mono text-[0.5625rem]">
            {en ? "Payment" : "Bayar"}
          </p>
          <p className="mt-0.5 truncate text-[0.75rem]">
            {en ? "QRIS · paid" : "QRIS · lunas"}
          </p>
        </div>
      </div>
    </div>
  );
}
function Campaign({ en }: { en: boolean }) {
  const rows = [
    {
      name: c("Pelanggan Gold · 3 bulan", "Gold customers · 3 months"),
      sent: c("1.284", "1,284"),
      opened: 72,
      bought: c("9,4%", "9.4%"),
    },
    {
      name: c("Semua pelanggan · katalog", "All customers · catalogue"),
      sent: c("8.902", "8,902"),
      opened: 68,
      bought: c("4,1%", "4.1%"),
    },
    {
      name: c("Keranjang ditinggal", "Abandoned carts"),
      sent: c("486", "486"),
      opened: 54,
      bought: c("2,8%", "2.8%"),
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--ph4-line)] px-3 py-2">
        <span className="ph4-mono text-[0.5625rem]">
          {en ? "Sent · 30 days" : "Terkirim · 30 hari"}
        </span>
        <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-accent)]">
          4,8× ROAS
        </span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--ph4-line)]">
            <th className="ph4-mono px-3 py-2 text-left text-[0.5625rem] font-normal text-[var(--ph4-muted-3)]">
              {en ? "Campaign" : "Kampanye"}
            </th>
            <th className="ph4-mono px-3 py-2 text-left text-[0.5625rem] font-normal text-[var(--ph4-muted-3)]">
              {en ? "Sent" : "Terkirim"}
            </th>
            <th className="ph4-mono px-3 py-2 text-left text-[0.5625rem] font-normal text-[var(--ph4-muted-3)]">
              {en ? "Opened" : "Dibuka"}
            </th>
            <th className="ph4-mono px-3 py-2 text-left text-[0.5625rem] font-normal text-[var(--ph4-muted-3)]">
              {en ? "Bought" : "Beli"}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={pick(row.name, en)}
              className="border-b border-[var(--ph4-line)] last:border-b-0"
            >
              <th
                scope="row"
                className="px-3 py-2.5 text-left text-[0.8125rem] font-medium"
              >
                <span className="block truncate">{pick(row.name, en)}</span>
                <span className="ph4-meter mt-1.5 block">
                  <span
                    style={{
                      width: `${row.opened}%`,
                    }}
                  />
                </span>
              </th>
              <td className="px-3 py-2.5 text-[0.75rem] tabular-nums text-[var(--ph4-muted)]">
                {pick(row.sent, en)}
              </td>
              <td className="px-3 py-2.5 text-[0.75rem] font-medium tabular-nums">
                {row.opened}%
              </td>
              <td className="px-3 py-2.5 text-[0.75rem] tabular-nums text-[var(--ph4-accent)]">
                {pick(row.bought, en)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ProductSurface({
  surface,
  url,
  en,
  className,
}: {
  surface: "inbox" | "profile" | "order" | "campaign";
  url: string;
  en: boolean;
  className?: string;
}) {
  const Icon = SURFACE_ICON[surface];
  return (
    // The frame carries the clip; the floating cards are its *siblings*, not its
    // children. Inside `.ph4-surface` they had nowhere to go — every square
    // inch of the mock is spoken for, so any position ate legible chat text.
    // As siblings they are free to hang off the surface's edge, which is where
    // the depth cue belongs anyway.
    <div className={cn("relative", className)}>
      <div className="ph4-surface ph4-swap shadow-[0_1px_2px_rgb(10_10_11/0.05),0_18px_44px_-30px_rgb(10_10_11/0.3)]">
        <div className="ph4-surface-bar">
          <span aria-hidden={true} className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
          </span>
          <span className="ph4-surface-url">{url}</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span
              aria-hidden={true}
              className="ph4-pulse h-1.5 w-1.5 rounded-full bg-[var(--ph4-accent)] text-[var(--ph4-accent)]"
            />
            <span className="ph4-mono text-[0.5625rem]">
              {en ? "All systems normal" : "Semua sistem normal"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-b border-[var(--ph4-line)] px-3 py-2">
          <Ico icon={Icon} size={12} className="text-[var(--ph4-accent)]" />
          <span className="ph4-mono text-[0.5625rem]">
            {en ? "Sample workspace" : "Ruang kerja contoh"}
          </span>
        </div>
        {surface === "inbox" ? <Inbox en={en} /> : null}
        {surface === "profile" ? <Profile en={en} /> : null}
        {surface === "order" ? <Order en={en} /> : null}
        {surface === "campaign" ? <Campaign en={en} /> : null}
      </div>
      {/* Floating detail cards — the depth cue carried around the stage.
          Now siblings of the clipped frame, so they hang *off* it: `bottom-0`
          plus `translate-y-[40%]` drops each card until 60% of it is inside the
          surface and 40% past its floor. That floor is empty by construction —
          the inbox list stops ~57px short — so the cards clear the chat rather
          than covering it. Pushed any further they would leave the 24px gap and
          land on the real <h3> below; the single decorative link row inside the
          mock is the cheaper thing to graze.
          Square to the frame on both axes; mirrored left/right, which is what
          keeps the pair from reading as a widget bolted to one corner. */}
      <div
        aria-hidden={true}
        className="ph4-parallax pointer-events-none absolute inset-0 hidden lg:block"
        style={
          {
            "--ph4-parallax-from": "10px",
            "--ph4-parallax-to": "-10px",
          } as CSSProperties
        }
      >
        <div className="absolute bottom-0 left-6 w-40 translate-y-[75%] rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-white)] p-2.5 shadow-[0_8px_24px_-6px_rgb(10_10_11/0.10)]">
          <p className="ph4-mono text-[0.5rem] text-[var(--ph4-muted-3)]">
            {en ? "Conversion" : "Konversi"}
          </p>
          <p className="ph4-display ph4-num text-[1.25rem] text-[var(--ph4-accent)]">
            +34%
          </p>
        </div>
        <div className="absolute right-6 bottom-0 w-40 translate-y-[75%] rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-white)] p-2.5 shadow-[0_8px_24px_-6px_rgb(10_10_11/0.10)]">
          <p className="ph4-mono text-[0.5rem] text-[var(--ph4-muted-3)]">
            {en ? "Order value" : "Nilai order"}
          </p>
          <p className="ph4-display ph4-num text-[1.25rem] text-[var(--ph4-ink)]">
            {en ? "$27" : "Rp 428.000"}
          </p>
        </div>
      </div>
    </div>
  );
}
export const text = (v: { id: string; en: string }, en: boolean): string =>
  en ? v.en : v.id;
