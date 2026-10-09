import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { solar_arrow_right_up_bold } from "./icons";
import { Ico } from "./Icon";

/**
 * Primitives for /preview-home-3 — the "Precision Ledger" system.
 *
 * Three conventions hold everywhere on the page:
 *
 *   - Radius is 3 / 4 / 6 / 8 / 10px and nothing else. Pills and 20px+ cards
 *     were the single biggest reason the draft read as friendly local SaaS.
 *   - Structure is drawn with hairlines, not shadows. Only two things on the
 *     page carry a shadow, and both of them are objects (the hero window and the
 *     app frame) rather than content.
 *   - Blue is a signal — a link, a state, one accent word, a checkmark. It is
 *     never a background behind body copy. Actions are near-black, and hovering
 *     one brings the brand in.
 *
 * Motion is opt-in through data attributes rather than a wrapper component:
 * `data-ph3-enter` marks a block, `data-ph3-split` marks a heading, and
 * `Motion3` reads both. Keeping them as attributes means the DOM carries no
 * extra divs just to hold a class, and the resting CSS state is the *final*
 * state — so the page is complete and readable before any script runs.
 */

export const containerClass =
  "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10";

/** Hairline vertical rails on the grid columns — the structural signature. */
export function Rails({ className }: { className?: string }) {
  return (
    <div className={cn("ph3-rails", className)} aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export function Shell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(containerClass, className)}>{children}</div>;
}

type Tone = "paper" | "surface" | "console";

const TONE: Record<Tone, string> = {
  paper: "bg-[var(--ph3-paper)]",
  surface: "bg-[var(--ph3-surface)]",
  console: "bg-[var(--ph3-console)] text-[var(--ph3-on-console)]",
};

export function Section({
  id,
  tone = "paper",
  rule = false,
  rails = false,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  /** Hairline above the section — how most bands separate without shadows. */
  rule?: boolean;
  /** Draw the column rails inside the section. */
  rails?: boolean;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate overflow-hidden py-16 sm:py-20 lg:py-24",
        TONE[tone],
        rule &&
          (tone === "console"
            ? "border-t border-[var(--ph3-console-line)]"
            : "border-t border-[var(--ph3-line)]"),
        className,
      )}
    >
      {rails ? <Rails /> : null}
      {children}
    </section>
  );
}

