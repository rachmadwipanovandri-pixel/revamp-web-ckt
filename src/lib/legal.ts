import "server-only";
import type { Locale } from "@/i18n/routing";
import { existsSync } from "node:fs";
import path from "node:path";

export type LegalPageId = "terms" | "privacy" | "refund";

export interface LegalContent {
  /** Document heading, mirrored from the source cekat.ai page. */
  title: string;
  /**
   * Curated meta description. When present it wins over the first-paragraph
   * hoist — legal documents open with a letterhead ("Company: …"), which makes
   * a useless 37-char snippet.
   */
  description?: string;
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
  const root = path.join(process.cwd(), "src", "content", "legal");
  const fileLocale = [locale, "en", "id"].find((candidate) =>
    existsSync(path.join(root, `${page}.${candidate}.json`)),
  );
  if (!fileLocale)
    throw new Error(`Missing legal content for ${page}/${locale}`);
  const mod = await import(`../content/legal/${page}.${fileLocale}.json`);
  return mod.default as LegalContent;
}
