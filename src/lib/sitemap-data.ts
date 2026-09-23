import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { localizedPath, SITE_URL } from "@/lib/seo";
import { entryPaths, REGISTRY } from "@/lib/registry";
import type { LandingKind } from "@/lib/registry/types";
import { getAllPostSlugs, getAuthors, type PostSlugInfo } from "@/lib/wordpress";
import type { SitemapUrl } from "@/lib/sitemap-xml";

/**
 * Routes that exist as pages today, never list URLs that 404. Also never a URL
 * we tell crawlers to skip: /comparison is noindex, so listing it would ask
 * Google to crawl a page it is then told to drop.
 */
const STATIC_ROUTES = [
  "/",
  "/chat",
  "/crm",
  "/marketing",
  "/order",
  "/contact",
  "/pricing",
  "/features",
  "/industries",
  "/solutions",
  "/integrations",
  "/blog",
  "/terms-and-conditions",
  "/privacy-policy",
  "/return-refund-delivery-policy",
] as const;

/** Default locale first, so each page's variants read id then en. */
const LOCALE_ORDER: Locale[] = [
  routing.defaultLocale,
  ...routing.locales.filter((locale) => locale !== routing.defaultLocale),
];

/**
 * hreflang map for a page that exists in both locales. Returns undefined for
 * single-locale pages: hreflang requires 1:1 reciprocity, so advertising a
 * counterpart that does not exist would point crawlers at a 404.
 */
function languagesFor(paths: { en?: string; id?: string }) {
  if (!paths.en || !paths.id) return undefined;
  return {
    en: `${SITE_URL}${paths.en}`,
    id: `${SITE_URL}${paths.id}`,
    "x-default": `${SITE_URL}${paths.id}`,
  };
}

/** Marketing pages: static routes plus every registry-driven landing page. */
export function pageUrls(): SitemapUrl[] {
  const staticEntries: SitemapUrl[] = STATIC_ROUTES.flatMap((route) => {
    const languages = languagesFor({
      en: localizedPath("en", route),
      id: localizedPath("id", route),
    });
    return LOCALE_ORDER.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, route)}`,
      languages,
    }));
  });

  const landingEntries: SitemapUrl[] = (
    Object.keys(REGISTRY) as LandingKind[]
  ).flatMap((kind) =>
    REGISTRY[kind].flatMap((entry) => {
      const paths = entryPaths(kind, entry);
      const languages = languagesFor(paths);
      return LOCALE_ORDER.filter((locale) => paths[locale]).map((locale) => ({
        url: `${SITE_URL}${paths[locale]}`,
        languages,
      }));
    }),
  );

  return [...staticEntries, ...landingEntries];
}

/**
 * Blog posts. Polylang keeps a separate post per language, so each translation
 * set is grouped together and emitted in locale order with shared reciprocal
 * hreflang. Resilient by design: if WordPress is unreachable this returns an
 * empty list so the rest of the sitemap still ships.
 */
export async function blogUrls(): Promise<SitemapUrl[]> {
  const posts = await getAllPostSlugs();
  const byId = new Map(posts.map((post) => [post.id, post]));
  const blogPath = (slug: string, locale: Locale) =>
    getPathname({
      href: { pathname: "/blog/[slug]", params: { slug } },
      locale,
    });

  const urls: SitemapUrl[] = [];
  const seen = new Set<number>();

  for (const post of posts) {
    if (seen.has(post.id)) continue;
    if (post.lang !== "en" && post.lang !== "id") continue;

    const group = LOCALE_ORDER.map((locale) => {
      const translatedId = post.translations?.[locale];
      const translated =
        translatedId !== undefined ? byId.get(translatedId) : undefined;
      return translated ?? (post.lang === locale ? post : undefined);
    }).filter((entry): entry is PostSlugInfo => Boolean(entry));

    const paths: { en?: string; id?: string } = {};
    for (const entry of group) {
      paths[entry.lang as Locale] = blogPath(entry.slug, entry.lang as Locale);
    }
    const languages = languagesFor(paths);

    for (const entry of group) {
      if (seen.has(entry.id)) continue;
      seen.add(entry.id);
      urls.push({
        url: `${SITE_URL}${blogPath(entry.slug, entry.lang as Locale)}`,
        lastModified: entry.modified,
        languages,
      });
    }
  }

  return urls;
}

/**
 * Author profile pages. Same slug in both locales → reciprocal hreflang.
 * Degrades to [] when WordPress is down so the rest of the blog sitemap ships.
 */
export async function blogAuthorUrls(): Promise<SitemapUrl[]> {
  const authors = await getAuthors();
  return authors.flatMap((author) => {
    const path = (locale: Locale) =>
      getPathname({
        href: {
          pathname: "/blog/author/[slug]",
          params: { slug: author.slug },
        },
        locale,
      });
    const paths = {
      en: path("en"),
      id: path("id"),
    };
    const languages = languagesFor(paths);
    return LOCALE_ORDER.map((locale) => ({
      url: `${SITE_URL}${paths[locale]}`,
      languages,
    }));
  });
}

/** Most recent lastmod in a set, for the index entry. */
export function latestLastModified(urls: SitemapUrl[]): string | undefined {
  return urls.reduce<string | undefined>((latest, entry) => {
    if (!entry.lastModified) return latest;
    return !latest || entry.lastModified > latest ? entry.lastModified : latest;
  }, undefined);
}
