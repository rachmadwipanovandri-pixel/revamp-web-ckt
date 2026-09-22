import { cn } from "@/lib/utils";

/**
 * Shared section header grammar for /new: optional ghost chapter numeral,
 * eyebrow, one H2, one lede. Type scale is intentionally aggressive —
 * display headings sit in a much tighter tracking / larger clamp than body.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
  titleClassName,
  level = 2,
  chapter,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  level?: 1 | 2;
  /** Ghost numeral, e.g. "02" — structural, not decorative filler */
  chapter?: string;
  tone?: "light" | "ink";
}) {
  const Heading = level === 1 ? "h1" : "h2";
  const isInk = tone === "ink";

  return (
    <div
      className={cn(
        "relative max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {chapter && (
        <span
          aria-hidden
          className={cn(
            "chapter-ghost absolute -top-8 -left-2 z-0 md:-top-12 md:-left-6",
            isInk && "chapter-ghost-ink",
            align === "center" && "left-1/2 -translate-x-1/2",
          )}
        >
          {chapter}
        </span>
      )}
      <div className="relative z-10">
        {eyebrow && (
          <p
            className={cn(
              "eyebrow-rule mb-5 font-numeric text-[0.68rem] font-semibold tracking-[0.2em] uppercase",
              isInk
                ? "eyebrow-rule-light text-sky-300"
                : "text-primary",
              align === "center" && "justify-center",
            )}
          >
            {eyebrow}
          </p>
        )}
        <Heading
          className={cn(
            "font-semibold tracking-[-0.04em] text-balance",
            isInk ? "text-white" : "text-foreground",
            level === 1
              ? "text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02]"
              : "text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.06]",
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {lede && (
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed md:text-lg",
              isInk ? "text-primary-foreground-muted" : "text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {lede}
          </p>
        )}
      </div>
    </div>
  );
}
