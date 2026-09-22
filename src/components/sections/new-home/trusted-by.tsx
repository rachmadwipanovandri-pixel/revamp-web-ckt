"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useInViewport } from "@/hooks/use-in-viewport";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { cn } from "@/lib/utils";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  "natureCraft",
  "threeland",
  "putiih",
  "wallStreet",
  "rumahZakat",
] as const;

const ROTATE_MS = 7000;

export function TrustedBy() {
  const t = useTranslations("home.trustedBy");
  const tq = useTranslations("home.testimonials");
  const [activeId, setActiveId] = useState<string>(TESTIMONIALS[0]);
  const quotesRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(quotesRef, 0.3);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate || !inView) return;
    const timer = setTimeout(() => {
      setActiveId((prev) => {
        const index = TESTIMONIALS.findIndex((id) => id === prev);
        return TESTIMONIALS[(index + 1) % TESTIMONIALS.length];
      });
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [activeId, autoRotate, inView]);

  return (
    <>
      {/* Editorial stats act — compact so a laptop fold can hold both columns */}
      <SectionShell surface="white" padded={false}>
        <div className="pt-12 pb-14 md:pt-14 md:pb-16">
          <Reveal>
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <SectionHeading
                  chapter="01"
                  eyebrow={t("partnersHeading")}
                  title={t("heading")}
                  titleClassName="text-foreground text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.08]"
                />

                <div className="mt-8 flex flex-col">
                  {(["stat1", "stat2"] as const).map((stat, index) => (
                    <div
                      key={stat}
                      className={cn(
                        "group py-5",
                        index > 0 && "border-t border-foreground/10",
                      )}
                    >
                      <p className="font-numeric text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-primary tabular-nums whitespace-nowrap">
                        {t(`${stat}Value`)}
                      </p>
                      <p className="mt-1.5 max-w-sm text-[0.78rem] tracking-wide text-muted-foreground uppercase">
                        {t(`${stat}Label`)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-8">
                  <Image
                    src="/images/home/meta-icon.webp"
                    alt="Meta"
                    width={960}
                    height={194}
                    className="h-auto w-20 object-contain sm:w-24"
                  />
                  <Image
                    src="/images/home/tiktok.svg"
                    alt="TikTok"
                    width={2500}
                    height={731}
                    className="h-auto w-20 object-contain sm:w-24"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-surface-muted/60 p-5 md:p-6">
                  <span
                    aria-hidden
                    className="chapter-ghost absolute -top-3 -right-1 text-primary/8"
                  >
                    3k+
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-20 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                  />

                  <div className="relative mb-4 flex items-center justify-between gap-3 border-b border-foreground/10 pb-3">
                    <p className="font-numeric text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
                      {t("partnersHeading")}
                    </p>
                    <span
                      aria-hidden
                      className="font-numeric text-[0.68rem] font-bold tracking-[0.14em] text-subtle-foreground"
                    >
                      15+
                    </span>
                  </div>

                  {/* Content-sized tiles — card hugs the grid, no dead space below */}
                  <div className="relative grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
                    {TRUSTED_LOGOS.map((logo, index) => (
                      <div
                        key={logo.src}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className="group flex min-h-[3.4rem] animate-fade-in-up-blur items-center justify-center rounded-xl border border-foreground/6 bg-white/70 px-2.5 py-3 shadow-[0_8px_20px_-16px_rgba(16,24,40,0.4)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-[0_14px_28px_-18px_rgba(19,82,191,0.35)] motion-reduce:animate-none"
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={logo.width}
                          height={logo.height}
                          className="h-6 w-auto max-w-full object-contain opacity-60 grayscale transition duration-400 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:h-7"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="relative mt-4 border-t border-foreground/10 pt-3 text-center text-xs text-muted-foreground">
                    {t("moreClients")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Quote act — oversized metric as the hero of the card */}
      <SectionShell surface="void">
        <div
          aria-hidden
          className="ink-noise pointer-events-none absolute inset-0 opacity-50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-primary/35 blur-[110px]"
        />
        <div
          ref={quotesRef}
          className="relative grid gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <Reveal className="lg:col-span-5">
            <SectionHeading
              chapter="02"
              tone="ink"
              title={tq("heading")}
              lede={tq("body")}
            />
          </Reveal>

          <div className="lg:col-span-7">
            <div
              key={activeId}
              className="animate-fade-in-up-blur glass-ink relative overflow-hidden rounded-[1.75rem] p-7 md:p-10"
            >
              <div className="relative">
                <p className="font-numeric text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none font-semibold tracking-[-0.05em] text-sky-300 tabular-nums break-words">
                  {tq(`${activeId}.metricValue`)}
                </p>
                <p className="mt-3 max-w-md text-sm leading-snug text-primary-foreground-muted">
                  {tq(`${activeId}.metricLabel`)}
                </p>
                <blockquote className="mt-8 text-xl leading-[1.35] font-medium tracking-[-0.02em] text-white md:text-2xl">
                  &ldquo;{tq(`${activeId}.quote`)}&rdquo;
                </blockquote>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-semibold text-white">
                    {tq(`${activeId}.industry`)}
                  </p>
                  <p className="text-primary-foreground-muted">
                    {tq(`${activeId}.function`)}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground-muted/80">
                    {tq(`${activeId}.name`)}, {tq(`${activeId}.role`)},{" "}
                    {tq(`${activeId}.company`)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 -ml-2 flex items-center gap-1">
              {TESTIMONIALS.map((id) => {
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
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full focus-visible:ring-3 focus-visible:ring-sky-400/50 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive
                          ? "h-2.5 w-8 bg-sky-300"
                          : "size-2.5 bg-white/30 hover:bg-white/55",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
