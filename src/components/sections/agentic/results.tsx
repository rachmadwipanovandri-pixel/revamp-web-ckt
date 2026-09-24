"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useInViewport } from "@/hooks/use-in-viewport";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { Reveal } from "@/components/sections/new-home/reveal";

const QUOTES = [
  "natureCraft",
  "threeland",
  "putiih",
  "wallStreet",
  "rumahZakat",
] as const;

const VIDEOS = [
  {
    id: "moir",
    videoId: "ePdVgW7X01s",
    imageSrc: "/images/home/testimonial-silica-brenda.jpg",
  },
  {
    id: "rumahZakat",
    videoId: "wvOip0Gkx30",
    imageSrc: "/images/chat/tantan-supriatna.png",
  },
  {
    id: "mnp",
    videoId: "O_xSafLehMQ",
    imageSrc: "/images/home/testimonial-hargyo.jpg",
  },
  {
    id: "vio",
    videoId: "681luT0Aa68",
    imageSrc: "/images/home/rianti-yahya.png",
  },
  {
    id: "dokterhub",
    videoId: "vmXUCHVo6k8",
    imageSrc: "/images/home/gerry-wilianto.png",
  },
  {
    id: "threeland",
    videoId: "IezNIgsGH5I",
    imageSrc: "/images/crm/adam-sulaiman.png",
  },
] as const;

const ROTATE_MS = 7000;

/**
 * One proof chapter: rotating metric quotes beside a dense 2×3 video wall
 * (stretched to match the quote column height), then the trusted-logo strip.
 */
export function Results() {
  const t = useTranslations("agentic.results");
  const tq = useTranslations("home.testimonials");
  const [activeId, setActiveId] = useState<string>(QUOTES[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const quotesRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(quotesRef, 0.3);

  useEffect(() => {
    if (!autoRotate || !inView) return;
    const timer = setTimeout(() => {
      setActiveId((prev) => {
        const index = QUOTES.findIndex((id) => id === prev);
        return QUOTES[(index + 1) % QUOTES.length];
      });
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [activeId, autoRotate, inView]);

  return (
    <section className="relative overflow-hidden bg-surface-muted py-14 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-primary/8 blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {t("headingLead")}{" "}
                <span className="text-primary">{t("headingAccent")}</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:pb-2 lg:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div ref={quotesRef} className="lg:col-span-5">
            <Reveal className="flex h-full flex-col">
              <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-subtle-foreground uppercase">
                {tq("heading")}
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {tq("body")}
              </p>

              <article
                key={activeId}
                className="animate-fade-in-up-blur mt-6 flex-1 rounded-[1.35rem] border border-foreground/10 bg-white p-6 shadow-[0_24px_50px_-36px_rgba(16,24,40,0.4)] md:p-7"
              >
                <p className="font-numeric text-[clamp(1.75rem,3.5vw,2.5rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums break-words">
                  {tq(`${activeId}.metricValue`)}
                </p>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">
                  {tq(`${activeId}.metricLabel`)}
                </p>
                <blockquote className="mt-5 text-base leading-[1.45] font-medium tracking-[-0.02em] text-foreground md:text-lg">
                  &ldquo;{tq(`${activeId}.quote`)}&rdquo;
                </blockquote>
                <footer className="mt-5 border-t border-foreground/10 pt-4">
                  <p className="font-semibold text-foreground">
                    {tq(`${activeId}.company`)}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {tq(`${activeId}.name`)}, {tq(`${activeId}.role`)}
                  </p>
                  <p className="mt-1 text-xs text-subtle-foreground">
                    {tq(`${activeId}.industry`)} · {tq(`${activeId}.function`)}
                  </p>
                </footer>
              </article>

              <div className="mt-4 -ml-2 flex items-center gap-1">
                {QUOTES.map((id) => {
                  const isActive = id === activeId;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setAutoRotate(false);
                        setActiveId(id);
                      }}
                      aria-label={tq(`${id}.company`)}
                      aria-current={isActive}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-full focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          isActive
                            ? "h-2.5 w-8 bg-primary"
                            : "size-2.5 bg-foreground/20 hover:bg-foreground/40",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Full-width stacked videos on phones; the dense 2×3 wall only
              kicks in once there is room for it (lg tracks the quote column). */}
          <div className="lg:col-span-7 lg:h-full">
            <div className="grid grid-cols-1 content-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:h-full lg:grid-rows-3 lg:gap-4">
              {VIDEOS.map((video, index) => (
                <Reveal
                  key={video.videoId}
                  delay={index * 40}
                  className="h-full min-h-0"
                >
                  <div className="h-full">
                    <TestimonialVideoCard
                      videoId={video.videoId}
                      name={tq(`videos.${video.id}.name`)}
                      role={tq(`videos.${video.id}.role`)}
                      imageSrc={video.imageSrc}
                      compact
                      fill
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={60} className="mt-14">
          <div className="flex flex-col gap-5 rounded-[1.5rem] border border-foreground/8 bg-white px-6 py-6 shadow-[0_16px_40px_-32px_rgba(16,24,40,0.35)] md:flex-row md:items-center md:gap-10">
            <h3 className="shrink-0 font-numeric text-sm font-bold tracking-[0.16em] text-foreground uppercase">
              {t("brandTitle")}
            </h3>
            <div className="min-w-0 flex-1 overflow-hidden">
              <MarqueeStrip logos={TRUSTED_LOGOS} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
