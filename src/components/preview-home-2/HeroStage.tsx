"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import { AnimGate } from "./AnimGate";
import type { HeroDashboard, LiveStage, StageCard } from "./types";

/**
 * One floating slot per product, each with a fixed canvas anchor around the
 * centered dashboard (the /preview-home canvas pattern). A popup is on stage
 * only while its product is toggled on from the dashboard.
 *
 * Every slot also carries its own bob — a distinct period and a distinct
 * negative phase (`delay`), all different lengths — plus its own entrance
 * offset (`enter`). Six windows on six independent rhythms means nothing on
 * this canvas ever pulses, dims or slides in unison.
 *
 * Centered slots use `left-0 right-0 mx-auto` on purpose: the slot carries an
 * inline `transform` for drag placement, which would override a
 * `-translate-x-1/2` utility.
 */
const SLOTS = [
  {
    key: "chat",
    float: "ph2-float",
    className: "lg:top-32 lg:left-0",
    period: "7.4s",
    phase: "-1.1s",
    enter: 0,
  },
  {
    key: "order",
    float: "ph2-float-slow",
    className: "lg:top-32 lg:right-0",
    period: "9.6s",
    phase: "-4.3s",
    enter: 240,
  },
  {
    key: "crm",
    float: "ph2-float",
    className: "lg:right-0 lg:bottom-4 lg:left-0 lg:mx-auto",
    period: "6.8s",
    phase: "-2.7s",
    enter: 500,
  },
  {
    key: "mini",
    float: "ph2-float-slow",
    className: "lg:bottom-4 lg:left-0",
    period: "8.8s",
    phase: "-6.1s",
    enter: 120,
  },
  {
    key: "consulting",
    float: "ph2-float",
    className: "lg:right-0 lg:bottom-4",
    period: "11.2s",
    phase: "-3.5s",
    enter: 380,
  },
  {
    key: "marketing",
    float: "ph2-float-slow",
    className: "lg:right-0 lg:bottom-4 lg:left-0 lg:mx-auto",
    period: "7.9s",
    phase: "-5.2s",
    enter: 660,
  },
] as const;

/** Popups on first paint: the core funnel (auto reply → order → CRM). The
 * other three are one dashboard tap away. */
const INITIAL_VISIBLE = [true, true, true, false, false, false];

/**
 * The choreography runs in beats rather than in raw milliseconds. Every delay
 * inside a card is written as "when in the story this appears" — beat 1 is the
 * header, the chat thread answers around beat 22, the CTA lands last — and
 * BEAT converts that to time.
 *
 * One constant sets the pace of all six cards at once. It is deliberately slow:
 * a card's whole story takes several seconds to play out, which is the
 * difference between watching Cekat work and watching a spinner.
 */
const BEAT = 180;

/**
 * How long one card's story runs before it starts over.
 *
 * The loop is not a CSS `infinite` — the card's animations play forward once
 * and hold their last frame, because that final frame is the *result* (order
 * paid, reply sent). Restarting means remounting the card, so the visible state
 * is always a real finished state rather than a half-drawn one. LOOP is
 * therefore a little longer than the longest story, giving each card a beat of
 * stillness before it begins again.
 */
const LOOP = 8000;

/** Where this card sits in its own loop: a negative offset, applied to every
 * delay inside it, so a card that just mounted is already partway through its
 * story — and no two windows are ever on the same beat. */
const phase = (ms: number): CSSProperties => ({
  animationDelay: `calc(var(--ph2-phase, 0ms) + ${ms}ms)`,
});

/** Staggered entry: base CSS is the settled state, so `animation: none` is safe. */
const at = (beat: number): CSSProperties => phase(beat * BEAT);

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduce;
}

/**
 * True while a fine pointer (mouse, trackpad) is present. Touch-only viewports
 * report coarse, so gating drag-and-drop on this keeps mobile exactly as it
 * is: no handlers, no extra listeners, no behavior change — and no bundle
 * impact either, since this is a runtime gate around pointer events.
 */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return fine;
}

/**
 * Clamp a drop offset so the held card stays inside the stage. Pure so the
 * bounds math is unit-testable without DOM.
 */
export function clampOffset(
  dx: number,
  dy: number,
  anchor: { left: number; top: number; width: number; height: number },
  stage: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  return {
    x: clamp(
      dx,
      stage.left - anchor.left,
      stage.left + stage.width - anchor.left - anchor.width,
    ),
    y: clamp(
      dy,
      stage.top - anchor.top,
      stage.top + stage.height - anchor.top - anchor.height,
    ),
  };
}

/** An in-progress drag: which slot is held and its pointer offset from that
 * slot's anchor. On drop the offset persists as the slot's new home — the
 * card stays where it was put, like a placed object, instead of snapping
 * back. */
type DragState = {
  slot: number;
  dx: number;
  dy: number;
};

/** Movement before a press becomes a drag — lets plain presses (and text
 * selection starts) alone. */
const DRAG_THRESHOLD = 6;

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      stroke={light ? "#22C55E" : "#fff"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3 4.5 9 2 6.5" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="ph2-dot h-1.5 w-1.5 rounded-full bg-[#94A3B8]"
          style={phase(index * 260)}
        />
      ))}
    </span>
  );
}

