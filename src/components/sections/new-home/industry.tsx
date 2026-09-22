import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getEntryById } from "@/lib/registry";
import { loadLandingContent } from "@/lib/registry/content";
import type { IndustryPanel } from "@/components/sections/home/industry-carousel-panels";
import { IndustryRail } from "./industry-rail";

const INDUSTRY_IDS = [
  "healthcare",
  "retail",
  "fnb",
  "education",
  "finance",
  "property",
  "beauty-wellness",
  "logistics",
] as const;

export async function IndustryCarousel() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home.industries");
  const tn = await getTranslations("nav");

  const resolved = await Promise.all(
    INDUSTRY_IDS.map(async (id) => {
      const entry = getEntryById("industries", id);
      const slug = entry?.slugs[locale];
      if (!entry || !slug) return null;
      const content = await loadLandingContent("industries", id, locale);
      return {
        id,
        slug,
        title: entry.title[locale] ?? "",
        photo: `/images/industries/${id}.webp`,
        description: content.hero.subtitle,
        useCases: content.hero.useCases ?? [],
      };
    }),
  );
  const panels: IndustryPanel[] = resolved.filter((panel) => panel !== null);

  return (
    <IndustryRail
      panels={panels}
      labels={{
        heading: t("heading"),
        body: t("body"),
        useCases: t("useCases"),
        learnMore: t("learnMore"),
        previous: t("previous"),
        next: t("next"),
        viewAll: tn("viewAllIndustries"),
      }}
    />
  );
}
