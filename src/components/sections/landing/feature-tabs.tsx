"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { BrowserFrame } from "./browser-frame";

export function FeatureTabs({
  eyebrow,
  heading,
  tabs,
}: {
  eyebrow?: string;
  heading?: string;
  tabs: Array<{ label: string; title: string; body: string; image?: string }>;
}) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.04] to-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        {heading && <SectionHeading eyebrow={eyebrow} heading={heading} />}

        <div
          role="tablist"
          aria-label={heading}
          className={cn(
            // Mobile: one row, swipe if needed — wrapping inside a stadium pill
            // left "Handoff" orphaned under a tall rounded shell.
            "flex w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-foreground/10 bg-white/85 p-1.5 shadow-[0_16px_40px_-32px_rgba(16,24,40,0.35)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit sm:flex-wrap sm:justify-start sm:gap-1.5",
            heading && "mt-6 sm:mt-8",
          )}
        >
          {tabs.map((item, index) => (
            <button
              key={item.label}
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center rounded-full px-3.5 py-2 font-numeric text-sm whitespace-nowrap transition-all focus:outline-none sm:px-5",
                active === index
                  ? "bg-ink-void font-semibold text-white shadow-[0_10px_24px_-14px_rgba(15,31,58,0.8)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          key={active}
          className={cn(
            "mt-6 animate-swap-in grid grid-cols-1 items-center gap-6 sm:mt-8 sm:gap-8",
            tab.image && "md:grid-cols-2 md:gap-12",
          )}
        >
          <div>
            <h3 className="max-w-xl text-[clamp(1.35rem,2.5vw,1.85rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-foreground">
              {tab.title}
            </h3>
            <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
              {tab.body}
            </p>
          </div>
          {tab.image && (
            <BrowserFrame label={tab.label}>
              <Image
                src={tab.image}
                alt={tab.title}
                width={720}
                height={480}
                className="h-auto w-full"
              />
            </BrowserFrame>
          )}
        </div>
      </Container>
    </section>
  );
}
