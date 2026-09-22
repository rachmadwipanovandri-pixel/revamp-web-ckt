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
 * to whichever is open.
 *
 * Closed panels hold their portrait in greyscale and the open one restores
 * colour, which is the reference's own device and, usefully, the reason eight
 * photographers' photos can sit together: only ever one is in colour, so their
 * palettes never appear side by side. The scrim under the label goes brand blue
 * on the open panel, so the photography still reads as ours.
 *
 * The row scrolls horizontally on phones, where eight panels cannot share a
 * viewport, and the active panel is scrolled into view whenever it changes so
 * the arrows work there too.
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

  // Wraps in both directions, so neither arrow is ever a dead end.
  const go = (target: number) => {
    const index = (target + panels.length) % panels.length;
    setActiveIndex(index);
    // Optional call: not every environment implements scrollIntoView, and
    // bringing a panel into view is a nicety, not the feature.
    panelRefs.current[index]?.scrollIntoView?.({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <div className="mt-10">
      {/* Scrollbar hidden rather than styled: on phones this row is swiped,
          and a visible bar under the panels reads as a stray rule. */}
      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={panel.id}
              className={cn(
                "shrink-0 transition-[flex-grow,width] duration-500 ease-out motion-reduce:transition-none sm:w-auto sm:shrink sm:basis-0",
                isActive ? "w-56 sm:grow-[5]" : "w-24 sm:grow",
              )}
            >
              <button
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                type="button"
                aria-pressed={isActive}
                onClick={() => go(index)}
                className="relative flex h-72 w-full cursor-pointer flex-col justify-end overflow-hidden rounded-xl bg-surface-muted p-4 text-left sm:h-[21rem]"
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
                    "object-cover transition-[filter] duration-500 motion-reduce:transition-none",
                    !isActive && "grayscale",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-colors duration-500 motion-reduce:transition-none",
                    isActive
                      ? "bg-gradient-to-t from-primary-dark/90 via-primary-dark/25 to-transparent"
                      : "bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent",
                  )}
                />
                <span
                  className={cn(
                    "relative font-numeric font-semibold text-white",
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
          same three-part row the panels sit on top of. */}
      <div className="mt-7 grid gap-7 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-5">
          <p className="text-base text-muted-foreground">
            {active.description}
          </p>
          <Link
            href={{
              pathname: "/industries/[slug]",
              params: { slug: active.slug },
            }}
            className="mt-4 inline-flex min-h-7 items-center gap-1.5 border-b border-primary/40 pb-0.5 font-numeric text-sm font-semibold text-primary transition-colors hover:border-primary"
          >
            {labels.learnMore}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <div className="lg:col-span-5">
          <p className="font-numeric text-sm font-semibold text-foreground">
            {labels.useCases}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {active.useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-full border border-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
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
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            onClick={() => go(activeIndex + 1)}
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
