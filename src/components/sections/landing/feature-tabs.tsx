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
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        {heading && <SectionHeading eyebrow={eyebrow} heading={heading} />}

        <div
          role="tablist"
          className={cn(
            "flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface-muted p-1",
            heading && "mt-8",
          )}
        >
          {tabs.map((item, index) => (
            <button
              key={item.label}
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={cn(
                "inline-flex cursor-pointer items-center rounded-lg px-3.5 py-1.5 font-numeric text-sm transition-all focus:outline-none",
                active === index
                  ? "border border-border/60 bg-white font-medium text-foreground shadow-xs"
                  : "border border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          key={active}
          className={cn(
            "mt-8 grid animate-swap-in grid-cols-1 items-center gap-8",
            tab.image && "md:grid-cols-2 md:gap-12",
          )}
        >
          <div>
            <h3 className="max-w-xl font-numeric text-xl font-semibold text-foreground md:text-2xl">
              {tab.title}
            </h3>
            <p className="mt-3 max-w-xl font-numeric text-base text-muted-foreground md:text-lg">
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
