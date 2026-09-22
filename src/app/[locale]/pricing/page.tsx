import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, SITE_URL } from "@/lib/seo";
import { priceRangeIDR, showsPrices } from "@/lib/pricing";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { PricingTabs } from "@/components/sections/pricing/pricing-tabs";
import { LogoMarquee } from "@/components/sections/shared/logo-marquee";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { Faq } from "@/components/sections/features/faq";
import { FinalCTA } from "@/components/sections/home/final-cta";

const FAQ_COUNT = 6;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing.meta" });
  const { canonical, languages } = alternates(locale, "/pricing");
  const title = t("title");
  const description = t("description");

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

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pricing" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const tm = await getTranslations({ locale, namespace: "pricing.meta" });

  const url = `${SITE_URL}${getPathname({ href: "/pricing", locale })}`;
  // AggregateOffer asserts prices. A locale that withholds them must not ship
  // it, or the rich result advertises figures the page never shows.
  const offers = showsPrices(locale)
    ? { ...priceRangeIDR(), currency: "IDR" as const }
    : undefined;

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, index) => ({
    q: t(`faq.q${index + 1}`),
    a: t(`faq.a${index + 1}`),
  }));

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: "Cekat.AI",
            description: tm("description"),
            url,
            offers: offers && {
              lowPrice: offers.low,
              highPrice: offers.high,
              currency: offers.currency,
            },
          }),
          faqPageJsonLd(faqItems),
          breadcrumbJsonLd([
            {
              name: tb("home"),
              url: `${SITE_URL}${getPathname({ href: "/", locale })}`,
            },
            { name: t("hero.eyebrow"), url },
          ]),
        ]}
      />

      <section className="border-b border-border bg-white pt-28 lg:pt-32">
        <Container className="px-4 pb-12 text-center lg:px-0 lg:pb-16">
          <p className="font-numeric text-sm font-semibold tracking-[0.12em] text-primary uppercase">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl font-numeric text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-numeric text-base text-muted-foreground md:text-lg">
            {t("hero.subtitle")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-numeric text-sm text-subtle-foreground">
            {t("hero.note")}
          </p>
        </Container>
      </section>

      <PricingTabs />

      <LogoMarquee heading={t("trustHeading")} logos={TRUSTED_LOGOS} />

      <Faq namespace="pricing" count={FAQ_COUNT} />

      <FinalCTA namespace="pricing.cta" />
    </>
  );
}
