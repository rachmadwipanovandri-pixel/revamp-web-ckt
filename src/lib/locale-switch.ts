import type { AppPathname, Locale } from "@/i18n/routing";
import { counterpartSlug, kindForTemplate } from "@/lib/registry";

/** Templates that carry a `[slug]` param. */
type SlugTemplate =
  | "/features/[slug]"
  | "/industries/[slug]"
  | "/solutions/[slug]"
  | "/blog/[slug]"
  | "/blog/author/[slug]";

/** Bare route templates (no params) — valid as string hrefs for next-intl Link. */
type StaticTemplate = Exclude<AppPathname, SlugTemplate>;

const HUB_FOR_TEMPLATE: Partial<Record<AppPathname, StaticTemplate>> = {
  "/features/[slug]": "/features",
  "/industries/[slug]": "/industries",
  "/solutions/[slug]": "/solutions",
};

/**
 * An href for next-intl's `Link`: either a bare route template, or a
 * template + params for the `[slug]` routes. It is intentionally NOT
 * pre-localized — the switcher passes `locale={to}` and next-intl builds the
 * correct URL for the target locale (and, crucially, performs a real locale
 * switch even for the unprefixed default-locale root, which a plain
 * `next/link` to "/" does not).
 */
export type SwitchLocaleHref =
  | StaticTemplate
  | { pathname: SlugTemplate; params: { slug: string } };

function resolveCounterpartSlug(
  template: AppPathname,
  slug: string,
  from: Locale,
  to: Locale,
): string | undefined {
  const kind = kindForTemplate(template);
  return kind ? counterpartSlug(kind, slug, from, to) : undefined;
}

/**
 * href descriptor for the language switcher. `template` is the internal route
 * template from `usePathname()` (with `pathnames` configured it returns keys
 * like "/features/[slug]", not concrete paths).
 */
export function switchLocaleHref(
  template: string,
  slug: string | undefined,
  from: Locale,
  to: Locale,
): SwitchLocaleHref {
  const hub = HUB_FOR_TEMPLATE[template as AppPathname];
  if (hub) {
    const counterpart = slug
      ? resolveCounterpartSlug(template as AppPathname, slug, from, to)
      : undefined;
    if (counterpart) {
      return { pathname: template as SlugTemplate, params: { slug: counterpart } };
    }
    // No counterpart in the target locale, land on the hub instead.
    return hub;
  }
  // Blog posts and author profiles share one slug across locales.
  if ((template === "/blog/[slug]" || template === "/blog/author/[slug]") && slug) {
    return { pathname: template as SlugTemplate, params: { slug } };
  }
  return template as StaticTemplate;
}
