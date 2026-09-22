"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { PLAN_TABS, type PlanTab } from "@/lib/pricing";
import { usePlans } from "@/hooks/use-plans";
import { PricingCards } from "./pricing-cards";
import { PricingMatrix } from "./pricing-matrix";
import { PlanThreeSixty } from "./plan-three-sixty";

/**
 * Product switcher. Tablist markup and motion mirror
 * `sections/landing/feature-tabs.tsx` so the interaction feels native to the
 * site. Cekat 360 renders a contact block instead of a price grid.
 */
export function PricingTabs() {
  const [active, setActive] = useState<PlanTab>("chat");
  const t = useTranslations("pricing");
  // Chat's tier lineup differs per locale; CRM and Marketing are shared.
  const plans = usePlans();

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.04] to-white py-16 md:py-20 lg:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="absolute top-24 right-[8%] h-56 w-56 rounded-full bg-accent-sky/10 blur-[90px]" />
        <span className="absolute bottom-16 left-[4%] h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <Container className="relative">
        <div
          role="tablist"
          aria-label={t("compareHeading")}
          className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-foreground/10 bg-white/80 p-1.5 shadow-[0_16px_40px_-32px_rgba(16,24,40,0.4)] backdrop-blur"
        >
          {PLAN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              onClick={() => setActive(tab)}
              className={cn(
                "inline-flex cursor-pointer items-center rounded-full px-5 py-2 font-numeric text-sm transition-all focus:outline-none",
                active === tab
                  ? "bg-ink-void font-semibold text-white shadow-[0_10px_24px_-14px_rgba(15,31,58,0.8)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div key={active} className="mt-12 animate-swap-in">
          {active === "threeSixty" ? (
            <PlanThreeSixty />
          ) : (
            <>
              <p className="mx-auto mb-8 max-w-2xl text-center font-numeric text-base text-muted-foreground">
                {t(`${active}.intro`)}
              </p>
              <PricingCards plan={plans[active]} />
              <PricingMatrix plan={plans[active]} />
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
