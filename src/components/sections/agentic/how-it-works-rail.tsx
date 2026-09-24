"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type HowItWorksStep = {
  key: string;
  index: string;
  title: string;
  body: string;
  hint: string;
};

/**
 * Sticky left rail + scrolling cards with a synced visual stage.
 *
 * Mobile: compact stage sits *inside* the cards column and sticks under the
 * 64px navbar — the column is tall (cards), so sticky has real travel and
 * releases when the section ends. A stage as a sibling grid row would only
 * be as tall as itself (no sticky range).
 *
 * Desktop: stage in the right column, sticky at top-24.
 *
 * Section must NOT use overflow-hidden (cancels sticky).
 */
export function HowItWorksRail({
  steps,
  labels,
  footnote,
}: {
  steps: HowItWorksStep[];
  labels: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    body: string;
    nav: string;
    stageLabel: string;
  };
  footnote: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const stepKeys = steps.map((s) => s.key).join("|");

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
    if (cards.length === 0) return;

    // Scroll-position tracking instead of IntersectionObserver: a sticky
    // stage overlays cards and skews IO ratios, so the mobile stage never
    // advanced past step 01. Aim point sits just under the sticky stage
    // on small screens, mid-viewport on desktop.
    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      // Below navbar (64px) + compact sticky stage (~140px) on mobile.
      const target = mobile
        ? window.innerHeight * 0.42
        : window.innerHeight * 0.45;

      let best = 0;
      let bestScore = Number.POSITIVE_INFINITY;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        // Bias toward the top of the card as it crosses the aim line.
        const anchor = rect.top + Math.min(rect.height * 0.3, 80);
        const dist = Math.abs(anchor - target);
        // Prefer cards already above the aim line once past it.
        const score = dist + (rect.top > target ? 100 : 0);
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stepKeys]);

  const fillPct = steps.length <= 1 ? 100 : (active / (steps.length - 1)) * 100;
  const activeStep = steps[active] ?? steps[0];
  const stage = (
    <StagePanel
      stageLabel={labels.stageLabel}
      stepKey={activeStep?.key ?? "chat"}
      index={activeStep?.index ?? "01"}
      total={steps.length}
      active={active}
      stepCount={steps.length}
    />
  );

  return (
    <section className="relative bg-white py-14 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div
        aria-hidden
        className="surface-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
            {labels.eyebrow}
          </p>
          <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {labels.headingLead}{" "}
            <span className="text-primary">{labels.headingAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {labels.body}
          </p>
        </div>

        {/* min-w-0: nowrap chips must not stretch grid columns past 100vw. */}
        <div className="mt-8 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Desktop-only stage column */}
          <div className="hidden min-w-0 lg:order-2 lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-24 lg:h-fit">{stage}</div>
          </div>

          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            {/* Mobile sticky stage — parent is this column (stage + cards),
                so sticky travels until the section ends. */}
            <div className="sticky top-16 z-20 -mx-1 mb-3 bg-white/95 px-1 pb-1 backdrop-blur-sm lg:hidden">
              {stage}
            </div>

            <nav aria-label={labels.nav} className="mb-4 min-w-0 lg:mb-6">
              <div className="relative flex w-full max-w-full gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:gap-4 lg:overflow-visible lg:pb-0 lg:pl-8 [&::-webkit-scrollbar]:hidden">
                <span aria-hidden className="chapter-rail-line hidden lg:block" />
                <span
                  aria-hidden
                  className="chapter-rail-fill hidden lg:block"
                  style={{ height: `calc((100% - 1.1rem) * ${fillPct / 100})` }}
                />
                <ul className="flex gap-2 lg:flex-col lg:gap-4">
                  {steps.map((step, index) => {
                    const isActive = index === active;
                    return (
                      <li key={step.key} className="relative shrink-0">
                        <span
                          aria-hidden
                          className={cn(
                            "absolute top-2 -left-8 hidden size-3 rounded-full ring-4 ring-white transition-all duration-500 lg:block",
                            isActive
                              ? "scale-125 bg-primary shadow-[0_0_0_4px_rgba(19,82,191,0.18)]"
                              : "bg-foreground/20",
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            listRef.current
                              ?.querySelector<HTMLElement>(
                                `[data-step="${step.key}"]`,
                              )
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            setActive(index);
                          }}
                          className={cn(
                            "group flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-left transition-colors duration-300 lg:w-full lg:flex-col lg:items-start lg:gap-0.5 lg:rounded-none lg:border-0 lg:px-0 lg:py-0",
                            isActive
                              ? "border-primary/40 bg-primary/10 text-primary lg:bg-transparent"
                              : "border-foreground/10 bg-white text-subtle-foreground hover:border-primary/30 hover:text-foreground",
                          )}
                        >
                          <span className="font-numeric text-[0.68rem] font-bold tracking-[0.16em]">
                            {step.index}
                          </span>
                          <span
                            className={cn(
                              "font-numeric text-sm leading-snug font-semibold tracking-[-0.02em] transition-transform duration-300",
                              isActive && "lg:translate-x-1",
                            )}
                          >
                            {step.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            <ol ref={listRef} className="flex min-w-0 flex-col gap-4 lg:gap-5">
              {steps.map((step, index) => (
                <li key={step.key} data-step={step.key}>
                  <div
                    className={cn(
                      "transition-all duration-500",
                      index === active ? "animate-step-in" : "opacity-65",
                    )}
                  >
                    <article
                      onClick={() => setActive(index)}
                      className={cn(
                        "w-full max-w-full cursor-pointer rounded-[1.5rem] border p-5 transition-all duration-500 sm:p-6 md:p-7",
                        index === active
                          ? "border-primary/30 bg-white shadow-[0_24px_50px_-36px_rgba(19,82,191,0.45)]"
                          : "border-foreground/10 bg-white/70 hover:border-primary/20",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-numeric text-[0.7rem] font-bold tracking-[0.18em] text-primary">
                          STEP {step.index}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full font-numeric text-sm font-bold transition-colors duration-400",
                            index === active
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          {step.index}
                        </span>
                      </div>
                      <h3 className="mt-4 font-numeric text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground md:text-base">
                        {step.body}
                      </p>
                      <p className="mt-4 inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-[0.78rem] font-medium text-primary">
                        {step.hint}
                      </p>
                    </article>
                  </div>
                </li>
              ))}
              <li className="pt-1 text-center text-sm text-subtle-foreground sm:text-left">
                {footnote}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Shared stage chrome — compact on mobile (sticky), roomier on desktop. */
function StagePanel({
  stageLabel,
  stepKey,
  index,
  total,
  active,
  stepCount,
}: {
  stageLabel: string;
  stepKey: string;
  index: string;
  total: number;
  active: number;
  stepCount: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-ink-void p-3 text-white shadow-[0_24px_50px_-36px_rgba(16,24,40,0.7)] sm:p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5 md:pb-3">
        <span className="font-numeric text-[0.65rem] font-semibold tracking-[0.16em] text-sky-300 uppercase">
          {stageLabel}
        </span>
        <span className="font-numeric text-[0.65rem] text-white/45">
          {index} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2.5 min-h-[8.5rem] sm:min-h-[10rem] md:mt-3 md:min-h-[18rem]">
        {/* key forces remount so animate-swap-in re-runs on every step change */}
        <StepStage key={stepKey} stepKey={stepKey} />
      </div>
      <div className="mt-2.5 flex gap-1.5 border-t border-white/10 pt-2.5 md:mt-3 md:pt-3">
        {Array.from({ length: stepCount }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              i === active ? "bg-sky-400" : "bg-white/15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Pure-CSS micro-UI for each step — no extra network assets. */
function StepStage({ stepKey }: { stepKey: string }) {
  if (stepKey === "crm") {
    return (
      <div className="animate-swap-in space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
          <p className="font-numeric text-[0.65rem] tracking-[0.14em] text-sky-300/80 uppercase">
            Pipeline
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Lead", "Demo", "Won"].map((col, i) => (
              <div
                key={col}
                className={cn(
                  "rounded-lg border p-2 text-[0.7rem]",
                  i === 2
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-white/10 bg-white/5 text-white/70",
                )}
              >
                {col}
                <div className="mt-2 space-y-1.5">
                  <div className="h-6 rounded bg-white/10" />
                  <div
                    className={cn(
                      "h-6 rounded",
                      i === 0 ? "bg-primary/40" : "bg-white/8",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white/70">
          Contact auto-saved · stage updated · no manual entry
        </div>
      </div>
    );
  }

  if (stepKey === "mini") {
    return (
      <div className="animate-swap-in space-y-3">
        {[
          { label: "FAQ agent", on: true },
          { label: "Lead cleaner", on: true },
          { label: "Shipping bot", on: false },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
          >
            <span className="text-sm text-white/85">{row.label}</span>
            <span
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                row.on ? "bg-primary" : "bg-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-all",
                  row.on ? "left-[1.35rem]" : "left-0.5",
                )}
              />
            </span>
          </div>
        ))}
        <p className="text-xs text-white/50">No-code · live in minutes</p>
      </div>
    );
  }

  if (stepKey === "consulting") {
    return (
      <div className="animate-swap-in space-y-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
          <p className="font-numeric text-[0.65rem] tracking-[0.14em] text-sky-300/80 uppercase">
            Insight
          </p>
          <p className="mt-2 text-sm leading-snug text-white/85">
            Weekend chats convert 2.1× higher — shift broadcast to Sat 10:00.
          </p>
        </div>
        <div className="flex gap-2">
          {[40, 65, 55, 90, 70, 95, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-linear-to-t from-primary to-sky-400/80"
              style={{ height: `${h}px`, opacity: 0.45 + i * 0.07 }}
            />
          ))}
        </div>
        <p className="text-xs text-white/50">From your data · next step suggested</p>
      </div>
    );
  }

  if (stepKey === "marketing") {
    return (
      <div className="animate-swap-in space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { k: "ROAS", v: "4.2×" },
            { k: "Leads", v: "+38%" },
          ].map((m) => (
            <div
              key={m.k}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
            >
              <p className="text-[0.7rem] text-white/50">{m.k}</p>
              <p className="mt-1 font-numeric text-2xl font-semibold text-sky-300">
                {m.v}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Broadcast · VIP segment</span>
            <span className="text-emerald-300">Sent</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-linear-to-r from-primary to-sky-400" />
          </div>
        </div>
        <p className="text-xs text-white/50">Ads → chat → sale loop closed</p>
      </div>
    );
  }

  // chat (default)
  return (
    <div className="animate-swap-in space-y-3">
      <div className="space-y-2.5">
        {[
          { who: "Customer", text: "Masih ready size M?", me: false },
          { who: "AI", text: "Ready! M warna navy. Mau saya reserve?", me: true },
          { who: "Customer", text: "Boleh, jam 5 sore ambil.", me: false },
        ].map((msg, i) => (
          <div
                key={i}
                className={cn(
                  "flex min-w-0",
                  msg.me ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "min-w-0 max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.82rem] leading-snug break-words",
                    msg.me
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md border border-white/10 bg-white/8 text-white/85",
                  )}
                >
              <span
                className={cn(
                  "mb-0.5 block font-numeric text-[0.6rem] tracking-wide",
                  msg.me ? "text-white/65" : "text-white/45",
                )}
              >
                {msg.who}
              </span>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
        <span className="animate-pulse-soft size-1.5 rounded-full bg-sky-400" />
        <span className="text-xs text-white/45">AI typing · 24/7 inbox</span>
      </div>
    </div>
  );
}
