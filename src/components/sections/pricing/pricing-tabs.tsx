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
    <section className="bg-white">
      <Container className="px-4 py-12 lg:px-0 lg:py-16">
        <div
          role="tablist"
          aria-label={t("compareHeading")}
          className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-muted p-1"
        >
          {PLAN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              onClick={() => setActive(tab)}
              className={cn(
                "inline-flex cursor-pointer items-center rounded-lg px-4 py-1.5 font-numeric text-sm transition-all focus:outline-none",
                active === tab
                  ? "border border-border/60 bg-white font-medium text-foreground shadow-xs"
                  : "border border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div key={active} className="mt-10 animate-swap-in">
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
