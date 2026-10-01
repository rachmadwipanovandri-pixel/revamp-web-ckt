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

  useEffect(() => {
    const nodes = stepRefs.current.filter((node): node is HTMLLIElement =>
      Boolean(node),
    );
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!winner) return;
        const index = nodes.indexOf(winner.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] },
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const current = content.steps[active] ?? content.steps[0];

  const goTo = (index: number) => {
    const node = stepRefs.current[index];
    if (!node) return;
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
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#64748B] uppercase">
                {content.stageLabel}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span
                  className="text-[3rem] leading-none font-bold tracking-[-0.04em] tabular-nums"
                  style={{ color: current.accent }}
                >
                  {current.index}
                </span>
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
                  {current.hint}
                </span>
              </div>

              <h3 className="mt-3 text-[1.15rem] leading-[1.3] font-bold tracking-[-0.02em] text-[#101828]">
                {current.title}
              </h3>

              {/*
                The explainer for the active step. `key` remounts it on change so
                the entrance animation replays — that replay is the crossfade,
                without keeping five diagrams mounted and animating off-screen.
              */}
              <div className="ph2-panel-in mt-5" key={current.index}>
                <StepVisual
                  kind={current.visual}
                  diagrams={content.diagrams}
                  accent={current.accent}
                />
              </div>

              {/* One continuous rail rather than five separate dots, so the
                  position reads as progress through a single loop. */}
              <div aria-hidden className="mt-6 flex items-center gap-1.5">
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
              <p className="mt-2 text-[0.7rem] font-semibold text-[#64748B] tabular-nums">
                {active + 1} / {content.steps.length}
              </p>

              <nav aria-label={content.stageLabel} className="mt-6">
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
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.875rem] font-semibold transition-colors duration-150",
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

          <ol className="flex flex-col gap-4">
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
