import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { alternates, htmlLang, SITE_URL } from "@/lib/seo";
import { fontSans } from "@/lib/fonts";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import "../globals.css";

/**
 * Namespaces that `"use client"` modules call via `useTranslations` used to be
 * subset here and handed to a `NextIntlClientProvider` wrapping every route.
 * That provider now lives in `(site)/layout.tsx`, beside the chrome whose client
 * components are the only ones that call `useTranslations` — the draft routes
 * under [locale] build their strings locally and were paying for the lot.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const { canonical, languages } = alternates(locale, "/");
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    // Search Console ownership proof. A public token, not a secret, and it is
    // set here rather than per page: metadata merges shallowly from layout to
    // page, and no route overrides `verification`, so every URL carries it.
    verification: {
      google: "yTYCSWyej9IjZTWUHuSSF_AQNLSCxTnu_h9mvnmySXA",
    },
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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Site chrome (Navbar / main / Footer / FloatingWhatsApp) lives in
  // (site)/layout.tsx so route groups keep it off standalone drafts like
  // preview-home, which renders its own header and footer.
  return (
    <html lang={htmlLang(locale)} className={fontSans.variable}>
      <body className="min-h-screen bg-background text-foreground">
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
