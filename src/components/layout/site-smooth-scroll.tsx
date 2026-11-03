"use client";

import { useEffect } from "react";

/**
 * A single Lenis instance for production pages. It deliberately runs only for
 * mouse/trackpad devices: touch scrolling stays native and visitors requesting
 * reduced motion receive no scroll interpolation at all.
 */
export function SiteSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let cancelled = false;
    let lenis: { destroy(): void } | undefined;
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (callback: () => void) => window.setTimeout(callback, 0);
    const cancel =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : (handle: number) => window.clearTimeout(handle);

    const handle = schedule(() => {
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          autoRaf: true,
          // A lower lerp gives the requested heavier, weighted response while
          // remaining responsive for navigation and normal reading.
          lerp: 0.075,
          wheelMultiplier: 0.9,
          touchMultiplier: 1,
          syncTouch: false,
          anchors: true,
        });
      });
    });

    return () => {
      cancelled = true;
      cancel(handle as number);
      lenis?.destroy();
    };
  }, []);

  return null;
}
