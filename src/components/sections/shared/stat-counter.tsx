"use client";

import { useEffect, useState } from "react";

export function StatCounter({
  target,
  label,
  durationMs = 1200,
}: {
  target: number;
  label: string;
  durationMs?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-card">
      <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      <span className="font-numeric text-sm font-semibold text-primary">
        {value}%
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
