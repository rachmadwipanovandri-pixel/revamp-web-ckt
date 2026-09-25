"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
 * One pair of arrows, always floating: pinned to the hero block's left and
 * right edges and vertically centered over it (every breakpoint). The rail
 * itself is click-through; only the arrow buttons capture pointer events.
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
        // Floating rail: full height of the hero block, arrows pushed to the
        // left/right edges. Click-through so taps and swipes reach the content.
        "pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between",
        "md:px-3 lg:px-6 xl:px-10",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => pick(index - 1)}
        className="pointer-events-auto grid size-10 shrink-0 cursor-pointer place-items-center text-white/65 transition-all hover:scale-110 hover:text-white active:scale-95 motion-reduce:transition-none lg:size-12"
      >
        <ChevronLeft
          aria-hidden
          className="size-7 lg:size-8"
          strokeWidth={2.2}
        />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={() => pick(index + 1)}
        className="pointer-events-auto grid size-10 shrink-0 cursor-pointer place-items-center text-white/65 transition-all hover:scale-110 hover:text-white active:scale-95 motion-reduce:transition-none lg:size-12"
      >
        <ChevronRight
          aria-hidden
          className="size-7 lg:size-8"
          strokeWidth={2.2}
        />
      </button>
    </nav>
  );
}

/** Axis-lock threshold before the drag starts moving the hero track. */
const DRAG_LOCK_PX = 6;
/** Distance the gesture must travel horizontally to change the slide. */
const DRAG_COMMIT_PX = 40;
/** How long the outgoing hero flies out before the next slide mounts. */
const DRAG_THROW_MS = 200;

type HeroDrag = {
  pointerId: number;
  startX: number;
  startY: number;
  axis: "x" | "y" | null;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /** Mirror of `index` so timers scheduled mid-drag read the live slide. */
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  /** Jump to a slide (dot click). Direction = shortest path around the rail. */
  const goTo = (to: number) => {
    const current = indexRef.current;
    if (to === current || to < 0 || to >= slideCount) return;
    const forward = (to - current + slideCount) % slideCount;
    setDirection(forward <= slideCount / 2 ? 1 : -1);
    setIndex(to);
  };

  /** Live drag — the track follows the pointer via direct style writes (no
      re-renders), then throws out along the swipe before the slide swaps. */
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HeroDrag | null>(null);
  const commitTimerRef = useRef<number | null>(null);

  const setTrack = (transform: string, transition: string) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = transition;
    track.style.transform = transform;
  };

  const resetTrack = (animate: boolean) => {
    if (animate && !prefersReducedMotion()) {
      setTrack(
        "translate3d(0, 0, 0)",
        "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      );
    } else {
      setTrack("", "");
    }
    if (trackRef.current) trackRef.current.style.willChange = "";
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    // A re-press mid-throw wins: cancel the pending slide swap.
    if (commitTimerRef.current !== null) {
      window.clearTimeout(commitTimerRef.current);
      commitTimerRef.current = null;
    }
    // Freeze any snap-back so the track never lags behind the finger.
    if (trackRef.current) trackRef.current.style.transition = "";
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.axis) {
      if (Math.abs(dx) < DRAG_LOCK_PX && Math.abs(dy) < DRAG_LOCK_PX) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        drag.axis = "y"; // vertical gesture — the page keeps scrolling
        return;
      }
      drag.axis = "x";
      const track = trackRef.current;
      if (track) {
        track.style.transition = "";
        track.style.willChange = "transform";
      }
      try {
        // Keep pointer events arriving even after the pointer leaves the hero.
        event.currentTarget.setPointerCapture?.(event.pointerId);
      } catch {
        // Capture unsupported — moves that bubble still drive the track.
      }
    }
    if (drag.axis !== "x") return;
    setTrack(`translate3d(${dx}px, 0, 0)`, "");
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || event.pointerId !== drag.pointerId || drag.axis !== "x")
      return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    // Not far enough (or turned vertical at the last moment): settle back.
    if (Math.abs(dx) < DRAG_COMMIT_PX || Math.abs(dx) <= Math.abs(dy)) {
      resetTrack(true);
      return;
    }

    const commit = () => {
      commitTimerRef.current = null;
      goTo(
        dx < 0
          ? (indexRef.current + 1) % slideCount
          : (indexRef.current - 1 + slideCount) % slideCount,
      );
      resetTrack(false);
    };

    if (prefersReducedMotion()) {
      commit();
      return;
    }

    // Fly out along the swipe direction, then mount the next slide — the
    // enter animation picks the same direction up from here.
    const sign = dx < 0 ? -1 : 1;
    setTrack(
      `translate3d(${dx + sign * 140}px, 0, 0)`,
      `transform ${DRAG_THROW_MS}ms cubic-bezier(0.55, 0, 1, 0.45)`,
    );
    commitTimerRef.current = window.setTimeout(commit, DRAG_THROW_MS);
  };

  // Pointer events cover touch, mouse, and pen in one path. `touch-pan-y`
  // tells mobile browsers horizontal drags belong to us, select-none keeps a
  // drag from highlighting the hero copy, and grab/grabbing advertises the
  // drag on desktop (interactive children keep their own pointer cursors).
  return (
    <div
      className="relative touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        if (dragRef.current?.axis === "x") resetTrack(true);
        dragRef.current = null;
      }}
    >
      {/* Drag track — translated inline during a drag; the slide swap resets
          it before paint so only the enter animation is visible. */}
      <div ref={trackRef}>
        {/* Compact keynote copy so the product collage stays high in the fold. */}
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
              className="h-12 cursor-pointer rounded-full bg-white px-6 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.4)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-sky-50 active:scale-[0.98] motion-reduce:transition-none sm:h-13 sm:px-8"
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
              className="h-12 cursor-pointer rounded-full border-sky-300/40 bg-sky-400/10 px-6 text-sm text-white backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-sky-200/70 hover:bg-sky-400/20 active:scale-[0.98] motion-reduce:transition-none sm:h-13 sm:px-8"
              nativeButton={false}
              render={<AppAnchor href={REGISTER_URL} />}
            >
              {copy.ctaSecondary}
            </Button>
          </div>

          {/* Floating arrows — pinned to the hero's left/right edges on every
            breakpoint; the hero root also maps horizontal swipes to next/prev. */}
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
    </div>
  );
}
