import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export function generateStaticParams() {
  return [{ locale: "id" }, { locale: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
  };
}

/**
 * Former design playground for the homepage redesign. The agentic sections
 * now live on `/`; this route only keeps old links working.
 */
export default async function NewHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/", locale });
}
