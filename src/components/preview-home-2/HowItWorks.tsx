"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Band, Card, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 5 — the five-step rail with a sticky stage.
 *
 * Two deliberate departures from preview-home: the active step is driven by an
 * IntersectionObserver band around the viewport centre (not a per-frame scroll
 * handler), and the step list is a real keyboard control that scrolls its card
 * into view and marks itself `aria-current="step"`.
 */
export function HowItWorks({ content }: { content: HomeContent["howItWorks"] }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter((node): node is HTMLLIElement => Boolean(node));
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!winner) return;
        const index = nodes.indexOf(winner.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] },
    );

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const current = content.steps[active] ?? content.steps[0];

  const goTo = (index: number) => {
    const node = stepRefs.current[index];
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <Band
      id="how-it-works"
      tone="soft"
      labelledBy="ph2-how-title"
      className="scroll-mt-24"
    >
      <Shell>
        <SectionHead
          id="ph2-how-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#64748B] uppercase">
                {content.stageLabel}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span
                  className="text-[3rem] leading-none font-bold tracking-[-0.04em] tabular-nums"
                  style={{ color: current.accent }}
                >
                  {current.index}
                </span>
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
                  {current.hint}
                </span>
              </div>

              <h3 className="mt-3 text-[1.15rem] leading-[1.3] font-bold tracking-[-0.02em] text-[#101828]">
                {current.title}
              </h3>

              <nav aria-label={content.stageLabel} className="mt-6">
                <ol className="flex flex-col gap-1">
                  {content.steps.map((step, index) => {
                    const selected = index === active;
                    return (
                      <li key={step.index}>
                        <button
                          type="button"
                          aria-current={selected ? "step" : undefined}
                          onClick={() => goTo(index)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.875rem] font-semibold transition-colors duration-150",
                            selected
                              ? "bg-[#EFF6FF] text-[#101828]"
                              : "text-[#64748B] hover:bg-[#F8FAFF] hover:text-[#101828]",
                          )}
                        >
                          <span
                            aria-hidden
                            className="h-2 w-2 shrink-0 rounded-full transition-colors duration-150"
                            style={{
                              background: selected ? step.accent : "#CBD5E1",
                            }}
                          />
                          {step.title}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </Card>
          </div>

          <ol className="flex flex-col gap-4">
            {content.steps.map((step, index) => {
              const selected = index === active;
              return (
                <li
                  key={step.index}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                >
                  <Card
                    className={cn(
                      "p-6 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
                      selected &&
                        "border-[#BFDBFE] shadow-[0_1px_2px_rgba(11,18,32,0.05),0_28px_52px_-32px_rgba(19,82,191,0.45)]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[0.75rem] font-bold text-white"
                        style={{ background: step.accent }}
                      >
                        {step.index}
                      </span>
                      <h3 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#101828]">
                        {step.title}
                      </h3>
                      <span className="ml-auto hidden shrink-0 text-xs font-semibold text-[#64748B] sm:block">
                        {step.hint}
                      </span>
                    </div>
                    <p className="mt-3 text-[0.95rem] leading-[1.65] text-[#4B5563]">
                      {step.body}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </Shell>
    </Band>
  );
}
