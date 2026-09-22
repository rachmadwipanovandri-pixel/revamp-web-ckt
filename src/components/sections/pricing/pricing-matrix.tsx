"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatIDR, showsPrices, type Plan } from "@/lib/pricing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { PricingCell } from "./pricing-cell";

/**
 * Full feature matrix for one product. Scrolls horizontally on small screens
 * rather than squashing four tiers into a phone width.
 */
export function PricingMatrix({ plan }: { plan: Plan }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("pricing");
  const tp = useTranslations(`pricing.${plan.id}`);
  const value = (key: string) => t(`values.${key}`);
  const priced = showsPrices(locale);

  return (
    <div className="mt-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
          {t("compareHeading")}
        </p>
        <p className="font-numeric text-base text-muted-foreground">
          {t("compareIntro")}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[1.35rem] border border-foreground/10 bg-white shadow-[0_24px_50px_-40px_rgba(16,24,40,0.45)]">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th
                scope="col"
                className="px-4 py-3 font-numeric text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                {t("featureColumn")}
              </th>
              {plan.tiers.map((tier) => (
                <th
                  key={tier.id}
                  scope="col"
                  className={cn(
                    "px-4 py-3 align-top",
                    tier.popular && "bg-primary/5",
                  )}
                >
                  <span className="block font-numeric text-sm font-semibold text-foreground">
                    {tp(`tiers.${tier.id}.name`)}
                  </span>
                  {/* Unpriced locales show the tier name alone. */}
                  {(priced || tier.quoteOnly) && (
                    <span className="mt-0.5 block font-numeric text-xs font-medium text-muted-foreground">
                      {tier.quoteOnly
                        ? t("customPrice")
                        : `${formatIDR(tier.priceIDR!, locale)}${t("perMonth")}`}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-b-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-numeric text-sm font-medium text-foreground"
                >
                  {tp(`rows.${row.id}`)}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={plan.tiers[index].id}
                    className={cn(
                      "px-4 py-3",
                      plan.tiers[index].popular && "bg-primary/5",
                    )}
                  >
                    <PricingCell
                      cell={cell}
                      locale={locale}
                      value={value}
                      includedLabel={value("included")}
                      notIncludedLabel={value("notIncluded")}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
