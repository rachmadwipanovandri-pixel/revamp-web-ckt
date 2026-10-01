"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type FeatureClip = {
  webm?: string;
  mp4?: string;
  poster?: string;
};

const PLACEHOLDER_CLIPS: FeatureClip[] = [
  { webm: "/videos/feature.webm", mp4: "/videos/feature.mp4" },
];

/**
 * Rotating feature-video reel: the Monaco-style square block, upgraded with
 * crossfading clips, a slow ken-burns zoom, hairline progress segments, and a
 * glow frame. Every clip stays mounted and swaps opacity so transitions never
 * wait on a reload; the reel pauses while off-screen. `muted` ships in the
 * server HTML so the first clip autoplays before hydration, and
 * prefers-reduced-motion holds it on the first clip (no rotation/zoom/bars).
 */
export function FeatureVideo({
  clips = PLACEHOLDER_CLIPS,
  poster = "/videos/feature-poster.jpg",
  interval = 4000,
  className,
}: {
  clips?: FeatureClip[];
  /** Fallback poster for clips that don't set their own. */
  poster?: string;
  /** Milliseconds a clip stays active before the crossfade. */
  interval?: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const zoomRefs = useRef<Array<Animation | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const activeSince = useRef(0);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.2,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    activeSince.current = Date.now();
  }, [active]);

  // Advance to the next clip; on re-entry only the remaining time is left.
  useEffect(() => {
    if (reduce || !inView || clips.length < 2) return;
    const remaining = Math.max(
      0,
      interval - (Date.now() - activeSince.current),
    );
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % clips.length),
      remaining,
    );
    return () => clearTimeout(timer);
  }, [active, inView, reduce, clips.length, interval]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView) {
        void video.play()?.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, inView]);

  // The zoom is deliberately kept (not cancelled) when a clip deactivates so
  // the fade-out doesn't snap back to scale(1); it is cancelled only when the
  // same clip starts its next cycle, while it is still fully transparent.
  useEffect(() => {
    const video = videoRefs.current[active];
    if (!video) return;
    zoomRefs.current[active]?.cancel();
    zoomRefs.current[active] = null;
    if (reduce || typeof video.animate !== "function") return;
    zoomRefs.current[active] = video.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.08)" }],
      { duration: interval, easing: "linear", fill: "forwards" },
    );
  }, [active, reduce, interval]);

  // Cancelling on cleanup hands the segment back to its base class:
  // full for clips already passed, empty for the one ahead.
  useEffect(() => {
    if (reduce) return;
    const bar = barRefs.current[active];
    if (!bar || typeof bar.animate !== "function") return;
    const fill = bar.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: interval, easing: "linear", fill: "forwards" },
    );
    if (!inView) fill.pause();
    return () => fill.cancel();
  }, [active, inView, reduce, interval]);

  return (
    <div
      ref={boxRef}
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-[20px] bg-black ring-1 ring-[#BFDBFE]/70",
        "shadow-[0_30px_60px_-28px_rgba(19,82,191,0.45),0_2px_10px_-4px_rgba(16,24,40,0.3)]",
        className,
      )}
    >
      {clips.map((clip, i) => (
        <video
          key={i}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay={i === 0}
          loop
          muted
          playsInline
          preload="metadata"
          poster={clip.poster ?? poster}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          {clip.webm ? <source src={clip.webm} type="video/webm" /> : null}
          {clip.mp4 ? <source src={clip.mp4} type="video/mp4" /> : null}
        </video>
      ))}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-linear-to-b from-white/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-black/45 to-transparent"
      />

      {!reduce && (
        <div
          aria-hidden="true"
          className="absolute inset-x-4 bottom-4 z-30 flex gap-1.5"
        >
          {clips.map((_, i) => (
            <span
              key={i}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <span
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className={cn(
                  "block h-full w-full origin-left bg-white",
                  i < active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
