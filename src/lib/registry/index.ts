import { getPathname } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import type { LocalePaths } from "@/lib/seo";
import { FEATURES } from "./features";
import { INDUSTRIES } from "./industries";
import { SOLUTIONS } from "./solutions";
import type { LandingKind, RegistryEntry } from "./types";

export const REGISTRY: Record<LandingKind, readonly RegistryEntry[]> = {
  features: FEATURES,
  industries: INDUSTRIES,
  solutions: SOLUTIONS,
};

const SLUG_TEMPLATE: Record<LandingKind, AppPathname> = {
  features: "/features/[slug]",
  industries: "/industries/[slug]",
  solutions: "/solutions/[slug]",
};

export function kindForTemplate(template: string): LandingKind | undefined {
  return (Object.keys(SLUG_TEMPLATE) as LandingKind[]).find(
    (kind) => SLUG_TEMPLATE[kind] === template,
  );
}

export function getEntryById(
  kind: LandingKind,
  id: string,
): RegistryEntry | undefined {
  return REGISTRY[kind].find((entry) => entry.id === id);
}

export function getEntryBySlug(
  kind: LandingKind,
  locale: Locale,
  slug: string,
): RegistryEntry | undefined {
  return REGISTRY[kind].find((entry) => entry.slugs[locale] === slug);
}

export function slugsFor(kind: LandingKind, locale: Locale): string[] {
  return REGISTRY[kind].flatMap((entry) => entry.slugs[locale] ?? []);
}

/**
 * Localized absolute path for one entry in one locale (undefined when the
 * page does not exist there).
 */
export function entryPath(
  kind: LandingKind,
  entry: RegistryEntry,
  locale: Locale,
): string | undefined {
  const slug = entry.slugs[locale];
  if (!slug) return undefined;
  return getPathname({
    href: {
      pathname: SLUG_TEMPLATE[kind] as "/features/[slug]",
      params: { slug },
    },
    locale,
  });
}

/** Localized absolute paths per locale the entry exists in, for hreflang. */
export function entryPaths(
  kind: LandingKind,
  entry: RegistryEntry,
): LocalePaths {
  const paths: LocalePaths = {};
  for (const locale of Object.keys(entry.slugs) as Locale[]) {
    paths[locale] = entryPath(kind, entry, locale);
  }
  return paths;
}

/**
 * Counterpart slug in the target locale for the language switcher, the
 * entry's own slug when it exists, else its switcherFallback's.
 */
export function counterpartSlug(
  kind: LandingKind,
  slug: string,
  from: Locale,
  to: Locale,
): string | undefined {
  const entry = getEntryBySlug(kind, from, slug);
  if (!entry) return undefined;
  if (entry.slugs[to]) return entry.slugs[to];
  if (entry.switcherFallbackId) {
    return getEntryById(kind, entry.switcherFallbackId)?.slugs[to];
  }
  return undefined;
}

/** Same-category entries existing in the locale, excluding the entry itself. */
export function relatedEntries(
  kind: LandingKind,
  entry: RegistryEntry,
  locale: Locale,
  limit = 4,
): RegistryEntry[] {
  const sameCategory = REGISTRY[kind].filter(
    (other) =>
      other.id !== entry.id &&
      other.category === entry.category &&
      other.slugs[locale] &&
      // Keyword twins of the same canonical page are near-duplicates, not
      // useful related links.
      other.switcherFallbackId !== entry.id &&
      entry.switcherFallbackId !== other.id,
  );
  const rest = REGISTRY[kind].filter(
    (other) =>
      other.id !== entry.id &&
      other.category !== entry.category &&
      other.slugs[locale],
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Mega-menu items grouped by category, sorted by nav.order. */
/**
 * Every entry of a kind that exists in this locale, ordered for navigation:
 * curated `nav.order` first, then the rest alphabetically.
 *
 * For small, complete sets (industries, roles) this is better than the
 * `nav.megaMenu` flag, which exists to curate features down from 160. A new
 * industry appears in the menu by existing, with no second list to update.
 */
export function allNavEntries(
  kind: LandingKind,
  locale: Locale,
): RegistryEntry[] {
  return REGISTRY[kind]
    .filter((entry) => entry.slugs[locale] && !entry.switcherFallbackId)
    .slice()
    .sort((a, b) => {
      const orderA = a.nav?.order ?? Infinity;
      const orderB = b.nav?.order ?? Infinity;
      if (orderA !== orderB) return orderA - orderB;
      return (a.title[locale] ?? "").localeCompare(b.title[locale] ?? "");
    });
}

export function megaMenuGroups(
  kind: LandingKind,
  locale: Locale,
): Map<string, RegistryEntry[]> {
  const groups = new Map<string, RegistryEntry[]>();
  for (const entry of REGISTRY[kind]) {
    if (!entry.nav?.megaMenu || !entry.slugs[locale]) continue;
    const group = groups.get(entry.category) ?? [];
    group.push(entry);
    groups.set(entry.category, group);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => (a.nav?.order ?? 99) - (b.nav?.order ?? 99));
  }
  return groups;
}
