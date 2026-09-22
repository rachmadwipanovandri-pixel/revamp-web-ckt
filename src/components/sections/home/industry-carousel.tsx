import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getEntryById } from "@/lib/registry";
import { loadLandingContent } from "@/lib/registry/content";
import { Container } from "@/components/layout/container";
import {
  IndustryCarouselPanels,
  type IndustryPanel,
} from "@/components/sections/home/industry-carousel-panels";

/**
 * Server half of the industry carousel: picks the eight industries the section
 * features and reads each one's own page copy, so the panel description and
 * chips are the same words the industry page opens with rather than a second
 * set written for the homepage. Order follows the registry's nav.order.
 *
 * Loading eight content files costs nothing at runtime: this page is static,
 * so the reads happen once at build.
 */
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
  // Plain null check, not a hand-written predicate: the resolved ids are a
  // literal union, which no `panel is IndustryPanel` guard can narrow.
  const panels: IndustryPanel[] = resolved.filter((panel) => panel !== null);

  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border py-16 lg:py-20">
        {/* Heading and body side by side, with the hub link under the body:
            the panels below carry their own per-industry link, so keeping the
            two apart stops them competing. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:col-span-6">
            {t("heading")}
          </h2>
          <div className="lg:col-span-6">
            <p className="text-base text-muted-foreground md:text-lg">
              {t("body")}
            </p>
            <Link
              href="/industries"
              className="mt-4 inline-flex min-h-7 items-center gap-1 font-numeric text-sm font-semibold text-primary hover:underline"
            >
              {tn("viewAllIndustries")}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </div>

        <IndustryCarouselPanels
          panels={panels}
          labels={{
            useCases: t("useCases"),
            learnMore: t("learnMore"),
            previous: t("previous"),
            next: t("next"),
          }}
        />
      </Container>
    </section>
  );
}
