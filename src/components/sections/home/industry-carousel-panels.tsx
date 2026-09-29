"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type IndustryPanel = {
  id: string;
  slug: string;
  title: string;
  /** One-line positioning from the registry nav — the card's scannable summary. */
  tagline: string;
  /** Portrait for the card thumbnail; see public/images/industries/CREDITS.md. */
  photo: string;
  description: string;
  useCases: string[];
};

export type IndustryCarouselLabels = {
  useCases: string;
  learnMore: string;
  previous: string;
  next: string;
};

/** Pixels of travel before a press becomes a drag instead of a click. */
const DRAG_THRESHOLD = 5;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Horizontal scroll-snap rail. One card leads with a peek of the next at every
 * breakpoint (84% / 56% / 37% of the rail), so it reads as a slider on a phone
 * without collapsing into the unreadable slivers the earlier rail had.
 *
 * Position is reported by a scroll-linked progress bar rather than an
 * `01 / 08` counter: with three cards in view the trailing cards never reach
 * the snap start, so a counter read off snap position would stick at 06 while
 * the rail is already at the end. Scroll percentage is honest at both extremes.
 *
 * Three ways to move: arrows (wrap at both ends so neither is a dead end),
 * native scroll for touch and two-finger trackpad, and pointer drag — a plain
 * overflow container ignores mouse drags, which is the one gesture people
 * reach for first on desktop. Drag suspends snapping so the mandatory snap
 * does not fight the pointer, then settles back onto the nearest card.
 *
 * The whole card is the link — one large tap target per industry instead of a
 * small pill stranded at the bottom of a tall card.
 */
export function IndustryCarouselPanels({
  panels,
  labels,
}: {
  panels: IndustryPanel[];
  labels: IndustryCarouselLabels;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<number | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScroll: 0,
    engaged: false,
    moved: false,
  });
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  // Scroll position can be restored before hydration on a reload; read it once
  // on mount so the bar is not stale until the first swipe.
  useEffect(() => {
    setProgress(scrollProgress(trackRef.current));
  }, []);

  const syncProgress = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setProgress(scrollProgress(trackRef.current));
    });
  };

  const go = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;

    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    // Wrap rather than stall: native scrolling cannot go past the ends, so an
    // arrow that just called scrollBy would otherwise do nothing at all.
    if (direction > 0 && track.scrollLeft >= max - 1) {
      track.scrollTo({ left: 0, behavior });
      return;
    }
    if (direction < 0 && track.scrollLeft <= 1) {
      track.scrollTo({ left: max, behavior });
      return;
    }
    track.scrollBy({ left: direction * cardStride(track), behavior });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    // Touch already scrolls natively — hijacking it only makes it worse.
    if (event.pointerType === "touch" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track || track.scrollWidth - track.clientWidth <= 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      engaged: false,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    const delta = event.clientX - drag.startX;
    if (!drag.engaged) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      drag.engaged = true;
      drag.moved = true;
      // Snap off while the pointer owns the scroll, otherwise mandatory
      // snapping yanks the rail back to a card on every frame.
      track.style.scrollSnapType = "none";
      track.setPointerCapture?.(event.pointerId);
      setDragging(true);
    }
    track.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLUListElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!track || drag.pointerId !== event.pointerId) return;

    if (drag.engaged) {
      track.style.scrollSnapType = "";
      settleToCard(track);
      if (track.hasPointerCapture?.(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      setDragging(false);
    }
    drag.pointerId = -1;
    drag.engaged = false;
  };

  // A drag that ends on a card must not follow the link underneath it.
  const onClickCapture = (event: React.MouseEvent<HTMLUListElement>) => {
    if (!dragRef.current.moved) return;
    dragRef.current.moved = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={syncProgress}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          "snap-rail flex gap-4 cursor-grab overflow-x-auto overscroll-x-contain select-none pb-1 sm:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          dragging && "[&_*]:cursor-grabbing",
        )}
      >
        {panels.map((panel, index) => (
          <li key={panel.id} className="w-[84%] shrink-0 sm:w-[56%] lg:w-[37%]">
            <Link
              href={{
                pathname: "/industries/[slug]",
                params: { slug: panel.slug },
              }}
              aria-label={`${labels.learnMore} — ${panel.title}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#0B1220]/[0.08] bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04),0_18px_40px_-28px_rgba(11,18,32,0.18)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_2px_rgba(11,18,32,0.04),0_28px_56px_-30px_rgba(19,82,191,0.28)] focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#DCE7FC] sm:aspect-[16/10]">
                <Image
                  src={panel.photo}
                  alt={panel.title}
                  fill
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 56vw, 37vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span
                  aria-hidden
                  className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] tabular-nums text-[#94A3B8] transition-colors duration-300 group-hover:text-primary motion-reduce:transition-none"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-numeric text-lg font-semibold tracking-[-0.02em] text-[#0B1220] sm:text-xl">
                  {panel.title}
                </h3>
                {panel.tagline ? (
                  <p className="mt-1 text-sm leading-snug font-medium text-primary/90">
                    {panel.tagline}
                  </p>
                ) : null}

                <p className="mt-3.5 text-sm leading-[1.65] text-[#4B5563] sm:text-[0.95rem]">
                  {panel.description}
                </p>

                {panel.useCases.length > 0 ? (
                  <>
                    <p className="mt-6 font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-subtle-foreground uppercase">
                      {labels.useCases}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {panel.useCases.map((useCase) => (
                        <li
                          key={useCase}
                          className="rounded-full border border-[#0B1220]/10 bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#0B1220]/75"
                        >
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <span
                  aria-hidden
                  className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 self-start rounded-full border border-primary/25 bg-white px-5 py-2.5 font-numeric text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-3 group-hover:shadow-[0_16px_36px_-24px_rgba(19,82,191,0.5)] motion-reduce:transition-none"
                >
                  {labels.learnMore}
                  <span>&rarr;</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-4 sm:gap-5">
        <div
          aria-hidden
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0B1220]/10"
        >
          <div
            className={cn(
              "h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none",
              dragging && "transition-none",
            )}
            style={{ width: `${Math.round(progress * 1000) / 10}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={labels.previous}
            onClick={() => go(-1)}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#0B1220]/15 bg-white text-[#0B1220] transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none motion-reduce:transition-none"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(1)}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-[#0B1220]/15 bg-white text-[#0B1220] transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none motion-reduce:transition-none"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function scrollProgress(track: HTMLUListElement | null): number {
  if (!track) return 0;
  const max = track.scrollWidth - track.clientWidth;
  return max > 0 ? clamp01(track.scrollLeft / max) : 0;
}

/** Distance between two card starts — exactly what one arrow press travels. */
function cardStride(track: HTMLUListElement): number {
  const first = track.children.item(0) as HTMLElement | null;
  const second = track.children.item(1) as HTMLElement | null;
  if (!first) return 0;
  if (second) return second.offsetLeft - first.offsetLeft;
  return first.offsetWidth;
}

/** Park the rail on the nearest card after a free drag. */
function settleToCard(track: HTMLUListElement) {
  const stride = cardStride(track);
  if (stride <= 0) return;
  const max = track.scrollWidth - track.clientWidth;
  const target = Math.min(
    max,
    Math.max(0, Math.round(track.scrollLeft / stride) * stride),
  );
  track.scrollTo({
    left: target,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
