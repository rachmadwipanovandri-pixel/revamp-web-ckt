import type { ReactNode } from "react";
import { getMessages, getTranslations } from "next-intl/server";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { CekatAnalytics } from "@/components/analytics/cekat-analytics";
import { Hyros } from "@/components/analytics/hyros";
import { AdParamsUrl } from "@/components/analytics/ad-params-url";
import { AnalyticsPreconnect } from "@/components/analytics/analytics-preconnect";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/google-tag-manager";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

/**
 * Namespaces that `"use client"` modules under this group actually call via
 * `useTranslations`. Server Components read the full catalog from
 * `i18n/request.ts`, so this list only bounds what is serialized into the RSC
 * payload for the client.
 *
 * Product pages (chat/crm/marketing/order) compose shared sections server-side,
 * so only comparison still needs its own namespace here (Faq + FinalCTA).
 */
const CLIENT_MESSAGE_KEYS = [
  "nav",
  "footer",
  "pricing",
  "home",
  "agentic",
  "contact",
  "comparison",
  "events",
] as const;

function pickClientMessages(messages: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of CLIENT_MESSAGE_KEYS) {
    if (messages[key] !== undefined) picked[key] = messages[key];
  }
  return picked;
}

/**
 * Global site chrome for every production route. Kept out of the [locale]
 * layout so standalone drafts (preview-home-2) that ship their own header and
 * footer don't render the site nav twice.
 *
 * The client-side i18n provider lives here rather than in [locale]/layout for
 * the same reason the chrome does: it is only needed by this group's client
 * components. `NextIntlClientProvider` is itself a client component, so passing
 * it `messages` writes them into the flight payload and the HTML of *every*
 * route beneath [locale] — including the drafts, which build all their strings
 * locally in `content.ts` and call `useTranslations` zero times. That was ~42 KB
 * of parsed-and-discarded JSON on /preview-home-2's 439 KB document.
 *
 * The locale is passed explicitly: a locale-less `getTranslations()` falls
 * back to reading request headers, which throws DYNAMIC_SERVER_USAGE while
 * static-ISR pages (blog/[slug], author pages) render on demand — 500 in
 * production while dev and build-time prerenders look fine.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });
  const clientMessages = pickClientMessages(await getMessages({ locale }));

  return (
    <NextIntlClientProvider locale={locale} messages={clientMessages}>
      {/*
        Preconnect is hoisted to <head> by Next. UTM / click-id capture
        already happened in proxy.ts (edge cookie). GTM / Meta / HYROS / Cekat
        boot after first interaction, or via the hybrid fallback (≤9s timeout /
        pagehide) so non-interacting visitors still count.
      */}
      <AnalyticsPreconnect />
      <AdParamsUrl />
      <GoogleTagManagerNoScript />
      <GoogleTagManager />
      <MetaPixel />
      <CekatAnalytics />
      <Hyros />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp label={tn("ctaWhatsapp")} />
    </NextIntlClientProvider>
  );
}
