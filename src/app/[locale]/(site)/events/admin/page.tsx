import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { EventsAdmin } from "@/components/sections/events/admin/events-admin";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Event — CekatAI",
    robots: { index: false, follow: false },
  };
}

export default async function EventsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // ID-first internal tool.
  if (locale !== "id") notFound();
  setRequestLocale(locale);

  return <EventsAdmin />;
}
