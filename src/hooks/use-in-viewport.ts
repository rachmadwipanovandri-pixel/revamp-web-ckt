"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether `ref` is on screen, for pausing perpetual animations.
 *
 * Starts as `true` on purpose. Both callers drive endless autoplay loops, and
 * the failure mode of starting `false` is that the homepage's product demo
 * never animates at all if IntersectionObserver is missing or never reports.
 * Starting `true` inverts that: the worst case is the old always-on behaviour,
 * and the observer only ever turns the loop OFF. IntersectionObserver fires
 * with the current state as soon as it observes, so a genuinely offscreen
 * element settles to `false` within a frame.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  amount = 0.2,
): boolean {
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount]);

  return inViewport;
}
