"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type IndustryPanel = {
  id: string;
  slug: string;
  title: string;
  /** One-line positioning from the registry nav — the row's scannable summary. */
  tagline: string;
  /** Portrait for the row thumbnail and the open detail; see public/images/industries/CREDITS.md. */
  photo: string;
  description: string;
  useCases: string[];
};

export type IndustryCarouselLabels = {
  useCases: string;
  learnMore: string;
  previous: string;
  next: string;
};

/**
 * A ruled directory instead of a photo rail: every industry keeps its number,
 * portrait and tagline on screen, and picking a row unfolds that industry's
 * copy, use cases and portrait underneath it. The old rail left seven of the
 * eight as unreadable slivers behind the open one.
 *
 * Selection is click-driven, not hover-driven — a vertical accordion that
 * reflows under the pointer strands the row the user was aiming for. Hover
 * only tints the row and un-greys its thumbnail; the primary rule, tinted
 * well and rotated chevron mark the open one. Portraits stay greyscale until
 * their row opens so eight photographers' colours don't fight each other.
 *
 * Card language still matches the homepage agentic grid: 1.35rem radius, soft
 * hairline borders, the same bordered pills, and a footer carrying the
 * 01 / 08 counter the arrows wrap around in both directions.
 */
export function IndustryCarouselPanels({
  panels,
  labels,
}: {
  panels: IndustryPanel[];
  labels: IndustryCarouselLabels;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Wraps in both directions, so neither arrow is ever a dead end.
  const go = (target: number) => {
    setActiveIndex((target + panels.length) % panels.length);
  };

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-36px_rgba(12,17,29,0.2)]">
      <ul>
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={panel.id}
              className={cn(
                "transition-colors duration-300",
                index > 0 && "border-t border-[#0C111D]/[0.07]",
                isActive ? "bg-[#EFF4FD]" : "bg-white",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "group relative grid w-full cursor-pointer grid-cols-[1.25rem_2.5rem_minmax(0,1fr)_1rem] items-center gap-2.5 px-4 py-3.5 text-left transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-inset focus-visible:outline-none sm:grid-cols-[2.25rem_3.5rem_minmax(0,1fr)_1.25rem] sm:gap-4 sm:px-6 sm:py-4",
                    !isActive && "hover:bg-[#F6F7F9]/70",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px] transition-colors duration-300",
                      isActive ? "bg-primary" : "bg-transparent",
                    )}
                  />
                  <span
                    className={cn(
                      "font-numeric text-[0.7rem] font-semibold tracking-[0.14em] tabular-nums transition-colors duration-300",
                      isActive ? "text-primary" : "text-[#98A2B3]",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "relative h-8 w-10 shrink-0 overflow-hidden rounded-md border transition-colors duration-300 sm:h-9 sm:w-12",
                      isActive
                        ? "border-primary/30"
                        : "border-[#0C111D]/[0.08]",
                    )}
                  >
                    <Image
                      src={panel.photo}
                      alt=""
                      fill
                      sizes="48px"
                      className={cn(
                        "object-cover transition-[filter] duration-500 motion-reduce:transition-none",
                        isActive
                          ? "grayscale-0"
                          : "grayscale group-hover:grayscale-0",
                      )}
                    />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate font-numeric text-[0.95rem] font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-base",
                        isActive ? "text-[#0C111D]" : "text-[#0C111D]/85",
                      )}
                    >
                      {panel.title}
                    </span>
                    {panel.tagline ? (
                      <span className="mt-0.5 block truncate text-[0.8rem] leading-snug text-[#667085]">
                        {panel.tagline}
                      </span>
                    ) : null}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-4 shrink-0 justify-self-end transition-transform duration-300 motion-reduce:transition-none",
                      isActive
                        ? "rotate-180 text-primary"
                        : "text-[#98A2B3] group-hover:text-[#667085]",
                    )}
                  />
                </button>
              </h3>

              {/* Only the open row's detail exists in the DOM — a collapsed row
                  must not leak its copy into the page for find-in-page. */}
              {isActive && (
                <div className="animate-swap-in px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
                  <div className="grid gap-5 sm:grid-cols-12 sm:items-start sm:gap-6 lg:gap-8">
                    <div className="sm:col-span-7">
                      <p className="max-w-2xl text-[0.95rem] leading-[1.65] text-[#525C6B] md:text-base">
                        {panel.description}
                      </p>
                      <p className="mt-5 font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-subtle-foreground uppercase">
                        {labels.useCases}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {panel.useCases.map((useCase) => (
                          <li
                            key={useCase}
                            className="rounded-full border border-[#0C111D]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#0C111D]/75"
                          >
                            {useCase}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={{
                          pathname: "/industries/[slug]",
                          params: { slug: panel.slug },
                        }}
                        className="group mt-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-white px-5 py-2 font-numeric text-sm font-semibold text-primary transition-all duration-300 hover:gap-3 hover:border-primary/50 hover:shadow-[0_16px_36px_-24px_rgba(19,82,191,0.5)] focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
                      >
                        {labels.learnMore}
                        <span aria-hidden>&rarr;</span>
                      </Link>
                    </div>

                    <div className="sm:col-span-5">
                      <div className="relative aspect-[16/10] max-h-[16rem] w-full overflow-hidden rounded-xl border border-[#0C111D]/[0.08] bg-[#0C111D]/5 sm:aspect-auto sm:max-h-none sm:min-h-[16rem]">
                        <Image
                          src={panel.photo}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 460px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-[#0C111D]/[0.07] bg-white px-4 py-3 sm:px-6">
        <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.16em] text-[#98A2B3] tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(panels.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={labels.previous}
            onClick={() => go(activeIndex - 1)}
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-[#0C111D]/15 text-[#0C111D] transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(activeIndex + 1)}
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-[#0C111D]/15 text-[#0C111D] transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
