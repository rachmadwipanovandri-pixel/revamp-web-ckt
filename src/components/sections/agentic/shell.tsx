import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared chapter shell for the incident.io-style homepage redesign.
 * Calm editorial surfaces, product-UI frames, no glow orbs.
 */

/** Full-bleed photo with a dark wash for text overlays. */
export function PhotoOverlay({
  src,
  alt = "",
  className,
  wash = "from-[#0B1220]/85 via-[#0B1220]/55 to-[#0B1220]/70",
  priority,
}: {
  src: string;
  alt?: string;
  className?: string;
  wash?: string;
  priority?: boolean;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className={cn("absolute inset-0 bg-linear-to-b", wash)} />
    </div>
  );
}

export function SectionBand({
  children,
  tone = "white",
  className,
  id,
}: {
  children: ReactNode;
  tone?: "white" | "soft" | "ink";
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        tone === "white" && "bg-white text-foreground",
        tone === "soft" && "bg-[#F6F7F9] text-foreground",
        tone === "ink" && "bg-[#0B1220] text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "brand" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-numeric text-[0.7rem] font-semibold tracking-[0.16em] uppercase",
        tone === "brand" && "text-primary",
        tone === "ink" && "text-[#667085]",
        tone === "light" && "text-white/55",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-6",
          tone === "brand" && "bg-primary/50",
          tone === "ink" && "bg-foreground/20",
          tone === "light" && "bg-white/30",
        )}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  lead,
  accent,
  body,
  tone = "ink",
  align = "split",
  className,
  actions,
}: {
  eyebrow?: ReactNode;
  lead: ReactNode;
  accent?: ReactNode;
  body?: ReactNode;
  tone?: "ink" | "light";
  align?: "split" | "center";
  className?: string;
  actions?: ReactNode;
}) {
  const heading = (
    <h2
      className={cn(
        "text-[clamp(2rem,3.8vw,3.15rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance",
        tone === "light" ? "text-white" : "text-[#0C111D]",
      )}
    >
      {lead}
      {accent ? (
        <>
          {" "}
          <span
            className={
              tone === "light" ? "text-[#8EC5FF]" : "text-primary"
            }
          >
            {accent}
          </span>
        </>
      ) : null}
    </h2>
  );

  const copy = body ? (
    <p
      className={cn(
        "max-w-xl text-base leading-[1.65] md:text-[1.0625rem]",
        tone === "light" ? "text-white/70" : "text-[#525C6B]",
      )}
    >
      {body}
    </p>
  ) : null;

  if (align === "center") {
    return (
      <div className={cn("mx-auto max-w-3xl text-center", className)}>
        {eyebrow ? (
          <div className="mb-5 flex justify-center">
            <Eyebrow tone={tone === "light" ? "light" : "brand"}>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        {heading}
        {copy ? <div className="mx-auto mt-5">{copy}</div> : null}
        {actions ? <div className="mt-8 flex justify-center">{actions}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10",
        className,
      )}
    >
      <div className="lg:col-span-7">
        {eyebrow ? (
          <div className="mb-5">
            <Eyebrow tone={tone === "light" ? "light" : "brand"}>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        {heading}
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {copy ? <div className="lg:col-span-5 lg:pb-1">{copy}</div> : null}
    </div>
  );
}

/** Soft elevated card — incident.io product/story card language. */
export function SoftCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white",
        "shadow-[0_1px_2px_rgba(12,17,29,0.04),0_18px_40px_-28px_rgba(12,17,29,0.18)]",
        hover &&
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-30px_rgba(19,82,191,0.28)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Browser chrome for product UI mockups. */
export function BrowserFrame({
  title,
  children,
  className,
  tone = "light",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.25rem] border shadow-[0_1px_2px_rgba(12,17,29,0.05),0_32px_64px_-36px_rgba(12,17,29,0.28)]",
        tone === "light"
          ? "border-[#0C111D]/[0.08] bg-white"
          : "border-white/10 bg-[#111827]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3.5 py-2.5",
          tone === "light"
            ? "border-[#0C111D]/[0.06] bg-[#F6F7F9]"
            : "border-white/10 bg-white/[0.04]",
        )}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-[#FF5F57]" />
          <span className="size-2 rounded-full bg-[#FEBC2E]" />
          <span className="size-2 rounded-full bg-[#28C840]" />
        </span>
        <p
          className={cn(
            "mx-auto max-w-[55%] truncate rounded-md px-2.5 py-0.5 font-numeric text-[0.7rem]",
            tone === "light"
              ? "bg-white text-[#667085]"
              : "bg-white/5 text-white/50",
          )}
        >
          {title ?? "app.cekat.ai"}
        </p>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

/** Compact metric chip used across story + proof chapters. */
export function MetricChip({
  value,
  label,
  tone = "ink",
  className,
}: {
  value: string;
  label: string;
  tone?: "ink" | "brand" | "light";
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "font-numeric text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums",
          tone === "brand" && "text-primary",
          tone === "ink" && "text-[#0C111D]",
          tone === "light" && "text-white",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 max-w-[15rem] text-sm leading-snug",
          tone === "light" ? "text-white/60" : "text-[#525C6B]",
        )}
      >
        {label}
      </p>
    </div>
  );
}

/** Quiet pill button used for secondary links. */
export function TextLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "ink" | "light" | "brand";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-2.5 font-numeric text-sm font-semibold transition-all duration-300",
        tone === "brand" &&
          "border-primary/25 bg-white text-primary hover:border-primary/50 hover:shadow-[0_12px_28px_-18px_rgba(19,82,191,0.45)]",
        tone === "ink" &&
          "border-[#0C111D]/12 bg-white text-[#0C111D] hover:border-[#0C111D]/25 hover:bg-[#F6F7F9]",
        tone === "light" &&
          "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
