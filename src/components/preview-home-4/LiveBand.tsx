"use client";

import { Ico } from "./Icon";
import { SplitHeading } from "./ui";
import { solar_arrow_right_up_bold, solar_check_circle_bold } from "./icons";
import { useEffect, useState } from "react";

export function LiveBand({
  eyebrow,
  heading,
  accent,
  body,
  url,
  figures,
  en,
}: {
  eyebrow: string;
  heading: string;
  accent: string;
  body: string;
  url: string;
  figures: { value: string; label: string }[];
  en: boolean;
}) {
  // The rising figure on the right edge of the queue. Directional only — no axis
  // and no rate claimed, because a sparkline that implies a trend the page
  // cannot support is decoration wearing a chart's clothes.
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.hidden) return;
    const id = window.setInterval(() => setElapsed((n) => (n + 1) % 24), 2200);
    return () => window.clearInterval(id);
  }, []);

  const QUEUE = [
    "Rani — Instagram",
    "Bagus — WhatsApp",
    "Sinta — Web chat",
    "Yosua — Instagram",
    "Dewi — TikTok",
    "Rangga — WhatsApp",
  ];
  const HANDLED = [
    en ? "Price + stock answered" : "Harga + stok dijawab",
    en ? "Shipping link sent" : "Link ongkir dikirim",
    en ? "Order recorded" : "Order tercatat",
    en ? "Payment matched" : "Pembayaran dicocokkan",
    en ? "Escalated to a human" : "Diteruskan ke tim",
    en ? "Reorder reminder set" : "Pengingat ulang disetel",
  ];
  const RECORDED = [
    {
      k: en ? "Customer profiles completed" : "Profil pelanggan lengkap",
      v: en ? "3,184" : "3.184",
    },
    {
      k: en ? "Orders created from chat" : "Order dibuat dari chat",
      v: en ? "1,062" : "1.062",
    },
    {
      k: en ? "Payment links sent" : "Link bayar terkirim",
      v: en ? "2,417" : "2.417",
    },
    { k: en ? "Reminders scheduled" : "Pengingat terjadwal", v: "748" },
    { k: en ? "Referred to a person" : "Diteruskan ke tim", v: "196" },
  ];

  return (
    <section aria-labelledby="ph4-live-title" className="ph4-live">
      <div className="ph4-console-grid" aria-hidden={true} />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-14">
          <div data-ph4-enter={true} className="flex flex-col gap-4">
            <p className="ph4-mono ph4-eyebrow">{eyebrow}</p>
            <SplitHeading
              id="ph4-live-title"
              as="h2"
              text={heading}
              accent={accent}
              size="none"
              className="ph4-display text-[clamp(1.75rem,4.2vw,3rem)] text-[var(--ph4-on-console)]"
            />
            <p className="max-w-[34rem] text-[0.9375rem] leading-[1.6] text-[var(--ph4-on-console-2)]">
              {body}
            </p>
          </div>
          <dl
            data-ph4-enter={true}
            className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-console-line)] bg-[var(--ph4-console-line)]"
          >
            {figures.map((figure) => (
              <div
                key={figure.label}
                className="bg-[var(--ph4-console-2)] px-4 py-5"
              >
                <dd
                  data-ph4-count={figure.value}
                  className="ph4-display ph4-num text-[clamp(1.4rem,2.6vw,2rem)] text-[var(--ph4-on-console)]"
                >
                  {figure.value}
                </dd>
                <dt className="ph4-mono mt-1.5 text-[0.5625rem] leading-[1.5] text-[var(--ph4-on-console-3)]">
                  {figure.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-ph4-drift={true}
          className="ph4-live-stage overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-console-line)] bg-[var(--ph4-console-2)]"
        >
          <div className="flex items-center gap-2 border-b border-[var(--ph4-console-line)] px-4 py-2.5">
            <span aria-hidden={true} className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph4-console-line-2)]" />
            </span>
            <span className="ph4-surface-url text-[var(--ph4-on-console-3)]">
              {url}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <span
                aria-hidden={true}
                className="ph4-pulse h-1.5 w-1.5 rounded-full bg-[var(--ph4-ok-dot)] text-[var(--ph4-ok-dot)]"
              />
              <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
                {en ? "Sample workspace" : "Ruang kerja contoh"}
              </span>
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="border-b border-[var(--ph4-console-line)] lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-[var(--ph4-console-line)] px-4 py-2.5">
                <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-2)]">
                  {en ? "Incoming" : "Masuk"}
                </span>
                <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
                  {en ? "63 assigned · 12 unassigned" : "63 ditugaskan · 12 belum"}
                </span>
              </div>
              <ul>
                {QUEUE.map((row, i) => (
                  <li
                    key={row}
                    className="flex items-center gap-3 border-b border-[var(--ph4-console-line)] px-4 py-3 last:border-b-0"
                  >
                    <span
                      aria-hidden={true}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--ph4-console-line-2)] text-[0.5625rem] font-semibold text-[var(--ph4-on-console-3)]"
                    >
                      {row.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[0.875rem] text-[var(--ph4-on-console)]">
                      {row}
                    </span>
                    <span
                      className="flex min-w-0 items-center gap-2"
                      style={{
                        opacity: i <= elapsed % QUEUE.length ? 1 : 0.28,
                        transition: "opacity 600ms var(--ph4-ease)",
                      }}
                    >
                      <Ico
                        icon={solar_check_circle_bold}
                        size={13}
                        className="shrink-0 text-[var(--ph4-ok-dot)]"
                      />
                      <span className="truncate text-[0.75rem] text-[var(--ph4-on-console-2)]">
                        {HANDLED[i]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
                  {en ? "Written automatically from chat" : "Tercatat otomatis dari chat"}
                </span>
                <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-accent)]">
                  {en ? "automatic" : "otomatis"}
                </span>
              </div>
              <ul className="flex flex-col">
                {RECORDED.map((row) => (
                  <li
                    key={row.k}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--ph4-console-line)] py-2.5 last:border-b-0"
                  >
                    <span className="truncate text-[0.8125rem] text-[var(--ph4-on-console-2)]">
                      {row.k}
                    </span>
                    <span className="ph4-num text-[0.9375rem] font-medium text-[var(--ph4-on-console)] tabular-nums">
                      {row.v}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 border-t border-[var(--ph4-console-line)] pt-3.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[var(--ph4-r-xs)] bg-[var(--ph4-on-console)] text-[var(--ph4-console)]">
                  <Ico icon={solar_arrow_right_up_bold} size={11} />
                </span>
                <span className="text-[0.8125rem] text-[var(--ph4-on-console-2)]">
                  {en ? "Sample data for illustration" : "Data contoh untuk ilustrasi"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
