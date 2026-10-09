"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import { AnimGate } from "./AnimGate";
import type {
  HeroDashboard,
  LiveStage,
  StageCard,
  StageThread,
  StageThreadTurn,
} from "./types";

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
 *
 * Column-mates never share an anchor, and the anchors step sideways on
 * purpose: the top row hugs the two edges, the bottom row spreads across the
 * stage (0% / 11% / ~50% from the left), the centre card sits on `mx-auto`.
 * The windows are *meant* to overlap — six 320–340px cards cover more area
 * than the canvas has, so some stacking on every pixel of the pile is forced
 * by geometry, the way attio.com's canvas stacks. What these anchors hand out
 * is the *share* of each card that gets covered: distributed so no window sits
 * buried much past halfway, each keeping a grab strip and its own chrome
 * visible.
 *
 * Overlap used to be a hit-testing hazard — the browser routes a press to
 * whichever window paints on top, so a half-visible card behind could look
 * clickable and receive nothing. Correctness no longer comes from keeping the
 * rectangles apart; it comes from the paint itself: each shell is
 * `pointer-events-none`, so a window's hit region is exactly the pixels it
 * paints, wherever a drop has put it, and grabbing (even a plain click) fronts
 * the touched window above the rest. That is what lets a visitor pile cards
 * anywhere without ever losing a click.
 */
