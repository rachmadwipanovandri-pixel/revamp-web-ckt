import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactHero } from "@/components/sections/contact/contact-hero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  const { canonical, languages } = alternates(locale, "/contact");
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  const { canonical } = alternates(locale, "/contact");

  return (
    <>
      {/* ContactPage schema — the one form-bearing family that had none.
          The Organization itself (phones, addresses) lives in the global
          organizationJsonLd, so this only points at it. */}
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
      <ContactHero />
    </>
  );
}
