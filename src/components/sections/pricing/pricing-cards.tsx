"use client";

import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIDR, showsPrices, taglineSlot, type Plan } from "@/lib/pricing";
import type { Locale } from "@/i18n/routing";
import { PricingCell } from "./pricing-cell";

/** The four tier cards for one product: the scannable, conversion-facing view. */
export function PricingCards({ plan }: { plan: Plan }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("pricing");
  const tp = useTranslations(`pricing.${plan.id}`);
  const value = (key: string) => t(`values.${key}`);
  const priced = showsPrices(locale);

  const cardRows = plan.cardRowIds
    .map((id) => plan.rows.find((row) => row.id === id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {plan.tiers.map((tier, index) => {
        const isCustom = tier.quoteOnly === true;
        return (
          <div
            key={tier.id}
            className={cn(
              "relative flex flex-col rounded-lg border bg-white p-6",
              tier.popular
                ? "border-primary/40 ring-2 ring-primary/15"
                : "border-border",
            )}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-numeric text-[11px] font-semibold tracking-wide text-white uppercase">
                {t("popular")}
              </span>
            )}

            <h3 className="font-numeric text-lg font-semibold text-foreground">
              {tp(`tiers.${tier.id}.name`)}
            </h3>
            <p className="mt-1.5 min-h-[2.5rem] font-numeric text-sm leading-snug text-muted-foreground">
              {tp(`taglines.${taglineSlot(index)}`)}
            </p>

            {/* Unpriced locales skip the price block entirely rather than
                showing a placeholder, which would read as a missing value. */}
            {priced && (
              <div className="mt-5 border-t border-border pt-5">
                {isCustom ? (
                  <>
                    <p className="font-numeric text-2xl font-semibold text-foreground">
                      {t("customPrice")}
                    </p>
                    <p className="mt-1 font-numeric text-xs text-muted-foreground">
                      {tier.minBillingIDR
                        ? t("minBilling", {
                            amount: formatIDR(tier.minBillingIDR, locale),
                          })
                        : t("customPriceNote")}
                    </p>
                  </>
                ) : (
                  <>
                    {/* formatIDR keeps "Rp" glued to the amount with a
                        non-breaking space. Cards are narrowest at the 4-column
                        breakpoint, so the type steps down there to fit. */}
                    <p className="flex flex-wrap items-baseline gap-x-1">
                      <span className="font-numeric text-2xl font-semibold text-foreground xl:text-xl">
                        {formatIDR(tier.priceIDR!, locale)}
                      </span>
                      <span className="font-numeric text-sm font-medium text-muted-foreground">
                        {t("perMonth")}
                      </span>
                    </p>
                    <p className="mt-1 font-numeric text-xs text-muted-foreground">
                      {t("excludesVat")}
                    </p>
                  </>
                )}
              </div>
            )}

            <div
              className={cn("mt-5", !priced && "border-t border-border pt-5")}
            >
              {isCustom || !priced ? (
                <Button
                  // Priced locales keep the solid button on the Custom tier;
                  // unpriced ones follow the same emphasis rule as the others.
                  variant={
                    isCustom || tier.popular ? "default" : "outline-primary"
                  }
                  size="lg"
                  className="w-full px-4 text-xs"
                  nativeButton={false}
                  render={
                    <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <Icon icon={mdiWhatsapp} className="size-4" />
                  {priced ? t("ctaCustom") : t("ctaWhatsApp")}
                </Button>
              ) : (
                <Button
                  variant={tier.popular ? "default" : "outline-primary"}
                  size="lg"
                  className="w-full px-4 text-xs"
                  nativeButton={false}
                  render={<AppAnchor href={REGISTER_URL} />}
                >
                  {t("ctaSecondary")}
                </Button>
              )}
            </div>

            <ul className="mt-6 space-y-3 border-t border-border pt-5">
              {cardRows.map((row) => {
                const cell = row.cells[index];
                // A tick already precedes every row, so an included boolean
                // needs no value; only numbers and prose add information.
                const isBoolean = typeof cell === "boolean";
                if (cell === false) return null;
                return (
                  <li key={row.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon
                        icon={lucideCheck}
                        className="size-2.5"
                        aria-hidden
                      />
                    </span>
                    <span className="font-numeric text-sm leading-snug text-muted-foreground">
                      <span className="text-foreground">
                        {tp(`rows.${row.id}`)}
                      </span>
                      {!isBoolean && (
                        <>
                          {": "}
                          <PricingCell
                            cell={cell}
                            locale={locale}
                            value={value}
                            includedLabel={value("included")}
                            notIncludedLabel={value("notIncluded")}
                          />
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
