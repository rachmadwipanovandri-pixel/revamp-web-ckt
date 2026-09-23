"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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

// Phone demo is ~70KB of client JS + Lucide icons; LCP is the left-hand
// copy, not the stage. Split it out of the critical hydration chunk.
const HeroChatDemo = dynamic(
  () =>
    import("@/components/sections/home/hero-chat-demo").then((m) => ({
      default: m.HeroChatDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="aspect-[9/16] w-full animate-pulse rounded-[1.55rem] bg-white/8 sm:aspect-[4/5]"
      />
    ),
  },
);

type SlideDot = {
  key: string;
  label: string;
};

/**
 * Dot rail for the hero slider — one button per slide, no autoplay.
 *
 * Orientation is a prop so the same control can sit vertical on the left
 * edge (desktop) and horizontal under the CTAs (mobile) without duplicating
 * markup or state.
 */
export function SlideDots({
  slides,
  index,
  onSelect,
  label,
  orientation = "vertical",
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
  return (
    <nav
      aria-label={label}
      data-hero-slide-dots={orientation}
      className={cn(
        "flex gap-1.5",
        orientation === "vertical"
          ? "flex-col items-center"
          : "flex-row items-center justify-center",
        className,
      )}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <button
            key={slide.key}
            type="button"
            aria-label={slide.label}
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(i)}
            className="group grid size-9 cursor-pointer place-items-center rounded-full focus-visible:ring-3 focus-visible:ring-sky-400/70 focus-visible:outline-none motion-reduce:transition-none"
          >
            <span
              aria-hidden
              className={cn(
                "block rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                active
                  ? "size-2.5 bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.75)]"
                  : "size-1.5 bg-white/35 group-hover:bg-white/75 group-hover:scale-125",
              )}
            />
          </button>
        );
      })}
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
      {/* Vertical rail in the left gutter — desktop only (matches empty band
          beside the copy). Horizontal twin lives under the CTAs on mobile. */}
      <div className="pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 lg:block lg:-left-8 xl:-left-12">
        <div className="pointer-events-auto">
          <SlideDots
            slides={dots}
            index={index}
            onSelect={goTo}
            label={copy.navLabel}
            orientation="vertical"
          />
        </div>
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 xl:gap-14">
        <div className="hero-stagger text-center lg:pl-8 lg:text-left xl:pl-10">
          <p
            key={`eyebrow-${active.key}`}
            data-slide-dir={direction}
            className="hero-slide-fade mb-6 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur"
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
            <h1 className="mx-auto max-w-[16ch] text-[clamp(2.1rem,5.2vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-white lg:mx-0 lg:max-w-[14ch]">
              {active.titleLead}
              {active.titleAccent ? (
                <>
                  {" "}
                  <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                    {active.titleAccent}
                  </span>
                </>
              ) : null}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sky-50/85 lg:mx-0 lg:text-lg">
              {active.subtitle}
            </p>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {active.pills.map((word) => (
                <li
                  key={word}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-numeric text-[0.72rem] font-semibold tracking-[0.12em] text-sky-100 uppercase backdrop-blur"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>

          {/* Same pairing and order as the navbar: WhatsApp filled, trial
              outlined. Repeating the nav's hierarchy means a visitor who
              scrolled past the header meets the same primary action. */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              size="lg"
              className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-sky-50 active:scale-[0.98] motion-reduce:transition-none"
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
              className="h-13 rounded-full border-white/30 bg-white/8 px-8 text-sm text-white backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15 active:scale-[0.98] motion-reduce:transition-none"
              nativeButton={false}
              render={<AppAnchor href={REGISTER_URL} />}
            >
              {copy.ctaSecondary}
            </Button>
          </div>

          {/* Horizontal twin for small screens — same `goTo`, same dots. */}
          <div className="mt-7 flex justify-center lg:hidden">
            <SlideDots
              slides={dots}
              index={index}
              onSelect={goTo}
              label={copy.navLabel}
              orientation="horizontal"
            />
          </div>
        </div>

        <div className="hero-stagger relative mx-auto w-full max-w-[36rem] sm:max-w-[42rem] lg:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/35 blur-3xl"
          />

          {/* Glass console matches the void hero. Ecosystem locks the phone
              chat demo; product slides swap in related product artwork so the
              stage follows the selected slide. */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-linear-to-b from-white/10 to-white/4 p-2 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:p-2.5">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-40 h-24 bg-linear-to-b from-white/10 to-transparent"
            />

            {active.visual ? (
              /* Content-driven height: a fixed tall frame + object-contain
                 letterboxed landscape shots into large empty bands. */
              <div
                key={`visual-${active.key}`}
                data-slide-dir={direction}
                className="hero-slide-art relative w-full overflow-hidden rounded-[1.55rem] bg-linear-to-b from-white/8 to-white/2 px-3 pt-14 pb-4 sm:px-5 sm:pt-16 sm:pb-5"
              >
                {/* Clears the absolute stage badge; radius sits on the image itself. */}
                <Image
                  src={active.visual}
                  alt=""
                  width={1600}
                  height={900}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 52rem"
                  className="block h-auto w-full rounded-xl shadow-[0_18px_40px_-24px_rgba(0,0,0,0.65)] sm:rounded-2xl"
                  quality={75}
                />
                {/* Soft brand floor so artwork edges melt into the glass console. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-ink-void/40"
                />
              </div>
            ) : (
              /* Industry tabs sit at the top of the demo on mobile and would
                 collide with the absolute stage badge — clear that band. */
              <HeroChatDemo
                stage="ink"
                className="w-full pt-12 sm:pt-14 lg:pt-0"
              />
            )}

            {/* Stage badge: which product the current slide is highlighting. */}
            <div
              key={`badge-${active.key}`}
              data-slide-dir={direction}
              className="hero-slide-fade absolute top-5 left-5 z-30 flex max-w-[calc(100%-2.5rem)] items-center gap-2 rounded-full border border-white/20 bg-ink-panel/90 py-1.5 pr-3.5 pl-2.5 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md"
            >
              {active.icon ? (
                <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10">
                  <Image
                    src={active.icon}
                    alt=""
                    width={28}
                    height={28}
                    className="size-5 object-contain"
                  />
                </span>
              ) : (
                <span
                  aria-hidden
                  className="animate-pulse-soft size-2 shrink-0 rounded-full bg-sky-300"
                />
              )}
              <span className="truncate font-numeric text-[0.68rem] font-semibold tracking-[0.14em] text-sky-100 uppercase">
                {active.stageLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
