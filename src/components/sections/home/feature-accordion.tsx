import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getEntryById } from "@/lib/registry";
import {
  FeatureAccordionPanels,
  type FeatureLink,
} from "@/components/sections/home/feature-accordion-panels";

/**
 * Server half of the accordion: resolves the twelve deep feature links here
 * so the full registry stays out of the client bundle, then hands plain
 * strings to the interactive panels.
 *
 * The triads are the ones the old product-card grid carried, preserved
 * verbatim when that section merged into this one.
 */
const FEATURE_IDS = {
  chat: ["ai-agent", "whatsapp-chatbot", "omnichannel"],
  crm: ["crm-application", "lead-management", "pipeline-management"],
  marketing: ["whatsapp-blast", "marketing-analytics", "ads-conversion-api"],
  order: ["order-automation", "shipping-cost-check", "workflow-automation"],
} as const;

export async function FeatureAccordion() {
  const locale = (await getLocale()) as Locale;

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

  return <FeatureAccordionPanels featureLinks={featureLinks} />;
}
