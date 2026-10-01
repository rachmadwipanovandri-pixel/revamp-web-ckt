"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Band, Card, SectionHead, Shell } from "./ui";
import type { HomeContent, StepVisualKind } from "./types";

/**
 * The five explainers. Every diagram is pure layout — divs and borders rather
 * than SVG — so it inherits the palette tokens, scales with the container, and
 * costs nothing on first paint.
 */
function StepVisual({
  kind,
  diagrams,
  accent,
}: {
  kind: StepVisualKind;
  diagrams: HomeContent["howItWorks"]["diagrams"];
  accent: string;
}) {
  const shell =
    "rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFF] px-4 py-3.5";

  if (kind === "channels") {
    return (
      <div className={shell}>
        <p className="text-[0.58rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
          {diagrams.channels.caption}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            {diagrams.channels.channels.map((channel) => (
              <span
                key={channel}
                className="rounded-[7px] border border-border bg-white px-2 py-1.5 text-[0.62rem] font-semibold whitespace-nowrap text-[#4B5563]"
              >
                {channel}
              </span>
            ))}
          </div>
          {/* Merging arrow: four inputs, one output. */}
          <svg width="26" height="46" viewBox="0 0 26 46" aria-hidden>
            <path
              d="M2 6 L18 23 M2 23 L18 23 M2 40 L18 23"
              stroke="#CBD5E1"
              strokeWidth="1.6"
              fill="none"
            />
            <path d="M16 20 L22 23 L16 26 Z" fill={accent} />
          </svg>
          <span className="w-[5.5rem] shrink-0 rounded-[10px] px-2.5 py-3 text-center text-[0.66rem] leading-[1.3] font-bold text-white">
            <span
              className="block rounded-[10px] py-3"
              style={{ background: accent }}
            >
              {diagrams.channels.inbox}
            </span>
          </span>
        </div>
      </div>
    );
  }

  if (kind === "knowledge") {
    return (
      <div className={shell}>
        <p className="text-[0.58rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
          {diagrams.knowledge.caption}
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {diagrams.knowledge.sources.map((source) => (
              <span
                key={source}
                className="rounded-[7px] border border-border bg-white px-2 py-1.5 text-[0.6rem] font-semibold text-[#4B5563]"
              >
                {source}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
              <path
                d="M1 1 L12 9 M12 1 L1 9"
                stroke={accent}
                strokeWidth="1.4"
                opacity="0.45"
              />
            </svg>
            <span
              className="rounded-[9px] px-3 py-2 text-[0.64rem] font-bold text-white"
              style={{ background: accent }}
            >
              {diagrams.knowledge.base}
            </span>
          </div>
          <p className="rounded-[9px] border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[0.62rem] leading-[1.4] font-semibold text-[#101828]">
            {diagrams.knowledge.answer}
          </p>
        </div>
      </div>
    );
  }

  if (kind === "ai") {
    return (
      <div className={shell}>
        <p className="text-[0.58rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
          {diagrams.ai.caption}
        </p>
        <div className="mt-3 flex items-stretch gap-2">
          {/* The wide bar is the AI's share, the narrow one is what reaches a
              person: the split is the whole point of this step. */}
          <div
            className="flex-1 rounded-[10px] px-3 py-3 text-[0.64rem] font-bold text-white"
            style={{ background: accent }}
          >
            {diagrams.ai.handled}
          </div>
          <div className="flex-1 rounded-[10px] border border-[#BFDBFE] bg-white px-3 py-3 text-[0.64rem] font-bold text-[#101828]">
            {diagrams.ai.human}
          </div>
        </div>
        <p className="mt-2 text-[0.6rem] font-semibold text-[#64748B]">
          → {diagrams.ai.escalate}
        </p>
      </div>
    );
  }

  if (kind === "order") {
    return (
      <div className={shell}>
        <p className="text-[0.58rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
          {diagrams.order.caption}
        </p>
        <p className="mt-3 rounded-[9px] border border-border bg-white px-3 py-2 text-[0.62rem] font-semibold text-[#4B5563]">
          {diagrams.order.chat}
        </p>
        {/* Vertical rail: the connector is a pseudo-element-free element so the
            layout stays pure flow and cannot desync from the labels. */}
        <ol className="mt-2 flex flex-col">
          {diagrams.order.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.55rem] font-bold text-white"
                style={{ background: accent }}
              >
                {index + 1}
              </span>
              <span className="text-[0.62rem] font-semibold text-[#101828]">
                {step}
              </span>
              {index < diagrams.order.steps.length - 1 ? (
                <span aria-hidden className="h-2 w-px shrink-0 bg-[#E2E8F0]" />
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-2.5 rounded-[9px] border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[0.6rem] font-bold text-[#101828]">
          ✓ {diagrams.order.total}
        </p>
      </div>
    );
  }

  return (
    <div className={shell}>
      <p className="text-[0.58rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
        {diagrams.chart.caption}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {diagrams.chart.series.map((entry, index) => (
          <div key={entry.label} className="flex items-center gap-2.5">
            <span className="w-[3.6rem] shrink-0 text-[0.58rem] font-semibold text-[#64748B]">
              {entry.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]">
              {/* Keyframes scale from 0 and the delay staggers the series, so
                  the chart draws itself in instead of appearing finished. */}
              <span
                className="ph2-bar-x block h-full origin-left rounded-full"
                style={{
                  width: `${entry.value}%`,
                  background: accent,
                  opacity: 0.55 + index * 0.15,
                  animationDelay: `${80 + index * 90}ms`,
                }}
              />
            </span>
            <span className="w-7 shrink-0 text-right text-[0.58rem] font-bold text-[#101828] tabular-nums">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[0.6rem] font-semibold text-[#64748B]">
        {diagrams.chart.note}
      </p>
    </div>
  );
}

/**
 * Stateful scrollspy with a dead zone around each step boundary.
 *
 * The first version picked the intersecting card with the largest
 * `intersectionRatio`. When a card boundary sits inside the center band, two
 * cards intersect with tiny, noisy ratios and the "winner" flips back and
 * forth — 1→2→1→3→2 on a single downward scroll. The eased Lenis glide lingers
 * in that ambiguous zone, which is why it reads as flicker. A second attempt
 * shifted one decision line by scroll direction, but re-anchoring the line on
 * every direction flip still flaps under jitter that straddles it.
 *
 * This instead keys both transitions off the *boundary card's* top and
 * separates them by 48px: from step `i`, the next card promotes when its top
 * reaches `center + 24`, but the current card demotes only once its own top
 * falls back past `center + 72`. Between those two lines the state is stable
 * by construction — ±3px trackpad jitter cannot cross a 48px zone, and the
 * zone is far smaller than the 164px card pitch, so no step can be skipped in
 * either direction. The `while` loops let one call traverse several steps on a
 * fast jump.
 *
 * Pure (takes rect tops plus the current step, not elements) so the sweep
 * behavior is unit-testable.
 */
export function resolveActiveStep(
  tops: number[],
  current: number,
  viewportHeight: number,
): number {
  const center = viewportHeight / 2;
  let next = Math.max(0, Math.min(current, tops.length - 1));
  while (next + 1 < tops.length && tops[next + 1] <= center + 24) next += 1;
  while (next > 0 && tops[next] > center + 72) next -= 1;
  return next;
}

/**
 * Band 5 — the five-step rail with a sticky stage.
 *
 * Two deliberate departures from preview-home: the active step is driven by an
 * IntersectionObserver band around the viewport centre (not a per-frame scroll
 * handler), and the step list is a real keyboard control that scrolls its card
 * into view and marks itself `aria-current="step"`.
 */
export function HowItWorks({
  content,
}: {
  content: HomeContent["howItWorks"];
}) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Mirror of `active` for the observer callback below. The effect runs once,
  // so reading state directly would see a stale value forever; a ref plus the
  // functional `setActive` keeps the stateful scrollspy honest.
  const activeRef = useRef(0);

  useEffect(() => {
    const nodes = stepRefs.current.filter((node): node is HTMLLIElement =>
      Boolean(node),
    );
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const decide = () => {
      const tops = nodes.map((node) => node.getBoundingClientRect().top);
      const next = resolveActiveStep(
        tops,
        activeRef.current,
        window.innerHeight,
      );
      activeRef.current = next;
      setActive((prev) => (prev === next ? prev : next));
    };

    // The band only gates *when* `decide` runs; the decision itself reads
    // fresh rects, so a stale entry can never vote.
    const io = new IntersectionObserver(() => decide(), {
      rootMargin: "-45% 0px -45% 0px",
      threshold: [0, 0.2, 0.6, 1],
    });

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const current = content.steps[active] ?? content.steps[0];

  const goTo = (index: number) => {
    const node = stepRefs.current[index];
    if (!node) return;
    const lenis = window.__ph2Lenis;
    if (lenis) {
      // A native smooth `scrollIntoView` is a second scroll driver next to
      // Lenis's rAF loop — one input, two owners, visible fighting. Route the
      // jump through Lenis instead. `offset` centers the card: Lenis targets
      // the element top, so pull back by half the viewport minus half the
      // card. (When Lenis is off — mobile, reduced motion — the native path
      // below runs, where `scroll-mt`/CSS smooth apply as usual.)
      lenis.scrollTo(node, {
        offset: -(
          window.innerHeight / 2 -
          node.getBoundingClientRect().height / 2
        ),
      });
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    node.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <Band
      id="how-it-works"
      tone="soft"
      labelledBy="ph2-how-title"
      className="scroll-mt-24"
    >
      <Shell>
        <SectionHead
          id="ph2-how-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
          {/*
            The sticky stage is deliberately compact: its travel — the right
            column's height minus this card's — is what holds the explainer on
            screen while the steps scroll by. Every `mt`/`py` here buys or
            spends that travel, so keep this card short.
          */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#64748B] uppercase">
                {content.stageLabel}
              </p>

              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className="text-[2.5rem] leading-none font-bold tracking-[-0.04em] tabular-nums"
                  style={{ color: current.accent }}
                >
                  {current.index}
                </span>
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
                  {current.hint}
                </span>
              </div>

              <h3 className="mt-2 text-[1.05rem] leading-[1.3] font-bold tracking-[-0.02em] text-[#101828]">
                {current.title}
              </h3>

              {/*
                The explainer for the active step. `key` remounts it on change so
                the entrance animation replays — that replay is the crossfade,
                without keeping five diagrams mounted and animating off-screen.

                The area is locked to the tallest diagram (step 3, 219px in
                both locales — re-measure if the copy changes) instead of
                hugging each diagram. Without this the sticky card resizes on
                every switch, the layout shift moves the scroll position, the
                observer fires again, and the stage visibly jitters in a
                feedback loop.
              */}
              <div
                className="ph2-panel-in mt-4 min-h-[224px]"
                key={current.index}
              >
                <StepVisual
                  kind={current.visual}
                  diagrams={content.diagrams}
                  accent={current.accent}
                />
              </div>

              {/* One continuous rail rather than five separate dots, so the
                  position reads as progress through a single loop. */}
              <div aria-hidden className="mt-4 flex items-center gap-1.5">
                {content.steps.map((step, index) => (
                  <span
                    key={step.index}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
                      index <= active ? "bg-primary" : "bg-[#E2E8F0]",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[0.7rem] font-semibold text-[#64748B] tabular-nums">
                {active + 1} / {content.steps.length}
              </p>

              <nav aria-label={content.stageLabel} className="mt-4">
                <ol className="flex flex-col gap-1">
                  {content.steps.map((step, index) => {
                    const selected = index === active;
                    return (
                      <li key={step.index}>
                        <button
                          type="button"
                          aria-current={selected ? "step" : undefined}
                          onClick={() => goTo(index)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[0.875rem] font-semibold transition-colors duration-150",
                            selected
                              ? "bg-[#EFF6FF] text-[#101828]"
                              : "text-[#64748B] hover:bg-[#F8FAFF] hover:text-[#101828]",
                          )}
                        >
                          <span
                            aria-hidden
                            className="h-2 w-2 shrink-0 rounded-full transition-colors duration-150"
                            style={{
                              background: selected ? step.accent : "#CBD5E1",
                            }}
                          />
                          {step.title}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </Card>
          </div>

          <ol className="flex flex-col gap-4 lg:gap-5">
            {content.steps.map((step, index) => {
              const selected = index === active;
              return (
                <li
                  key={step.index}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                >
                  <Card
                    className={cn(
                      "p-6 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
                      selected &&
                        "border-[#BFDBFE] shadow-[0_1px_2px_rgba(11,18,32,0.05),0_28px_52px_-32px_rgba(19,82,191,0.45)]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[0.75rem] font-bold text-white"
                        style={{ background: step.accent }}
                      >
                        {step.index}
                      </span>
                      <h3 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#101828]">
                        {step.title}
                      </h3>
                      <span className="ml-auto hidden shrink-0 text-xs font-semibold text-[#64748B] sm:block">
                        {step.hint}
                      </span>
                    </div>
                    <p className="mt-3 text-[0.95rem] leading-[1.65] text-[#4B5563]">
                      {step.body}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </Shell>
    </Band>
  );
}
