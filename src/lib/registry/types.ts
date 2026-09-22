import type { Locale } from "@/i18n/routing";

export type LandingKind = "features" | "industries" | "solutions";

export type FeatureCategory = "chat" | "crm" | "marketing" | "order" | "ai";
export type IndustryCategory = "industry";
export type SolutionCategory = "role";

export interface RegistryEntry<C extends string = string> {
  /** Canonical, locale-neutral page id, also the content directory name. */
  id: string;
  /** Grouping for the mega menu, related links and breadcrumbs. */
  category: C;
  /** Localized URL slug per locale. Absence = page does not exist in that locale. */
  slugs: Partial<Record<Locale, string>>;
  /** Short label for nav / breadcrumbs / related-link cards. */
  title: Partial<Record<Locale, string>>;
  /** lucide-react icon name for the mega menu (e.g. "Bot"). */
  icon?: string;
  /** Short one-line description for nav cards (industries mega menu). */
  tagline?: Partial<Record<Locale, string>>;
  /** `megaMenu` marks the curated set shown in the desktop mega menu / mobile nav. */
  nav?: { megaMenu?: boolean; order?: number };
  /**
   * For single-locale keyword-variant pages: the id of the canonical entry the
   * language switcher should target. UX affordance only, never used for
   * hreflang (which requires 1:1 reciprocity).
   */
  switcherFallbackId?: string;
}

export type FeatureEntry = RegistryEntry<FeatureCategory>;
export type IndustryEntry = RegistryEntry<IndustryCategory>;
export type SolutionEntry = RegistryEntry<SolutionCategory>;

/** Body copy for one landing page in one locale (src/content/<kind>/<id>/<locale>.json). */
export interface LandingContent {
  meta: { title: string; description: string };
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    /** Industry pages: short use-case labels, one per benefit below. */
    useCases?: string[];
  };
  /**
   * GEO: 1–2 sentence entity definition ("WhatsApp Blast is …"), rendered
   * first in the body, the snippet answer engines lift.
   */
  definition: string;
  stats?: Array<{ value: string; label: string }>;
  benefits: Array<{
    title: string;
    body: string;
    image?: string;
    imageAlt?: string;
  }>;
  tabs?: Array<{ label: string; title: string; body: string; image?: string }>;
  /** Role pages: problems the role hits without the platform, as cards. */
  painPoints?: {
    heading: string;
    items: Array<{ icon?: string; title: string; body: string }>;
  };
  /** Role pages: the with/without toggle comparison. */
  compare?: {
    heading: string;
    body: string;
    withLabel: string;
    withoutLabel: string;
    with: {
      title: string;
      bullets: string[];
      image?: string;
      imageAlt?: string;
    };
    without: { title: string; bullets: string[] };
  };
  /**
   * A named client's story. Kept out of `benefits` on purpose: those describe
   * how the product works, this is evidence that it did, and the two do not
   * belong in the same list.
   */
  caseStudy?: {
    client: string;
    /** Optional story heading; defaults to the client name for existing pages. */
    title?: string;
    /** Figures the client reported, rendered as the section's lead. */
    metrics: Array<{ value: string; label: string }>;
    body: string;
  };
  /** Role pages: light CTA band mid-page, after the comparison. */
  midCta?: { heading: string; body: string };
  pillars: Array<{ title: string; body: string }>;
  testimonial?: {
    /** Overrides the shared landing.testimonialHeading for this page only,
        for a quote that speaks to something narrower than "real results". */
    heading?: string;
    quote: string;
    name: string;
    role: string;
    image?: string;
    videoId?: string;
  };
  faq: Array<{ q: string; a: string }>;
  cta: { heading: string; body: string };
}
