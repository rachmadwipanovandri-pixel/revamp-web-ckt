"use client";

import { useState } from "react";
import type { SandboxCopy } from "./copy";
import { Sparkline } from "../Charts";
import { SEGMENTS, type L, type Segment } from "./data";

/**
 * Cekat Marketing — pick an audience and watch the numbers move.
 *
 * The interaction is the segment picker, and it is honest in the way this page
 * tries to be everywhere else: the projected open and conversion rates belong
 * to the segment, they are not invented per click, and the arithmetic is done in
 * the data rather than faked in the render. Choosing "no purchase in 90 days"
 * shows a *worse* open rate than choosing Gold, because that is what a cold
 * list does — a demo where every choice produces a bigger number teaches the
 * opposite of the product.
 */
export function MarketingSandbox({
  copy,
  en,
}: {
  copy: SandboxCopy["marketing"];
  en: boolean;
}) {
  const t = (l: L) => (en ? l.en : l.id);
  const [segmentId, setSegmentId] = useState<string>(SEGMENTS[1].id);
  const [sent, setSent] = useState(false);

  const segment: Segment =
    SEGMENTS.find((s) => s.id === segmentId) ?? SEGMENTS[0];

  // Derived from the segment, so a segment's figures cannot disagree with them.
  const buyers = Math.round((segment.people * segment.buy) / 100);
  const series = [
    segment.open - 22,
    segment.open - 15,
    segment.open - 17,
    segment.open - 6,
    segment.open - 9,
    segment.open,
    segment.open + 4,
    segment.open + 2,
    segment.open + 11,
    segment.open + 17,
  ];

  return (
    <div className="grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <div className="border-b border-[var(--ph3-line)] p-3 lg:border-r lg:border-b-0">
        <p className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
          {copy.audience}
        </p>
        <ul className="mt-2 list-none">
          {SEGMENTS.map((option) => {
            const on = option.id === segmentId;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setSegmentId(option.id);
                    setSent(false);
                  }}
                  className={`flex w-full items-baseline gap-2 rounded-[var(--ph3-r-sm)] border px-2.5 py-2 text-left transition-colors ${
                    on
                      ? "border-[var(--ph3-accent)] bg-[var(--ph3-surface)]"
                      : "border-transparent hover:bg-[var(--ph3-surface)]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      on ? "bg-[var(--ph3-accent)]" : "bg-[var(--ph3-line-2)]"
                    }`}
                  />
                  <span className="min-w-0 flex-1 truncate text-[0.8125rem]">
                    {t(option.label)}
                  </span>
                  <span className="ph3-mono shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
                    {option.people.toLocaleString(en ? "en-US" : "id-ID")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 border-t border-[var(--ph3-line)] pt-3 text-[0.6875rem] leading-relaxed text-[var(--ph3-muted-3)]">
          {copy.excluded}
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="ph3-mono text-[0.5rem]">{copy.expected}</p>
            <p className="mt-1.5 truncate text-[0.9375rem] font-medium tracking-tight text-[var(--ph3-ink)]">
              {t(segment.label)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSent(true)}
            disabled={sent}
            className="shrink-0 rounded-[var(--ph3-r-sm)] bg-[var(--ph3-ink)] px-3 py-2 text-[0.75rem] font-medium text-white transition-opacity disabled:opacity-60"
          >
            {sent ? copy.sent : copy.send}
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-line)]">
          {[
            {
              value: segment.people.toLocaleString(en ? "en-US" : "id-ID"),
              label: en ? "Recipients" : "Penerima",
            },
            { value: segment.open + "%", label: en ? "Expected open" : "Perkiraan dibuka" },
            { value: segment.buy + "%", label: en ? "Expected buy" : "Perkiraan beli" },
          ].map((metric) => (
            <div key={metric.label} className="bg-[var(--ph3-white)] px-3 py-2.5">
              <dt className="ph3-mono text-[0.5rem]">{metric.label}</dt>
              <dd className="mt-1.5 text-[1rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
            {en ? "Expected engagement" : "Perkiraan interaksi"}
          </p>
          <Sparkline className="mt-2" height={30} points={series} />
        </div>

        <div className="mt-4 rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] p-3">
          <p className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
            {copy.why}
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--ph3-ink)]">
            {t(segment.note)}
          </p>
          <p className="mt-2 text-[0.75rem] text-[var(--ph3-muted)]">
            {buyers.toLocaleString(en ? "en-US" : "id-ID")} {t({ id: "orang diperkirakan membeli", en: "people expected to buy" })}
          </p>
        </div>
      </div>
    </div>
  );
}