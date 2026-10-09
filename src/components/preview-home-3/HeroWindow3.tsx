"use client";

import { useEffect, useRef, useState } from "react";
import { Ico } from "./Icon";
import {
  solar_alt_arrow_up_bold,
  solar_bag_3_bold,
  solar_check_circle_bold,
  solar_check_read_bold,
  solar_global_bold,
  solar_users_group_rounded_bold,
  solar_verified_check_bold,
} from "./icons";
import { HERO_STATS, HERO_VIEWS } from "./content";
import { useReducedMotion } from "./useReducedMotion";
import { ChatPlayback } from "./ChatPlayback3";
import { Sparkline } from "./Charts";

/**
 * The hero's product window.
 *
 * It cycles through four views, one per capability the product actually has —
 * inbox, customer profile, order, campaign — rather than sitting on a single
 * static screenshot. A static mock says "screenshot"; a cycling one says
 * "product", and it lets the hero carry the whole feature story inside the
 * first viewport instead of making the visitor scroll to learn what it does.
 *
 * Accessibility, which is the part that is easy to get wrong here:
 *
 *   - An animation that changes on its own and runs longer than five seconds
 *     needs a pause mechanism (WCAG 2.2.2). There is a real button, in the tab
 *     order, with a label that changes with the state — not a hover-only
 *     affordance, and not something only reachable with a mouse.
 *   - It also pauses on hover and on keyboard focus inside the frame, so
 *     nothing moves while someone is reading or tabbing through it.
 *   - `prefers-reduced-motion` does not merely slow this down: the loop never
 *     starts, and the first view is rendered in its final state. The dots
 *     remain, because they are navigation, not decoration — they let anyone
 *     reach the other views deliberately.
 *
 * Content is bilingual and switches with the page. Nothing here is invented
 * telemetry: every figure is one the page already shows elsewhere.
 */
/**
 * How long each view holds.
 *
 * 11s, and it went up because 6s was too fast to read anything. It also has to
 * clear the inbox conversation's 10.4s cycle, or the rotation severs the last
 * turn — the action the product took — before its source note appears. Both
 * constraints land in the same place, and the second is the easy one to miss,
 * because a truncated conversation still looks like a working demo at a glance.
 *
 * The per-view cycles below divide into it: 3 × 3.5s for the inbox and profile,
 * 4 × 2.6s for the order's four steps.
 */
const DWELL = 11000;

/** One cycle step of whichever view is on screen. */
const CYCLE = {
  inbox: 3500,
  profile: 3500,
  order: 2600,
  campaign: 5500,
} as const;

/**
 * A timer that advances `length` steps and wraps.
 *
 * `frozen` is the window's single pause state, so one button stops the view
 * rotation, the internal cycles and the conversation together — three loops on
 * one flag, or they drift apart the moment someone pauses.
 *
 * Nothing is scheduled under reduced motion and the step stays at 0, which is
 * why every view's first entry has to be a complete readable state rather than
 * an empty one waiting for a tick.
 */
function useCycle(length: number, ms: number, frozen: boolean): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (frozen || length <= 1) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [length, ms, frozen]);

  return step;
}

