"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades the hero copy out as it scrolls away (attio-style hero exit), ceding
 * the viewport to the interactive stage below.
 *
 * Scroll-linked through `--fade` (0 at rest → 1 after ~45vh of upward travel),
 * composited only (opacity + transform). Past halfway the block goes `inert`
 * so its form and links leave the tab order instead of lingering invisibly.
 * Under `prefers-reduced-motion` the var stays 0: copy behaves like plain
 * content that scrolls away naturally.
 */
export function HeroFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (reduce.matches) {
        el.style.setProperty("--fade", "0");
        el.inert = false;
        return;
      }
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, -top / (vh * 0.45)));
      el.style.setProperty("--fade", p.toFixed(3));
      // `inert` is a DOM property, not paint work: toggling it is cheap and
      // keeps keyboard/AT users from tabbing into faded-out controls.
      el.inert = p > 0.5;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", apply);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div ref={ref} className={cn("ph2-fade", className)}>
      {children}
    </div>
  );
}
