"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/new-home/reveal";

const COUNT = 6;

/**
 * Sticky-title FAQ (Linear pattern): heading locks left, accordion scrolls
 * right. Six objection questions covering cost, setup, skill, data, scale,
 * and commercial terms.
 */
export function Faq() {
  const t = useTranslations("agentic.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = Array.from({ length: COUNT }, (_, i) => i + 1);

  // No overflow-hidden on the section: that cancels sticky on the title column.
  return (
    <section className="relative bg-white py-14 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div
        aria-hidden
        className="surface-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {t("label")}
              </p>
              <h2 className="text-[clamp(1.85rem,3.5vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {t("heading")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                {t("body")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={item} delay={index * 40}>
                  <div
                    className={cn(
                      "mt-3 rounded-[1.15rem] border transition-all duration-300",
                      isOpen
                        ? "border-primary/25 bg-surface-muted/70 shadow-[0_20px_40px_-32px_rgba(19,82,191,0.4)]"
                        : "border-foreground/8 bg-white hover:border-primary/20",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-numeric text-[0.68rem] font-bold tracking-[0.14em] text-subtle-foreground tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-numeric text-base font-semibold tracking-[-0.02em] text-foreground md:text-lg">
                          {t(`q${item}`)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-white text-primary transition-transform duration-300",
                          isOpen && "rotate-180 bg-primary/10",
                        )}
                      >
                        <Icon icon={lucideChevronDown} className="size-4" />
                      </span>
                    </button>
                    <div
                      inert={!isOpen}
                      aria-hidden={!isOpen}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-3xl px-5 pb-5 font-numeric text-base leading-relaxed text-muted-foreground md:px-6 md:pl-[calc(1.5rem+2.1rem)]">
                          {t(`a${item}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
