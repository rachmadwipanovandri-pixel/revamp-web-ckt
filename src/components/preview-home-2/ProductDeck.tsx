"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Band, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Product deck — preview-home's stacked "pillars" cards, reimplemented in React.
 *
 * The original moved DOM nodes with `appendChild()` on click, which silently
 * reorders the tab sequence, and sized the stack with a JS height tracker. Here
 * the order is state, each header is a real `aria-expanded` button, the
 * collapsed panels are `inert`, and the fanned layout comes from document flow
 * (width + a small negative overlap) so its height is always correct.
 */
export function ProductDeck({ content }: { content: HomeContent["deck"] }) {
  const items = content.items;
  // Last entry renders in front; the first item starts there.
  const [order, setOrder] = useState<number[]>(() => items.map((_, index) => index));
  const front = order[order.length - 1];

  const promote = (index: number) =>
    setOrder((previous) => [...previous.filter((i) => i !== index), index]);

  return (
    <Band tone="white" labelledBy="ph2-deck-title">
      <Shell>
        <SectionHead
          id="ph2-deck-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />
        <p className="mt-3 text-sm text-[#64748B]">{content.hint}</p>

        <div className="mt-9 flex flex-col items-center">
          {order.map((itemIndex, position) => {
            const item = items[itemIndex];
            const isFront = itemIndex === front;
            const depth = order.length - 1 - position;

            return (
              <article
                key={item.title}
                style={{
                  width: `${100 - depth * 4}%`,
                  zIndex: 10 + position,
                  marginTop: position === 0 ? 0 : -14,
                }}
                className={cn(
                  "rounded-[20px] border bg-white transition-[width,margin,box-shadow,border-color] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isFront
                    ? "border-[#BFDBFE] shadow-[0_1px_2px_rgba(11,18,32,0.05),0_30px_56px_-32px_rgba(19,82,191,0.45)]"
                    : "border-border shadow-[0_1px_2px_rgba(11,18,32,0.04),0_14px_30px_-24px_rgba(11,18,32,0.35)]",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isFront}
                    aria-controls={`ph2-deck-panel-${itemIndex}`}
                    onClick={() => promote(itemIndex)}
                    className="flex w-full items-center gap-3 rounded-[20px] px-5 py-4 text-left"
                  >
                    <span
                      aria-hidden
                      className="h-3 w-3 shrink-0 rotate-45 rounded-[3px]"
                      style={{ background: item.accent, opacity: isFront ? 1 : 0.45 }}
                    />
                    <span
                      className={cn(
                        "text-[1.05rem] font-bold tracking-[-0.02em] transition-colors duration-200",
                        isFront ? "text-[#101828]" : "text-[#4B5563]",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto text-xs font-semibold text-[#64748B]"
                    >
                      {isFront ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={`ph2-deck-panel-${itemIndex}`}
                  inert={!isFront}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
                    isFront ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 px-5 pb-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                      <div>
                        <h4 className="text-[clamp(1.25rem,2.2vw,1.7rem)] leading-[1.2] font-bold tracking-[-0.025em] text-[#101828]">
                          {item.headline}
                        </h4>
                        <p className="mt-3 max-w-[34rem] text-[0.95rem] leading-[1.65] text-[#4B5563]">
                          {item.body}
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {item.points.map((point) => (
                            <li
                              key={point}
                              className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-[0.75rem] font-semibold text-primary"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={item.cta.href}
                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                        >
                          {item.cta.label}
                          <span
                            aria-hidden
                            className="transition-transform duration-200"
                          >
                            →
                          </span>
                        </Link>
                      </div>

                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-[#F8FAFF]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 460px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Shell>
    </Band>
  );
}
