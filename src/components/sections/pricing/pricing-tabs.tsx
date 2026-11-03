"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { PLAN_TABS, type PlanTab } from "@/lib/pricing";
import { usePlans } from "@/hooks/use-plans";
import { PricingCards } from "./pricing-cards";
import { PricingMatrix } from "./pricing-matrix";
import { PlanThreeSixty } from "./plan-three-sixty";
import Image from "next/image";

/**
 * Product switcher. Tablist markup and motion mirror
 * `sections/landing/feature-tabs.tsx` so the interaction feels native to the
 * site. Cekat 360 renders a contact block instead of a price grid.
 */
export function PricingTabs() {
  const [active, setActive] = useState<PlanTab>("chat");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = useTranslations("pricing");
  // Chat's tier lineup differs per locale; CRM and Marketing are shared.
  const plans = usePlans();

  return (
    <section className="pricing-studio relative overflow-hidden bg-linear-to-b from-[#e4ebf9] via-[#f3f6fd] to-white py-14 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="absolute top-24 right-[8%] h-56 w-56 rounded-full bg-accent-sky/10 blur-[90px]" />
        <span className="absolute bottom-16 left-[4%] h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <Container className="relative">
        <div
          role="tablist"
          aria-label={t("compareHeading")}
          className="mx-auto grid w-full max-w-[820px] grid-cols-2 gap-2 rounded-[24px] border border-[#ccdaf1] bg-white p-2 shadow-[0_16px_40px_-32px_rgba(16,24,40,0.4)] sm:grid-cols-4"
        >
          {PLAN_TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`pricing-tab-${tab}`}
              aria-controls={`pricing-panel-${tab}`}
              aria-selected={active === tab}
              tabIndex={active === tab ? 0 : -1}
              ref={(element) => { tabRefs.current[index] = element; }}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight") next = (index + 1) % PLAN_TABS.length;
                else if (event.key === "ArrowLeft") next = (index - 1 + PLAN_TABS.length) % PLAN_TABS.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = PLAN_TABS.length - 1;
                else return;
                event.preventDefault();
                setActive(PLAN_TABS[next]);
                tabRefs.current[next]?.focus();
              }}
              onClick={() => setActive(tab)}
              className={cn(
                "inline-flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-[18px] px-3 py-3 text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1352bf]",
                active === tab
                  ? "bg-[#1352bf] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(19,82,191,0.6)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white">
                <Image src={`/revamp-web-cekat/assets/${tab === "threeSixty" ? "logo-mark" : `products/${tab}`}.svg`} alt="" width={24} height={24} />
              </span>
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        <div key={active} role="tabpanel" id={`pricing-panel-${active}`} aria-labelledby={`pricing-tab-${active}`} className="mt-12 animate-swap-in motion-reduce:animate-none">
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
