import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { reciprocalLanguages, SITE_URL } from "@/lib/seo";
import { readEventBySlug, isPastEvent } from "@/lib/events/store";
import { hasSession } from "@/lib/events/session";
import { eventJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { EventLanding } from "@/components/sections/events/event-landing";

export const dynamicParams = true;
// Hourly refresh so a started event flips EventScheduled → EventCompleted
// (and its JSON-LD follows) without waiting for the next marketing save.
export const revalidate = 3600;

// Rendered on demand so a marketing save shows up without a rebuild.
export function generateStaticParams() {
  return [];
}

function canonicalFor(locale: Locale, slug: string) {
  return `${SITE_URL}${getPathname({
    href: { pathname: "/events/[slug]", params: { slug } },
    locale,
  })}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = readEventBySlug(slug);
  if (!event || event.status !== "published") return {};
  const t = await getTranslations({ locale, namespace: "events.meta" });
  const canonical = canonicalFor(locale as Locale, slug);
  const description = event.excerpt || t("description");
  // The language variants are THIS event in each locale — never the hub.
  // (Previously borrowed from alternates("/events"), which pointed the whole
  // cluster at the listing page and broke reciprocity on first publish.)
  // Relative paths: reciprocalLanguages adds SITE_URL itself — absolute input
  // would double-prefix (`https://cekat.aihttps://cekat.ai/...`).
  const pathFor = (target: Locale) =>
    getPathname({
      href: { pathname: "/events/[slug]", params: { slug } },
      locale: target,
    });
  const languages = reciprocalLanguages({ en: pathFor("en"), id: pathFor("id") });
  return {
    title: event.title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: event.title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: event.cover
        ? [{ url: event.cover, alt: event.title }]
        : [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [event.cover || "/graph-image.jpg"],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const event = readEventBySlug(slug);
  // Drafts stay hidden from visitors but previewable by logged-in marketers.
  if (!event || (event.status !== "published" && !(await hasSession()))) {
    notFound();
  }

  // Event schema only for published events — a draft must leave no trace.
  const jsonLd =
    event.status === "published"
      ? eventJsonLd({
          name: event.title,
          description: event.excerpt || event.title,
          url: canonicalFor(locale as Locale, slug),
          startDate: event.startsAt,
          past: isPastEvent(event),
          image: event.cover
            ? event.cover.startsWith("http")
              ? event.cover
              : `${SITE_URL}${event.cover.startsWith("/") ? "" : "/"}${event.cover}`
            : `${SITE_URL}/graph-image.jpg`,
          locationLabel: event.locationLabel,
          language: locale === "en" ? "en" : "id-ID",
        })
      : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <EventLanding event={event} />
    </>
  );
}
