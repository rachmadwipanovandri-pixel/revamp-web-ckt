"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type IndustryPanel = {
  id: string;
  slug: string;
  title: string;
  /** Portrait behind the panel; see public/images/industries/CREDITS.md. */
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
 * An expanding row of industry panels: the picked one opens wide and takes the
 * brand colour, the rest stay narrow and muted, and the copy underneath swaps
 * to whichever is open. Hover (or click/focus) picks a panel, so the rail
 * opens as soon as the pointer lands — no second click needed.
 *
 * Card language matches the homepage agentic grid: 1.35rem radius, soft
 * hairline borders, brand-blue scrim on the open panel, and the detail row
 * uses the same bordered pills / text tokens as Products and SoundWords.
 *
 * Closed panels hold their portrait in greyscale and the open one restores
 * colour so eight photographers' photos can sit together without clashing.
 * The row scrolls horizontally on phones; the active panel is scrolled into
 * view whenever it changes so the arrows work there too.
 */
export function IndustryCarouselPanels({
  panels,
  labels,
}: {
  panels: IndustryPanel[];
  labels: IndustryCarouselLabels;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = panels[activeIndex];

  const select = (index: number) => {
    setActiveIndex(index);
    // Optional call: not every environment implements scrollIntoView, and
    // bringing a panel into view is a nicety, not the feature.
    panelRefs.current[index]?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  // Wraps in both directions, so neither arrow is ever a dead end.
  const go = (target: number) => {
    select((target + panels.length) % panels.length);
  };

  return (
    <div>
      {/* Scrollbar hidden rather than styled: on phones this row is swiped,
          and a visible bar under the panels reads as a stray rule. */}
      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 sm:gap-3 [&::-webkit-scrollbar]:hidden">
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={panel.id}
              className={cn(
                "shrink-0 transition-[flex-grow,width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:w-auto sm:shrink sm:basis-0",
                isActive
                  ? "w-56 shadow-[0_24px_48px_-28px_rgba(19,82,191,0.45)] sm:grow-[5]"
                  : "w-24 sm:grow",
              )}
            >
              <button
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => select(index)}
                onMouseEnter={() => select(index)}
                onFocus={() => select(index)}
                className={cn(
                  "relative flex h-72 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-[1.35rem] border bg-surface-muted p-4 text-left transition-colors duration-500 focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none sm:h-[22rem]",
                  isActive
                    ? "border-primary/30"
                    : "border-foreground/8 hover:border-primary/20",
                )}
              >
                {/* Sized for the open panel, which is the widest a given
                    photo ever renders (around 483px at desktop). Any panel can
                    become the open one, so they all need that variant. The
                    square source is what lets one file serve both this frame
                    and the 96px sliver; see CREDITS.md before swapping one. */}
                <Image
                  src={panel.photo}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 224px, 500px"
                  className={cn(
                    "object-cover transition-[filter,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isActive ? "scale-100 grayscale-0" : "scale-105 grayscale",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-colors duration-500 motion-reduce:transition-none",
                    isActive
                      ? "bg-linear-to-t from-primary-dark/95 via-primary-dark/35 to-transparent"
                      : "bg-linear-to-t from-foreground/90 via-foreground/30 to-transparent",
                  )}
                />
                <span
                  className={cn(
                    "relative font-numeric font-semibold tracking-[-0.02em] text-white transition-all duration-500",
                    isActive
                      ? "text-xl leading-tight sm:text-2xl"
                      : "text-xs leading-snug sm:text-sm",
                  )}
                >
                  {panel.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* What the open panel is about, what it handles, and the arrows: the
          same three-part row the panels sit on top of, using the agentic
          card/pill tokens so it reads as one chapter with the grid above. */}
      <div className="mt-8 grid gap-6 rounded-[1.35rem] border border-foreground/8 bg-surface-muted/60 p-5 md:p-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="lg:col-span-5">
          <p className="text-base leading-relaxed text-muted-foreground">
            {active.description}
          </p>
          <Link
            href={{
              pathname: "/industries/[slug]",
              params: { slug: active.slug },
            }}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-white px-5 py-2 font-numeric text-sm font-semibold text-primary transition-all duration-300 hover:gap-3 hover:border-primary/50 hover:shadow-[0_16px_36px_-24px_rgba(19,82,191,0.5)]"
          >
            {labels.learnMore}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className="lg:col-span-5">
          <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-subtle-foreground uppercase">
            {labels.useCases}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {active.useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-xs font-medium text-foreground/75"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 lg:col-span-2 lg:justify-end">
          <button
            type="button"
            aria-label={labels.previous}
            onClick={() => go(activeIndex - 1)}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-foreground/15 text-foreground transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(activeIndex + 1)}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-foreground/15 text-foreground transition-all hover:border-primary/50 hover:text-primary focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
