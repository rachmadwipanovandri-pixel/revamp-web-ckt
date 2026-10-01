"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /**
     * The draft's Lenis instance, if smooth-scroll is active. Set by
     * SmoothScroll; read by Nav's scroll lock so opening the mobile panel
     * also freezes the virtual scroll behind it, and by the step rail's
     * `goTo` so programmatic scrolls go through Lenis instead of fighting it
     * with a native smooth `scrollIntoView`.
     */
    __ph2Lenis?: {
      stop(): void;
      start(): void;
      destroy(): void;
      scrollTo(
        target: HTMLElement,
        options?: { offset?: number; duration?: number },
      ): void;
    };
  }
}

/**
 * Lenis smooth-scroll — the weighted glide on aira.app — scoped to
 * /preview-home-2 only.
 *
 * PageSpeed budget (target ≥90 mobile + desktop) is why this is gated three
 * ways instead of mounted unconditionally:
 *
 *   1. `prefers-reduced-motion` → never starts. Lenis has its own
 *      `respectReducedMotion`, but not instantiating at all costs zero bytes
 *      and zero rAF, and is unambiguous.
 *   2. coarse pointers (touch) → never starts. Lenis does not smooth touch by
 *      default (`syncTouch: false`) anyway, so mobile pays nothing: no chunk,
 *      no loop, native scroll throughout.
 *   3. `import("lenis")` is dynamic, so the ~18 KB module (~5.4 KB gzip) rides
 *      in its own async chunk *after* hydration instead of the critical path.
 *      LCP is untouched: the chunk cannot block first paint.
 *
 * Lenis drives the real scroll position (no transform wrapper), so sticky nav,
 * the scroll progress bar, the scroll-linked hero scale, and the
 * IntersectionObserver step rail all keep working unchanged.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let instance: Window["__ph2Lenis"];
    let cancelled = false;

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 0);
    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : (id: number) => window.clearTimeout(id);

    const handle = schedule(() => {
      // Dynamic import keeps Lenis out of the initial bundle; `anchors: true`
      // routes the in-page `#how-it-works` link through the same glide.
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        instance = new Lenis({
          autoRaf: true,
          lerp: 0.1,
          // `offset` mirrors the `scroll-mt-24` on anchored bands: Lenis
          // computes its target from the rect and ignores CSS scroll-margin,
          // so without this `#how-it-works` would land hidden under the
          // sticky nav.
          anchors: { offset: -96 },
        });
        window.__ph2Lenis = instance;
      });
    });

    return () => {
      cancelled = true;
      cancel(handle as number);
      instance?.destroy();
      if (instance && window.__ph2Lenis === instance) {
        window.__ph2Lenis = undefined;
      }
    };
  }, []);

  return null;
}
