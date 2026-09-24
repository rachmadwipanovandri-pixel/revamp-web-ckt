"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  SectionBand,
  SectionShell,
  Eyebrow,
} from "@/components/sections/agentic/shell";

const COUNT = 6;

/**
 * Sticky-title FAQ — heading locks left, clean accordion scrolls right.
 */
export function Faq() {
  const t = useTranslations("agentic.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = Array.from({ length: COUNT }, (_, i) => i + 1);

  return (
    <SectionBand tone="white" className="py-20 md:py-28">
      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow tone="brand" className="mb-5">
                {t("label")}
              </Eyebrow>
              <h2 className="text-[clamp(2rem,3.5vw,2.85rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-[#0C111D]">
                {t("heading")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-[1.65] text-[#525C6B]">
                {t("body")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={item} delay={index * 35}>
                  <div
                    className={cn(
                      "mt-3 rounded-[1.1rem] border transition-all duration-300",
                      isOpen
                        ? "border-primary/25 bg-[#F6F7F9]"
                        : "border-[#0C111D]/[0.08] bg-white hover:border-[#0C111D]/15",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#98A2B3] tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-numeric text-base font-semibold tracking-[-0.02em] text-[#0C111D] md:text-lg">
                          {t(`q${item}`)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border border-[#0C111D]/10 bg-white text-primary transition-transform duration-300",
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
                        <p className="max-w-3xl px-5 pb-5 text-base leading-[1.65] text-[#525C6B] md:px-6 md:pl-[calc(1.5rem+2.1rem)]">
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
      </SectionShell>
    </SectionBand>
  );
}
