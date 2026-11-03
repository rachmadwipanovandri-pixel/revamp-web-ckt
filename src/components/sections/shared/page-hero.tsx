import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeroEntrance } from "./hero-entrance";
import { HighlightedText } from "./highlighted-text";

/** Shared editorial opening for the site pages. The homepage keeps its own hero. */
export function PageHero({
  eyebrow,
  title,
  accent,
  subtitle,
  note,
  chips,
  image,
  imageAlt,
  children,
  className,
  solidNav = false,
  align = "center",
  compactCenter = false,
  visual,
  split = false,
  tone,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  note?: string;
  chips?: string[];
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
  solidNav?: boolean;
  align?: "left" | "center";
  compactCenter?: boolean;
  visual?: React.ReactNode;
  split?: boolean;
  tone?: string;
}) {
  const centered = align === "center" && !split;

  return (
    <section
      data-tone={tone}
      className={cn(
        "secondary-hero relative isolate overflow-hidden border-b border-[#e5e9ef] bg-white text-[#09214c]",
        split && "secondary-hero--split",
        solidNav ? "pt-24 lg:pt-28" : "pt-20 lg:pt-24",
        className,
      )}
    >
      <HeroEntrance />
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-15"
        />
      )}
      <div
        aria-hidden
        className="secondary-hero__color-field pointer-events-none absolute inset-0"
      />

      <div className={cn("secondary-hero__layout relative z-10 mx-auto w-full max-w-[1248px] px-5 pb-16 sm:px-8 md:pb-20 lg:px-6 lg:pb-24", split && "lg:grid lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-12")}>
        <div className="min-w-0">
        <div
          className={cn(
            "flex w-full flex-col",
            centered
              ? "mx-auto items-center text-center"
              : "items-start text-left",
            compactCenter ? "max-w-[850px]" : "max-w-[930px]",
          )}
        >
          {eyebrow && (
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-[#1352bf]">
              <span aria-hidden className="size-1.5 rounded-full bg-[var(--brand-cyan)]" />
              {eyebrow}
            </p>
          )}
          <h1 className={cn("max-w-[18ch] text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.06] font-semibold tracking-[-0.055em] text-balance text-[#09214c]", split && "lg:text-[clamp(2.75rem,4.2vw,3.9rem)]")}>
            {accent ? title : <HighlightedText text={title} />}
            {accent && <span className="headline-highlight"> {accent}</span>}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-[650px] text-[clamp(1.0625rem,1.2vw,1.25rem)] leading-[1.6] text-[#3a4960]">
              {subtitle}
            </p>
          )}
          {note && (
            <p className="mt-4 max-w-[650px] text-sm leading-relaxed text-[#505f73]">
              {note}
            </p>
          )}
          {chips && chips.length > 0 && (
            <ul
              className={cn(
                "mt-7 flex flex-wrap gap-2",
                centered && "justify-center",
              )}
            >
              {chips.map((chip) => (
                <li
                  key={chip}
                   className="inline-flex items-center gap-2 rounded-full border border-[#ccdaf1] bg-white px-3.5 py-1.5 text-sm font-medium text-[#0a3173]"
                 >
                   <span aria-hidden className="size-1 shrink-0 rounded-full bg-primary" />
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
        {children && (
          <div
            data-page-hero-children
            className={cn(
              "mt-9",
              centered &&
                "flex w-full flex-wrap items-center justify-center gap-3",
              compactCenter && "mx-auto max-w-[850px]",
            )}
          >
            {children}
          </div>
        )}
        </div>
        {visual && <div className={cn("secondary-hero__visual min-w-0", split ? "mt-12 lg:mt-0" : "mt-14")}>{visual}</div>}
      </div>
    </section>
  );
}
