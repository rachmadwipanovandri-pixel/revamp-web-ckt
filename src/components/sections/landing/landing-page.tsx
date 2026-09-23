import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";
import { alternatesFor, localizedPath, metaSnippet, SITE_URL } from "@/lib/seo";
import {
  entryPath,
  entryPaths,
  getEntryBySlug,
  relatedEntries,
  slugsFor,
  REGISTRY,
} from "@/lib/registry";
import { loadLandingContent } from "@/lib/registry/content";
import type { LandingKind } from "@/lib/registry/types";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { LogoMarquee } from "@/components/sections/shared/logo-marquee";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { Breadcrumbs } from "./breadcrumbs";
import { LandingHero } from "./landing-hero";
import { DefinitionBlock } from "./definition-block";
import { BenefitAccordion } from "./benefit-accordion";
import { StatCards } from "./stat-cards";
import { CaseStudy } from "./case-study";
import { IndustryRoles } from "./industry-roles";
import { PainPoints } from "./pain-points";
import { SolutionCompare } from "./solution-compare";
import { MidCta } from "./mid-cta";
import { FeatureTabs } from "./feature-tabs";
import { Pillars } from "./pillars";
import { LandingTestimonial } from "./landing-testimonial";
import { RichFaq } from "./rich-faq";
import { RelatedLinks } from "./related-links";
import { LandingCta } from "./landing-cta";

const HUB_TEMPLATE = {
  features: "/features",
  industries: "/industries",
  solutions: "/solutions",
} as const satisfies Record<LandingKind, AppPathname>;

type LandingParams = Promise<{ locale: string; slug: string }>;

/**
 * Homepage industry portraits reused in the industry hero when the file
 * exists on disk. Only the eight curated rail photos ship today; other
 * verticals keep the text-only void hero until art lands.
 */
function industryHeroImage(id: string): string | undefined {
  const rel = `/images/industries/${id}.webp`;
  const abs = path.join(process.cwd(), "public", rel);
  return existsSync(abs) ? rel : undefined;
}

export function landingStaticParams(kind: LandingKind) {
  return routing.locales.flatMap((locale) =>
    slugsFor(kind, locale).map((slug) => ({ locale, slug })),
  );
}

export async function landingMetadata(
  kind: LandingKind,
  params: LandingParams,
): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const entry = getEntryBySlug(kind, locale, slug);
  if (!entry) notFound();
  const content = await loadLandingContent(kind, entry.id, locale);
  const { canonical, languages } = alternatesFor(
    locale,
    entryPaths(kind, entry),
  );
  const title = metaSnippet(content.meta.title, 70);
  const description = metaSnippet(content.meta.description, 158);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        { url: "/graph-image.jpg", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/graph-image.jpg"],
    },
  };
}

