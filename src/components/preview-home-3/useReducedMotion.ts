"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `prefers-reduced-motion`, read during render rather than from an effect.
 *
 * The usual shape is `useEffect(() => setReduced(query.matches), [])`, and
 * eslint's `react-hooks/set-state-in-effect` is right to reject it: that is a
 * synchronous setState on mount, which costs an extra render pass before the
 * value is right — so a reduced-motion visitor gets one frame of the animation
 * they asked not to see. `useSyncExternalStore` is the sanctioned shape for an
 * external store like a media query: the value is available on first render, and
 * the subscription is torn down by React rather than by a hand-written listener.
 *
 * The server snapshot is `false`, so a statically rendered page starts on the
 * animated path and settles to the visitor's preference on hydration. That is
 * deliberate: a static shell cannot know the visitor's OS setting, and guessing
 * "reduced" would strip the motion from everyone.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia(QUERY);
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}