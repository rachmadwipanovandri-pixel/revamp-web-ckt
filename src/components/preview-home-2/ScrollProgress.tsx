"use client";

import { useEffect, useState } from "react";

/**
 * Fixed reading-progress bar. Transform-only (composited), 2px tall, and hidden
 * until the visitor actually scrolls — unlike preview-home's version, which ran
 * a second CSS transition on a value already written every animation frame.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-[#1352BF] to-[#0EA5E9]"
      style={{
        transform: `scaleX(${progress})`,
        opacity: progress > 0.002 ? 1 : 0,
        transition: "opacity 200ms linear",
      }}
    />
  );
}
