"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

type Benefit = {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

/**
 * The homepage FeatureAccordion treatment, applied to a landing page's
 * benefits: one open at a time on the left, its artwork in a synced well on
 * the right. Replaces the alternating left/right rows on solution pages,
 * whose five zigzag blocks left more whitespace than content.
 *
 * Closed panels stay mounted (hidden) so all five bodies remain in the DOM
 * for crawlers; artwork mounts only once a panel has been opened, and the
 * mobile in-panel copy shares the desktop well's sizes string so the two
 * CSS-hidden twins dedupe to a single fetch.
 */
export function BenefitAccordion({
  eyebrow,
  heading,
  benefits,
}: {
  eyebrow?: string;
  heading?: string;
  benefits: Benefit[];
}) {
  const [open, setOpen] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);

  function select(index: number) {
    setOpen(index);
    setSeen((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }

  const active = benefits[open];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        {heading && <SectionHeading eyebrow={eyebrow} heading={heading} />}

        <div
          className={cn(
            "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12",
            heading && "mt-10",
          )}
        >
          <div className="flex flex-col gap-3 lg:col-span-6">
            {benefits.map((benefit, index) => {
              const isOpen = index === open;
              return (
                <div
                  key={benefit.title}
                  className={cn(
                    "rounded-[1.25rem] border transition-all duration-300",
                    isOpen
                      ? "border-primary/40 bg-ink-void shadow-[0_24px_48px_-32px_rgba(15,31,58,0.75)]"
                      : "border-foreground/8 bg-surface-muted/60 hover:border-primary/25 hover:bg-white",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => select(index)}
                      aria-expanded={isOpen}
                      aria-controls={`benefit-panel-${index}`}
                      id={`benefit-tab-${index}`}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={cn(
                            "font-numeric text-sm font-semibold tabular-nums",
                            isOpen ? "text-sky-300" : "text-primary/60",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-numeric text-base font-semibold tracking-[-0.02em]",
                            isOpen ? "text-white" : "text-foreground",
                          )}
                        >
                          {benefit.title}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-5 shrink-0 transition-transform",
                          isOpen
                            ? "rotate-180 text-sky-200"
                            : "text-subtle-foreground",
                        )}
                      />
                    </button>
                  </h3>

                  <div
                    id={`benefit-panel-${index}`}
                    role="region"
                    aria-labelledby={`benefit-tab-${index}`}
                    hidden={!isOpen}
                    className="px-5 pb-5"
                  >
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        isOpen ? "text-sky-50/85" : "text-muted-foreground",
                      )}
                    >
                      {benefit.body}
                    </p>

                    {benefit.image && seen.includes(index) && (
                      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl bg-white lg:hidden">
                        <Image
                          src={benefit.image}
                          alt={benefit.imageAlt ?? ""}
                          fill
                          sizes="(max-width: 1024px) 100vw, 560px"
                          className="object-contain p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rendered only when the open item actually has artwork, so a
              text-only benefit leaves no empty box beside it. */}
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-surface-muted shadow-[0_24px_50px_-40px_rgba(16,24,40,0.45)] lg:col-span-6 lg:self-stretch",
              active.image ? "hidden lg:block" : "hidden",
            )}
          >
            {benefits.map((benefit, index) =>
              benefit.image && seen.includes(index) ? (
                <Image
                  key={benefit.title}
                  src={benefit.image}
                  alt={index === open ? (benefit.imageAlt ?? "") : ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className={cn(
                    "object-contain p-6 transition-opacity duration-500",
                    index === open ? "opacity-100" : "opacity-0",
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
