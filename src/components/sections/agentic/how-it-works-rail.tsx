"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ProductMockFor } from "@/components/sections/agentic/product-ui";

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

/** Shared stage chrome — product UI frame (incident.io language). */
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
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-32px_rgba(12,17,29,0.28)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#0C111D]/[0.06] bg-[#F6F7F9] px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#667085] uppercase">
          <span aria-hidden className="flex gap-1">
            <span className="size-2 rounded-full bg-[#FF5F57]" />
            <span className="size-2 rounded-full bg-[#FEBC2E]" />
            <span className="size-2 rounded-full bg-[#28C840]" />
          </span>
          {stageLabel}
        </span>
        <span className="font-numeric text-[0.7rem] text-[#98A2B3]">
          {index} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="min-h-[8.5rem] sm:min-h-[10rem] md:min-h-[18rem]">
        {/* key forces remount so animate-swap-in re-runs on every step change */}
        <div key={stepKey} className="animate-swap-in h-full">
          <ProductMockFor kind={stepKey} />
        </div>
      </div>
      <div className="flex gap-1.5 border-t border-[#0C111D]/[0.06] px-4 py-2.5">
        {Array.from({ length: stepCount }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              i === active ? "bg-primary" : "bg-[#0C111D]/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}
