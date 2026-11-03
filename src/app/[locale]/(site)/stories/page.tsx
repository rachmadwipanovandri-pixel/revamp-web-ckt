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
import { STORIES, storyCopyFor } from "@/lib/stories";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const copy = storyCopyFor(locale);

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
  const copy = storyCopyFor(locale);
  const url = `${SITE_URL}${getPathname({ href: "/stories", locale })}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const featured = STORIES[0];

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
        tone="stories"
        eyebrow={copy.eyebrow}
        title={copy.indexHeading}
        subtitle={copy.indexLead}
        align="left"
        className="editorial-index"
      >
        <Link
          href={{
            pathname: "/stories/[slug]",
            params: { slug: featured.slug },
          }}
          className="story-feature grid overflow-hidden rounded-[28px] border border-[#ccdaf1] bg-white lg:grid-cols-2"
        >
          <div className="story-proof rounded-none">
            {featured.image && (
              <Image
                src={featured.image}
                alt={t(`${featured.key}.company`)}
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            )}
            <div className="story-proof__copy">
              <span className="story-proof__number">
                {t(`${featured.key}.metricValue`)}
              </span>
              <p>{t(`${featured.key}.metricLabel`)}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 lg:p-12">
            <span className="text-sm font-semibold text-primary">
              {t(`${featured.key}.industry`)}
            </span>
            <h2 className="mt-5 text-[clamp(2rem,3vw,3rem)] leading-tight tracking-[-0.045em] text-[#09214c]">
              {t(`${featured.key}.company`)}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#3a4960]">
              {t(`${featured.key}.quote`)}
            </p>
            <span className="mt-7 inline-flex items-center gap-3 text-sm font-semibold text-primary">
              {copy.quoteLabel} <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
      </PageHero>

      <section className="relative overflow-hidden bg-[#f9fafb] py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STORIES.slice(1).map((story, index) => {
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
                    className="group flex h-full flex-col rounded-[20px] border border-[#e5e9ef] bg-white p-7 shadow-[0_1px_2px_rgba(9,33,76,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9eb8e5] hover:shadow-[0_18px_40px_-22px_rgba(9,33,76,0.27)] motion-reduce:transform-none"
                  >
                    {story.image && (
                      <div className="relative -mx-7 -mt-7 mb-7 aspect-[16/9] overflow-hidden">
                        <Image
                          src={story.image}
                          alt={company}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="font-numeric text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums">
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
