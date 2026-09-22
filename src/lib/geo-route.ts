import { FEATURES } from "@/lib/registry/features";
import { INDUSTRIES } from "@/lib/registry/industries";
import { SOLUTIONS } from "@/lib/registry/solutions";

type SlugEntry = { slugs: { en?: string; id?: string } };

function idToEnSlugs(entries: readonly SlugEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of entries) {
    if (entry.slugs.id && entry.slugs.en) map.set(entry.slugs.id, entry.slugs.en);
  }
  return map;
}

// Indonesian hub segment → English segment + that kind's id→en slug map.
const LANDING: Record<string, { en: string; slugs: Map<string, string> }> = {
  fitur: { en: "features", slugs: idToEnSlugs(FEATURES) },
  industri: { en: "industries", slugs: idToEnSlugs(INDUSTRIES) },
  solusi: { en: "solutions", slugs: idToEnSlugs(SOLUTIONS) },
};

/**
 * Standalone pages whose slug differs per locale. Anything not listed here (or
 * in LANDING) shares its slug across locales and is simply prefixed. Keep this
 * in sync with `routing.pathnames`: a divergent slug missing from here gets
 * redirected to a URL that does not exist.
 */
const TRANSLATED_SEGMENTS: Record<string, string> = {
  harga: "pricing",
};

/**
 * Maps a default-locale (Indonesian, unprefixed) pathname to its English
 * (/en) counterpart. Localized landing slugs are translated via the registry;
 * Localized landing slugs are translated via the registry; all other routes
 * share their slug across locales, so they are simply prefixed.
 *
 * Returns null when the page has no English equivalent. The caller must then
 * leave the visitor on the Indonesian page: redirecting to a URL that does not
 * exist turns a perfectly good page into a 404 for everyone outside Indonesia,
 * search engines included.
 */
export function toEnglishPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/en";

  // A blog article exists in whatever language it was written in, and whether a
  // translation exists is only knowable from WordPress. Never gamble a deep
  // link on it.
  if (parts[0] === "blog" && parts.length > 1) return null;

  if (parts.length === 1) {
    const translated = TRANSLATED_SEGMENTS[parts[0]];
    if (translated) return `/en/${translated}`;
  }

  const landing = LANDING[parts[0]];
  if (landing) {
    if (parts.length === 1) return `/en/${landing.en}`;
    const enSlug = landing.slugs.get(parts[1]);
    // Indonesian-only keyword twin: keep the page the visitor asked for
    // instead of dumping them on the English hub.
    return enSlug ? `/en/${landing.en}/${enSlug}` : null;
  }

  return `/en${pathname}`;
}
