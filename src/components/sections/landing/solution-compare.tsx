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
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:col-span-6 lg:text-4xl">
            {compare.heading}
          </h2>
          <p className="text-base text-muted-foreground lg:col-span-6 lg:text-lg">
            {compare.body}
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-surface-subtle p-1">
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
                  "min-h-9 cursor-pointer rounded-full px-5 text-sm font-semibold transition-colors",
                  showWith === tab.value
                    ? "bg-white text-primary shadow-sm"
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
              <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-surface-muted lg:h-80">
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
              <h3 className="font-numeric text-xl font-semibold text-foreground md:text-2xl">
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
          <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-border bg-surface-muted p-8">
            <h3 className="font-numeric text-xl font-semibold text-foreground md:text-2xl">
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
