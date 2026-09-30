import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, metaSnippet, metaTitle, SITE_URL } from "@/lib/seo";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { STORIES, STORY_COPY, type StoryLocale } from "@/lib/stories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const copy = STORY_COPY[locale as StoryLocale];

  const title = metaTitle(
    `${copy.indexHeading} — ${copy.metaTitleSuffix} Cekat.AI`,
  );
  const description = metaSnippet(t("body"), 158);
  const { canonical, languages } = alternates(locale, "/stories");

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/graph-image.jpg"],
    },
  };
}

export default async function StoriesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const copy = STORY_COPY[locale as StoryLocale];
  const url = `${SITE_URL}${getPathname({ href: "/stories", locale })}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd({
            url,
            name: `${copy.eyebrow} — Cekat.AI`,
            description: copy.indexLead,
            items: STORIES.map((story) => ({
              name: t(`${story.key}.company`),
              url: `${SITE_URL}${getPathname({
                href: {
                  pathname: "/stories/[slug]",
                  params: { slug: story.slug },
                },
                locale,
              })}`,
            })),
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: copy.eyebrow },
          ]),
        ]}
      />

      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.indexHeading}
        subtitle={copy.indexLead}
      />

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((story, index) => {
              const company = t(`${story.key}.company`);
              const metricValue = t(`${story.key}.metricValue`);
              const metricLabel = t(`${story.key}.metricLabel`);
              return (
                <Reveal key={story.slug} delay={index * 60}>
                  <Link
                    href={{
                      pathname: "/stories/[slug]",
                      params: { slug: story.slug },
                    }}
                    className="group flex h-full flex-col rounded-[1.35rem] border border-foreground/10 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <span className="font-numeric text-[clamp(1.75rem,3vw,2.35rem)] leading-none font-semibold tracking-[-0.04em] text-primary tabular-nums">
                      {metricValue}
                    </span>
                    <p className="mt-3 text-sm leading-snug text-muted-foreground">
                      {metricLabel}
                    </p>
                    <p className="mt-5 font-numeric text-base font-semibold text-foreground">
                      {company}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t(`${story.key}.industry`)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      {copy.quoteLabel} →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
