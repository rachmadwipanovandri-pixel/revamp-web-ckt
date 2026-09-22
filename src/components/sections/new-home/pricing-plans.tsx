"use client";

import { useLocale, useTranslations } from "next-intl";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIDR, showsPrices, taglineSlot, type Plan } from "@/lib/pricing";
import type { Locale } from "@/i18n/routing";
import { usePlans } from "@/hooks/use-plans";
import { PricingCell } from "@/components/sections/pricing/pricing-cell";
import { SafeIcon } from "./safe-icon";

/**
 * Chat plan cards for /new: elevated hierarchy, popular badge in normal flow
 * (never overlapping the tier name), and soft entrance stagger.
 */
export function PricingPlans() {
  const locale = useLocale() as Locale;
  const priced = showsPrices(locale);
  const plan = usePlans().chat;

  return <PlanCards plan={plan} locale={locale} priced={priced} />;
}

function PlanCards({
  plan,
  locale,
  priced,
}: {
  plan: Plan;
  locale: Locale;
  priced: boolean;
}) {
  const t = useTranslations("pricing");
  const tp = useTranslations(`pricing.${plan.id}`);
  const value = (key: string) => t(`values.${key}`);

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

              <p className="mt-2 min-h-[3rem] text-sm leading-snug text-muted-foreground">
                {tp(`taglines.${taglineSlot(index)}`)}
              </p>

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
                <Button
                  variant={
                    isCustom || isPopular ? "default" : "outline-primary"
                  }
                  size="lg"
                  className="h-11 w-full rounded-full px-4 text-sm shadow-none transition-all duration-300 hover:-translate-y-0.5"
                  nativeButton={false}
                  render={
                    isCustom || !priced ? (
                      <WhatsAppAnchor
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ) : (
                      <AppAnchor href={REGISTER_URL} />
                    )
                  }
                >
                  {isCustom || !priced ? (
                    <SafeIcon
                      icon={mdiWhatsapp}
                      className="size-4"
                      size="1rem"
                    />
                  ) : null}
                  {isCustom || !priced
                    ? priced
                      ? t("ctaCustom")
                      : t("ctaWhatsApp")
                    : t("ctaSecondary")}
                </Button>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-foreground/10 pt-5">
                {cardRows.map((row) => {
                  const cell = row.cells[index];
                  const isBoolean = typeof cell === "boolean";
                  if (cell === false) return null;
                  return (
                    <li key={row.id} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                          isPopular
                            ? "bg-primary/20 text-primary"
                            : "bg-primary/12 text-primary",
                        )}
                      >
                        <SafeIcon
                          icon={lucideCheck}
                          className="size-2.5"
                          size="0.625rem"
                        />
                      </span>
                      <span className="text-sm leading-snug text-muted-foreground">
                        <span className="font-medium text-foreground">
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
