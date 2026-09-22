"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import type { LandingContent } from "@/lib/registry/types";

type Compare = NonNullable<LandingContent["compare"]>;

/**
 * The with/without toggle from the reference pages. The "with" panel pairs a
 * product screenshot with green-check bullets; the "without" panel is a flat
 * grey card with red crosses and deliberately no imagery, so absence looks
 * like absence instead of getting artwork of its own.
 */
export function SolutionCompare({ compare }: { compare: Compare }) {
  const [showWith, setShowWith] = useState(true);

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-foreground lg:col-span-6">
            {compare.heading}
          </h2>
          <p className="text-base text-muted-foreground lg:col-span-6 lg:text-lg">
            {compare.body}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-foreground/10 bg-surface-muted p-1.5">
            {[
              { label: compare.withLabel, value: true },
              { label: compare.withoutLabel, value: false },
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                aria-pressed={showWith === tab.value}
                onClick={() => setShowWith(tab.value)}
                className={cn(
                  "min-h-10 cursor-pointer rounded-full px-5 text-sm font-semibold transition-all",
                  showWith === tab.value
                    ? "bg-ink-void text-white shadow-[0_10px_24px_-14px_rgba(15,31,58,0.8)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {showWith ? (
          <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {compare.with.image && (
              <div className="relative h-64 overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-surface-muted shadow-[0_24px_50px_-40px_rgba(16,24,40,0.45)] lg:h-80">
                <Image
                  src={compare.with.image}
                  alt={compare.with.imageAlt ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-contain p-4"
                />
              </div>
            )}
            <div>
              <h3 className="text-[clamp(1.35rem,2.5vw,1.75rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground">
                {compare.with.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {compare.with.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-green/10">
                      <Check
                        aria-hidden
                        className="size-3 text-accent-green-deep"
                      />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl rounded-[1.35rem] border border-foreground/10 bg-surface-muted p-8">
            <h3 className="text-[clamp(1.35rem,2.5vw,1.75rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-foreground">
              {compare.without.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {compare.without.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X aria-hidden className="size-3 text-destructive" />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
