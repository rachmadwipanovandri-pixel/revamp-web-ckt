"use client";

import { useEffect, useRef } from "react";

/** Full accessible name; visible words remain complete in the static SSR frame. */
export function HeadingWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!heading || media.matches || typeof IntersectionObserver === "undefined") return;
    let cancelled = false;
    let context: { revert(): void } | undefined;
    const stop = () => {
      cancelled = true;
      context?.revert();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void import("gsap").then(({ gsap }) => {
        if (cancelled) return;
        context = gsap.context(() => {
          gsap.from(heading.querySelectorAll("[data-heading-word]"), {
            y: 10, opacity: 0.7, stagger: 0.025, duration: 0.65,
            ease: "power3.out", clearProps: "all",
          });
        }, heading);
      }).catch(() => { /* Keep the complete static heading on load failure. */ });
    }, { threshold: 0.2 });
    observer.observe(heading);
    media.addEventListener("change", stop);
    return () => {
      stop();
      observer.disconnect();
      media.removeEventListener("change", stop);
    };
  }, []);

  return (
    <h2 ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{text.split(/(\s+)/).map((word, index) =>
        /\s+/.test(word) ? word : <span key={index} data-heading-word className="inline-block">{word}</span>,
      )}</span>
    </h2>
  );
}
