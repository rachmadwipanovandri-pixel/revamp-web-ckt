"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { rememberLocaleFromLinkTarget } from "@/lib/locale-preference";
import { RevampHeader } from "./revamp-header";
import { Footer } from "./footer";
import { FloatingWhatsApp } from "./floating-whatsapp";
import { SiteSmoothScroll } from "./site-smooth-scroll";

/**
 * The revamp homepage owns its complete header, footer, and mobile CTA.
 * Rendering the legacy site chrome around it produced two stacked navbars.
 */
export function SiteChrome({
  children,
  whatsappLabel,
}: {
  children: ReactNode;
  whatsappLabel: string;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    const rememberLanguageChoice = (event: MouseEvent) => {
      rememberLocaleFromLinkTarget(event.target);
    };

    document.addEventListener("click", rememberLanguageChoice);
    return () => document.removeEventListener("click", rememberLanguageChoice);
  }, []);

  if (isHomepage) {
    return (
      <>
        <SiteSmoothScroll />
        <main className="reference-home-main">{children}</main>
      </>
    );
  }

  return (
    <>
      <SiteSmoothScroll />
      <RevampHeader />
      <main className="cekat-page">
        <noscript>
          <style>{`.cekat-page .reveal-on-scroll { opacity: 1 !important; transform: none !important; }
            .cekat-page .workflow-scene__controls { display: none; }
            @layer base { .cekat-page .benefit-studio [role="region"][hidden] { display: block !important; } }`}</style>
        </noscript>
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp label={whatsappLabel} />
    </>
  );
}
