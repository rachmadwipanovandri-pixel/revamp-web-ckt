"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether `ref` has ever been on screen, for one-shot scroll reveals.
 *
 * Distinct from `useInViewport`, which tracks the current state to pause
 * perpetual loops and therefore starts `true`. A reveal needs the opposite
 * default, so it can animate in, and it must latch: an element that scrolls
 * back out should stay revealed rather than replay on every pass.
 *
 * Without IntersectionObserver it reveals immediately. The failure mode of a
 * reveal is content that never appears, so the fallback is always visible.
 *
 * ── Why there is a scroll listener here, not just an observer ───────────────
 *
 * IntersectionObserver reports *transitions*. An element that goes from fully
 * below the viewport to fully above it between two delivered frames produces
 * "not intersecting" at both samples, so no callback ever fires and the reveal
 * never happens. That is not a rare case — it is what every instant jump does:
 * an `href="#anchor"`, `End`/`PageDown`, a programmatic `scrollTo`, a
 * find-in-page hit, or a route change restoring a remembered scroll offset. It
 * also hits any visitor who flings a trackpad hard enough to cross a whole block
 * between two frames.
 *
 * The symptom is the worst one available: the element sits at `opacity: 0`
 * forever, so the copy is simply gone. Measured on /preview-home-2, 11 of 37
 * reveals stayed invisible after a scripted scroll down the page while the
 * observer sat there having correctly observed nothing.
 *
 * So the observer stays the primary path — it is the one that gets the timing
 * right — and a rAF-throttled rect test on scroll covers the case the observer
 * structurally cannot see. The test is "has this entered the viewport from
 * below, or did we jump over it": `rect.top < innerHeight` is true in both
 * cases and false for everything still ahead of the visitor.
 */
export function useReveal<T extends Element>(
  ref: RefObject<T | null>,
  amount = 0.15,
): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      setRevealed(true);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      observer?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };

    const check = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        // A zero-height box means the element is inside a subtree the browser
        // has not laid out (`content-visibility: auto`). Revealing is the safe
        // direction there — the alternative is content that never appears.
        if (rect.height === 0 || rect.top < window.innerHeight) reveal();
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      // Deferred, not called in the effect body: react-hooks forbids a
      // synchronous setState there, and an observer's own first callback is
      // async anyway, so this matches the normal path's timing.
      const id = setTimeout(reveal, 0);
      return () => clearTimeout(id);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: amount },
    );
    observer.observe(el);

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    // An element already within the first viewport when it mounts will never
    // produce a scroll event, so the same test runs once up front.
    check();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, amount]);

  return revealed;
}
