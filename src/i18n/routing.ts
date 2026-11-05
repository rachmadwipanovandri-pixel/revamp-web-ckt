import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "id", "cn", "jp", "kr"],
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
    "/blog/author/[slug]": "/blog/author/[slug]",
    "/contact": "/contact",
    // Keep the internal route name for the sales form while exposing the
    // public contact-us slug used by the live site.
    "/contact-sales": "/contact-us",
    "/events": "/events",
    "/events/[slug]": "/events/[slug]",
    // Marketing-only editor; not linked in the public nav.
    "/events/admin": "/events/admin",
    "/pricing": {
      en: "/pricing",
      id: "/harga",
      cn: "/pricing",
      jp: "/pricing",
      kr: "/pricing",
    },
    "/comparison": {
      en: "/comparison",
      id: "/perbandingan",
      cn: "/comparison",
      jp: "/comparison",
      kr: "/comparison",
    },
    "/terms-and-conditions": "/terms-and-conditions",
    "/privacy-policy": "/privacy-policy",
    "/return-refund-delivery-policy": "/return-refund-delivery-policy",
    "/features": {
      en: "/features",
      id: "/fitur",
      cn: "/features",
      jp: "/features",
      kr: "/features",
    },
    "/features/[slug]": {
      en: "/features/[slug]",
      id: "/fitur/[slug]",
      cn: "/features/[slug]",
      jp: "/features/[slug]",
      kr: "/features/[slug]",
    },
    "/industries": {
      en: "/industries",
      id: "/industri",
      cn: "/industries",
      jp: "/industries",
      kr: "/industries",
    },
    "/industries/[slug]": {
      en: "/industries/[slug]",
      id: "/industri/[slug]",
      cn: "/industries/[slug]",
      jp: "/industries/[slug]",
      kr: "/industries/[slug]",
    },
    "/integrations": {
      en: "/integrations",
      id: "/integrasi",
      cn: "/integrations",
      jp: "/integrations",
      kr: "/integrations",
    },
    "/solutions": {
      en: "/solutions",
      id: "/solusi",
      cn: "/solutions",
      jp: "/solutions",
      kr: "/solutions",
    },
    "/solutions/[slug]": {
      en: "/solutions/[slug]",
      id: "/solusi/[slug]",
      cn: "/solutions/[slug]",
      jp: "/solutions/[slug]",
      kr: "/solutions/[slug]",
    },
    "/stories": {
      en: "/stories",
      id: "/cerita",
      cn: "/stories",
      jp: "/stories",
      kr: "/stories",
    },
    "/stories/[slug]": {
      en: "/stories/[slug]",
      id: "/cerita/[slug]",
      cn: "/stories/[slug]",
      jp: "/stories/[slug]",
      kr: "/stories/[slug]",
    },
    "/case-studies": {
      en: "/studi-kasus",
      id: "/studi-kasus",
      cn: "/case-studies",
      jp: "/case-studies",
      kr: "/case-studies",
    },
    "/case-studies/[slug]": {
      en: "/studi-kasus/[slug]",
      id: "/studi-kasus/[slug]",
      cn: "/case-studies/[slug]",
      jp: "/case-studies/[slug]",
      kr: "/case-studies/[slug]",
    },
    "/about": {
      en: "/about",
      id: "/tentang",
      cn: "/about",
      jp: "/about",
      kr: "/about",
    },
    "/careers": {
      en: "/careers",
      id: "/karier",
      cn: "/careers",
      jp: "/careers",
      kr: "/careers",
    },
    // `/new` and `/new-2` are gone: next.config.ts redirects() 308s them to
    // `/` (config redirects run before this middleware, so a page-level 307
    // shim would never fire anyway).
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
