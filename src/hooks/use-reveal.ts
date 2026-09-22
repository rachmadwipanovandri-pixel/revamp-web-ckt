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
 */
export function useReveal<T extends Element>(
  ref: RefObject<T | null>,
  amount = 0.15,
): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Deferred, not called in the effect body: react-hooks forbids a
      // synchronous setState there, and an observer's own first callback is
      // async anyway, so this matches the normal path's timing.
      const id = setTimeout(() => setRevealed(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount]);

  return revealed;
}
