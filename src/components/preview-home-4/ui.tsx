import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { solar_arrow_right_up_bold } from "./icons";
import { Ico } from "./Icon";

/**
 * Primitives for /preview-home-4 — "The product is the proof".
 *
 * The conventions that hold everywhere on the page:
 *
 *   - Radius collapses to 3 / 4 / 6 / 8 / 10px. Pills and 20px+ cards are what
 *     give a SaaS page a friendly local read, and geometry does more for tone
 *     than any colour choice.
 *   - Structure is drawn with hairlines, not shadows. Only two things carry a
 *     shadow and both are objects — the hero window and the browser frame — not
 *     content.
 *   - Blue is a signal: a link, a state, one accent word, a checkmark. Primary
 *     actions are near-black and bring the brand in on hover.
 *   - Every figure is tabular, so columns of numbers align and a count-up does
 *     not reflow its own column.
 *
 * Motion is opt-in through data attributes rather than a wrapper component:
 * `data-ph4-enter`, `data-ph4-stagger`, `data-ph4-split`, `data-ph4-drift`,
 * `data-ph4-rule`, `data-ph4-count`, `data-ph4-spot`. The
 * DOM carries no extra divs to hold a class, and the resting CSS state *is* the
 * finished state — so the page is complete and readable before any script runs.
 */

export const containerClass =
  "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10";

