import { routing, type Locale } from "@/i18n/routing";
import { existsSync } from "node:fs";
import path from "node:path";
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
  const root = path.join(process.cwd(), "src", "content", kind, id);
  const candidates = [locale, "en", "id"];
  const fileLocale = candidates.find((candidate) =>
    existsSync(path.join(root, `${candidate}.json`)),
  );
  if (!fileLocale || !routing.locales.includes(fileLocale as Locale)) {
    throw new Error(`Missing landing content for ${kind}/${id}/${locale}`);
  }
  const mod = await import(`../../content/${kind}/${id}/${fileLocale}.json`);
  return mod.default as LandingContent;
}

/**
 * Exposed for integrity checks and build diagnostics. A locale-specific file
 * is preferred; English and Indonesian remain the documented safety net for
 * older content entries while translations are being rolled out.
 */
export function landingContentLocale(
  kind: LandingKind,
  id: string,
  locale: Locale,
): Locale | undefined {
  const root = path.join(process.cwd(), "src", "content", kind, id);
  const candidates = [locale, "en", "id"] as const;
  const fileLocale = candidates.find((candidate) =>
    existsSync(path.join(root, `${candidate}.json`)),
  );
  return fileLocale && routing.locales.includes(fileLocale as Locale)
    ? (fileLocale as Locale)
    : undefined;
}
