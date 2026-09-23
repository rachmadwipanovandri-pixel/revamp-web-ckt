import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getEntryById } from "@/lib/registry";
import { loadLandingContent } from "@/lib/registry/content";
import { Reveal } from "@/components/sections/new-home/reveal";
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
 * so the reads happen once at build. Shell and type match the other light
 * agentic chapters (eyebrow-rule, clamp heading, Reveal, max-w-7xl).
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
    <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {tn("industries")}
            </p>
            <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {t("headingLead")}{" "}
              <span className="text-primary">{t("headingAccent")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body")}
            </p>
            <Link
              href="/industries"
              className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/25 bg-white px-5 py-2.5 font-numeric text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_16px_36px_-24px_rgba(19,82,191,0.55)]"
            >
              {tn("viewAllIndustries")}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={60} className="mt-12">
          <IndustryCarouselPanels
            panels={panels}
            labels={{
              useCases: t("useCases"),
              learnMore: t("learnMore"),
              previous: t("previous"),
              next: t("next"),
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
