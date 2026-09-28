import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, SITE_URL } from "@/lib/seo";
import { readEventBySlug } from "@/lib/events/store";
import { hasSession } from "@/lib/events/session";
import { EventLanding } from "@/components/sections/events/event-landing";

export const dynamicParams = true;

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
  const { languages } = alternates(locale, "/events");
  const canonical = canonicalFor(locale as Locale, slug);
  const description = event.excerpt || t("description");
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
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const event = readEventBySlug(slug);
  // Drafts stay hidden from visitors but previewable by logged-in marketers.
  if (!event || (event.status !== "published" && !(await hasSession()))) {
    notFound();
  }
  return <EventLanding event={event} />;
}
