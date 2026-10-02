import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, metaSnippet, metaTitle, SITE_URL } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/shared/page-hero";
import { OpenRoles } from "@/components/sections/careers/open-roles";

/**
 * Careers.
 *
 * A short page on purpose: it exists to get the right person to the right
 * posting. The list itself links out to LinkedIn — the same model fun.xyz uses
 * — so this page carries no description copy that could drift away from the
 * real job ad and no `/careers/[slug]` route to keep in sync with it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "careers" });

  const title = metaTitle(t("metaTitle"));
  const description = metaSnippet(t("metaDescription"), 158);
  const { canonical, languages } = alternates(locale, "/careers");

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

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "careers" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: t("breadcrumb") },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        accent={t("heroAccent")}
        subtitle={t("heroSub")}
        chips={(t.raw("heroChips") as string[]).map(String)}
        align="center"
        solidNav
      />

      <OpenRoles locale={locale} />
    </>
  );
}
