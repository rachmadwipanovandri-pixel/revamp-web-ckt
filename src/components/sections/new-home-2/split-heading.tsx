import { cn } from "@/lib/utils";

/**
 * Two-tone display heading used across /new-2 — first clause in ink (or white
 * on dark), accent clause in brand blue. Mirrors the Sentry reference rhythm
 * without pulling in chapter numerals from /new.
 */
export function SplitHeading({
  lead,
  accent,
  as: Tag = "h2",
  className,
  tone = "light",
  align = "left",
  size = "section",
}: {
  lead: string;
  accent: string;
  as?: "h1" | "h2";
  className?: string;
  tone?: "light" | "ink" | "muted";
  align?: "left" | "center";
  size?: "hero" | "section";
}) {
  const isInk = tone === "ink";

  return (
    <Tag
      className={cn(
        "font-semibold tracking-[-0.04em] text-balance",
        align === "center" && "mx-auto text-center",
        size === "hero"
          ? "text-[clamp(2.35rem,5.6vw,4.15rem)] leading-[1.02]"
          : "text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08]",
        isInk ? "text-white" : "text-foreground",
        className,
      )}
    >
      <span className={isInk ? "text-white/55" : "text-foreground/45"}>
        {lead}
      </span>{" "}
      <span
        className={
          isInk
            ? "bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent"
            : "text-primary"
        }
      >
        {accent}
      </span>
    </Tag>
  );
}

export function Eyebrow({
  children,
  tone = "light",
  align = "left",
  className,
}: {
  children: string;
  tone?: "light" | "ink" | "muted";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "eyebrow-rule font-numeric text-[0.68rem] font-semibold tracking-[0.2em] uppercase",
        tone === "ink"
          ? "eyebrow-rule-light text-sky-300"
          : tone === "muted"
            ? "text-subtle-foreground"
            : "text-primary",
        align === "center" && "justify-center",
        className,
      )}
    >
      {children}
    </p>
  );
}
