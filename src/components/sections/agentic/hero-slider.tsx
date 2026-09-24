"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { mdiWhatsapp } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  HeroSlide,
  HeroSliderCopy,
} from "@/components/sections/agentic/hero-slides";
import { HeroCollage } from "@/components/sections/agentic/hero-collage";

type SlideDot = {
  key: string;
  label: string;
};

/** Static suite labels under the lede — context, not navigation. */
const PRODUCT_SUITE = [
  "CRM",
  "Mini Agent",
  "OMS",
  "Cekat Marketing",
  "Consulting Agent",
] as const;

/**
 * Slide picker — manual only (never auto-advances).
 *
 * One pair of arrows, responsive placement: page gutters on md+, compact
 * strip under the CTAs on small screens. Never sits on the collage.
 */
export function SlideDots({
  slides,
  index,
  onSelect,
  label,
  className,
}: {
  slides: SlideDot[];
  index: number;
  onSelect: (next: number) => void;
  /** `<nav aria-label>` — pass `copy.navLabel`. */
  label: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const count = slides.length;
  const pick = (to: number) => onSelect((to + count) % count);

  return (
    <nav
      aria-label={label}
      data-hero-slide-dots="arrows"
      className={cn(
        "z-20 flex items-center justify-between gap-4",
        // Small screens: compact row under the CTAs.
        // md+: dock to the page gutters beside the hero block (not on the collage).
        "mx-auto mt-5 w-full max-w-[16rem]",
        "md:pointer-events-none md:absolute md:top-1/2 md:right-0 md:left-0 md:mt-0 md:max-w-none md:-translate-y-1/2 md:px-3 lg:px-6 xl:px-10",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => pick(index - 1)}
        className="pointer-events-auto grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95 motion-reduce:transition-none lg:size-14"
      >
        <ChevronLeft aria-hidden className="size-6 lg:size-7" strokeWidth={2.4} />
      </button>

      {/* Slide position — readable cue in the middle of the strip on mobile. */}
      <span
        aria-hidden
        className="font-numeric text-xs text-white/60 tabular-nums md:hidden"
      >
        {index + 1} / {count}
      </span>
      {/* Spacer keeps arrows pinned to the gutters on desktop. */}
      <span aria-hidden className="hidden flex-1 md:block" />

      <button
        type="button"
        aria-label="Next slide"
        onClick={() => pick(index + 1)}
        className="pointer-events-auto grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95 motion-reduce:transition-none lg:size-14"
      >
        <ChevronRight aria-hidden className="size-6 lg:size-7" strokeWidth={2.4} />
      </button>
    </nav>
  );
}

/**
 * Two-column homepage hero content: manual (never auto-advancing) product
 * slides on the left, staged phone demo on the right.
 *
 * All copy arrives as props from the server half (`Hero`) — this component
 * only owns the active index and must not call `agentic.hero.slides.*`.
 */
export function HeroSlider({ copy }: { copy: HeroSliderCopy }) {
  const [index, setIndex] = useState(0);
  // +1 next / -1 previous — drives enter offset without autoplay.
  const [direction, setDirection] = useState(1);
  const slideCount = copy.slides.length;
  const active = copy.slides[Math.min(index, slideCount - 1)] as HeroSlide;

  const dots: SlideDot[] = copy.slides.map((slide) => ({
    key: slide.key,
    label: slide.stageLabel,
  }));

  /** Jump to a slide (dot click). Direction = shortest path around the rail. */
  const goTo = (to: number) => {
    if (to === index || to < 0 || to >= slideCount) return;
    const forward = (to - index + slideCount) % slideCount;
    setDirection(forward <= slideCount / 2 ? 1 : -1);
    setIndex(to);
  };

  return (
    <div className="relative">
      {/* Compact keynote copy so the product collage stays high in the fold. */}
      <div className="hero-stagger mx-auto flex max-w-3xl flex-col items-center text-center">
        <p
          key={`eyebrow-${active.key}`}
          data-slide-dir={direction}
          className="hero-slide-fade mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-400/12 px-3 py-1 font-numeric text-[0.65rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur"
        >
          <span
            aria-hidden
            className="animate-pulse-soft size-1.5 rounded-full bg-sky-300"
          />
          {active.eyebrow}
        </p>

        {/* LCP candidate: fully opaque in the first paint (no opacity-from-0). */}
        <div
          key={`copy-${active.key}`}
          data-slide-dir={direction}
          className="hero-slide"
        >
          <h1 className="mx-auto max-w-[32ch] text-[clamp(1.45rem,3.6vw,2.1rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-white">
            {active.titleLead}
            {active.titleAccent ? (
              <>
                {" "}
                <span className="bg-linear-to-r from-sky-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {active.titleAccent}
                </span>
              </>
            ) : null}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-sky-50/85 sm:text-base">
            {active.subtitle}
          </p>

          {/* Product suite context — static labels, not interactive pills. */}
          <p
            aria-label="Product suite"
            className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-1 font-numeric text-[0.68rem] tracking-[0.08em] text-sky-200/70 uppercase"
          >
            {PRODUCT_SUITE.map((name, i) => (
              <span key={name} className="inline-flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="text-sky-300/40">
                    ·
                  </span>
                ) : null}
                {name}
              </span>
            ))}
          </p>
        </div>

        {/* Same pairing and order as the navbar: WhatsApp filled, trial
            outlined. Repeating the nav's hierarchy means a visitor who
            scrolled past the header meets the same primary action. */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full bg-white px-6 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.4)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-sky-50 active:scale-[0.98] motion-reduce:transition-none sm:h-13 sm:px-8"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <SafeIcon icon={mdiWhatsapp} className="size-4" size="1rem" />
            {copy.ctaPrimary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-sky-300/40 bg-sky-400/10 px-6 text-sm text-white backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-sky-200/70 hover:bg-sky-400/20 active:scale-[0.98] motion-reduce:transition-none sm:h-13 sm:px-8"
            nativeButton={false}
            render={<AppAnchor href={REGISTER_URL} />}
          >
            {copy.ctaSecondary}
          </Button>
        </div>

        {/* Mobile: compact strip under CTAs. md+: same pair docks to page gutters. */}
        <SlideDots
          slides={dots}
          index={index}
          onSelect={goTo}
          label={copy.navLabel}
        />
      </div>

      {/* Product stage — every slide is the live collage; `focus` lifts the
          product window for that slide (no flat screenshots). */}
      <div
        key={`stage-${active.key}`}
        data-slide-dir={direction}
        className="hero-slide-art relative mx-auto mt-6 w-full max-w-5xl sm:mt-8 lg:max-w-[58rem] xl:max-w-[64rem]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/40 blur-3xl"
        />
        <HeroCollage focus={active.key} />
      </div>
    </div>
  );
}
