import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Void keynote hero for secondary pages — same ground language as the
 * homepage Hero: deep navy gradient, film noise, soft orbs, and a fade into
 * white so the first light chapter below feels continuous.
 *
 * When `image` is set (industry landings with a stock portrait), the photo
 * fills the section as a background plate and the navy gradient rides over
 * it as an overlay, so the copy stays legible on the same void stage.
 */
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
  /** Extra top padding when a solid navbar sits above (not transparent). */
  solidNav = false,
}: {
  eyebrow?: string;
  title: string;
  /** Optional gradient span appended to the title. */
  accent?: string;
  subtitle?: string;
  note?: string;
  chips?: string[];
  /** Optional industry photo used as the hero background. */
  image?: string;
  imageAlt?: string;
  /** Optional content (e.g. featured card) rendered under the copy block. */
  children?: React.ReactNode;
  className?: string;
  solidNav?: boolean;
}) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-ink-void text-white",
        solidNav ? "pt-28 lg:pt-32" : "pt-36 lg:pt-40",
        className,
      )}
    >
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ""}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center brightness-115 saturate-110 contrast-105"
        />
      )}
      {/* Photo path: only a light blue tint + edge gradients for type contrast —
          the subject must stay visible, not a navy blur. */}
      {hasImage ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#0a1a3d]/30"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#050b18]/85 via-[#050b18]/35 to-[#050b18]/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18]/55 via-transparent to-[#0b1220]/70"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]"
        />
      )}
      {/* Grain sits on the stage, not on the photo — keep it subtle when art is under. */}
      <div
        aria-hidden
        className={cn(
          "ink-noise pointer-events-none absolute inset-0",
          hasImage ? "opacity-15" : "opacity-55",
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className={cn(
            "animate-orb-drift absolute top-[10%] left-[6%] h-72 w-72 rounded-full blur-[110px]",
            hasImage ? "bg-primary/15" : "bg-primary/40",
          )}
        />
        <span
          className={cn(
            "animate-orb-drift absolute top-[30%] right-[4%] h-80 w-80 rounded-full blur-[120px]",
            hasImage ? "bg-accent-sky/10" : "bg-accent-sky/25",
          )}
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="hero-stagger mx-auto max-w-3xl text-center lg:max-w-4xl lg:text-left">
          {eyebrow && (
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur">
              <span
                aria-hidden
                className="animate-pulse-soft size-1.5 rounded-full bg-sky-300"
              />
              {eyebrow}
            </p>
          )}

          <h1 className="text-[clamp(2.1rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-white">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  {accent}
                </span>
              </>
            ) : null}
          </h1>

          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sky-50/85 lg:mx-0 lg:text-lg">
              {subtitle}
            </p>
          )}
          {note && (
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-sky-100/70 lg:mx-0">
              {note}
            </p>
          )}

          {chips && chips.length > 0 && (
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-numeric text-[0.72rem] font-semibold tracking-[0.12em] text-sky-100 uppercase backdrop-blur"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>

        {children && (
          <div className="mt-12 lg:mt-14" data-page-hero-children>
            {children}
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}
