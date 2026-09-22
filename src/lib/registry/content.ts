import type { Locale } from "@/i18n/routing";
import type { LandingContent, LandingKind } from "./types";

/**
 * Loads one landing page's body copy. Server-side only, page copy must never
 * enter next-intl messages (they ship to every route's client bundle).
 * The relative template-literal import lets the bundler code-split one chunk
 * per content file.
 */
export async function loadLandingContent(
  kind: LandingKind,
  id: string,
  locale: Locale,
): Promise<LandingContent> {
  const mod = await import(`../../content/${kind}/${id}/${locale}.json`);
  return mod.default as LandingContent;
}