/** Monospace telemetry label. The page's section-index voice. */
export function Eyebrow({
  children,
  className,
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  tone?: "accent" | "muted" | "light";
}) {
  return (
    <p
      className={cn(
        "ph3-mono",
        tone === "accent" && "ph3-eyebrow",
        tone === "light" && "text-[var(--ph3-on-console-3)]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * A heading that reveals word by word.
 *
 * The words are rendered on the server as inline spans, which means the
 * accessible name is exactly the original string (a heading is a heading, not a
 * list of boxes) and the page is complete without JavaScript. `Motion3` only
 * writes a start transform onto `[data-ph3-word]`; nothing is hidden in CSS.
 *
 * `accent` marks the one word that carries the brand signal. Google Sans Flex
 * has no italic and none is synthesised — colour alone does the work.
 */
export function SplitHeading({
  id,
  text,
  accent,
  as: Tag = "h2",
  className,
  size = "display",
  motion = "scroll",
}: {
  id?: string;
  /** The heading text. A plain string, because it gets split into words. */
  text: string;
  /** The one brand-blue word. Kept separate so it can carry the accent. */
  accent?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** `display` for band headings, `display-2` a step down inside a band. */
  size?: "display" | "display-2";
  /**
   * `scroll` reveals on scroll (the default for band headings); `hero` hands the
   * words to the opening timeline instead; `off` leaves them alone.
   */
  motion?: "scroll" | "hero" | "off";
}) {
  const mask =
    "inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]";
  const word = "inline-block will-change-transform";

  const render = (
    text: string,
    key: string,
    isAccent: boolean,
    mode: "scroll" | "hero" | "off",
  ) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((token, index) => (
        // The mask is `overflow: hidden`, so it clips trailing whitespace. The
        // space therefore has to live *outside* it as a sibling — inside, it is
        // swallowed and every word runs together into one string.
        <Fragment key={`${key}-${index}`}>
          <span className={mask}>
            <span
              {...(mode === "scroll"
                ? { "data-ph3-word": "" }
                : mode === "hero"
                  ? { "data-ph3-hero-word": "" }
                  : {})}
              className={cn(word, isAccent && "text-[var(--ph3-accent)]")}
            >
              {token}
            </span>
          </span>{" "}
        </Fragment>
      ));

  return (
    <Tag
      id={id}
      data-ph3-split={motion === "scroll" ? "" : undefined}
      className={cn("ph3-display", size === "display-2" && "ph3-display-2", className)}
    >
      {text ? render(text, "a", false, motion) : null}
      {accent ? render(accent, "b", true, motion) : null}
    </Tag>
  );
}

/**
 * Band header: index, heading, lede.
 *
 * `split` is off by default because `SplitHeading` needs plain strings, not
 * arbitrary nodes — every band on this page has a single-string heading, so the
 * constraint costs nothing and it keeps the heading text in one typed field.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  accent,
  body,
  index,
  tone = "paper",
  align = "left",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  accent?: string;
  body?: string;
  /** Two-digit section index, rendered in the margin like a spec sheet. */
  index?: string;
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "console";
  return (
    <div
      data-ph3-enter
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {index ? (
          <span
            className={cn(
              "ph3-mono text-[0.625rem]",
              dark && "text-[var(--ph3-on-console-3)]",
            )}
          >
            {index}
          </span>
        ) : null}
        {eyebrow ? <Eyebrow tone={dark ? "light" : "accent"}>{eyebrow}</Eyebrow> : null}
      </div>

      <SplitHeading
        id={id}
        as="h2"
        text={title}
        accent={accent}
        size="display-2"
        className={cn(
          "text-[clamp(1.75rem,4.6vw,3.5rem)]",
          dark && "text-[var(--ph3-on-console)]",
          dark && "[&_span_span]:!text-[var(--ph3-on-console)]",
        )}
      />

      {body ? (
        <p
          className={cn(
            "ph3-lede max-w-[38rem] text-[1.0625rem]",
            dark && "text-[var(--ph3-on-console-2)]",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------------------
   actions
   -------------------------------------------------------------------------- */

type ActionVariant = "solid" | "outline" | "invert" | "ghost-invert";

const ACTION: Record<ActionVariant, string> = {
  solid: "ph3-btn-solid",
  outline: "ph3-btn-outline",
  invert: "ph3-btn-invert",
  "ghost-invert": "ph3-btn-ghost-invert",
};

export function Action({
  href,
  children,
  variant = "solid",
  arrow = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  /** Trailing arrow that travels with the label on hover. */
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("ph3-btn", ACTION[variant], className)}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
      {arrow ? (
        <Ico icon={solar_arrow_right_up_bold} size={15} className="ph3-arrow" />
      ) : null}
    </Link>
  );
}

/** Inline text link. The only place blue appears as text. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("ph3-link group text-[0.9375rem]", className)}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
      <Ico icon={solar_arrow_right_up_bold} size={14} className="ph3-arrow" />
    </Link>
  );
}

/* --------------------------------------------------------------------------
   figures
   -------------------------------------------------------------------------- */

/**
 * A headline figure. `value` is plain text so it is correct with JS disabled;
 * `Motion3` re-renders only the numeric run when it can, and writes the original
 * string back on completion.
 */
export function Figure({
  value,
  label,
  tone = "paper",
  size = "md",
  className,
}: {
  value: string;
  label?: string;
  tone?: Tone;
  size?: "lg" | "md";
  className?: string;
}) {
  const dark = tone === "console";
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        data-ph3-count={value}
        className={cn(
          "ph3-display ph3-num",
          size === "lg"
            ? "text-[clamp(2.5rem,5vw,3.5rem)]"
            : "text-[clamp(1.75rem,3.2vw,2.35rem)]",
          dark && "text-[var(--ph3-on-console)]",
        )}
      >
        {value}
      </span>
      {label ? (
        <span
          className={cn(
            "ph3-mono max-w-[16rem] text-[0.625rem] leading-[1.6]",
            dark ? "text-[var(--ph3-on-console-3)]" : undefined,
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Label + value row, the shape used in the app mock and the plan card. */
export function MetaRow({
  label,
  value,
  tone = "paper",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const dark = tone === "console";
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-2.5",
        "border-b",
        dark ? "border-[var(--ph3-console-line)]" : "border-[var(--ph3-line)]",
      )}
    >
      <span className="ph3-mono text-[0.625rem]">{label}</span>
      <span
        className={cn(
          "text-[0.875rem] font-medium tabular-nums",
          dark ? "text-[var(--ph3-on-console)]" : "text-[var(--ph3-ink)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}