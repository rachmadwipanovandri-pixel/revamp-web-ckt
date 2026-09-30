import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { alternates, localizedPath, SITE_URL } from "@/lib/seo";
import { collectionPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { readListedEvents } from "@/lib/events/store";
import { PageHero } from "@/components/sections/shared/page-hero";
import { EventCard } from "@/components/sections/events/event-card";
import { Container } from "@/components/layout/container";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events.meta" });
  const { canonical, languages } = alternates(locale, "/events");
  // An empty hub is a holding page, not an answer to any query — keep it out
  // of the index until the first event publishes (and revalidate flips it).
  const hasEvents = readListedEvents().length > 0;
  return {
    title: t("title"),
    description: t("description"),
    ...(hasEvents ? {} : { robots: { index: false, follow: true } }),
    alternates: { canonical, languages },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        { url: "/graph-image.jpg", width: 1200, height: 630, alt: t("title") },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/graph-image.jpg"],
    },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "events" });

  // Upcoming events first (soonest on top), then past ones most recent first.
  const events = readListedEvents();

  const url = `${SITE_URL}${localizedPath(locale, "/events")}`;
  const jsonLd =
    events.length > 0
      ? collectionPageJsonLd({
          url,
          name: t("listing.title"),
          description: t("listing.subtitle"),
          items: events.map((event) => ({
            name: event.title,
            url: `${SITE_URL}${getPathname({
              href: {
                pathname: "/events/[slug]",
                params: { slug: event.slug },
              },
              locale,
            })}`,
          })),
        })
      : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <PageHero
        eyebrow={t("listing.eyebrow")}
        title={t("listing.title")}
        subtitle={t("listing.subtitle")}
        align="center"
      />

      <Container className="py-14 lg:py-20">
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground lg:text-lg">
          {t("listing.intro")}
        </p>
        {events.length === 0 ? (
          <p className="mx-auto mt-10 max-w-md text-center text-muted-foreground">
            {t("listing.empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} isPast={event.isPast} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
