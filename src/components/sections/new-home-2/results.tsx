"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useInViewport } from "@/hooks/use-in-viewport";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SplitHeading, Eyebrow } from "./split-heading";

const QUOTES = [
  "natureCraft",
  "threeland",
  "putiih",
  "wallStreet",
  "rumahZakat",
] as const;

const VIDEOS = [
  {
    name: "Silcia Brenda",
    role: "CEO & Founder - Moir Salon",
    videoId: "ePdVgW7X01s",
    imageSrc: "/images/home/testimonial-silica-brenda.jpg",
  },
  {
    name: "Tantan Supriantna",
    role: "Head Customer Relation - Rumah Zakat",
    videoId: "wvOip0Gkx30",
    imageSrc: "/images/chat/tantan-supriatna.png",
  },
  {
    name: "Adam Sulaiman",
    role: "President Director - Threeland Property",
    videoId: "IezNIgsGH5I",
    imageSrc: "/images/crm/adam-sulaiman.png",
  },
] as const;

const ROTATE_MS = 7000;

/**
 * Customer proof: rotating metric quote + a tight video wall. Numbers stay
 * front-and-center (ref 1’s stats energy) without the dark testimonial act.
 */
export function Results() {
  const t = useTranslations("home.testimonials");
  const tr = useTranslations("home.realResults");
  const [activeId, setActiveId] = useState<string>(QUOTES[0]);
  const quotesRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(quotesRef, 0.3);
  const [autoRotate, setAutoRotate] = useState(true);

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
    <section className="relative overflow-hidden bg-surface-muted py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={quotesRef} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Results</Eyebrow>
            <SplitHeading
              className="mt-5"
              lead="Revenue up,"
              accent="not just replies"
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {t("body")}
            </p>

            <div
              key={activeId}
              className="animate-fade-in-up-blur mt-8 rounded-[1.35rem] border border-foreground/10 bg-white p-6 shadow-[0_24px_50px_-36px_rgba(16,24,40,0.4)] md:p-8"
            >
              <p className="font-numeric text-[clamp(2rem,4vw,3rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums break-words">
                {t(`${activeId}.metricValue`)}
              </p>
              <p className="mt-3 max-w-md text-sm leading-snug text-muted-foreground">
                {t(`${activeId}.metricLabel`)}
              </p>
              <blockquote className="mt-6 text-lg leading-[1.4] font-medium tracking-[-0.02em] text-foreground md:text-xl">
                &ldquo;{t(`${activeId}.quote`)}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-foreground/10 pt-4">
                <p className="font-semibold text-foreground">
                  {t(`${activeId}.company`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`${activeId}.name`)}, {t(`${activeId}.role`)}
                </p>
              </div>
            </div>

            <div className="mt-6 -ml-2 flex items-center gap-1">
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
                    aria-label={t(`${id}.company`)}
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

          <Reveal className="lg:col-span-7" delay={80}>
            <p className="mb-5 font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-subtle-foreground uppercase">
              {tr("heading")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {VIDEOS.map((video) => (
                <div key={video.videoId} className="h-full">
                  <TestimonialVideoCard
                    videoId={video.videoId}
                    name={video.name}
                    role={video.role}
                    imageSrc={video.imageSrc}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
