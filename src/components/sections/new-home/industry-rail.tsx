"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { IndustryPanel } from "@/components/sections/home/industry-carousel-panels";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

type Labels = {
  useCases: string;
  learnMore: string;
  previous: string;
  next: string;
  heading: string;
  body: string;
  viewAll: string;
};

/**
 * Full-bleed horizontal snap rail. Hovering a slab expands it immediately
 * (click/tap also works). The CTA lives in normal flow under the use-case
 * pills — never absolutely positioned — so spacing cannot collide.
 */
export function IndustryRail({
  panels,
  labels,
}: {
  panels: IndustryPanel[];
  labels: Labels;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLUListElement>(null);

  const scrollToIndex = (index: number) => {
    const el = railRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const go = (target: number) => {
    const index = (target + panels.length) % panels.length;
    setActiveIndex(index);
    scrollToIndex(index);
  };

  return (
    <SectionShell surface="white" bleed>
      <div className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <SectionHeading
                chapter="04"
                title={labels.heading}
                lede={labels.body}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
              <Link
                href="/industries"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 py-3 font-numeric text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary"
              >
                {labels.viewAll}
                <span aria-hidden>&rarr;</span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={labels.previous}
                  onClick={() => go(activeIndex - 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-foreground/15 text-foreground transition-all hover:border-primary/50 hover:text-primary"
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={labels.next}
                  onClick={() => go(activeIndex + 1)}
                  className="grid size-11 cursor-pointer place-items-center rounded-full border border-foreground/15 text-foreground transition-all hover:border-primary/50 hover:text-primary"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={60} className="mt-12">
        <ul
          ref={railRef}
          className="snap-rail flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8"
        >
          {panels.map((panel, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={panel.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "relative h-[26rem] shrink-0 overflow-hidden rounded-[1.5rem] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:h-[28rem]",
                  isActive
                    ? "w-[min(88vw,28rem)] shadow-[0_30px_60px_-30px_rgba(16,24,40,0.45)] sm:w-[32rem]"
                    : "w-[min(70vw,16rem)] opacity-90 hover:opacity-100 sm:w-56",
                )}
              >
                {/* Full-bleed hit target for hover/click — not nested with the CTA link */}
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-label={panel.title}
                  onClick={() => {
                    setActiveIndex(index);
                    scrollToIndex(index);
                  }}
                  onFocus={() => setActiveIndex(index)}
                  className="absolute inset-0 z-10 cursor-pointer focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:ring-inset focus-visible:outline-none"
                />

                <Image
                  src={panel.photo}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 70vw, 500px"
                  className={cn(
                    "object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isActive ? "scale-100 grayscale-0" : "scale-105 grayscale",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isActive
                      ? "bg-linear-to-t from-ink-void via-ink-void/45 to-transparent"
                      : "bg-linear-to-t from-ink-void/90 via-ink-void/30 to-transparent",
                  )}
                />

                {/* Content above the hit target; CTA is interactive again */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col p-5 sm:p-6">
                  <span
                    className={cn(
                      "font-numeric font-semibold tracking-[-0.02em] text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      isActive
                        ? "text-2xl leading-tight sm:text-3xl"
                        : "text-base leading-snug",
                    )}
                  >
                    {panel.title}
                  </span>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      isActive
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex max-w-md flex-col gap-5">
                        <p className="text-sm leading-relaxed text-primary-foreground-muted">
                          {panel.description}
                        </p>

                        {panel.useCases.length > 0 && (
                          <ul className="flex flex-wrap gap-2">
                            {panel.useCases.slice(0, 4).map((useCase) => (
                              <li
                                key={useCase}
                                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.7rem] font-medium text-white/90 backdrop-blur"
                              >
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Separate row under the pills — no absolute collision */}
                        <div className="pt-1">
                          <Link
                            href={{
                              pathname: "/industries/[slug]",
                              params: { slug: panel.slug },
                            }}
                            className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-sky-400/40 bg-ink-void/70 px-5 py-2 font-numeric text-sm font-semibold text-sky-300 backdrop-blur transition-all duration-300 hover:gap-3 hover:border-sky-300 hover:bg-ink-void/90"
                          >
                            {labels.learnMore}
                            <span aria-hidden>&rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="font-numeric text-xs font-semibold tracking-[0.16em] text-subtle-foreground tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(panels.length).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-foreground/10">
            <div
              className="h-px bg-primary transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                width: `${((activeIndex + 1) / panels.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
