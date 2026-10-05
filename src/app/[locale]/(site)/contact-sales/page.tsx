import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactSalesHero } from "@/components/sections/contact-sales/contact-sales-hero";
import { ContactSalesLogos } from "@/components/sections/contact-sales/contact-sales-logos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactSales.meta" });
  const { canonical, languages } = alternates(locale, "/contact-sales");
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

export default async function ContactSalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactSales.meta" });
  const { canonical } = alternates(locale, "/contact-sales");

  return (
    <>
      {/* Same ContactPage shape as /contact: the Organization's phone numbers
          and addresses live in the global organizationJsonLd, so this only
          points at it rather than restating them. */}
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: t("title"),
            description: t("description"),
            url: canonical,
            about: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <ContactSalesHero />
      {/* Logos sit BELOW the form, not above it: the hero is the reason a
          visitor landed, and the wall is supporting evidence they read on the
          way to deciding whether to submit. */}
      <ContactSalesLogos />
    </>
  );
}
