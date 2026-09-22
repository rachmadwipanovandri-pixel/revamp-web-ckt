import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { WireframeEditor } from "./wireframe-editor";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Wireframe Copy — Beranda | CekatAI",
    robots: { index: false, follow: false },
  };
}

export default async function WireframePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // ID-first editor; EN can reuse the same shell later.
  if (locale !== "id") notFound();
  setRequestLocale(locale);

  return <WireframeEditor />;
}
