import { cn } from "@/lib/utils";
import type { ReactNode, Ref } from "react";

type Surface =
  | "white"
  | "muted"
  | "subtle"
  | "brand-soft"
  | "ink"
  | "void"
  | "gradient-brand";

const SURFACE: Record<Surface, string> = {
  white: "bg-white text-foreground",
  muted: "bg-surface-muted text-foreground",
  subtle: "bg-surface-subtle text-foreground",
  "brand-soft":
    "bg-linear-to-b from-white via-primary/[0.04] to-primary/[0.08] text-foreground",
  ink: "bg-ink-deep text-white",
  void: "bg-ink-void text-white",
  "gradient-brand":
    "bg-linear-to-br from-ink-void via-primary-dark to-[#0c3f96] text-white",
};

/**
 * Vertical rhythm for /new. Surfaces now include full ink chapters so the page
 * reads as alternating light/dark acts rather than a flat white scroll.
 */
export function SectionShell({
  children,
  surface = "white",
  className,
  id,
  containerClassName,
  padded = true,
  bleed = false,
  ref,
}: {
  children: ReactNode;
  surface?: Surface;
  className?: string;
  id?: string;
  containerClassName?: string;
  padded?: boolean;
  /** Outer section is full-bleed; container still constrains content unless overridden */
  bleed?: boolean;
  ref?: Ref<HTMLElement>;
}) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative overflow-hidden",
        SURFACE[surface],
        padded && "py-20 md:py-28 lg:py-32",
        className,
      )}
    >
      <div
        className={cn(
          bleed
            ? "mx-auto w-full max-w-none px-0"
            : "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
