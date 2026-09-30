import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { metaSnippet, metaTitle, SITE_URL } from "@/lib/seo";
import { breadcrumbJsonLd, videoJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import {
  STORIES,
  STORY_COPY,
  getStory,
  type StoryLocale,
} from "@/lib/stories";

export const revalidate = false;

export function generateStaticParams() {
  return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const story = getStory(slug);
  if (!story) return { robots: { index: false, follow: false } };

  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const copy = STORY_COPY[locale as StoryLocale];
  const company = t(`${story.key}.company`);
  const metricLabel = t(`${story.key}.metricLabel`);

  const title = metaTitle(
    `${company} — ${copy.metaTitleSuffix} Cekat.AI`,
  );
  const description = metaSnippet(
    `${company}: ${metricLabel}. ${t("body")}`,
    158,
  );
  const path = getPathname({
    href: { pathname: "/stories/[slug]", params: { slug } },
    locale,
  });
  const canonical = `${SITE_URL}${path}`;
  const languages = {
    en: `${SITE_URL}${getPathname({
      href: { pathname: "/stories/[slug]", params: { slug } },
      locale: "en",
    })}`,
    id: `${SITE_URL}${getPathname({
      href: { pathname: "/stories/[slug]", params: { slug } },
      locale: "id",
    })}`,
    "x-default": `${SITE_URL}${getPathname({
      href: { pathname: "/stories/[slug]", params: { slug } },
      locale: "id",
    })}`,
  };
  const images = story.image
    ? [{ url: story.image, alt: company }]
    : [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: title }];

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
      type: "article",
      images,
    },
    twitter: {
      card: story.image ? "summary" : "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const story = getStory(slug);
  if (!story) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const tc = await getTranslations({ locale, namespace: "agentic.caseStudy" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const copy = STORY_COPY[locale as StoryLocale];

  const company = t(`${story.key}.company`);
  const metricValue = t(`${story.key}.metricValue`);
  const metricLabel = t(`${story.key}.metricLabel`);
  const quote = t(`${story.key}.quote`);
  const name = t(`${story.key}.name`);
  const role = t(`${story.key}.role`);
  const industry = t(`${story.key}.industry`);
  const fn = t(`${story.key}.function`);

  const path = getPathname({
    href: { pathname: "/stories/[slug]", params: { slug } },
    locale,
  });
  const url = `${SITE_URL}${path}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const listUrl = `${SITE_URL}${getPathname({ href: "/stories", locale })}`;
  const isFeatureStory = story.slug === "nature-craft";
  const videoKey = story.slug === "rumah-zakat" ? "rumahZakat" : "threeland";

  const others = STORIES.filter((s) => s.slug !== story.slug);

  const schema: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#story`,
      url,
      name: `${company} — ${copy.metaTitleSuffix}`,
      description: metricLabel,
      inLanguage: locale === "id" ? "id-ID" : "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@type": "Organization", name: company },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbJsonLd([
      { name: tb("home"), url: homeUrl },
      { name: copy.eyebrow, url: listUrl },
      { name: company },
    ]),
  ];
  if (story.videoId) {
    schema.push(
      videoJsonLd({
        name: `${company} — ${t(`videos.${videoKey}.name`)}`,
        description: metricLabel,
        videoId: story.videoId,
      }),
    );
  }

  return (
    <>
      <JsonLd data={schema} />

      <PageHero
        eyebrow={copy.eyebrow}
        title={company}
        subtitle={metricLabel}
        chips={[metricValue, industry, fn]}
      />

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {isFeatureStory && (
                <Reveal>
                  <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    {copy.storyLabel}
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {tc("body")}
                  </p>
                  <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {tc("outcome")}
                  </p>
                </Reveal>
              )}

              <Reveal delay={60}>
                <p className="eyebrow-rule mt-10 mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase first:mt-0">
                  {copy.quoteLabel}
                </p>
                <blockquote className="text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.5] font-medium tracking-[-0.02em] text-balance text-foreground">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  {story.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- customer photo asset served as-is, same as testimonial avatars
                    <img
                      src={story.image}
                      alt={name}
                      width={56}
                      height={56}
                      className="size-14 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 font-numeric text-xl font-semibold text-primary ring-2 ring-primary/20">
                      {name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="font-numeric font-semibold text-foreground">
                      {name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {role} · {company}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground/80">
                  {tc("attribution")}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              {story.videoId && (
                <Reveal delay={120}>
                  <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    {copy.videoLabel}
                  </p>
                  <TestimonialVideoCard
                    videoId={story.videoId}
                    name={t(`videos.${story.slug === "rumah-zakat" ? "rumahZakat" : "threeland"}.name`)}
                    role={t(`videos.${story.slug === "rumah-zakat" ? "rumahZakat" : "threeland"}.role`)}
                  />
                </Reveal>
              )}
              <Reveal delay={180} className="mt-8">
                <div className="rounded-[1.35rem] border border-foreground/10 bg-slate-50 p-6">
                  <p className="font-numeric text-sm font-semibold text-foreground">
                    {copy.cta}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {locale === "id"
                      ? "Setup 10 menit, tanpa kartu kredit — tim kami mendampingi onboarding."
                      : "10-minute setup, no credit card — our team walks you through onboarding."}
                  </p>
                  <a
                    className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                    href="https://chat.cekat.ai/register"
                  >
                    {copy.cta}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={60} className="mt-14 border-t border-foreground/10 pt-10">
            <h2 className="font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {copy.moreHeading}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={{
                    pathname: "/stories/[slug]",
                    params: { slug: other.slug },
                  }}
                  className="group rounded-2xl border border-foreground/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="font-numeric text-lg font-semibold tracking-[-0.03em] text-primary">
                    {t(`${other.key}.metricValue`)}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {t(`${other.key}.company`)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(`${other.key}.metricLabel`)}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/stories"
                className="inline-flex font-numeric text-sm font-semibold text-primary transition-all hover:gap-1"
              >
                {copy.backToList} →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
