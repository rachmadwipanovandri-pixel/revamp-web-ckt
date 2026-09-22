import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "id",
  localePrefix: "as-needed",
  localeDetection: false,
  // The default alternate-links header substitutes identical param values into
  // every locale's template, wrong for landing pages whose slug differs per
  // locale (or that exist in only one locale). hreflang is emitted per page
  // via metadata instead (src/lib/seo.ts).
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/chat": "/chat",
    "/crm": "/crm",
    "/marketing": "/marketing",
    "/order": "/order",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": "/contact",
    "/pricing": { en: "/pricing", id: "/harga" },
    "/comparison": { en: "/comparison", id: "/perbandingan" },
    "/demo": "/demo",
    "/terms-and-conditions": "/terms-and-conditions",
    "/privacy-policy": "/privacy-policy",
    "/return-refund-delivery-policy": "/return-refund-delivery-policy",
    "/features": { en: "/features", id: "/fitur" },
    "/features/[slug]": { en: "/features/[slug]", id: "/fitur/[slug]" },
    "/industries": { en: "/industries", id: "/industri" },
    "/industries/[slug]": { en: "/industries/[slug]", id: "/industri/[slug]" },
    "/integrations": { en: "/integrations", id: "/integrasi" },
    "/solutions": { en: "/solutions", id: "/solusi" },
    "/solutions/[slug]": { en: "/solutions/[slug]", id: "/solusi/[slug]" },
    // Internal copy wireframe (ID-first). Not linked in the public nav.
    "/wireframe": "/wireframe",
    // Legacy redesign URL — redirects to `/`. Not in the public nav.
    "/new": "/new",
    // Second redesign pass (exclusive SiteHeader/Footer). Not in the public nav.
    "/new-2": "/new-2",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

/**
 * Cookie holding an EXPLICIT locale choice (set by the language switcher).
 * The geo middleware honors this over geo, but ignores next-intl's own
 * NEXT_LOCALE cookie — so geo re-applies on every visit unless the visitor
 * has actively picked a language.
 */
export const LOCALE_COOKIE = "locale_pref";
