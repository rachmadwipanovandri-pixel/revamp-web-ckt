"use client";

import { useEffect, useRef } from "react";

/** Additive intro: the server-rendered message and controls never start hidden. */
export function HeroEntrance() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || media.matches) return;
    let cancelled = false;
    let context: { revert(): void } | undefined;
    const stop = () => {
      cancelled = true;
      context?.revert();
    };
    media.addEventListener("change", stop);
    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
        timeline.from(section.querySelector("h1"), { y: 18, opacity: 0.7, clearProps: "all" });
        const controls = section.querySelector("[data-page-hero-children]");
        if (controls) timeline.from(controls, { y: 12, clearProps: "all" }, 0.12);
        const visual = section.querySelector(".secondary-hero__visual");
        if (visual) timeline.from(visual, { y: 26, scale: 0.98, clearProps: "all" }, 0.18);
      }, section);
    }).catch(() => { /* Static server-rendered layout is the fallback. */ });
    return () => {
      stop();
      media.removeEventListener("change", stop);
    };
  }, []);

  return <span ref={ref} hidden aria-hidden />;
}
