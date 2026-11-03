"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { WorkflowScene } from "./workflow-scene";
import { sceneKind } from "./scene-art";

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
 * for crawlers; only the active scene mounts. CSS-hidden desktop/mobile
 * twins share image URLs, and offscreen scenes never start their motion.
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
  const id = useId();

  function select(index: number) {
    setOpen(index);
  }

  const active = benefits[open];
  const hasArtwork = benefits.some((benefit) => benefit.image);

  return (
    <section className="benefit-studio benefit-studio--playground relative overflow-hidden py-20 md:py-28" data-scene-kind={active?.image ? sceneKind(active.image) : "editorial"}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        {heading && <SectionHeading eyebrow={eyebrow} heading={heading} />}

        {!hasArtwork ? (
          <div className="benefit-editorial mt-12">
            {benefits.map((benefit, index) => (
              <article key={benefit.title}>
                <span className="text-sm font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        ) : <div
          className={cn(
            "grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12",
            heading && "mt-10",
          )}
        >
          <div className={cn("benefit-studio__steps flex flex-col gap-3", active?.image ? "lg:col-span-5" : "lg:col-span-12")}>
            {benefits.map((benefit, index) => {
              const isOpen = index === open;
              return (
                <div
                  key={benefit.title}
                  className={cn(
                    "rounded-[1.25rem] border transition-all duration-300",
                    isOpen
                      ? "border-primary/35 bg-white shadow-[0_28px_56px_-36px_rgba(19,82,191,0.38)]"
                      : "border-[#09214c]/8 bg-white/70 hover:border-primary/25 hover:bg-white",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => select(index)}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-benefit-panel-${index}`}
                      id={`${id}-benefit-tab-${index}`}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className="font-numeric text-sm font-semibold text-primary tabular-nums"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-numeric text-base font-semibold tracking-[-0.02em]",
                            "text-foreground",
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
                            ? "rotate-180 text-primary"
                            : "text-subtle-foreground",
                        )}
                      />
                    </button>
                  </h3>

                  <div
                    id={`${id}-benefit-panel-${index}`}
                    role="region"
                    aria-labelledby={`${id}-benefit-tab-${index}`}
                    hidden={!isOpen}
                    className="px-5 pb-5"
                  >
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        "text-muted-foreground",
                      )}
                    >
                      {benefit.body}
                    </p>

                    {benefit.image && isOpen && (
                      <div className="mt-6 lg:hidden">
                        <WorkflowScene image={benefit.image} imageAlt={benefit.imageAlt ?? benefit.title} title={benefit.title} index={index} count={benefits.length} />
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
               "benefit-studio__well benefit-studio__well--live relative w-full lg:col-span-7 lg:self-start lg:sticky lg:top-28",
              active?.image ? "hidden lg:block" : "hidden",
            )}
          >
            {active?.image && <WorkflowScene image={active.image} imageAlt={active.imageAlt ?? active.title} title={active.title} index={open} count={benefits.length} />}
          </div>
        </div>}
      </Container>
    </section>
  );
}
