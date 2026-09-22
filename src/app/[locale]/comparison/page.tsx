import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { ComparisonMatrix } from "@/components/sections/comparison/comparison-matrix";
import { ThreePillars } from "@/components/sections/comparison/three-pillars";
import { Faq } from "@/components/sections/features/faq";
import { FinalCTA } from "@/components/sections/home/final-cta";

const FAQ_COUNT = 6;
/** Copy key paired with its artwork, in the order the four cards read. */
const DIFFERENTIATORS = [
  { key: "diff1", image: "/images/comparison/all-in-one.png" },
  { key: "diff2", image: "/images/comparison/social-media.png" },
  { key: "diff3", image: "/images/comparison/setup.png" },
  { key: "diff4", image: "/images/comparison/dedicated-team.png" },
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comparison" });
  const { canonical, languages } = alternates(locale, "/comparison");
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    // Kept out of the index on purpose: the page names competitors, so it is
    // for sales to share by link rather than for search to surface. `follow`
    // stays on so the internal links it carries still pass through.
    robots: { index: false, follow: true },
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

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("comparison");
  const { canonical } = alternates(locale, "/comparison");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: t("heading"), url: canonical }]),
          faqPageJsonLd(
            Array.from({ length: FAQ_COUNT }, (_, i) => ({
              q: t(`faq.q${i + 1}`),
              a: t(`faq.a${i + 1}`),
            })),
          ),
        ]}
      />

      {/* Copy left, illustration right. The navbar is fixed at h-16 and
          overlays this, so the top padding is clearance, not decoration. */}
      <section className="bg-white">
        <Container className="border-x border-border pt-24 pb-12 lg:pt-28 lg:pb-14">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-numeric text-xs font-semibold text-primary">
                {t("eyebrow")}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {t("heading")}
              </h1>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                {t("body")}
              </p>
            </div>

            <div className="lg:col-span-6">
              {/* Above the fold and the largest element here, so it is the LCP
                  candidate: eager with high priority rather than next/image's
                  lazy default. */}
              <Image
                src="/images/home/comparison.png"
                alt=""
                width={1536}
                height={1024}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 1024px) 60vw, 480px"
                /* Capped rather than filling the column. At full width this rendered
                   ~470px tall, and the artwork already carries a lot of its own
                   whitespace, so the section was mostly empty canvas. */
                className="mx-auto h-auto w-full max-w-sm lg:max-w-md"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Frames the matrix rather than following it: the reader gets what the
          three pillars are before meeting twenty-five rows of them. */}
      <ThreePillars locale={locale} />

      <section className="border-t border-border bg-white">
        <Container className="border-x border-border py-12 lg:py-16">
          <ComparisonMatrix locale={locale as Locale} />

          {/* Provenance and date, immediately under the tables rather than in a
              footer. Every claim here is about a named company and was true of
              the sources on one particular day. */}
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-subtle-foreground">
            {t("note")}
          </p>
        </Container>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <Container className="border-x border-border py-16 lg:py-20">
          <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("diffHeading")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map(({ key, image }) => (
              <div
                key={key}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-white"
              >
                {/* Square artwork, matching the 1254x1254 sources, so the four
                    cards keep identical image heights whatever the copy does
                    underneath. */}
                <div className="relative aspect-square w-full bg-surface-muted">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-numeric text-base font-semibold text-foreground">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`${key}Body`)}
                  </p>
                </div>
              </div>
            ))}

            {/* Our own gap, stated plainly, spanning the full row beneath the
                four. A comparison page that only lists wins reads as marketing;
                naming the one thing we do not do is what makes the twenty-three
                other rows believable. */}
            <div className="rounded-lg border border-border bg-surface-muted p-6 sm:col-span-2 lg:col-span-4">
              <h3 className="font-numeric text-base font-semibold text-foreground">
                {t("honestHeading")}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {t("honestBody")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Faq namespace="comparison" count={FAQ_COUNT} />

      <FinalCTA />
    </>
  );
}
