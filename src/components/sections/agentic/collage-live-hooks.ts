"use client";

import { useEffect, useState } from "react";

/** How long a finished script holds before replaying. */
export const LOOP_HOLD_MS = 4200;

/**
 * Minimal timed cursor: reveals items 1..n on a per-item delay, holds, then
 * replays. Shared by the consulting chat and the live product panels.
 */
export function useLoopCursor(count: number, delayFor: (index: number) => number) {
  const [cursor, setCursor] = useState(0);
  const [prev, setPrev] = useState({ count, delayFor });

  // Reset during render when the script restarts — avoids setState-in-effect.
  if (prev.count !== count || prev.delayFor !== delayFor) {
    setPrev({ count, delayFor });
    setCursor(0);
  }

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      if (i >= count) {
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setCursor(0);
          i = 0;
          timer = window.setTimeout(tick, 350);
        }, LOOP_HOLD_MS);
        return;
      }
      i += 1;
      setCursor(i);
      timer = window.setTimeout(tick, delayFor(i - 1));
    };

    timer = window.setTimeout(tick, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [count, delayFor]);

  return cursor;
}
