"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { Button } from "@/components/ui/button";

const INCLUDES = [1, 2, 3, 4, 5] as const;
const FOR = [1, 2, 3] as const;

/**
 * Cekat 360 is an engagement, not a SKU: all three products plus onboarding,
 * a success manager, and custom integrations. So it sells on outcome and a
 * single conversation, not on a price grid.
 */
export function PlanThreeSixty() {
  const t = useTranslations("pricing.threeSixty");

  return (
    <div className="grid gap-10 rounded-2xl border border-primary/25 bg-primary/5 p-6 lg:grid-cols-2 lg:gap-12 lg:p-10">
      <div>
        <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
          {t("eyebrow")}
        </p>
        <h3 className="mt-2 font-numeric text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("heading")}
        </h3>
        <p className="mt-4 font-numeric text-base leading-relaxed text-muted-foreground">
          {t("body")}
        </p>

        <p className="mt-8 font-numeric text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {t("forLabel")}
        </p>
        <ul className="mt-3 space-y-2">
          {FOR.map((n) => (
            <li
              key={n}
              className="font-numeric text-sm leading-relaxed text-muted-foreground"
            >
              {t(`for${n}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-white p-6">
        <p className="font-numeric text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {t("includesLabel")}
        </p>
        <ul className="mt-4 space-y-3">
          {INCLUDES.map((n) => (
            <li key={n} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon icon={lucideCheck} className="size-2.5" aria-hidden />
              </span>
              <span className="font-numeric text-sm leading-snug text-foreground">
                {t(`include${n}`)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <p className="font-numeric text-sm text-muted-foreground">
            {t("priceNote")}
          </p>
          <Button
            size="lg"
            className="mt-4 w-full px-4 text-xs"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <Icon icon={mdiWhatsapp} className="size-4" />
            {t("cta")}
          </Button>
          <p className="mt-3 font-numeric text-xs leading-relaxed text-muted-foreground">
            {t("ctaNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
