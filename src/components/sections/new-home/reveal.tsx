"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * One-shot scroll reveal. Latches after first entry. Motion language for the
 * radical pass: longer travel, soft fade, single expo-out curve.
 *
 * Opacity + transform only — animating `filter` is non-composited and shows
 * up in Lighthouse under “Avoid non-composited animations”.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.12,
  as: Tag = "div",
  y = 36,
  x = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  as?: "div" | "section" | "li" | "article";
  y?: number;
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, amount);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "reveal-on-scroll transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        revealed ? "translate-y-0 opacity-100" : "opacity-0",
        className,
      )}
      style={
        revealed
          ? delay
            ? { transitionDelay: `${delay}ms` }
            : undefined
          : {
              transform: `translate3d(${x}px, ${y}px, 0)`,
              ...(delay ? { transitionDelay: `${delay}ms` } : {}),
            }
      }
    >
      {children}
    </Tag>
  );
}