export async function LandingPage({
  kind,
  params,
}: {
  kind: LandingKind;
  params: LandingParams;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const entry = getEntryBySlug(kind, locale, slug);
  if (!entry) notFound();
  setRequestLocale(locale);

  const content = await loadLandingContent(kind, entry.id, locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const tt = await getTranslations({ locale, namespace: "home.trustedBy" });

  const isIndustry = kind === "industries";
  const hubTemplate = HUB_TEMPLATE[kind];
  const pageTitle = entry.title[locale] ?? content.hero.title;
  const heroImage = isIndustry ? industryHeroImage(entry.id) : undefined;
  const crumbs = [
    { label: tb("home"), href: "/" as const },
    { label: tb(kind), href: hubTemplate },
    { label: pageTitle },
  ];
  const related = relatedEntries(kind, entry, locale).map((other) => ({
    title: other.title[locale] ?? other.id,
    icon: other.icon,
    tagline: other.tagline?.[locale],
    href: {
      pathname: `${hubTemplate}/[slug]` as "/features/[slug]",
      params: { slug: other.slugs[locale]! },
    },
  }));

  // Cross-cluster: same-kind related already covers peers; add one other kind
  // so a feature page can reach industries (and vice versa) without a second hop.
  const crossKind = kind === "industries" ? "solutions" : "industries";
  const cross = REGISTRY[crossKind]
    .filter((other) => other.slugs[locale] && !other.switcherFallbackId)
    .slice(0, 4)
    .map((other) => ({
      title: other.title[locale] ?? other.id,
      icon: other.icon,
      tagline: other.tagline?.[locale],
      href: {
        pathname:
          crossKind === "solutions"
            ? ("/solutions/[slug]" as const)
            : ("/industries/[slug]" as const),
        params: { slug: other.slugs[locale]! },
      },
    }));
  // Features should also surface roles, not only industries.
  const crossSolutions =
    kind === "features"
      ? REGISTRY.solutions
          .filter((other) => other.slugs[locale])
          .slice(0, 3)
          .map((other) => ({
            title: other.title[locale] ?? other.id,
            icon: other.icon,
            tagline: other.tagline?.[locale],
            href: {
              pathname: "/solutions/[slug]" as const,
              params: { slug: other.slugs[locale]! },
            },
          }))
      : [];
  const crossLinks = [...cross, ...crossSolutions];

  const pagePath = entryPath(kind, entry, locale)!;
  const pageUrl = `${SITE_URL}${pagePath}`;
  const jsonLd: object[] = [
    breadcrumbJsonLd([
      { name: tb("home"), url: `${SITE_URL}${localizedPath(locale, "/")}` },
      {
        name: tb(kind),
        url: `${SITE_URL}${localizedPath(locale, hubTemplate)}`,
      },
      { name: pageTitle, url: pageUrl },
    ]),
    faqPageJsonLd(content.faq),
  ];
  // Feature pages: one SoftwareApplication entity named for the platform (the
  // feature is the page context, not a separate product name). Industries and
  // roles are Services so schema matches what the page actually sells.
  if (kind === "features") {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Cekat.AI",
      description: content.definition,
      url: pageUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
      featureList: pageTitle,
    });
  } else {
    jsonLd.push(
      serviceJsonLd({
        name: `${pageTitle} — Cekat.AI`,
        description: content.definition,
        url: pageUrl,
        serviceType:
          kind === "industries"
            ? `AI customer service for ${pageTitle}`
            : `AI automation for ${pageTitle} teams`,
      }),
    );
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="cv-auto">
        <LandingHero
          badge={content.hero.badge}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          useCases={content.hero.useCases}
          image={heroImage}
          imageAlt={pageTitle}
        />
      </div>
      <Breadcrumbs items={crumbs} />
      <div className="cv-auto">
        <DefinitionBlock
          definition={content.definition}
          stats={isIndustry ? undefined : content.stats}
        />
      </div>
      {isIndustry && content.stats && content.stats.length > 0 && (
        <div className="cv-auto">
          <StatCards stats={content.stats} />
        </div>
      )}
      <div className="cv-auto">
        <LogoMarquee heading={tt("heading")} logos={TRUSTED_LOGOS} />
      </div>
      {content.painPoints && (
        <PainPoints
          heading={content.painPoints.heading}
          items={content.painPoints.items}
        />
      )}
      {content.compare && <SolutionCompare compare={content.compare} />}
      {content.midCta && (
        <MidCta heading={content.midCta.heading} body={content.midCta.body} />
      )}
      <BenefitAccordion
        eyebrow={t("benefitsEyebrow")}
        heading={t("benefitsHeading")}
        benefits={content.benefits}
      />
      {content.tabs && content.tabs.length > 0 && (
        <FeatureTabs
          eyebrow={t("tabsEyebrow")}
          heading={t("tabsHeading")}
          tabs={content.tabs}
        />
      )}
      {content.caseStudy && (
        <CaseStudy
          eyebrow={t("caseStudyEyebrow")}
          attribution={t("caseStudyAttribution")}
          story={content.caseStudy}
        />
      )}
      {isIndustry && <IndustryRoles locale={locale} industry={pageTitle} />}
      <Pillars
        eyebrow={t("pillarsEyebrow")}
        heading={t("pillarsHeading")}
        pillars={content.pillars}
      />
      {content.testimonial && (
        <LandingTestimonial
          eyebrow={t("testimonialEyebrow")}
          heading={content.testimonial.heading ?? t("testimonialHeading")}
          testimonial={content.testimonial}
        />
      )}
      <RichFaq
        label={t("faqLabel")}
        heading={t("faqHeading", { title: pageTitle })}
        items={content.faq}
      />
      <RelatedLinks
        eyebrow={t("relatedEyebrow")}
        heading={t(`related.${kind}`)}
        links={related}
        readMore={t("readMore")}
      />
      {crossLinks.length > 0 && (
        <RelatedLinks
          eyebrow={t("relatedCrossEyebrow")}
          heading={t("relatedCross")}
          links={crossLinks}
          readMore={t("readMore")}
        />
      )}
      <LandingCta heading={content.cta.heading} body={content.cta.body} />
    </>
  );
}
