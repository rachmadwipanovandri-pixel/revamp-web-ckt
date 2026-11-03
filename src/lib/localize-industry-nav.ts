const INDUSTRY_LINKS = {
  Healthcare: { en: "healthcare", id: "kesehatan" },
  "Retail &amp; F&amp;B": { en: "retail-ecommerce", id: "ritel" },
  "Financial Services": { en: "financial-services", id: "keuangan" },
  Automotive: { en: "automotive", id: "otomotif" },
  Logistics: { en: "logistics", id: "logistik" },
  "Travel &amp; Hospitality": { en: "tour-travel", id: "travel" },
  Education: { en: "education", id: "pendidikan" },
  Property: { en: "property", id: "properti" },
} as const;

/**
 * The reference markup gives every industry menu item the same hub href.
 * Rewrite by the item's visible label, rather than by its original href, so
 * this remains correct if the reference artifact changes that placeholder.
 */
export function localizeIndustryNav(markup: string, locale: string) {
  let next = markup;
  for (const [label, slugs] of Object.entries(INDUSTRY_LINKS)) {
    const href =
      locale === "id"
        ? `/industri/${slugs.id}`
        : `/${locale}/industries/${slugs.en}`;
    const pattern = new RegExp(
      `(<a\\b(?=[^>]*\\bclass="[^"]*\\bmlink\\b[^"]*")[^>]*\\bhref=")[^"]*("[^>]*>\\s*${label.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\s*</a>)`,
      "g",
    );
    next = next.replace(pattern, `$1${href}$2`);
  }
  return next;
}
