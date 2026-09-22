"use client";

import { useState } from "react";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function RichFaq({
  label,
  heading,
  items,
}: {
  label: string;
  heading: string;
  items: Array<{ q: string; a: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-foreground/8 bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
            {label}
          </p>
          <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {heading}
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
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
                  <span className="font-numeric text-base font-semibold tracking-[-0.02em] text-foreground md:text-lg">
                    {item.q}
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
                    <p className="max-w-3xl px-5 pb-5 font-numeric text-base leading-relaxed text-muted-foreground md:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
