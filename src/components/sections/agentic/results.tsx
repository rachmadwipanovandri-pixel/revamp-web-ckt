"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useInViewport } from "@/hooks/use-in-viewport";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  SoftCard,
} from "@/components/sections/agentic/shell";

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

const STORY_COVERS = [
  {
    id: "natureCraft",
    image: "/images/home/case-study-naturecraft.jpg",
  },
  {
    id: "wallStreet",
    image: "/images/home/story-lead-cs.jpg",
  },
  {
    id: "putiih",
    image: "/images/home/story-retail-owner.jpg",
  },
] as const;

const ROTATE_MS = 7000;

/**
 * Customer stories chapter — rotating metric quote + photo story cards +
 * video wall, then a quiet logo marquee. Editorial, not a dashboard dump.
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
    <SectionBand tone="soft" className="py-20 md:py-28 lg:py-32" id="stories">
      <SectionShell>
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div ref={quotesRef} className="lg:col-span-5">
            <Reveal className="flex h-full flex-col">
              <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#667085] uppercase">
                {tq("heading")}
              </p>
              <p className="mt-3 max-w-md text-sm leading-[1.65] text-[#525C6B]">
                {tq("body")}
              </p>

              <SoftCard hover={false} className="mt-6 flex-1 p-7 md:p-8">
                <article key={activeId} className="animate-fade-in-up-blur">
                  <p className="font-numeric text-[clamp(1.85rem,3.5vw,2.75rem)] leading-none font-semibold tracking-[-0.045em] text-primary tabular-nums">
                    {tq(`${activeId}.metricValue`)}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-[#525C6B]">
                    {tq(`${activeId}.metricLabel`)}
                  </p>
                  <blockquote className="mt-5 text-base leading-[1.5] font-medium tracking-[-0.015em] text-[#0C111D] md:text-lg">
                    &ldquo;{tq(`${activeId}.quote`)}&rdquo;
                  </blockquote>
                  <footer className="mt-5 border-t border-[#0C111D]/[0.08] pt-4">
                    <p className="font-semibold text-[#0C111D]">
                      {tq(`${activeId}.company`)}
                    </p>
                    <p className="mt-0.5 text-sm text-[#525C6B]">
                      {tq(`${activeId}.name`)}, {tq(`${activeId}.role`)}
                    </p>
                    <p className="mt-1 text-xs text-[#98A2B3]">
                      {tq(`${activeId}.industry`)} · {tq(`${activeId}.function`)}
                    </p>
                  </footer>
                </article>
              </SoftCard>

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
                            : "size-2.5 bg-[#0C111D]/20 hover:bg-[#0C111D]/35",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:h-full">
            {/* Photo story grid — replace covers when real brand photography lands. */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {STORY_COVERS.map((story) => (
                <Reveal key={story.id} className="h-full">
                  <SoftCard className="group h-full overflow-hidden" hover={false}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.3rem]">
                      <Image
                        src={story.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 50vw, 18vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0B1220]/45 to-transparent" />
                    </div>
                    <div className="p-4">
                      <p className="font-numeric text-sm font-semibold text-[#0C111D]">
                        {tq(`${story.id}.company`)}
                      </p>
                      <p className="mt-1 font-numeric text-lg font-semibold tracking-[-0.03em] text-primary">
                        {tq(`${story.id}.metricValue`)}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-[#667085]">
                        {tq(`${story.id}.metricLabel`)}
                      </p>
                    </div>
                  </SoftCard>
                </Reveal>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 content-stretch gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-rows-2">
              {VIDEOS.slice(0, 4).map((video, index) => (
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
          <div className="flex flex-col gap-5 rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white px-6 py-6 md:flex-row md:items-center md:gap-10">
            <h3 className="shrink-0 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#667085] uppercase">
              {t("brandTitle")}
            </h3>
            <div className="min-w-0 flex-1 overflow-hidden">
              <MarqueeStrip logos={TRUSTED_LOGOS} />
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}
