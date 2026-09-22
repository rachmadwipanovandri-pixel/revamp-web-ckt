"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInViewport } from "@/hooks/use-in-viewport";
import { cn } from "@/lib/utils";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export type ShowcaseFeature = {
  key: string;
  image: string;
  title: string;
  description: string;
};

type Layout = "media-top" | "media-left";

const AUTOPLAY_MS = 5600;

/**
 * Product-story carousel with editorial chrome: oversized index tabs,
 * media bleeding past the text column, optional ink surface.
 */
export function FeatureShowcase({
  features,
  layout = "media-top",
  surface = "white",
  eyebrow,
  heading,
  lede,
  backgroundImage = "/images/home/platform-overview-background.png",
  chapter,
  className,
}: {
  features: ShowcaseFeature[];
  layout?: Layout;
  surface?: "white" | "muted" | "subtle" | "brand-soft" | "ink" | "void" | "gradient-brand";
  eyebrow?: string;
  heading?: string;
  lede?: string;
  backgroundImage?: string;
  chapter?: string;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInViewport(sectionRef, 0.25);
  const [paused, setPaused] = useState(false);

  const active = features[activeIndex];
  const isInk =
    surface === "ink" || surface === "void" || surface === "gradient-brand";

  useEffect(() => {
    if (!inView || paused) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % features.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, inView, paused, features.length]);

  const media = (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border p-2 shadow-[0_32px_64px_-36px_rgba(16,24,40,0.4)]",
        isInk
          ? "border-white/12 bg-white/6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
          : "border-foreground/8 bg-white",
      )}
    >
      <div className="mb-2 flex items-center gap-1.5 px-2 pt-1">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span
          aria-hidden
          className={cn(
            "ml-3 h-2 flex-1 rounded-full",
            isInk ? "bg-white/10" : "bg-surface-subtle",
          )}
        />
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          isInk ? "bg-ink-void" : "bg-surface-muted",
          layout === "media-top"
            ? "aspect-video"
            : "aspect-square md:aspect-video",
        )}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          className={cn("object-cover", isInk ? "opacity-40" : "opacity-55")}
        />
        <div key={active.key} className="absolute inset-0 animate-panel-in">
          <Image
            src={active.image}
            alt={active.title}
            fill
            className={cn(
              "object-cover",
              layout === "media-left" ? "object-center" : "object-bottom",
            )}
          />
        </div>
      </div>
    </div>
  );

  const tabs = (
    <div
      className={cn(
        "grid gap-3",
        layout === "media-top"
          ? "sm:grid-cols-3 sm:gap-4"
          : "flex flex-col gap-0 md:col-span-7",
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {features.map((feature, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={feature.key}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setPaused(true);
            }}
            aria-pressed={isActive}
            className={cn(
              "group rounded-2xl border p-1 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-3 focus-visible:outline-none",
              layout === "media-top" && "sm:p-2",
              layout === "media-left" &&
                "rounded-none border-x-0 border-t-0 py-6 last:border-b-0",
              isInk
                ? cn(
                    "border-white/8 focus-visible:ring-sky-400/50",
                    isActive
                      ? "border-sky-400/30 bg-white/8"
                      : "hover:bg-white/5",
                  )
                : cn(
                    "border-foreground/8 focus-visible:ring-primary/40",
                    isActive
                      ? "border-primary/25 bg-primary/[0.04]"
                      : "hover:bg-surface-muted/70",
                  ),
            )}
          >
            <div
              className={cn(
                "relative mb-4 h-px w-full overflow-hidden",
                isInk ? "bg-white/12" : "bg-foreground/10",
              )}
            >
              {isActive && (
                <div
                  key={`${activeIndex}-${paused}`}
                  className={cn(
                    "absolute inset-y-0 left-0 w-full origin-left",
                    isInk ? "bg-sky-300" : "bg-primary",
                    !paused && "animate-progress",
                  )}
                  style={
                    paused
                      ? { transform: "scaleX(1)", animationPlayState: "paused" }
                      : undefined
                  }
                />
              )}
            </div>
            <div className="px-2">
              <div className="mb-2 flex items-baseline gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "font-numeric text-[0.65rem] font-bold tracking-[0.18em]",
                    isInk
                      ? isActive
                        ? "text-sky-300"
                        : "text-white/30"
                      : isActive
                        ? "text-primary"
                        : "text-subtle-foreground",
                  )}
                >
                  0{index + 1}
                </span>
                <h3
                  className={cn(
                    "font-numeric text-lg font-semibold tracking-[-0.025em] transition-colors duration-500",
                    isInk
                      ? isActive
                        ? "text-white"
                        : "text-white/55"
                      : isActive
                        ? "text-foreground"
                        : "text-subtle-foreground",
                  )}
                >
                  {feature.title}
                </h3>
              </div>
              <p
                className={cn(
                  "text-sm leading-relaxed transition-colors duration-500 md:text-base",
                  isInk
                    ? isActive
                      ? "text-primary-foreground-muted"
                      : "text-white/40"
                    : isActive
                      ? "text-muted-foreground"
                      : "text-subtle-foreground/80",
                )}
              >
                {feature.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <SectionShell ref={sectionRef} surface={surface} className={className}>
      {(heading || eyebrow || lede) && (
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={heading ?? ""}
            lede={lede}
            chapter={chapter}
            tone={isInk ? "ink" : "light"}
          />
        </Reveal>
      )}

      {layout === "media-top" ? (
        <div className="mt-14 space-y-8">
          <Reveal delay={60}>{media}</Reveal>
          <Reveal delay={100}>{tabs}</Reveal>
        </div>
      ) : (
        <div className="mt-14 grid items-start gap-10 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-5 md:sticky md:top-28" delay={40}>
            {media}
          </Reveal>
          <Reveal className="md:col-span-7" delay={100}>
            {tabs}
          </Reveal>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {active.title}
      </p>
    </SectionShell>
  );
}
