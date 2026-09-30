import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

/**
 * Global site chrome for every production route. Kept out of the [locale]
 * layout so standalone drafts (preview-home) that ship their own header and
 * footer don't render the site nav twice.
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

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp label={tn("ctaWhatsapp")} />
    </>
  );
}
