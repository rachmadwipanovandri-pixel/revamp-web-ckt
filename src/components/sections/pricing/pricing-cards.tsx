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
        const isPopular = tier.popular === true;
        return (
          <article
            key={tier.id}
            style={{ animationDelay: `${index * 70}ms` }}
            className={cn(
              "group relative flex animate-fade-in-up-blur flex-col overflow-hidden rounded-[1.5rem] border bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none",
              isPopular
                ? "z-10 border-primary/35 shadow-[0_28px_56px_-32px_rgba(19,82,191,0.55)] hover:-translate-y-1.5 hover:shadow-[0_36px_64px_-32px_rgba(19,82,191,0.6)] xl:-translate-y-2 xl:hover:-translate-y-3"
                : "border-foreground/10 shadow-[0_18px_40px_-30px_rgba(16,24,40,0.4)] hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_28px_56px_-28px_rgba(19,82,191,0.35)]",
            )}
          >
            {isPopular && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/[0.12] to-transparent"
              />
            )}
            <div className="relative flex flex-1 flex-col p-6 pt-7">
            {isPopular && (
              <span className="mb-3 w-fit rounded-full bg-ink-void px-3 py-1 font-numeric text-[0.65rem] font-semibold tracking-[0.14em] text-sky-300 uppercase">
                {t("popular")}
              </span>
            )}

            <div className="flex items-start justify-between gap-3">
              <h3 className="font-numeric text-xl font-semibold tracking-[-0.03em] text-foreground">
                {tp(`tiers.${tier.id}.name`)}
              </h3>
              <span
                aria-hidden
                className="mt-1 font-numeric text-[0.7rem] font-bold tracking-[0.16em] text-subtle-foreground"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-2 min-h-[2.5rem] font-numeric text-sm leading-snug text-muted-foreground">
              {tp(`taglines.${taglineSlot(index)}`)}
            </p>

            {/* Unpriced locales skip the price block entirely rather than
                showing a placeholder, which would read as a missing value. */}
            {priced && (
              <div className="mt-5 border-t border-foreground/10 pt-5">
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
              className={cn(
                "mt-5",
                !priced && "border-t border-foreground/10 pt-5",
              )}
            >
              {isCustom || !priced ? (
                <Button
                  // Priced locales keep the solid button on the Custom tier;
                  // unpriced ones follow the same emphasis rule as the others.
                  variant={
                    isCustom || isPopular ? "default" : "outline-primary"
                  }
                  size="lg"
                  className="h-11 w-full rounded-full px-4 text-sm shadow-none transition-all duration-300 hover:-translate-y-0.5"
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
                  variant={isPopular ? "default" : "outline-primary"}
                  size="lg"
                  className="h-11 w-full rounded-full px-4 text-sm shadow-none transition-all duration-300 hover:-translate-y-0.5"
                  nativeButton={false}
                  render={<AppAnchor href={REGISTER_URL} />}
                >
                  {t("ctaSecondary")}
                </Button>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-2.5 border-t border-foreground/10 pt-5">
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
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                isPopular && "scale-x-100 opacity-60",
              )}
            />
          </article>
        );
      })}
    </div>
  );
}