/** Incoming bubble + typing indicator + the AI reply that replaces it. */
function ChatThread({
  question,
  answer,
  incomingFirst = true,
}: {
  question: string;
  answer: string;
  incomingFirst?: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      <p
        className={cn(
          "ph2-in max-w-[86%] self-start rounded-[14px] bg-[#F1F5F9] px-3 py-2 text-[0.76rem] leading-[1.45] text-[#101828]",
          incomingFirst ? "rounded-tl-[5px]" : "rounded-tr-[5px]",
        )}
        style={at(1)}
      >
        {question}
        <span className="mt-1 block text-[0.6rem] text-[#64748B]">09:41</span>
      </p>

      {/* The typing bubble sits exactly where the reply will land, so nothing
          shifts when it swaps out — same trick as a real chat transcript. */}
      <div className="ph2-reply-slot self-end">
        <span className="ph2-typing ph2-typing-out" style={at(26)}>
          <span
            className="ph2-in inline-flex rounded-[14px] rounded-tl-[5px] bg-[#F1F5F9] px-3 py-2.5"
            style={at(2)}
          >
            <TypingDots />
          </span>
        </span>
        <p
          className="ph2-in max-w-[86%] self-end rounded-[14px] rounded-tr-[5px] bg-primary px-3 py-2 text-[0.76rem] leading-[1.45] text-white"
          style={at(22)}
        >
          {answer}
          <span className="mt-1 block text-[0.6rem] text-white/70">
            09:41{" "}
            <span className="tracking-[-2px] text-[#93C5FD]" aria-hidden>
              ✓✓
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

function CardHeader({
  card,
  icon,
  tone = "brand",
}: {
  card: StageCard;
  icon?: string;
  tone?: "brand" | "blue";
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-3">
      {icon ? (
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[0.68rem] font-bold",
            tone === "brand"
              ? "bg-primary text-white"
              : "bg-[#EFF6FF] text-primary",
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] font-bold tracking-[-0.01em] text-[#101828]">
          {card.title}
        </p>
        {card.footnote &&
        (card.kind === "mini" || card.kind === "consulting") ? (
          <p className="truncate text-[0.62rem] text-[#64748B]">
            {card.footnote}
          </p>
        ) : null}
      </div>
      {card.badge ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[0.56rem] font-bold",
            card.kind === "order"
              ? "bg-[#FAF9F5] text-[#BE185D]"
              : card.kind === "chat"
                ? "bg-[#EFF6FF] text-primary"
                : "flex items-center gap-1 bg-[#F0FDF4] text-[#101828]",
          )}
        >
          {(card.kind === "mini" || card.kind === "marketing") && (
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
            />
          )}
          {card.badge}
        </span>
      ) : null}
    </div>
  );
}

function Steps({ steps, start = 18 }: { steps: string[]; start?: number }) {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      {steps.map((step, index) => (
        <span
          key={step}
          className="ph2-in flex items-center gap-1.5"
          style={at(start + index * 3)}
        >
          {index > 0 ? (
            <span aria-hidden className="text-[0.6rem] text-[#64748B]">
              →
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[0.58rem] font-semibold",
              index === steps.length - 1
                ? "bg-primary text-white"
                : "border border-[#BBF7D0] bg-[#F0FDF4] text-[#101828]",
            )}
          >
            {step}
          </span>
        </span>
      ))}
    </div>
  );
}

function CtaPill({ label, delay = 30 }: { label: string; delay?: number }) {
  return (
    <p
      className="ph2-in mt-3 rounded-xl bg-primary px-3 py-2 text-center text-[0.7rem] font-bold text-white"
      style={at(delay)}
    >
      {label}
    </p>
  );
}

function sparkPaths(values: number[], w = 300, h = 40) {
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((value, index) => ({
    x: index * step,
    y: h - (value / 100) * h,
  }));
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  return {
    line,
    area: `${line} L${w} ${h} L0 ${h} Z`,
    last: points[points.length - 1],
  };
}