const SLOTS = [
  {
    key: "chat",
    float: "ph2-float",
    className: "lg:top-32 lg:left-0",
    period: "7.4s",
    phase: "-1.1s",
    /** Beats, not milliseconds — see `at()`. */
    enter: 0,
  },
  {
    key: "order",
    float: "ph2-float-slow",
    className: "lg:top-32 lg:right-0",
    period: "9.6s",
    phase: "-4.3s",
    enter: 2,
  },
  {
    key: "crm",
    float: "ph2-float",
    className: "lg:right-0 lg:bottom-4 lg:left-0 lg:mx-auto",
    period: "6.8s",
    phase: "-2.7s",
    enter: 4,
  },
  {
    key: "mini",
    float: "ph2-float-slow",
    className: "lg:bottom-4 lg:left-[11%]",
    period: "8.8s",
    phase: "-6.1s",
    enter: 1,
  },
  {
    key: "consulting",
    float: "ph2-float",
    className: "lg:right-[11%] lg:bottom-4",
    period: "11.2s",
    phase: "-3.5s",
    enter: 3,
  },
  {
    key: "marketing",
    float: "ph2-float-slow",
    className: "lg:bottom-12 lg:left-[50%]",
    period: "7.9s",
    phase: "-5.2s",
    enter: 5,
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

/**
 * How often the shared beat fires.
 *
 * Derived rather than fixed, and exported for tests: the cadence is `LOOP`
 * shared between however many cards are actually on the beat, so dropping a
 * scripted card out of the rotation necessarily speeds the rest up. Dividing by
 * the total slot count instead would desynchronise the cadence from the
 * rotation — each card would then get a share of the loop proportional to
 * cards it has nothing to do with.
 */
export function loopTickMs(beatCount: number): number {
  return beatCount > 0 ? LOOP / beatCount : LOOP;
}

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
 * Clamp where a dragged window may be *painted*.
 *
 * Everything here is in screen space, on purpose, and the caller converts back
 * to a translate. The distinction is the whole fix: `transform` is relative to a
 * window's layout box, while `getBoundingClientRect` reports where it is painted
 * right now — which, for a window that has already been placed, already includes
 * the placement that is about to be replaced. Feeding a painted rect into a
 * translate-space clamp makes a second pick-up compute a wildly negative
 * allowance, and the window leaps across the stage on the first move.
 *
 * `size` is the window's painted box, so a window wider than the gap simply
 * pins to `left` rather than flipping inside out.
 *
 * Pure, so the bounds are unit-testable without a DOM.
 */
export function clampOffset(
  wanted: { x: number; y: number },
  size: { width: number; height: number },
  bounds: { left: number; top: number; right: number; bottom: number },
): { x: number; y: number } {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
  return {
    x: clamp(
      wanted.x,
      bounds.left,
      Math.max(bounds.left, bounds.right - size.width),
    ),
    y: clamp(
      wanted.y,
      bounds.top,
      Math.max(bounds.top, bounds.bottom - size.height),
    ),
  };
}

/**
 * Where the float animation has moved a window right now, in pixels.
 *
 * `getComputedStyle` on an animating `transform` returns the current matrix, so
 * this is the bob's live offset rather than a guess. Falls back to zero when
 * the browser hands back `none` (no animation, or reduced motion) — which is the
 * correct answer in both cases.
 */
export function bobOffset(el: Element): { x: number; y: number } {
  const raw = window.getComputedStyle(el).transform;
  if (!raw || raw === "none") return { x: 0, y: 0 };
  // `matrix(a, b, c, d, tx, ty)` and `matrix3d(...)` both end in the
  // translation; there is no rotate or scale on the bob, so tx/ty are the whole
  // offset and no matrix maths is needed.
  const parts = raw
    .slice(raw.indexOf("(") + 1, raw.lastIndexOf(")"))
    .split(",")
    .map((value) => Number(value.trim()));
  if (parts.length !== 6 || Number.isNaN(parts[4])) return { x: 0, y: 0 };
  return { x: parts[4], y: parts[5] };
}

/** Movement before a press becomes a drag — sub-pixel jitter and click wobble
 * stay alone, while an intentional grab tracks the hand almost immediately. */
const DRAG_THRESHOLD = 3;

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

/**
 * The conversation clock, shared by the thread player and the mobile carousel.
 *
 * Both need the same answer to "how long does this card need?" — the player to
 * schedule its next turn, the carousel to know when it may move on. Written once
 * here so the two can never disagree, which is what would otherwise cut a
 * conversation short as the next card slides in.
 */
const TURN_BASE = 800;
const TURN_PER_CHAR = 12;
const TURN_CAP_AGENT = 3600;
const TURN_CAP_VISITOR = 2400;
/** The dots before a business line: punctuation, not content. */
const TYPE_BEAT = 900;
/** The finished conversation is held before the script starts over. */
const HOLD = 3800;

/** How long a revealed turn is read before the next one arrives. */
export function turnPause(turn: StageThreadTurn | undefined): number {
  if (turn === undefined) return 700;
  return Math.min(
    turn.from === "agent" ? TURN_CAP_AGENT : TURN_CAP_VISITOR,
    TURN_BASE + turn.text.length * TURN_PER_CHAR,
  );
}

/**
 * How long a card wants on stage.
 *
 * A conversation runs its script to the end and is then held on its closing
 * exchange; anything else gets one loop. The mobile carousel uses this as its
 * slide interval, which is why the long scripts are never truncated.
 */
export function cardDuration(card: StageCard): number {
  const script = card.thread;
  if (!script?.length) return LOOP;
  const total = script.reduce((sum, turn, index) => {
    const next: StageThreadTurn | undefined = script[index + 1];
    return sum + turnPause(turn) + (next?.from === "agent" ? TYPE_BEAT : 0);
  }, 0);
  return total + HOLD;
}

/**
 * A real conversation, not an exchange.
 *
 * The script is walked one turn at a time: a visitor message appears, the
 * business types (the dots), the reply replaces them, and so on — the same
 * shape as the scripted WhatsApp conversation on the production homepage, cut
 * down to what fits a 340px window. A turn can carry a note (the price, the
 * order that was created), which is where the product work shows rather than
 * just the words.
 *
 * This is JS-driven rather than the CSS beat clock the rest of the cards use,
 * because a conversation has no fixed length: the script decides how many turns
 * there are, so the player has to count them. It also owns its own restart,
 * which is what keeps a 14-turn script from being cut off by the shared loop.
 */
function ChatThread({ turns }: { turns: StageThread }) {
  const [shown, setShown] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const total = turns.length;

  useEffect(() => {
    if (total === 0 || document.hidden) return;
    const last = turns[Math.min(shown, total) - 1];
    const next = turns[shown];
    // After the last turn there is nothing left to type towards, so it is a
    // hold rather than a beat before the next message. `turnPause` covers the
    // opening beat too, where there is nothing to read yet.
    const delay =
      shown >= total
        ? HOLD
        : turnPause(last) + (next?.from === "agent" ? TYPE_BEAT : 0);
    const id = window.setTimeout(
      () => setShown((current) => (current >= total ? 0 : current + 1)),
      delay,
    );
    return () => window.clearTimeout(id);
  }, [shown, total, turns]);

  // A real chat view sticks to the newest message. Doing it here rather than
  // trusting the layout is what lets a long script scroll instead of spilling
  // out of the window.
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  if (total === 0) return null;

  // The dots appear only while the next turn belongs to the business.
  const typing = shown < total && turns[shown].from === "agent";

  return (
    <div ref={box} className="ph2-thread mt-3 flex flex-col gap-2">
      {turns.slice(0, shown).map((turn, index) => (
        <div
          key={`${index}-${turn.text.slice(0, 12)}`}
          className={cn(
            "ph2-in max-w-[88%] rounded-[14px] px-3 py-2 text-[0.74rem] leading-[1.45]",
            turn.from === "agent"
              ? "self-end rounded-tr-[5px] bg-primary text-white"
              : "self-start rounded-tl-[5px] bg-[#F1F5F9] text-[#101828]",
          )}
        >
          {turn.text}
          {turn.note ? (
            <span
              className={cn(
                "mt-1.5 block rounded-[10px] px-2 py-1.5 text-[0.62rem] leading-[1.4] font-medium",
                turn.from === "agent"
                  ? "bg-white/18 text-white"
                  : "border border-[#BFDBFE] bg-white text-[#101828]",
              )}
            >
              {turn.note}
            </span>
          ) : null}
          <span
            className={cn(
              "mt-1 block text-[0.56rem]",
              turn.from === "agent" ? "text-white" : "text-[#475467]",
            )}
          >
            {turn.from === "agent" ? (
              <>
                09:41{" "}
                <span className="tracking-[-2px] text-white" aria-hidden>
                  ✓✓
                </span>
              </>
            ) : (
              "09:41"
            )}
          </span>
        </div>
      ))}

      {/* The dots stand in for the reply's own slot, so nothing jumps when the
          real message lands. */}
      {typing ? (
        <span className="ph2-in inline-flex self-end rounded-[14px] rounded-tr-[5px] bg-[#F1F5F9] px-3 py-2.5">
          <TypingDots />
        </span>
      ) : null}
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
              <p className="flex items-center gap-1.5 text-[0.62rem] font-medium text-[#15803D]">
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

          {card.thread ? <ChatThread turns={card.thread} /> : null}
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
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#15803D]">
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
                  <span aria-hidden className="text-[#15803D]">
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
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in flex flex-col rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-2 text-center"
                  style={at(12 + index * 2)}
                >
                  <p className="text-[0.78rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </p>
                  <p className="mt-0.5 text-[0.56rem] text-[#475467]">
                    {row.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/*
            The timeline is what makes this card a CRM rather than a list of
            numbers: each row is something Ceka figured out on its own, and the
            `at` column says whether a person wrote it or the system inferred it.
          */}
          {card.notes ? (
            <ul className="mt-3 flex flex-col gap-1.5">
              {card.notes.map((note, index) => (
                <li
                  key={note.text}
                  className="ph2-in flex items-start gap-2 text-[0.68rem] leading-[1.4] text-[#4B5563]"
                  style={at(19 + index * 3)}
                >
                  <span
                    aria-hidden
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span className="min-w-0 flex-1">{note.text}</span>
                  <span className="shrink-0 text-[0.54rem] text-[#94A3B8]">
                    {note.at}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {card.steps ? <Steps steps={card.steps} start={18} /> : null}
        </>
      );

    case "mini":
      return (
        <>
          <CardHeader card={card} icon="C" />

          {/*
            The conversation carries the product too — the variants it offered
            and the cart it built arrive as `note`s inside the bubbles — so
            nothing static sits under it. A second column of product cards here
            would push the window taller than the conversation it is meant to
            illustrate.
          */}
          {card.thread ? <ChatThread turns={card.thread} /> : null}
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
                <span className="text-[0.62rem] font-bold text-[#15803D]">
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
            className="ph2-in mt-3 text-[0.68rem] leading-[1.4] text-[#64748B]"
            style={at(1)}
          >
            {card.lines[0]}
          </p>
          {card.lines[1] ? (
            <p
              className="ph2-in mt-1 text-[0.68rem] leading-[1.4] text-[#64748B]"
              style={at(3)}
            >
              {card.lines[1]}
            </p>
          ) : null}

          {/*
            Who got it. A broadcast is only convincing if the audience is
            visible — three named segments with their sizes, not just a total
            that could be anyone.
          */}
          {card.segments ? (
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {card.segments.map((segment, index) => (
                <li
                  key={segment}
                  className="ph2-in flex items-center gap-2 rounded-lg border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-1.5 text-[0.64rem] text-[#4B5563]"
                  style={at(6 + index * 3)}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B64ABF]"
                  />
                  <span className="min-w-0 truncate">{segment}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {card.rows ? (
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in rounded-lg border border-[#F1F5F9] bg-[#F8FAFF] px-1.5 py-1.5 text-center"
                  style={at(16 + index * 2)}
                >
                  <p className="text-[0.72rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </p>
                  <p className="mt-px text-[0.54rem] text-[#475467]">
                    {row.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {card.metric ? (
            <div
              className="ph2-in mt-3 flex items-baseline gap-2"
              style={at(24)}
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

        The row deliberately sits *under* the windows. Every slot starts at
        `top-32`, so the three that open by default never reach it; and when a
        card is dragged across it, the card passes over the row rather than
        sliding beneath the pills — which is what made it look like the pills
        were being dragged along with it. A window parked on top can always be
        moved or closed from its own chrome, so nothing becomes unreachable.

        Desktop only, and by breakpoint rather than in JS. Six pills are a
        switchboard on a 1040px window and clutter on a 360px one — below `lg`
        the stage is a single window that walks the products on its own, so the
        controls would have nothing to switch between. Deciding it in CSS also
        keeps the server and client markup identical, so nothing reflows when
        the viewport is measured.
      */}
      {toggles ? (
        <div className="hidden items-start gap-2.5 border-b border-[#F1F5F9] px-4 py-2.5 lg:flex">
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
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.6rem] font-bold ${
                    row.accent === "#22C55E"
                      ? "text-[#052E16]"
                      : "text-white"
                  }`}
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
  /**
   * The window box inside each slot: what gets measured and what the drag
   * writes to.
   */
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  /**
   * The shell that carries the bob. Kept separate from `slotRefs` because the
   * bob and the drag both want `transform`, and a CSS animation wins over an
   * inline style — so they live on different elements and cannot fight. Also
   * the element a gesture pauses and resumes: freezing the animation is what
   * keeps the bob's phase continuous across a press, so a plain click never
   * makes the card leap when the float starts running again.
   */
  const bobRefs = useRef<Array<HTMLDivElement | null>>([]);
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
  // Which window is in hand. One value per gesture, so unlike the old
  // per-move drag state it costs a single render at press and one at release.
  const [held, setHeld] = useState<number | null>(null);
  // Keyboard focus pauses the loop, the same way the pointer used to: someone
  // tabbing through the hero should not have a card rewound out from under
  // them mid-read. A mouse does not hold it — this is the page's main event,
  // and it should be seen moving.
  const [reading, setReading] = useState(false);
  // Which window the loop is up to. A ref, not state: the effect must not
  // re-subscribe every time it advances.
  const turn = useRef(0);
  // The mobile carousel's position. Below `lg` there is no canvas to float on
  // and no switchboard to choose from, so one window is on stage at a time and
  // it walks the products by itself — a card holds for exactly as long as its
  // own story needs, then the next takes over.
  const [slide, setSlide] = useState(0);
  /**
   * Snapshot taken on press, before any transform is applied. Measuring here
   * rather than per move keeps the move handler a pure arithmetic step.
   *
   * Two coordinate systems are kept apart on purpose:
   *
   * - `paintedX/Y` and `size` are *screen* coordinates, taken from the rect as
   *   it looks at press time. That is the space the bounds live in.
   * - `bx/by` are *translates*, what the inline `transform` is set to.
   *
   * The stage's scroll-linked scale sits between the two: one pixel of
   * translate moves the window by only `scale` pixels on screen, so a move is
   * "clamp the painted position against the bounds, then divide the difference
   * back out of the scale" — which is what makes the window follow the hand
   * 1:1 and land on the exact release point at any scroll position. Reading
   * the rect as a translate — or clamping a translate against a painted rect
   * — is what made a re-picked-up window leap, because the rect already
   * carried the placement that was about to be replaced.
   *
   * Horizontal bounds are the viewport, so a window can be parked flush against
   * either screen edge; vertical bounds are the hero band, so one cannot be
   * lost in the bands above or below — nor yanked down from the space above the
   * stage that several windows are designed to hang in.
   */
  const gesture = useRef<{
    slot: number;
    x0: number;
    y0: number;
    /** Translate in force at press time. */
    bx: number;
    by: number;
    /** The bob frozen at press time. A drop pays it into the home, because a
     *  placed card's shell stops animating and would otherwise lose it. */
    bob: { x: number; y: number };
    /** Screen px per local px (the stage's scroll scale) at press time. */
    scale: number;
    /** Painted top-left at press time, plus the painted size. */
    paintedX: number;
    paintedY: number;
    width: number;
    height: number;
    /** Whether the press has become a drag, and the translate it sits at. */
    moved: boolean;
    x: number;
    y: number;
    bounds: { left: number; top: number; right: number; bottom: number };
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
    // Closing the window that is currently in hand (its own red dot can be
    // pressed mid-gesture): the release that would have finished the drag
    // never arrives, so drop the gesture here or `held` sticks forever — the
    // loop stays paused and the re-summoned window thinks it is held.
    if (gesture.current?.slot === s) {
      gesture.current = null;
      setHeld(null);
    }
    // Surfacing: a toggled window jumps above the rest, like a newly opened
    // OS window. Without this, reopening a buried card puts it back exactly
    // where nobody could reach it — underneath everything else.
    zTop.current += 1;
    const top = zTop.current;
    setDepth((previous) => {
      const next = [...previous];
      next[s] = top;
      return next;
    });
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

  /**
   * Take a window in hand.
   *
   * The bob is frozen here rather than assumed to be zero. A card that has
   * not been placed yet is mid-bob, so its painted position is up to 8px off
   * its anchor; letting the float animation run under the pointer would drag
   * the window around out of sync with the hand, and *removing* it (the old
   * approach) both snapped the card back by that much on grab and restarted
   * the animation at another phase — so the next plain click made the card
   * leap. Pausing keeps the shell's transform exactly where it is, which
   * means the window leaves the hand at the exact pixel it was at and a
   * press that turns out to be just a click changes nothing at all.
   */
  const beginDrag = (event: React.PointerEvent<HTMLDivElement>, s: number) => {
    if (event.button !== 0) return;
    // Front on grab: the touched slot jumps above the rest immediately, so a
    // half-buried card surfaces the moment you pick it up — not only after
    // you drop it somewhere.
    zTop.current += 1;
    setDepth((previous) => {
      const next = [...previous];
      next[s] = zTop.current;
      return next;
    });
    const el = slotRefs.current[s];
    const stageEl = stageRef.current;
    // Without measurable boxes there is nothing to clamp against, so don't
    // start: a gesture with no bounds could throw the card off-stage.
    if (!el || !stageEl) return;
    const anchor = el.getBoundingClientRect();
    const stage = stageEl.getBoundingClientRect();
    /*
     * Vertical bounds are the hero band, not the stage: the stage is only the
     * dashboard's holder, while several windows are *designed* to hang above
     * it (the weekly-tips card sits ~80px over the top of it at xl). Clamping
     * to the stage would yank such a card down by that much on its first move
     * — a press that teleports. The band is the `<section>` around the stage,
     * `overflow-hidden`, so it is also the largest rectangle a card can be
     * seen in at all. Falls back to the stage when there is no section
     * (component tests, where every rect is zero-sized anyway).
     */
    const band = stageEl.closest("section")?.getBoundingClientRect();
    /*
     * The stage is scroll-linked scaled (`transform: scale(var(--stage))`), and
     * a translate written inside that wrapper moves the window by only
     * `scale` of the amount on screen — so a raw 1:1 translate made every drag
     * trail the pointer by (1 − scale) of the distance and land short of the
     * release point (~7.5% at xl). The ratio comes from the wrapper's own rect
     * against its layout width; no layout → 1, which is also what component
     * tests see.
     */
    const scale =
      stageEl.offsetWidth > 0 ? stage.width / stageEl.offsetWidth : 1;
    const shell = bobRefs.current[s];
    const home = placed[s];
    // 12px breathing room so the window's shadow never kisses the screen edge.
    const margin = 12;
    // Only a *floating* window's bob counts. A placed one has no float
    // animation, so its computed transform is its own stored placement —
    // reading that as a bob would move it twice as far as the pointer on
    // every pick-up after the first.
    const bob = home || !shell ? { x: 0, y: 0 } : bobOffset(shell);
    // No fold: the shell keeps its frozen bob, so the box below carries the
    // placement alone. `bob` rides along in the gesture for the drop, which
    // has to make the animation go away (a placed card does not float)
    // without the window moving a single pixel.
    const bx = home?.x ?? 0;
    const by = home?.y ?? 0;
    // `clientWidth` rather than `innerWidth`: innerWidth counts the scrollbar,
    // which is not a place a window can actually be seen, so using it let a
    // window slide the width of a scrollbar past the right edge.
    const viewportWidth =
      document.documentElement.clientWidth || window.innerWidth;
    const g = {
      slot: s,
      x0: event.clientX,
      y0: event.clientY,
      bx,
      by,
      bob,
      scale,
      paintedX: anchor.left,
      paintedY: anchor.top,
      width: anchor.width,
      height: anchor.height,
      moved: false,
      x: bx,
      y: by,
      bounds: {
        left: margin,
        right: viewportWidth - margin,
        top: band?.top ?? stage.top,
        bottom: band?.bottom ?? stage.top + stage.height,
      },
    };
    gesture.current = g;
    /*
     * Freeze the bob and hand the box to the gesture, in the same synchronous
     * block so both land in one frame. Pausing (rather than stripping the
     * class) keeps the shell's transform where it is, so the window neither
     * snaps back by its bob on grab nor restarts the animation at some other
     * phase when the press turns out to be a plain click — the box's own
     * translate and the shell's frozen bob add up to exactly the painted
     * position the pointer went down on.
     */
    if (shell) shell.style.animationPlayState = "paused";
    el.style.transition = "none";
    el.style.transform = `translate(${g.bx}px, ${g.by}px)`;
    setHeld(s);
    // Capture keeps the move stream on this slot even when the pointer races
    // ahead of it. Captured on the box, not on `currentTarget`: the shell is
    // `pointer-events-none` — its rect is the anchor, not the painted card —
    // and capturing on an element that cannot be hit is not reliably honoured.
    // Guarded: jsdom and some embedded browsers lack it, and a failed capture
    // must never break the press itself.
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      /* no-op: moves still track by coordinates */
    }
  };

  /**
   * Track the pointer.
   *
   * The position is written straight onto the element, never through state.
   * A pointermove can fire far more often than a card can usefully re-render,
   * and routing it through React meant re-rendering the whole stage — six
   * windows, their threads and the switchboard — for every single event. That
   * is the difference between dragging a card and dragging a slideshow, and it
   * showed worst on the tallest window (the weekly-tips card), which has the
   * most to lay out.
   *
   * Only `held` goes through React, and that changes once per gesture.
   */
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>, s: number) => {
    const g = gesture.current;
    if (!g || g.slot !== s) return;
    const rawDx = event.clientX - g.x0;
    const rawDy = event.clientY - g.y0;
    if (g.moved === false && Math.hypot(rawDx, rawDy) < DRAG_THRESHOLD) return;
    // Live-clamped, so the window visibly stops at the edge instead of sliding
    // out and snapping back on release. The clamp works in painted space; the
    // difference from where the window was at press time is divided back out
    // of the stage's scale before it becomes a translate, which keeps the two
    // coordinate systems — and their pixel units — from being mixed.
    const at = clampOffset(
      { x: g.paintedX + rawDx, y: g.paintedY + rawDy },
      { width: g.width, height: g.height },
      g.bounds,
    );
    const tx = g.bx + (at.x - g.paintedX) / g.scale;
    const ty = g.by + (at.y - g.paintedY) / g.scale;
    g.moved = true;
    g.x = tx;
    g.y = ty;
    const el = slotRefs.current[s];
    if (el) {
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  };

  const endDrag = (s: number) => {
    const g = gesture.current;
    // A release over a window that is not the one in hand is not ours. Without
    // pointer capture (or with a second pointer) the up can land on a
    // neighbour, and falling through would wipe that neighbour's box back to
    // its anchor — a window nobody touched leaping across the stage.
    if (!g || g.slot !== s) return;
    gesture.current = null;
    setHeld(null);
    const el = slotRefs.current[s];
    // Let the bob breathe again from exactly where it was frozen: the class
    // was never taken off, the animation is still there — merely paused — so
    // unpausing continues its phase instead of restarting the cycle. This is
    // what keeps a plain click from making the pressed card leap the moment
    // the float starts running again.
    const shell = bobRefs.current[s];
    if (shell) shell.style.animationPlayState = "";
    // Persist the release point: the slot's new home until dragged again. A
    // press without movement is a click, not a drop: the window goes back to
    // exactly where it was — its stored home, or its anchor when never
    // placed — instead of being wiped to the anchor.
    if (g.moved) {
      // A placed card does not float, so the shell's frozen bob disappears
      // with this drop. Paying it into the home keeps the window painted on
      // exactly the pixel the pointer let go of: box + home replaces
      // shell-bob + box translate, one for one.
      const home = { x: g.x + g.bob.x, y: g.y + g.bob.y };
      if (el) {
        // Hand the value to React before the state update lands, so the frame
        // where ownership changes hands shows no jump at all.
        el.style.transform = `translate(${home.x}px, ${home.y}px)`;
      }
      setPlaced((previous) => {
        const next = [...previous];
        next[s] = home;
        return next;
      });
    } else if (el) {
      const home = placed[s];
      el.style.transform = home
        ? `translate(${home.x}px, ${home.y}px)`
        : "";
      el.style.transition = "";
    }
  };

  /**
   * Slots that run on the shared beat.
   *
   * A card with a conversation script is deliberately left out: it drives itself,
   * because only it knows how many turns the script has. Putting it on this
   * timer too would cut a 30-second conversation off every eight seconds — and
   * the symptom was worse than a restart, since the loop kept landing on the
   * same cards and their scripts never got past the first exchange.
   */
  const beatSlots = useMemo(
    () => cards.flatMap((card, index) => (card.thread ? [] : [index])),
    [cards],
  );

  /**
   * The loop: one window restarts per tick, round-robin, so each card's story
   * begins again every LOOP and the restarts are spread evenly across it.
   * A single shared timer rather than one per card is deliberate — one interval
   * to clean up, and no chance of two windows landing on the same tick.
   *
   * Restarting means remounting the card body, which rewinds its CSS
   * animations; the chrome, the position and anything half-dragged are all left
   * alone.
   */
  useEffect(() => {
    // A window in hand stops the clock entirely. Restarting rebuilds that card's
    // body, and a rebuild mid-drag is a dropped frame right where the user is
    // moving something — which is what made the two heaviest windows (weekly
    // tips and broadcasts, both chart-and-tables tall) judder as they moved.
    if (reduce || reading || held !== null || beatSlots.length === 0) return;
    const el = stageRef.current;
    // Only while the hero is actually on screen. Remounting six card bodies
    // every beat for a visitor who has scrolled past is work with nobody to see,
    // and it is work that lands the moment they scroll back.
    //
    // Starts optimistic and is corrected by the observer, not the other way
    // round: where the observer never reports — an old browser, a stubbed one —
    // the loop keeps running, which is the state a visitor actually wants. The
    // off-screen gate in `AnimGate` still holds the paint either way.
    if (!el) return;
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    const step = loopTickMs(beatSlots.length);
    const id = window.setInterval(() => {
      if (document.hidden || !onScreen) return;
      const slot = beatSlots[turn.current % beatSlots.length];
      turn.current += 1;
      setLoop((previous) => {
        const next = [...previous];
        next[slot] += 1;
        return next;
      });
    }, step);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [reduce, reading, held, beatSlots]);

  /**
   * The mobile carousel: hold the current window for `cardDuration`, then move
   * on. Keyed to the card rather than a fixed beat, which is what lets a
   * thirty-second conversation finish before the next one slides in.
   *
   * Skipped for a hidden tab, and only runs when the reduced-motion branch is
   * not rendering the static gallery instead.
   */
  useEffect(() => {
    if (reduce || document.hidden) return;
    const id = window.setTimeout(() => {
      setSlide((current) => (current + 1) % cards.length);
    }, cardDuration(cards[slide]));
    return () => window.clearTimeout(id);
  }, [reduce, slide, cards]);

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
                const isHeld = held === s;
                // The stored drop point. React owns this value, and the drag
                // writes over it imperatively mid-gesture and hands it back on
                // release — a ref is never read during render, so the position
                // has exactly one source of truth.
                const home = placed[s];
                // Stacking: the most recently grabbed slot sits on top (base
                // 20 keeps every slot above the dashboard at z-10; the held
                // window goes higher still while dragged).
                const stackZ = isHeld ? 100 : 20 + depth[s];
                return (
                  <div
                    key={`${slot.key}-${summon[s]}`}
                    ref={(el) => {
                      bobRefs.current[s] = el;
                    }}
                    onPointerDown={
                      canDrag ? (event) => beginDrag(event, s) : undefined
                    }
                    onPointerMove={
                      canDrag ? (event) => moveDrag(event, s) : undefined
                    }
                    onPointerUp={canDrag ? () => endDrag(s) : undefined}
                    onPointerCancel={canDrag ? () => endDrag(s) : undefined}
                    /*
                     * The shell's only job is the anchor and the bob, so its
                     * `transform` is left entirely to CSS. The period and
                     * phase below are this slot's own, which is what stops six
                     * windows breathing in unison; the drop position lives on
                     * the box inside, where an animation cannot overwrite it.
                     *
                     * It is deliberately *not* the hit region: a dropped
                     * window's box moves away from this anchor, and
                     * hit-testing the vacated rectangle would hand its clicks
                     * to whatever paints underneath — a ghost that steals from
                     * the card below. The box inside turns pointer events back
                     * on, so a window's hit region is exactly the pixels it
                     * paints.
                     */
                    style={{
                      animationDuration: slot.period,
                      animationDelay: slot.phase,
                      // Promoted only while moving: a permanent `will-change` on
                      // six windows would hold six compositor layers open for a
                      // drag that happens once in a while.
                      ...(isHeld ? { willChange: "transform" } : null),
                      zIndex: stackZ,
                    }}
                    className={cn(
                      "ph2-anim absolute hidden w-[320px] xl:w-[340px] lg:block pointer-events-none",
                      // Kept while held as well: beginDrag freezes the bob by
                      // pausing the animation, never by removing the class —
                      // taking it off and putting it back is what restarted the
                      // bob at another phase and made the card leap when a
                      // press turned out to be just a click.
                      !home && slot.float,
                      slot.className,
                      // select-none belongs to the whole gesture, not just its
                      // held phase: the first few pixels of a drag used to
                      // start a text selection before `held` landed.
                      canDrag && "select-none lg:cursor-grab lg:touch-pan-y",
                      // The "picked up" cue is a shadow, not a scale: it follows
                      // the window without touching its geometry, so there is
                      // nothing to snap back when it is put down.
                      isHeld &&
                        "lg:cursor-grabbing lg:drop-shadow-[0_20px_30px_rgba(11,18,32,0.22)]",
                    )}
                  >
                    <div className="ph2-pop-in" style={at(slot.enter)}>
                      <div
                        ref={(el) => {
                          slotRefs.current[s] = el;
                        }}
                        // `pointer-events` is inherited, so the shell's `none`
                        // would switch off this whole subtree too. Re-enabling
                        // it here is what makes the painted card — not the
                        // anchor rectangle behind it — the hit region, and it
                        // keeps every handler on the shell working: presses
                        // start on this box and bubble up.
                        className="pointer-events-auto"
                        style={
                          home
                            ? {
                                transform: `translate(${home.x}px, ${home.y}px)`,
                              }
                            : undefined
                        }
                      >
                        <PopupWindow
                          card={card}
                          loop={loop[s]}
                          phase={(s * LOOP) / SLOTS.length}
                          closeLabel={stage.popups.close}
                          onClose={() => toggleProduct(s)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/*
                Below `lg` there is no canvas to float on and no switchboard to
                pick from, so this collapses to a single window under the app
                that walks the six products by itself. `key` includes the slide
                index, so each arrival is a fresh window — its story starts from
                the top and its own phase keeps it off the beat the desktop
                windows are on.
              */}
              <div className="relative z-20 -mt-6 grid justify-items-center lg:hidden">
                <div
                  key={`slide-${slide}`}
                  className="ph2-pop-in w-[min(92vw,420px)]"
                >
                  {/*
                    No close control here, and deliberately so: this window
                    replaces itself, so an X would promise something the
                    carousel does not do. The traffic lights are chrome, as on a
                    window you are only watching.
                  */}
                  <PopupWindow
                    card={cards[slide]}
                    loop={0}
                    phase={(slide * LOOP) / SLOTS.length}
                  />
                </div>
              </div>
            </div>
          </AnimGate>
        )}
      </div>
    </div>
  );
}
