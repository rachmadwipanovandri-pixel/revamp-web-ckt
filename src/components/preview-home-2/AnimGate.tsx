"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pauses every CSS animation inside this subtree while the band is off-screen
 * or the tab is hidden.
 *
 * preview-home ran its 34s hero loop permanently — including on hidden tabs —
 * because it deliberately skipped an IntersectionObserver. The CSS side of the
 * gate lives in preview-home-2.css (`.ph2-gate[data-off="true"] .ph2-anim`).
 */
export function AnimGate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [off, setOff] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let onScreen = true;
    const sync = () => setOff(!onScreen || document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-off={off ? "true" : "false"}
      className={cn("ph2-gate", className)}
    >
      {children}
    </div>
  );
}
