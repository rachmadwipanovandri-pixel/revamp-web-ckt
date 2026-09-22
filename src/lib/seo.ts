import { getPathname } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cekat.ai";

export function htmlLang(locale: string): string {
  return locale === "id" ? "id-ID" : "en";
}

/**
 * Localized absolute path for a STATIC route (a key of routing.pathnames
 * without dynamic params). Landing pages with per-locale slugs must use
 * `alternatesFor` with registry-resolved paths instead.
 */
export function localizedPath(locale: string, pathname: string): string {
  return getPathname({
    href: pathname as Exclude<AppPathname, `${string}[slug]${string}`>,
    locale: locale as Locale,
  });
}

export function alternates(locale: string, pathname: string) {
  return {
    // Self-referencing canonical per Google's hreflang guidance, each
    // locale variant points to itself, not to a single "master" URL.
    canonical: `${SITE_URL}${localizedPath(locale, pathname)}`,
    languages: {
      en: `${SITE_URL}${localizedPath("en", pathname)}`,
      id: `${SITE_URL}${localizedPath("id", pathname)}`,
      // Indonesian is the default locale (served at the root), so it is also
      // the x-default target for unmatched languages.
      "x-default": `${SITE_URL}${localizedPath("id", pathname)}`,
    },
  };
}

/** Absolute localized paths per locale the page exists in. */
export type LocalePaths = Partial<Record<Locale, string>>;

/**
 * Canonical + hreflang for pages whose locale variants have different slugs,
 * or that exist in only one locale. hreflang requires 1:1 reciprocity, so a
 * single-locale page emits a canonical only, never an alternate pointing at
 * a keyword-twin or fallback page.
 */
export function alternatesFor(locale: Locale, paths: LocalePaths) {
  const own = paths[locale];
  if (!own) throw new Error(`alternatesFor: no path for locale "${locale}"`);
  const languages =
    paths.en && paths.id
      ? {
          en: `${SITE_URL}${paths.en}`,
          id: `${SITE_URL}${paths.id}`,
          "x-default": `${SITE_URL}${paths.id}`,
        }
      : undefined;
  return { canonical: `${SITE_URL}${own}`, languages };
}
