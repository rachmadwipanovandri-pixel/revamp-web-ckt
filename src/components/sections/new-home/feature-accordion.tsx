import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getEntryById } from "@/lib/registry";
import type { FeatureLink } from "@/components/sections/home/feature-accordion-panels";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { FeatureAccordionPanels } from "./feature-accordion-panels";

const FEATURE_IDS = {
  chat: ["ai-agent", "whatsapp-chatbot", "omnichannel"],
  crm: ["crm-application", "lead-management", "pipeline-management"],
  marketing: ["whatsapp-blast", "marketing-analytics", "ads-conversion-api"],
  order: ["order-automation", "shipping-cost-check", "workflow-automation"],
} as const;

export async function FeatureAccordion() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home.featureAccordion");

  const featureLinks = Object.fromEntries(
    Object.entries(FEATURE_IDS).map(([key, ids]) => [
      key,
      ids.flatMap((id) => {
        const entry = getEntryById("features", id);
        const slug = entry?.slugs[locale];
        return entry && slug
          ? [{ id, slug, title: entry.title[locale] ?? "" }]
          : [];
      }),
    ]),
  ) as Record<keyof typeof FEATURE_IDS, FeatureLink[]>;

  return (
    <SectionShell surface="ink">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-sky-400/40 to-transparent"
      />
      <div className="relative">
        <Reveal>
          <SectionHeading
            chapter="03"
            tone="ink"
            title={t("heading")}
            lede={t("body")}
          />
        </Reveal>
        <Reveal delay={80} className="mt-14">
          <FeatureAccordionPanels featureLinks={featureLinks} />
        </Reveal>
      </div>
    </SectionShell>
  );
}