export function HeroWindow3({
  isEn,
}: {
  isEn: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const frameRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced || paused) return;

    timer.current = window.setTimeout(() => {
      setIndex((current) => (current + 1) % HERO_VIEWS.length);
    }, DWELL);

    return () => window.clearTimeout(timer.current);
  }, [index, paused, reduced]);

  // Crossfade with the Web Animations API rather than GSAP: this is a discrete
  // view change on a timer, not a scroll-linked sequence, so it needs no
  // ScrollTrigger and no shared ticker. CSS transitions on opacity would fight
  // the class swap; an explicit animation reads the previous state first.
  useEffect(() => {
    if (reduced) return;
    const incoming = panelRefs.current[index];
    if (!incoming) return;
    incoming.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [index, reduced]);

  const view = HERO_VIEWS[index];
  const url = isEn ? view.urlEn : view.url;

  return (
    <div
      ref={frameRef}
      className="ph3-window"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="ph3-window-bar">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
        </span>
        <span className="ph3-window-url">{url}</span>

        {/*
          The pause control. `aria-pressed` carries the state, and the accessible
          name says what the button will do next rather than what the animation
          currently is.
        */}
        {!reduced ? (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            className="grid h-5 w-5 shrink-0 place-items-center rounded-[var(--ph3-r-xs)] border border-[var(--ph3-line)] text-[var(--ph3-muted-2)] transition-colors duration-150 hover:border-[var(--ph3-line-3)] hover:text-[var(--ph3-ink)]"
          >
            <span className="sr-only">
              {paused
                ? isEn
                  ? "Play product demo"
                  : "Putar demo produk"
                : isEn
                  ? "Pause product demo"
                  : "Jeda demo produk"}
            </span>
            <span aria-hidden className="flex items-center gap-[2px]">
              {paused ? (
                <>
                  <span className="h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current" />
                </>
              ) : (
                <>
                  <span className="h-[7px] w-[2px] rounded-[1px] bg-current" />
                  <span className="h-[7px] w-[2px] rounded-[1px] bg-current" />
                </>
              )}
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-b border-[var(--ph3-line)] px-4 py-3">
        <p className="ph3-mono text-[0.625rem] text-[var(--ph3-ink)]">
          {(isEn ? view.titleEn : view.title) ?? ""}
        </p>
        <span className="ph3-chip ph3-chip-accent h-5">
          <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
          {isEn ? "Live" : "Aktif"}
        </span>
      </div>

      {/*
        Only the visible view is mounted. Keeping the others out of the DOM
        means a screen reader is never handed four stacked panels to
        disambiguate, and the crossfade cannot leak a half-transparent copy.
      */}
      {/*
        Sized to the tallest view, measured rather than estimated: a full
        four-turn conversation with both source notes comes to 262px of bubbles,
        which is 330px including the header row and padding. At `min-h` the box
        grew to fit that and shrank back on the next view, so the window jumped
        472 → 510px under the visitor's eye every time the inbox appeared.

        Fixed height instead of minimum: the panel changes, the frame does not.
        Each view fills and centres inside it, so a shorter view reads as
        deliberately centred rather than as a gap.
      */}
      <div className="relative h-[21rem]">
        <div
          ref={(node) => {
            panelRefs.current[index] = node;
          }}
        >
          {view.key === "inbox" ? (
            // The inbox view plays the conversation instead of listing it. The
            // pause and reduced-motion state belong to the window, so the one
            // control stops both the view rotation and the chat inside it.
            <ChatPlayback isEn={isEn} paused={paused} reduced={reduced} />
          ) : (
            <ViewPanel
              key={view.key}
              view={view}
              isEn={isEn}
              frozen={paused || reduced}
            />
          )}
        </div>
      </div>

      {/*
        The headline figures, kept from the original static window. They are
        proof, so they stay put while the panel above them changes — the number
        the visitor takes away should not move.
      */}
      <dl className="grid grid-cols-3 border-t border-[var(--ph3-line)]">
        {HERO_STATS.map((stat) => (
          <div
            key={stat.labelEn}
            className="border-l border-[var(--ph3-line)] px-3 py-3 first:border-l-0"
          >
            <dt className="sr-only">{isEn ? stat.labelEn : stat.label}</dt>
            <dd>
              <span className="block text-[0.9375rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
                {isEn ? stat.valueEn : stat.value}
              </span>
              <span className="mt-1 block text-[0.625rem] leading-snug text-[var(--ph3-muted-2)]">
                {isEn ? stat.labelEn : stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Real navigation between views, not decoration. */}
      <div className="flex items-center gap-2 border-t border-[var(--ph3-line)] px-4 py-2.5">
        <ul className="flex flex-1 items-center gap-1.5 list-none">
          {HERO_VIEWS.map((entry, i) => (
            <li key={entry.key}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                className={`block h-1 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 bg-[var(--ph3-accent)]"
                    : "w-1.5 bg-[var(--ph3-line-2)] hover:bg-[var(--ph3-line-3)]"
                }`}
              >
                <span className="sr-only">
                  {isEn ? entry.titleEn : entry.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="ph3-mono text-[0.5625rem] text-[var(--ph3-muted-3)]">
          {String(index + 1).padStart(2, "0")}/{String(HERO_VIEWS.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

type View = (typeof HERO_VIEWS)[number];

/**
 * One view, narrowed to the member that carries its data.
 *
 * `HERO_VIEWS` is a heterogeneous tuple, so `View` is a *union* of four shapes
 * and `view.facts` does not exist on the inbox member. `ViewPanel` narrows it
 * correctly with a `switch`, but a sub-component typed as the whole `View` gets
 * the union back and every property access fails. Taking `Extract<...>` makes
 * each sub-component state which view it renders, so `ProfileView` cannot be
 * handed the order view even by mistake.
 */
type ViewOf<K extends View["key"]> = Extract<View, { key: K }>;

/**
 * One view's body. Every branch is interface drawn in code — the same decision
 * that removed the four landscape illustrations. Avatars stay a neutral glyph:
 * an initials monogram asserts a likeness that does not exist.
 */
function ViewPanel({
  view,
  isEn,
  frozen,
}: {
  view: View;
  isEn: boolean;
  /** Reduced motion or the pause control: nothing below this point may tick. */
  frozen: boolean;
}) {
  /*
   * One hook call, before the switch.
   *
   * Calling `useCycle` inside each `case` would be four conditional hook calls:
   * the order changes with the view, and React would carry the wrong state
   * across the swap. The caller passes `key={view.key}`, so this component
   * remounts per view and the step always begins at 0 — a view cannot arrive
   * halfway through someone else's cycle.
   */
  const step = useCycle(...cycleSpec(view), frozen);

  switch (view.key) {
    case "inbox":
      return <InboxView isEn={isEn} view={view} step={step} />;
    case "profile":
      return <ProfileView view={view} isEn={isEn} step={step} />;
    case "order":
      return <OrderView view={view} isEn={isEn} step={step} />;
    case "campaign":
      return <CampaignView view={view} isEn={isEn} step={step} />;
  }
}

/** How many steps this view has, and how long each one holds. */
function cycleSpec(view: View): [length: number, ms: number] {
  switch (view.key) {
    case "inbox":
      return [view.batches.length, CYCLE.inbox];
    case "profile":
      return [view.facts.length, CYCLE.profile];
    case "order":
      return [view.statusByStep.length, CYCLE.order];
    case "campaign":
      return [view.campaign.length, CYCLE.campaign];
  }
}

function Row({
  icon,
  name,
  body,
  status,
}: {
  icon: typeof solar_check_read_bold;
  name: string;
  body: string;
  status: string;
}) {
  return (
    <li className="flex gap-3 px-4 py-3.5">
      <span
        aria-hidden
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] bg-[var(--ph3-surface)] text-[var(--ph3-muted-3)]"
      >
        <Ico icon={icon} size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-medium text-[var(--ph3-ink)]">
          {name}
        </span>
        <span className="mt-1 block text-[0.8125rem] leading-snug text-[var(--ph3-muted)]">
          {body}
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[0.6875rem] text-[var(--ph3-muted-2)]">
          <Ico
            icon={solar_check_circle_bold}
            size={12}
            className="text-[var(--ph3-accent)]"
          />
          {status}
        </span>
      </span>
    </li>
  );
}

function InboxView({
  isEn,
  view,
  step,
}: {
  isEn: boolean;
  view: ViewOf<"inbox">;
  /** Which page of the queue is showing. */
  step: number;
}) {
  // The English hero was showing Indonesian rows. Every other view carries a
  // `*En` twin for exactly this reason; the inbox was the one that did not, and
  // an unused `isEn` prop was the only symptom.
  const pages = isEn ? view.batchesEn : view.batches;
  const rows = pages[step % pages.length];
  return (
    <ul className="divide-y divide-[var(--ph3-line)]">
      {rows.map((row) => (
        <Row
          key={row.who}
          icon={solar_check_read_bold}
          name={row.who}
          body={row.msg}
          status={row.chip}
        />
      ))}
    </ul>
  );
}

/**
 * Icon per profile row.
 *
 * The content object carries a key, not an icon reference — copy files must stay
 * plain data with no React import, and `tsc` cannot check a component's icon set
 * from there. The union is closed, so an unknown key is a compile error rather
 * than an `undefined` reaching `<svg viewBox={icon.width}>` at runtime, which is
 * exactly how this view first crashed.
 */
const FACT_ICONS: Record<
  "tier" | "pin" | "heart" | "repeat",
  typeof solar_verified_check_bold
> = {
  tier: solar_verified_check_bold,
  pin: solar_global_bold,
  heart: solar_check_circle_bold,
  repeat: solar_alt_arrow_up_bold,
};

/**
 * A customer profile assembled from the conversation rather than typed in. The
 * "dari chat" provenance tag is the point of the view — it is what the product
 * claims, shown rather than asserted.
 */
function ProfileView({
  view,
  isEn,
  step,
}: {
  view: ViewOf<"profile">;
  isEn: boolean;
  /** Which assembled profile is showing. */
  step: number;
}) {
  const sets = isEn ? view.factsEn : view.facts;
  const facts = sets[step % sets.length];
  return (
    <div className="flex h-full flex-col justify-center px-4 py-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] bg-[var(--ph3-surface)] text-[var(--ph3-muted-3)]"
        >
          <Ico icon={solar_users_group_rounded_bold} size={17} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.875rem] font-medium text-[var(--ph3-ink)]">
            {facts.name}
          </p>
          <p className="ph3-mono mt-1 text-[0.5625rem]">
            {isEn ? "Lifetime value" : "Nilai seumur hidup"}
          </p>
        </div>
        <span className="ml-auto text-right">
          <span className="block text-[1.125rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
            {facts.ltv}
          </span>
          <span className="mt-0.5 block text-[0.625rem] text-[var(--ph3-muted-2)]">
            {isEn ? "12 orders" : "12 order"}
          </span>
        </span>
      </div>

      <dl className="mt-4 border-t border-[var(--ph3-line)]">
        {facts.rows.map((fact) => (
          <div
            key={fact.label}
            className="flex items-baseline justify-between gap-4 border-b border-[var(--ph3-line)] py-2.5 last:border-b-0"
          >
            <dt className="flex items-center gap-2 text-[0.75rem] text-[var(--ph3-muted)]">
              <Ico
                icon={FACT_ICONS[fact.icon]}
                size={13}
                className="text-[var(--ph3-muted-3)]"
              />
              {fact.label}
            </dt>
            <dd className="flex items-center gap-2 text-[0.75rem] font-medium tabular-nums text-[var(--ph3-ink)]">
              {fact.value}
              {/* Provenance: where this row came from. */}
              <span className="ph3-chip h-4 px-1.5 text-[0.5rem]">
                {isEn ? "from chat" : "dari chat"}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** An order that was closed inside the conversation. */
function OrderView({
  view,
  isEn,
  step,
}: {
  view: ViewOf<"order">;
  isEn: boolean;
  /** How far the order has progressed, 0-based. */
  step: number;
}) {
  const o = isEn ? view.orderEn : view.order;
  const steps = isEn ? view.stepsEn : view.steps;
  // One status per step, so the label and the bar always describe the same
  // moment. Indexed from `step`, which is why both live off the same number.
  const status = view.statusByStep[step % view.statusByStep.length];
  const reached = (step % view.statusByStep.length) + 1;

  return (
    <div className="flex h-full flex-col justify-center px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="ph3-mono text-[0.5625rem]">
            {isEn ? "Order" : "Pesanan"} · {o.id}
          </p>
          <p className="mt-1.5 truncate text-[0.9375rem] font-medium tracking-tight text-[var(--ph3-ink)]">
            {o.title}
          </p>
        </div>
        <span className="shrink-0 text-right">
          <span className="block text-[1.125rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
            {o.total}
          </span>
          <span className="mt-0.5 block text-[0.625rem] text-[var(--ph3-accent)]">
            {isEn ? status.en : status.id}
          </span>
        </span>
      </div>

      <ol className="mt-4 flex list-none gap-1.5">
        {steps.map((label, i) => (
          <li key={label} className="flex-1">
            <span
              className={`block h-1 rounded-full ${
                i < reached
                  ? "bg-[var(--ph3-accent)]"
                  : "bg-[var(--ph3-line-2)]"
              }`}
            />
            <span className="mt-2 block text-[0.625rem] leading-snug text-[var(--ph3-muted-2)]">
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-center gap-2.5 rounded-[var(--ph3-r)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-3 py-2.5">
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-white text-[var(--ph3-accent)]"
        >
          <Ico icon={solar_bag_3_bold} size={13} />
        </span>
        <p className="text-[0.75rem] leading-snug text-[var(--ph3-muted)]">
          {o.note}
        </p>
      </div>
    </div>
  );
}

/** A segment broadcast, with the response rate it produced. */
function CampaignView({
  view,
  isEn,
  step,
}: {
  view: ViewOf<"campaign">;
  isEn: boolean;
  /** Which send is being reported. */
  step: number;
}) {
  const sends = isEn ? view.campaignEn : view.campaign;
  const c = sends[step % sends.length];
  return (
    <div className="flex h-full flex-col justify-center px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="ph3-mono text-[0.5625rem]">
            {isEn ? "Broadcast" : "Broadcast"}
          </p>
          <p className="mt-1.5 truncate text-[0.9375rem] font-medium tracking-tight text-[var(--ph3-ink)]">
            {c.name}
          </p>
        </div>
        <span className="ph3-chip ph3-chip-accent h-5 shrink-0">
          {c.status}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--ph3-r)] border border-[var(--ph3-line)] bg-[var(--ph3-line)]">
        {c.metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-[var(--ph3-white)] px-3 py-2.5"
          >
            <dt className="ph3-mono text-[0.5rem]">{metric.label}</dt>
            <dd className="mt-1.5 text-[1rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <p className="ph3-mono text-[0.5rem]">
          {isEn ? "Responses today" : "Respons hari ini"}
        </p>
        <Sparkline className="mt-2" height={30} points={c.trend} />
      </div>
    </div>
  );
}