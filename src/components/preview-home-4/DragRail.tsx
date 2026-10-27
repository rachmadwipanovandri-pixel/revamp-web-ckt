"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Ico } from "./Icon";
import { solar_arrow_right_up_bold } from "./icons";

/**
 * A drag-to-scroll rail, with the buttons the drag gesture makes redundant.
 *
 * References all ship one of Splide or a custom IX2 drag; both are more
 * machinery than three cards need, and a carousel that only responds to a
 * pointer is a carousel a keyboard or touch user cannot use at all. So the
 * rail is native `overflow-x` with `scroll-snap` underneath — it already
 * works with every input device, and the pointer handler only *augments* it:
 * it writes `scrollLeft` directly instead of depending on the browser to
 * synthesise a drag, which is what makes a drag feel like it has weight.
 *
 * The arrows are the same reasoning in reverse, and only for the widths where
 * the cards actually overflow: on `lg` and up all three fit, so the buttons
 * would be inert, and `lg:hidden` takes them out of the layout — and with it
 * out of the tab order — instead of leaving two disabled controls behind.
 */
export function DragRail({
  children,
  label,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  label: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  /** -1 = at the start, 1 = at the end. Written to the node, never to state —
   *  an arrow that cannot scroll is a visual fact, not a re-render. */
  const atEndRef = useRef<HTMLButtonElement>(null);
  const atStartRef = useRef<HTMLButtonElement>(null);

  /** How far one press travels: a card plus the gap. */
  const step = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return 0;
    const card = rail.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 16;
    return (card?.offsetWidth ?? rail.clientWidth * 0.8) + gap;
  }, []);

  /** Paint the arrow states. Called on every scroll and on mount. */
  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const start = atStartRef.current;
    const end = atEndRef.current;
    const max = rail.scrollWidth - rail.clientWidth;
    if (start) {
      // Two pixels of slack: sub-pixel layout means scrollLeft can land a
      // fraction short of 0 and leave both arrows looking active.
      start.disabled = rail.scrollLeft <= 2;
    }
    if (end) {
      end.disabled = rail.scrollLeft >= max - 2;
    }
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    sync();
    rail.addEventListener("scroll", sync, { passive: true });
    // Images settle late and change the scroll width underneath us.
    const onResize = () => sync();
    window.addEventListener("resize", onResize);
    return () => {
      rail.removeEventListener("scroll", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [sync]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;

    // `pointerdown`, not mousedown: one handler covers mouse and the pen, and
    // touch keeps its native scrolling because we never preventDefault it.
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      dragging = true;
      startX = event.clientX;
      startLeft = rail.scrollLeft;
      rail.dataset.dragging = "true";
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      // Without this the browser starts a native image/text drag and the
      // gesture dies on the first card it crosses.
      event.preventDefault();
      rail.scrollLeft = startLeft - (event.clientX - startX);
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      delete rail.dataset.dragging;
    };

    rail.addEventListener("pointerdown", onDown);
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerup", onUp);
    rail.addEventListener("pointerleave", onUp);
    rail.addEventListener("pointercancel", onUp);
    // The rail holds selectable copy; a drag that ends on a word must not
    // leave a half-highlighted sentence behind.
    rail.addEventListener("dragstart", (event) => event.preventDefault());

    return () => {
      rail.removeEventListener("pointerdown", onDown);
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerup", onUp);
      rail.removeEventListener("pointerleave", onUp);
      rail.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const nudge = (direction: 1 | -1) => {
    railRef.current?.scrollBy({
      left: step() * direction,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-10 lg:mt-14">
      <div
        ref={railRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        className="ph4-rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-[var(--ph4-accent)]"
      >
        {children}
      </div>
      <div className="mt-5 flex justify-end gap-2 lg:hidden">
        <button
          ref={atStartRef}
          type="button"
          aria-label={prevLabel}
          onClick={() => nudge(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ph4-line)] text-[var(--ph4-ink)] transition-colors duration-200 hover:border-[var(--ph4-accent-line)] hover:text-[var(--ph4-accent)] disabled:opacity-30 motion-reduce:transition-none"
        >
          <Ico
            icon={solar_arrow_right_up_bold}
            size={16}
            className="rotate-[225deg]"
          />
        </button>
        <button
          ref={atEndRef}
          type="button"
          aria-label={nextLabel}
          onClick={() => nudge(1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ph4-line)] text-[var(--ph4-ink)] transition-colors duration-200 hover:border-[var(--ph4-accent-line)] hover:text-[var(--ph4-accent)] disabled:opacity-30 motion-reduce:transition-none"
        >
          <Ico icon={solar_arrow_right_up_bold} size={16} />
        </button>
      </div>
    </div>
  );
}