/** Hairline vertical rails on the grid columns — the structural signature. */
export function Rails({ className }: { className?: string }) {
  return (
    <div className={cn("ph4-rails", className)} aria-hidden>
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

export type Tone = "paper" | "surface" | "console" | "transparent";

const TONE: Record<Tone, string> = {
  paper: "bg-[var(--ph4-paper)]",
  surface: "bg-[var(--ph4-surface)]",
  console: "bg-[var(--ph4-console)] text-[var(--ph4-on-console)]",
  transparent: "",
};

export function Section({
  id,
  tone = "paper",
  rule = false,
  rails = false,
  labelledBy,
  className,
  children,
  /** Keep the band clipped. Disable only where a sticky descendant must
   *  survive — `overflow: hidden` would pin it in place and silently kill the
   *  stick. Clipping goes through `.ph4-clip`, which declares `clip` after
   *  `hidden`: `clip` does not create the scroll container that freezes a
   *  `view()` timeline, so the parallax inside the band still runs. */
  clip = true,
}: {
  id?: string;
  tone?: Tone;
  /** Hairline above the section — how most bands separate without shadows. */
  rule?: boolean;
  rails?: boolean;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  clip?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate py-20 sm:py-24 lg:py-32",
        clip && "ph4-clip",
        TONE[tone],
        tone === "console" && "ph4-console",
        rule &&
          (tone === "console"
            ? "border-t border-[var(--ph4-console-line)]"
            : "border-t border-[var(--ph4-line)]"),
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
        "ph4-mono",
        tone === "accent" && "ph4-eyebrow",
        tone === "light" && "text-[var(--ph4-on-console-3)]",
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
 * The words render as inline spans on the server, so the accessible name is
 * exactly the original string — a heading stays a heading, not a list of boxes —
 * and the page is complete without JavaScript. `Motion4` only writes a start
 * transform onto `[data-ph4-word]`; nothing is hidden in CSS.
 *
 * `accent` marks the one word carrying the brand signal. Google Sans Flex has
 * no italic and none is synthesised, so colour alone does the work.
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
  text: string;
  accent?: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** `none` leaves the size entirely to `className` — for type that already
   *  declares its own scale, like a pull quote. */
  size?: "display" | "display-2" | "display-hero" | "none";
  /** `scrub` emits the same words as `scroll` but marks the *block* for the
   *  scroll-linked reveal instead — a sentence that fills in as it passes
   *  rather than one that fires once. */
  motion?: "scroll" | "hero" | "scrub" | "off";
}) {
  const mask = "ph4-mask";
  const word = "inline-block will-change-transform";

  const render = (
    text: string,
    key: string,
    isAccent: boolean,
    mode: "scroll" | "hero" | "scrub" | "off",
  ) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((token, index) => (
        // The mask clips trailing whitespace, so the space has to live outside
        // it as a sibling — inside, it is swallowed and the words run together.
        <Fragment key={`${key}-${index}`}>
          <span className={mask}>
            <span
              {...(mode === "off"
                ? {}
                : mode === "hero"
                  ? { "data-ph4-hero-word": "" }
                  : { "data-ph4-word": "" })}
              className={cn(word, isAccent && "ph4-accent-word")}
            >
              {token}
            </span>
          </span>{" "}
        </Fragment>
      ));

  return (
    <Tag
      id={id}
      data-ph4-split={motion === "scroll" ? "" : undefined}
      data-ph4-scrub={motion === "scrub" ? "" : undefined}
      className={cn(
        "ph4-display",
        size === "display-2" && "ph4-display-2",
        size === "display-hero" && "ph4-display-hero",
        className,
      )}
    >
      {text ? render(text, "a", false, motion) : null}
      {accent ? render(accent, "b", true, motion) : null}
    </Tag>
  );
}

/** Band header: index, heading, lede. */
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
      data-ph4-enter
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" &&
          body &&
          "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-x-16",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {index ? (
            <span
              className={cn(
                "ph4-mono text-[0.625rem]",
                dark && "text-[var(--ph4-on-console-3)]",
              )}
            >
              {index}
            </span>
          ) : null}
          {eyebrow ? (
            <Eyebrow tone={dark ? "light" : "accent"}>{eyebrow}</Eyebrow>
          ) : null}
        </div>

        <SplitHeading
          id={id}
          as="h2"
          text={title}
          accent={accent}
          size="display-2"
          className={cn(
            "text-[clamp(2rem,5.2vw,3.75rem)]",
            dark && "text-[var(--ph4-on-console)]",
          )}
        />
      </div>

      {body ? (
        <p
          className={cn(
            "ph4-lede max-w-[36rem] text-[1.0625rem]",
            align === "left" && "lg:pb-1.5",
            dark && "text-[var(--ph4-on-console-2)]",
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
  solid: "ph4-btn-solid",
  outline: "ph4-btn-outline",
  invert: "ph4-btn-invert",
  "ghost-invert": "ph4-btn-ghost-invert",
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
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("ph4-btn", ACTION[variant], className)}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
      {arrow ? (
        <Ico icon={solar_arrow_right_up_bold} size={15} className="ph4-arrow" />
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
      className={cn("ph4-link group text-[0.9375rem]", className)}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
      <Ico icon={solar_arrow_right_up_bold} size={14} className="ph4-arrow" />
    </Link>
  );
}

/* --------------------------------------------------------------------------
   figures
   -------------------------------------------------------------------------- */

/**
 * A headline figure. `value` is plain text so it is correct with JS disabled;
 * `Motion4` re-renders only the numeric run when it can, and writes the original
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
        data-ph4-count={value}
        className={cn(
          "ph4-display ph4-num",
          size === "lg"
            ? "text-[clamp(2.5rem,5vw,3.5rem)]"
            : "text-[clamp(1.75rem,3.2vw,2.35rem)]",
          dark && "text-[var(--ph4-on-console)]",
        )}
      >
        {value}
      </span>
      {label ? (
        <span
          className={cn(
            "ph4-mono max-w-[16rem] text-[0.625rem] leading-[1.6]",
            dark ? "text-[var(--ph4-on-console-3)]" : undefined,
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
        dark ? "border-[var(--ph4-console-line)]" : "border-[var(--ph4-line)]",
      )}
    >
      <span className="ph4-mono text-[0.625rem]">{label}</span>
      <span
        className={cn(
          "text-[0.875rem] font-medium tabular-nums",
          dark ? "text-[var(--ph4-on-console)]" : "text-[var(--ph4-ink)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * A product screenshot inside a hairline browser frame.
 *
 * The frame is the one place on the page allowed a shadow, because the thing it
 * wraps is an object rather than content. `Image` uses `sizes` tied to the
 * rendered box so a wide capture never downloads at 3840 into a 900px slot.
 */
export function ProductShot({
  src,
  alt,
  url,
  width = 1600,
  height = 1000,
  sizes = "(min-width: 1024px) 900px, 100vw",
  priority = false,
  className,
  frameClassName,
}: {
  src: string;
  alt: string;
  /** The address bar text. Makes the capture read as a real session. */
  url?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  frameClassName?: string;
}) {
  return (
    <figure
      className={cn(
        "ph4-shot overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-white)]",
        "shadow-[0_1px_2px_rgba(10,10,11,0.06),0_24px_60px_-34px_rgba(10,10,11,0.35)]",
        frameClassName,
      )}
    >
      {url ? (
        <div className="flex items-center gap-2 border-b border-[var(--ph4-line)] bg-[var(--ph4-surface)] px-3 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ph4-line-2)]" />
          </span>
          <span className="ph4-window-url">{url}</span>
        </div>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn("block w-full bg-white", className)}
      />
    </figure>
  );
}
