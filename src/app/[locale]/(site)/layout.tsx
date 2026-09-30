import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

/**
 * Global site chrome for every production route. Kept out of the [locale]
 * layout so standalone drafts (preview-home) that ship their own header and
 * footer don't render the site nav twice.
 */
export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tn = await getTranslations("nav");

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp label={tn("ctaWhatsapp")} />
    </>
  );
}
