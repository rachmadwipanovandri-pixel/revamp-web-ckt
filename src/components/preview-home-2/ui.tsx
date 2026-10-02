import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small server-side primitives for the redesign. Tailwind utilities only, so
 * the bands stay declarative and the design language lives in one place
 * (docs/DESIGN.md: 1200 content frame, 8pt spacing, 20px cards, two elevations).
 */

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

type Tone = "white" | "soft" | "cream" | "wash" | "ink" | "none";

const TONE: Record<Tone, string> = {
  white: "bg-white",
  soft: "bg-[#F8FAFF]",
  cream: "bg-[#FAF9F5]",
  wash: "bg-[#EFF6FF]",
  ink: "bg-[#0B1220] text-white",
  none: "",
};

export function Band({
  id,
  tone = "white",
  border = false,
  className,
  children,
  labelledBy,
  defer,
}: {
  id?: string;
  tone?: Tone;
  border?: boolean;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  /**
   * Opt in to `content-visibility: auto` (see `.ph2-defer` in
   * preview-home-2.css), which skips layout and paint for a band until it nears
   * the viewport.
   *
   * Opt-in rather than automatic because `content-visibility` implies
   * `contain: layout`, and layout containment makes the band a containing block
   * for `position: fixed` and `position: absolute` descendants — so a band
   * holding a modal, or a sticky panel measured against itself, breaks in ways
   * that look like nothing at all until you scroll. Default to `false` and turn
   * it on only for a band whose contents are entirely static flow content.
   */
  defer?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-defer={defer ? "true" : undefined}
      className={cn(
        "relative py-20 md:py-28",
        TONE[tone],
        border && "border-y border-border",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase",
        tone === "brand" ? "text-primary" : "text-[#BFDBFE]",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.14] font-bold tracking-[-0.025em] text-balance text-[#101828]"
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "text-[1.0625rem] leading-[1.6] text-[#4B5563]",
            align === "center" ? "max-w-[46rem]" : "max-w-[40rem]",
          )}
        >
          {body}
        </p>
      ) : null}
    </header>
  );
}

/** One of the two documented elevations: hairline border + soft lift. */
export function Card({
  className,
  children,
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.04),0_16px_40px_-28px_rgba(11,18,32,0.22)]",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_1px_2px_rgba(11,18,32,0.05),0_28px_52px_-30px_rgba(19,82,191,0.38)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Text link with a sliding arrow. Renders a plain anchor so `next/link` can wrap it. */
export function ArrowText({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </span>
  );
}

/** Section eyebrow + the accent-coloured word inside an H2. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-primary italic">{children}</span>;
}
