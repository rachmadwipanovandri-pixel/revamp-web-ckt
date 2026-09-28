import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/lib/seo";
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
  return {
    title: t("title"),
    description: t("description"),
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

  return (
    <>
      <PageHero
        eyebrow={t("listing.eyebrow")}
        title={t("listing.title")}
        subtitle={t("listing.subtitle")}
        align="center"
      />

      <Container className="py-14 lg:py-20">
        {events.length === 0 ? (
          <p className="mx-auto max-w-md text-center text-muted-foreground">
            {t("listing.empty")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} isPast={event.isPast} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
