import "server-only";
import type { Locale } from "@/i18n/routing";

export type LegalPageId = "terms" | "privacy" | "refund";

export interface LegalContent {
  /** Document heading, mirrored from the source cekat.ai page. */
  title: string;
  /** "Last updated on …" line, or null when the source has none. */
  updated: string | null;
  /** Cleaned semantic HTML (headings, paragraphs, links) for the body. */
  html: string;
}

/** Route pathname (routing.ts key) for each legal document. */
export const LEGAL_PATHNAME: Record<LegalPageId, string> = {
  terms: "/terms-and-conditions",
  privacy: "/privacy-policy",
  refund: "/return-refund-delivery-policy",
};

/**
 * Loads one legal document's copy. Server-only — the bodies are long and must
 * never enter next-intl messages (which ship to every route's client bundle).
 * The relative template-literal import code-splits one chunk per content file.
 */
export async function loadLegalContent(
  page: LegalPageId,
  locale: Locale,
): Promise<LegalContent> {
  const mod = await import(`../content/legal/${page}.${locale}.json`);
  return mod.default as LegalContent;
}