/** The per-product mini UI. `kind` decides which one is drawn. */
function CardBody({ card }: { card: StageCard }) {
  switch (card.kind) {
    case "chat":
      return (
        <>
          <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[0.7rem] font-bold text-primary">
              SW
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem] font-bold text-[#101828]">
                {card.title}
              </p>
              <p className="flex items-center gap-1.5 text-[0.62rem] font-medium text-[#22C55E]">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
                />
                {card.footnote}
              </p>
            </div>
            {card.badge ? (
              <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-1 text-[0.56rem] font-bold text-primary">
                {card.badge}
              </span>
            ) : null}
          </div>

          <ChatThread question={card.lines[0]} answer={card.lines[1]} />

          {card.quick ? (
            <div className="ph2-in mt-3 flex flex-wrap gap-1.5" style={at(34)}>
              <span className="rounded-full bg-primary px-2.5 py-1.5 text-[0.64rem] font-semibold text-white">
                {card.quick[0]}
              </span>
              <span className="rounded-full border border-border bg-white px-2.5 py-1.5 text-[0.64rem] font-semibold text-[#4B5563]">
                {card.quick[1]}
              </span>
            </div>
          ) : null}
        </>
      );

    case "order":
      return (
        <>
          <CardHeader card={card} />

          <div className="ph2-in mt-3 flex items-center gap-2.5" style={at(1)}>
            <span
              aria-hidden
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#0B1220]"
            >
              <span className="absolute inset-x-3 inset-y-2.5 rounded-[4px] border border-white/55" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.78rem] font-semibold text-[#101828]">
                {card.lines[0]}
              </p>
              <p className="truncate text-[0.66rem] text-[#64748B]">
                {card.lines[1]}
              </p>
            </div>
          </div>

          <ul className="mt-3 flex flex-col gap-1.5">
            {card.rows?.map((row, index) => {
              const total = index === (card.rows?.length ?? 0) - 1;
              return (
                <li
                  key={row.label}
                  className={cn(
                    "ph2-in flex items-center justify-between gap-2 text-[0.72rem]",
                    total
                      ? "border-t border-dashed border-border pt-1.5 font-bold text-[#101828]"
                      : "text-[#64748B]",
                  )}
                  style={at(5 + index * 3)}
                >
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.value}</span>
                </li>
              );
            })}
          </ul>

          {card.footnote ? (
            <p
              className="ph2-in mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[0.72rem] font-bold text-[#101828]"
              style={at(12)}
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#22C55E]">
                <Check />
              </span>
              {card.footnote}
            </p>
          ) : null}

          {card.chips ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {card.chips.map((chip, index) => (
                <span
                  key={chip}
                  className="ph2-in inline-flex items-center gap-1 rounded-full border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-1 text-[0.58rem] font-semibold text-[#4B5563]"
                  style={at(19 + index * 2)}
                >
                  {chip}
                  <span aria-hidden className="text-[#22C55E]">
                    ✓
                  </span>
                </span>
              ))}
            </div>
          ) : null}

          {card.steps ? <Steps steps={card.steps} start={24} /> : null}
        </>
      );

    case "crm":
      return (
        <>
          <div className="flex items-center gap-2.5">
            <span
              className="ph2-in grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[0.72rem] font-bold text-primary"
              style={at(1)}
            >
              SW
            </span>
            <div className="min-w-0">
              <p
                className="ph2-in truncate text-[0.8rem] font-bold text-[#101828]"
                style={at(1)}
              >
                {card.title}
              </p>
              <p
                className="ph2-in truncate text-[0.64rem] text-[#64748B]"
                style={at(1)}
              >
                {card.lines[0]}
              </p>
            </div>
          </div>

          {card.chips ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.chips.map((chip, index) => (
                <span
                  key={chip}
                  className={cn(
                    "ph2-in rounded-full px-2 py-1 text-[0.58rem] font-semibold",
                    index === 0
                      ? "bg-[#EFF6FF] text-primary"
                      : "border border-border bg-white text-[#4B5563]",
                  )}
                  style={at(5 + index * 2)}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {card.rows ? (
            <dl className="mt-3 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-2 text-center"
                  style={at(12 + index * 2)}
                >
                  <dd className="text-[0.78rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </dd>
                  <dt className="mt-0.5 text-[0.56rem] text-[#64748B]">
                    {row.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          {card.steps ? <Steps steps={card.steps} start={18} /> : null}
        </>
      );

    case "mini":
      return (
        <>
          <CardHeader card={card} icon="C" />

          <ChatThread
            question={card.lines[0]}
            answer={card.lines[1]}
            incomingFirst={false}
          />

          {card.rows ? (
            <div className="mt-2.5 flex gap-2">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in flex flex-1 items-center gap-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-2"
                  style={at(32 + index * 3)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-7 w-7 shrink-0 rounded-lg",
                      index === 0
                        ? "bg-gradient-to-br from-[#4ABF5D] to-[#22C55E]"
                        : "bg-gradient-to-br from-[#FAF9F5] to-[#453F3D]",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.62rem] font-semibold text-[#101828]">
                      {row.label}
                    </span>
                    <span className="block text-[0.56rem] font-bold text-primary">
                      {row.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {card.quick ? <CtaPill label={card.quick[0]} delay={36} /> : null}
        </>
      );

    case "consulting":
      return (
        <>
          <CardHeader card={card} icon="◆" tone="blue" />

          <ul className="mt-3 flex flex-col gap-2">
            {card.lines.map((line, index) => (
              <li
                key={line}
                className="ph2-in flex items-start gap-2 text-[0.72rem] leading-[1.45] text-[#4B5563]"
                style={at(1 + index * 5)}
              >
                <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#F0FDF4]">
                  <Check light />
                </span>
                {line}
              </li>
            ))}
          </ul>

          {card.bars && card.days && card.metric ? (
            <div
              className="ph2-in mt-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] p-2.5"
              style={at(10)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.58rem] font-semibold text-[#4B5563]">
                  {card.metric.label}
                </span>
                <span className="text-[0.62rem] font-bold text-[#22C55E]">
                  {card.metric.value}
                </span>
              </div>
              <div className="mt-2 flex h-10 items-end gap-1">
                {card.bars.map((height, index) => (
                  <span
                    key={index}
                    className="ph2-bar flex-1 rounded-sm bg-gradient-to-t from-[#1352BF] to-[#3B82F6]"
                    style={{
                      height: `${height}%`,
                      ...phase(14 * BEAT + index * 90),
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex">
                {card.days.map((day, index) => (
                  <span
                    key={index}
                    className="flex-1 text-center text-[0.54rem] text-[#64748B]"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {card.quick ? <CtaPill label={card.quick[0]} delay={33} /> : null}
        </>
      );

    case "marketing": {
      const spark = card.spark ? sparkPaths(card.spark) : null;
      return (
        <>
          <CardHeader card={card} icon="M" />

          <p
            className="ph2-in mt-3 text-[0.68rem] text-[#64748B]"
            style={at(1)}
          >
            {card.lines[0]}
          </p>

          {card.rows ? (
            <dl className="mt-2.5 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in rounded-lg border border-[#F1F5F9] bg-[#F8FAFF] px-1.5 py-1.5 text-center"
                  style={at(1 + index * 4)}
                >
                  <dd className="text-[0.72rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </dd>
                  <dt className="mt-px text-[0.54rem] text-[#64748B]">
                    {row.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          {card.metric ? (
            <div
              className="ph2-in mt-3 flex items-baseline gap-2"
              style={at(8)}
            >
              <span className="text-[1.5rem] leading-none font-bold tracking-[-0.03em] text-[#101828] tabular-nums">
                {card.metric.value}
              </span>
              <span className="text-[0.58rem] text-[#64748B]">
                {card.metric.label}
              </span>
            </div>
          ) : null}

          {spark ? (
            <svg
              viewBox="0 0 300 40"
              fill="none"
              className="mt-2 h-10 w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="ph2-spark-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1352BF" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#1352BF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={spark.area} fill="url(#ph2-spark-fill)" />
              <path
                className="ph2-draw"
                d={spark.line}
                stroke="#1352BF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={spark.last.x}
                cy={spark.last.y}
                r="3.5"
                fill="#1352BF"
              />
            </svg>
          ) : null}

          {card.footnote ? (
            <p
              className="ph2-in mt-2 text-[0.62rem] font-semibold text-[#101828]"
              style={at(26)}
            >
              {card.footnote}
            </p>
          ) : null}
        </>
      );
    }
  }
}

/** The Cekat app window the card floats on. */
function Dashboard({
  dashboard,
  toggles,
}: {
  dashboard: HeroDashboard;
  /**
   * One toggle per product popup, rendered as a strip under the window chrome.
   * Absent in the reduced-motion gallery, where every popup is already on stage
   * and there is nothing to toggle.
   */
  toggles?: {
    label: string;
    items: {
      key: string;
      label: string;
      pressed: boolean;
      showLabel: string;
      hideLabel: string;
      onToggle: () => void;
    }[];
  };
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.05),0_44px_84px_-54px_rgba(11,18,32,0.5)]">
      <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] bg-[#FAFBFC] px-4 py-3">
        {/* macOS traffic lights, matching the floating popups' title bars. */}
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-full border border-border bg-white px-3 py-1 text-[0.65rem] text-[#64748B]">
          {dashboard.url}
        </span>
      </div>

      {/*
        The popup switchboard. Each pill owns exactly one window on the canvas:
        pressed means that popup is on stage, and pressing it again puts that
        one popup away — the other five are untouched. Labels are the products
        themselves rather than numbers, so the control reads as a list of what
        you can open.

        `z-40` is load-bearing. Windows overlap the app by design, and with all
        six open they do reach this row — so the one control that opens and
        closes them all has to paint over them, or closing a popup would mean
        first digging it out from under the others.
      */}
      {toggles ? (
        <div className="relative z-40 flex items-start gap-2.5 border-b border-[#F1F5F9] px-4 py-2.5">
          <span className="mt-1 shrink-0 text-[0.58rem] font-bold tracking-[0.1em] text-[#64748B] uppercase">
            {toggles.label}
          </span>
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {toggles.items.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onToggle}
                aria-pressed={item.pressed}
                aria-label={item.pressed ? item.hideLabel : item.showLabel}
                title={item.label}
                className={cn(
                  "inline-flex h-6 max-w-[9.5rem] items-center gap-1.5 rounded-full border px-2 text-[0.6rem] font-semibold transition-colors duration-200 motion-reduce:transition-none",
                  item.pressed
                    ? "border-[#BFDBFE] bg-[#EFF6FF] text-primary"
                    : "border-border bg-white text-[#64748B] hover:border-[#BFDBFE] hover:text-[#101828]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    item.pressed ? "bg-primary" : "bg-[#CBD5E1]",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* `lg:px-10` is the exact width the floating card overlaps, so it never
          covers a label or a number. */}
      <div className="grid lg:grid-cols-[164px_minmax(0,1fr)] lg:px-10 xl:grid-cols-[164px_minmax(0,1fr)_186px]">
        <aside className="hidden border-r border-[#F1F5F9] py-4 pr-3.5 lg:block">
          {dashboard.nav.map((item, index) => (
            <div
              key={item}
              className={cn(
                "mb-0.5 flex items-center gap-2 rounded-lg px-3 py-2 text-[0.72rem]",
                index === 0
                  ? "bg-[#EFF6FF] font-semibold text-primary"
                  : "text-[#64748B]",
              )}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-current opacity-25"
              />
              {item}
            </div>
          ))}
        </aside>

        <div className="p-4 lg:px-5 lg:py-5">
          <p className="text-[0.75rem] font-bold tracking-[-0.01em] text-[#101828]">
            {dashboard.title}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {dashboard.rows.map((row) => (
              <div
                key={row.who}
                className="flex gap-2.5 rounded-xl border border-border bg-white p-2.5"
              >
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.6rem] font-bold text-white"
                  style={{ background: row.accent }}
                >
                  {row.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.7rem] font-semibold text-[#101828]">
                    {row.who}
                  </p>
                  <p className="mt-0.5 text-[0.68rem] leading-[1.4] text-[#64748B]">
                    {row.msg}
                  </p>
                  <span className="mt-1.5 inline-flex rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[0.6rem] font-semibold text-primary">
                    {row.chip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden flex-col gap-2 border-l border-[#F1F5F9] py-4 pl-3.5 xl:flex">
          {dashboard.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-2.5"
            >
              <p className="text-[0.9rem] font-bold tracking-[-0.02em] text-[#101828] tabular-nums">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[0.6rem] leading-[1.3] text-[#64748B]">
                {stat.label}
              </p>
              {stat.spark ? (
                <div aria-hidden className="mt-1.5 flex h-5 items-end gap-0.5">
                  {[40, 55, 48, 70, 66, 84, 96].map((height, index) => (
                    <i
                      key={index}
                      className="flex-1 rounded-sm bg-gradient-to-t from-[#1352BF] to-[#3B82F6]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </aside>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white lg:hidden"
      />
    </div>
  );
}

/**
 * The chrome every window on this canvas shares: macOS traffic lights left,
 * label centered, a balancing spacer right (the dots are 3×12px plus 2×6px
 * gaps = 48px, so `w-12` keeps the label truly centered).
 *
 * Only the red dot is real. On a real window yellow and green minimize and zoom
 * the app behind it, which here would mean resizing the dashboard — so they are
 * decorative, and the red dot is the close control for this one popup.
 */
function WindowChrome({
  label,
  closeLabel,
  onClose,
}: {
  label: string;
  closeLabel?: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-[#F1F5F9] bg-[#FAFBFC] px-3 py-1.5">
      <span
        className="group flex shrink-0 items-center gap-1.5"
        aria-hidden={onClose ? undefined : true}
      >
        {onClose ? (
          /*
            The minimize control, and the only way to tell it apart from the two
            decorative dots next to it.

            Two deliberate choices, both about it actually landing:
            the button is 24px with the 12px dot drawn inside it, so the target
            is a real size instead of a 12px bullseye that a trackpad click can
            slide off; and the `×` is always painted at low opacity rather than
            revealed on hover, because a touch tap never fires hover — the glyph
            disappearing was exactly what made this look like an inert dot.
          */
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-6 w-6 place-items-center rounded-full transition-transform duration-150 hover:scale-110 focus-visible:scale-110 motion-reduce:transition-none"
          >
            <span className="grid h-3 w-3 place-items-center rounded-full bg-[#FF5F57] text-[9px] leading-none font-bold text-[#7A1F1F]">
              <span
                aria-hidden
                className="translate-y-px opacity-55 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
              >
                ×
              </span>
            </span>
          </button>
        ) : (
          <span className="grid h-6 w-6 place-items-center">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          </span>
        )}
        <span className="grid h-6 w-6 place-items-center">
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        </span>
        <span className="grid h-6 w-6 place-items-center">
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </span>
      </span>
      <p className="min-w-0 flex-1 truncate text-center text-[0.58rem] font-bold tracking-[0.1em] text-[#64748B] uppercase">
        {label}
      </p>
      {/* Balances the three 24px controls on the left, so the label reads as
          centered rather than nudged right. */}
      <span aria-hidden className="w-[5.25rem] shrink-0" />
    </div>
  );
}

/**
 * One popup on the canvas: a macOS-style window whose body is that product's
 * looping mini UI. Every window runs its own animation on its own clock, so
 * nothing on this canvas is ever in step with anything else.
 *
 * Closing it — red dot, or its dashboard pill — takes just this window down.
 * The other popups keep running.
 */
function PopupWindow({
  card,
  loop,
  phase: phaseMs,
  closeLabel,
  onClose,
}: {
  card: StageCard;
  /** Bumped on every restart, so the body remounts and replays from the top. */
  loop: number;
  /** Where this card sits in its own LOOP; see `phase`. */
  phase: number;
  closeLabel?: string;
  onClose?: () => void;
}) {
  return (
    <div
      // `--ph2-phase` reaches every animation inside the card through the
      // `calc()` in `phase()`, so the whole story is offset — which is why a
      // freshly mounted card is already mid-scene instead of starting dead.
      data-loop={loop}
      style={{ "--ph2-phase": `-${phaseMs}ms` } as CSSProperties}
      className="ph2-stage-card w-full rounded-[18px] border border-[#BFDBFE] bg-white opacity-100 shadow-[0_1px_2px_rgba(11,18,32,0.06),0_32px_64px_-30px_rgba(19,82,191,0.5)]"
    >
      <WindowChrome
        label={card.label}
        closeLabel={closeLabel}
        onClose={onClose}
      />
      <div className="p-5">
        <CardBody key={loop} card={card} />
      </div>
    </div>
  );
}

/**
 * Hero stage — the Cekat dashboard with the six product demos floating around
 * it as windows, ported from /preview-home's `#heroSec/div[2]` canvas.
 *
 * Every product owns a slot, so there is no rotation to keep up with and no
 * two windows ever show the same thing. The dashboard chrome carries one pill
 * per product: pressed means that popup is on stage, pressing it again puts
 * that one window away and leaves the rest alone. Closing from the window's
 * own red dot does the same thing from the other end, so a closed popup is
 * always one tap from coming back and never reachable only one way.
 *
 * Nothing here moves in lockstep. Each slot bobs on its own period and phase
 * (SLOTS), and each entrance is offset by its own delay, so the canvas reads as
 * six independent windows rather than one animation played six times.
 *
 * On fine pointers each window is also freely draggable, and the release point
 * becomes its new home until dragged again. Coarse pointers get no handlers at
 * all — mobile keeps the untouched canvas.
 *
 * With `prefers-reduced-motion` the whole canvas becomes a static gallery: all
 * six products laid out at once, so no product is unreachable and nothing
 * moves on its own.
 */
export function HeroStage({
  dashboard,
  stage,
}: {
  dashboard: HeroDashboard;
  stage: LiveStage;
}) {
  const cards = stage.cards;
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Which products show a popup. Independent per slot: summoning one never
  // touches the others, and each appearance remounts on its own timing — the
  // popups never move in lockstep.
  const [visible, setVisible] = useState<boolean[]>(() => [...INITIAL_VISIBLE]);
  // Entrance replay counter per slot. Bumped whenever a popup is summoned, so
  // its play-in animation runs fresh on every appearance — and only then: the
  // loop below restarts the card's body without replaying the window opening.
  const [summon, setSummon] = useState<number[]>(() => SLOTS.map(() => 0));
  // Restart counter per slot, bumped on that slot's own beat (see LOOP).
  const [loop, setLoop] = useState<number[]>(() => SLOTS.map(() => 0));

  // Where each slot lives. `null` is the designed anchor (left / right /
  // bottom-center); a drop stores the release offset here, so the window keeps
  // its dropped place across summoning cycles instead of snapping back.
  const [placed, setPlaced] = useState<Array<{ x: number; y: number } | null>>(
    () => SLOTS.map(() => null),
  );
  // Stacking order per slot. Grabbing (even a click without movement) bumps
  // that slot above the rest, so when cards overlap the most recently touched
  // one is always on top — no more guessing which card you're holding.
  const [depth, setDepth] = useState<number[]>(() => SLOTS.map((_, i) => i));
  const zTop = useRef(SLOTS.length);
  const [drag, setDrag] = useState<DragState | null>(null);
  // Keyboard focus pauses the loop, the same way the pointer used to: someone
  // tabbing through the hero should not have a card rewound out from under
  // them mid-read. A mouse does not hold it — this is the page's main event,
  // and it should be seen moving.
  const [reading, setReading] = useState(false);
  // Which window the loop is up to. A ref, not state: the effect must not
  // re-subscribe every time it advances.
  const turn = useRef(0);
  // Snapshot taken on press, before any transform is applied: pointer origin,
  // the slot's home offset, and the rects for bounds math. Measuring here
  // (not per move) keeps the move handler a pure arithmetic step.
  //
  // Horizontal bounds are the *viewport*, not the stage: cards can be parked
  // flush against either screen edge. Vertical bounds stay the stage, so a
  // card cannot be lost inside the bands above or below.
  const gesture = useRef<{
    slot: number;
    x0: number;
    y0: number;
    bx: number;
    by: number;
    anchor: { left: number; top: number; width: number; height: number };
    bounds: { left: number; top: number; width: number; height: number };
  } | null>(null);

  // Drag is a desktop-only enhancement (attio-style): mouse/trackpad get
  // free placement between slots, touch viewports keep the untouched canvas.
  const canDrag = finePointer && !reduce;

  /**
   * One product's popup, opened or closed from either end: its dashboard pill
   * or the window's own red dot. Both land here, so the two controls can never
   * disagree about what is on screen.
   *
   * Bumping the slot's `summon` count alongside the flip is what makes a
   * re-summoned window replay its entrance rather than popping in fully
   * formed. It is deliberately not the same counter as the loop's: restarting a
   * card's story must never re-run the window opening, or every window would
   * pop in from scratch once per loop.
   */
  const toggleProduct = useCallback((s: number) => {
    setVisible((previous) => {
      const next = [...previous];
      next[s] = !next[s];
      return next;
    });
    setSummon((previous) => {
      const next = [...previous];
      next[s] += 1;
      return next;
    });
  }, []);

  // The pill labels are built here rather than in content because each one
  // needs the product's own name inside it, and that name is already carried by
  // the card — one string per locale instead of twelve.
  const toggles = {
    label: stage.popups.strip,
    items: cards.map((card, s) => ({
      key: card.label,
      label: card.label,
      pressed: visible[s],
      showLabel: `${stage.popups.show}: ${card.label}`,
      hideLabel: `${stage.popups.hide}: ${card.label}`,
      onToggle: () => toggleProduct(s),
    })),
  };

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>, s: number) => {
    if (event.button !== 0) return;
    // Front on grab: the touched slot jumps above the rest immediately, so a
    // half-buried card surfaces the moment you pick it up — not only after
    // you drop it somewhere.
    zTop.current += 1;
    const z = zTop.current;
    setDepth((previous) => {
      const next = [...previous];
      next[s] = z;
      return next;
    });
    const el = slotRefs.current[s];
    const stageEl = stageRef.current;
    // Without measurable boxes there is nothing to clamp against, so don't
    // start: a gesture with no bounds could throw the card off-stage.
    if (!el || !stageEl) return;
    const anchor = el.getBoundingClientRect();
    const stage = stageEl.getBoundingClientRect();
    const home = placed[s] ?? { x: 0, y: 0 };
    // 12px breathing room so the card's shadow never kisses the chrome.
    const margin = 12;
    gesture.current = {
      slot: s,
      x0: event.clientX,
      y0: event.clientY,
      bx: home.x,
      by: home.y,
      anchor: {
        left: anchor.left,
        top: anchor.top,
        width: anchor.width,
        height: anchor.height,
      },
      bounds: {
        left: margin,
        top: stage.top,
        width: window.innerWidth - margin * 2,
        height: stage.height,
      },
    };
    // Capture keeps the move stream on this slot even when the pointer races
    // ahead of it. Guarded: jsdom and some embedded browsers lack it, and a
    // failed capture must never break the press itself.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* no-op: moves still track by coordinates */
    }
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>, s: number) => {
    const g = gesture.current;
    if (!g || g.slot !== s) return;
    const rawDx = event.clientX - g.x0;
    const rawDy = event.clientY - g.y0;
    if (!drag && Math.hypot(rawDx, rawDy) < DRAG_THRESHOLD) return;
    // Live-clamped, so the card visibly stops at the stage edge instead of
    // sliding out and snapping back on release.
    const at = clampOffset(g.bx + rawDx, g.by + rawDy, g.anchor, g.bounds);
    setDrag({ slot: s, dx: at.x, dy: at.y });
  };

  const endDrag = (s: number) => {
    const g = gesture.current;
    gesture.current = null;
    // Persist the release point: the slot's new home until dragged again. A
    // press without movement (`drag` still null) changes nothing.
    if (g && g.slot === s && drag && drag.slot === s) {
      const home = { x: drag.dx, y: drag.dy };
      setPlaced((previous) => {
        const next = [...previous];
        next[s] = home;
        return next;
      });
    }
    setDrag(null);
  };

  /**
   * The loop: one window restarts per tick, round-robin, so each card's story
   * begins again every LOOP and the six restarts are spread evenly across it.
   * A single shared timer rather than six is deliberate — one interval to clean
   * up, and no chance of two windows landing on the same tick.
   *
   * Restarting means remounting the card body, which rewinds its CSS
   * animations; the chrome, the position and anything half-dragged are all left
   * alone. Hidden tabs are skipped outright.
   */
  useEffect(() => {
    if (reduce || reading) return;
    const step = LOOP / SLOTS.length;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const slot = turn.current % SLOTS.length;
      turn.current += 1;
      setLoop((previous) => {
        const next = [...previous];
        next[slot] += 1;
        return next;
      });
    }, step);
    return () => window.clearInterval(id);
  }, [reduce, reading]);

  /**
   * Scroll-linked growth: the stage swells from 88% to full size as it travels
   * into view, then holds. `--stage` is written straight to the DOM inside a
   * rAF, so it tracks the scroll exactly instead of playing a transition
   * behind it.
   *
   * `transform-origin: center top` (see the CSS) is what keeps this stable: the
   * top edge does not move when the element scales, so the rect measured here
   * never depends on the value being written.
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (reduceMotion.matches) {
        el.style.setProperty("--stage", "1");
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 0 when the stage's top sits on the bottom edge of the viewport, 1 once
      // it has travelled 60% of the viewport upwards.
      const p = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport * 0.6)),
      );
      el.style.setProperty("--stage", (0.88 + 0.12 * p).toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduceMotion.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduceMotion.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div role="group" aria-label={stage.heading}>
      <p className="sr-only">{stage.caption}</p>

      <div ref={stageRef} className="ph2-stage-scale">
        {reduce ? (
          // No motion: every product is on stage at once as a plain window.
          // Nothing to toggle, so the dashboard drops its switchboard.
          <div className="flex flex-col gap-8">
            <div className="mx-auto w-full max-w-[880px]">
              <Dashboard dashboard={dashboard} />
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <li key={card.label}>
                  <PopupWindow card={card} loop={0} phase={0} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <AnimGate>
            {/*
              `lg:pb-8` is the strip the bottom row of windows hangs over —
              overlapping the app is the /preview-home look. The top row starts
              at `top-32` for the opposite reason: the dashboard's switchboard
              owns everything above that, and no window may bury the one row
              of controls that opens and closes all six of them.
            */}
            <div
              onFocusCapture={() => setReading(true)}
              onBlurCapture={() => setReading(false)}
              className="relative lg:pb-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-4 bottom-4 hidden rounded-[48px] bg-[radial-gradient(55%_55%_at_50%_50%,rgba(19,82,191,0.10),transparent_72%)] lg:block"
              />

              {/*
                The dashboard, centered and wide. On desktop the popups overlay
                its edges (~150px each side at 1040px in the 1400px breakout
                shell) — windows floating on top of the app, not beside it.
                Below `lg` it stands alone with its popups stacked under it.
              */}
              <div className="relative mx-auto w-full max-w-[1040px]">
                <Dashboard dashboard={dashboard} toggles={toggles} />
              </div>

              {/*
                The desktop canvas. Each slot is absolutely anchored and only
                rendered while its product is toggled on, so a closed window
                costs nothing and leaves the canvas uncluttered. `key` carries
                the slot's summon count: re-summoning a window remounts it, so
                its entrance replays on that slot's own delay.
              */}
              {SLOTS.map((slot, s) => {
                if (!visible[s]) return null;
                const card = cards[s];
                // The held window follows the pointer; a placed (previously
                // dropped) one keeps its stored offset. Either way the position
                // is inline, so it survives the entrance remount.
                const heldDrag = drag !== null && drag.slot === s ? drag : null;
                const held = heldDrag !== null;
                const home = heldDrag
                  ? { x: heldDrag.dx, y: heldDrag.dy }
                  : placed[s];
                // Stacking: the most recently grabbed slot sits on top (base
                // 20 keeps every slot above the dashboard at z-10; the held
                // window goes higher still while dragged).
                const stackZ = held ? 100 : 20 + depth[s];
                return (
                  <div
                    key={`${slot.key}-${summon[s]}`}
                    ref={(el) => {
                      slotRefs.current[s] = el;
                    }}
                    onPointerDown={
                      canDrag ? (event) => beginDrag(event, s) : undefined
                    }
                    onPointerMove={
                      canDrag ? (event) => moveDrag(event, s) : undefined
                    }
                    onPointerUp={canDrag ? () => endDrag(s) : undefined}
                    onPointerCancel={canDrag ? () => endDrag(s) : undefined}
                    // Inline transform carries the position. The bob is dropped
                    // while held or placed: a CSS animation would override the
                    // inline transform, snapping the window back to its anchor
                    // mid-drag (or after a drop). While it *is* bobbing, the
                    // period and phase below are this slot's own — that inline
                    // pair is what stops six windows breathing in unison.
                    style={{
                      ...(home
                        ? {
                            transform: `translate(${home.x}px, ${home.y}px)${heldDrag ? " scale(1.04)" : ""}`,
                            transition: "none",
                          }
                        : {
                            animationDuration: slot.period,
                            animationDelay: slot.phase,
                          }),
                      zIndex: stackZ,
                    }}
                    className={cn(
                      "ph2-anim absolute hidden w-[320px] xl:w-[340px] lg:block",
                      !home && slot.float,
                      slot.className,
                      canDrag && "lg:cursor-grab lg:touch-pan-y",
                      held && "select-none lg:cursor-grabbing",
                    )}
                  >
                    <div className="ph2-pop-in" style={at(slot.enter)}>
                      <PopupWindow
                        card={card}
                        loop={loop[s]}
                        phase={(s * LOOP) / SLOTS.length}
                        closeLabel={stage.popups.close}
                        onClose={() => toggleProduct(s)}
                      />
                    </div>
                  </div>
                );
              })}

              {/*
                Below `lg` there is no canvas to float on: the same popups stack
                under the window instead, each still owning its own reel and its
                own close dot, running its own loop.
              */}
              {visible.some(Boolean) ? (
                <div className="relative z-20 -mt-6 grid justify-items-center gap-5 lg:hidden">
                  {SLOTS.map((slot, s) =>
                    visible[s] ? (
                      <div
                        key={`${slot.key}-${summon[s]}`}
                        className="ph2-pop-in w-[min(92vw,420px)]"
                        style={at(slot.enter)}
                      >
                        <PopupWindow
                          card={cards[s]}
                          loop={loop[s]}
                          phase={(s * LOOP) / SLOTS.length}
                          closeLabel={stage.popups.close}
                          onClose={() => toggleProduct(s)}
                        />
                      </div>
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
          </AnimGate>
        )}
      </div>
    </div>
  );
}
