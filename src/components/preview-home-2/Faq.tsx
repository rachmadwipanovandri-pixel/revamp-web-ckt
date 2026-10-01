"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Band, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Accordion FAQ. Real `aria-expanded` / `aria-controls` on the trigger, a
 * `role="region"` panel, and `inert` while collapsed so a closed answer is not
 * reachable by keyboard or announced by assistive tech.
 */
export function Faq({ content }: { content: HomeContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band tone="soft" border labelledBy="ph2-faq-title">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              id="ph2-faq-title"
              eyebrow={content.eyebrow}
              title={content.heading}
              body={content.body}
            />
            <Link
              href={content.cta.href}
              className="mt-6 inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-[#101828] transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {content.cta.label}
            </Link>
          </div>

          <ul className="flex flex-col gap-3">
            {content.items.map((item, index) => {
              const isOpen = open === index;
              return (
                <li
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-[16px] border bg-white transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
                    isOpen
                      ? "border-[#BFDBFE] shadow-[0_18px_38px_-28px_rgba(19,82,191,0.5)]"
                      : "border-border hover:border-[#BFDBFE]",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      id={`ph2-faq-trigger-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`ph2-faq-panel-${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[0.95rem] leading-[1.4] font-semibold text-[#101828]">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="relative h-4 w-4 shrink-0 text-primary"
                      >
                        <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
                        <span
                          className={cn(
                            "absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                            isOpen && "rotate-90",
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`ph2-faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`ph2-faq-trigger-${index}`}
                    inert={!isOpen}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[0.9rem] leading-[1.65] text-[#4B5563]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>
    </Band>
  );
}
