import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { alternates, htmlLang } from "@/lib/seo";
import { fontSans } from "@/lib/fonts";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { CekatAnalytics } from "@/components/analytics/cekat-analytics";
import { Hyros } from "@/components/analytics/hyros";
import { AdParamsUrl } from "@/components/analytics/ad-params-url";
import { AnalyticsPreconnect } from "@/components/analytics/analytics-preconnect";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/google-tag-manager";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cekat.ai";

/**
 * Namespaces that `"use client"` modules actually call via `useTranslations`.
 * Server Components still read the full catalog from `i18n/request.ts`; only
 * this provider (and therefore the RSC/HTML payload) is subset. Shipping every
 * key cost ~57 KiB of serialized messages on every route.
 *
 * Dynamic product namespaces (`${ns}.faq`, `${ns}.howItWorks`, FinalCTA, …)
 * are why chat/crm/marketing/order/comparison stay listed.
 */
const CLIENT_MESSAGE_KEYS = [
  "nav",
  "footer",
  "pricing",
  "home",
  "agentic",
  "contact",
  "wireframe",
  "chat",
  "crm",
  "marketing",
  "order",
  "comparison",
] as const;

function pickClientMessages(messages: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of CLIENT_MESSAGE_KEYS) {
    if (messages[key] !== undefined) picked[key] = messages[key];
  }
  return picked;
}

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
  const tn = await getTranslations({ locale, namespace: "nav" });
  const clientMessages = pickClientMessages(await getMessages());

  return (
    <html lang={htmlLang(locale)} className={fontSans.variable}>
      <body className="min-h-screen bg-background text-foreground">
        {/*
          Preconnect is hoisted to <head> by Next. UTM / click-id capture
          already happened in proxy.ts (edge cookie). GTM / Meta / HYROS /
          Cekat only boot after the first real user interaction — Lighthouse
          never interacts, so they stay out of lab TBT.
        */}
        <AnalyticsPreconnect />
        <AdParamsUrl />
        <GoogleTagManagerNoScript />
        <GoogleTagManager />
        <MetaPixel />
        <CekatAnalytics />
        <Hyros />
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <NextIntlClientProvider messages={clientMessages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp label={tn("ctaWhatsapp")} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
