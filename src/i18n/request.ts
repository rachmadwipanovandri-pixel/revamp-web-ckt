import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

function mergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      result[key] = mergeMessages(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Read from disk (not a bundler import) so edits to messages/*.json are
  // picked up on the next render without a rebuild.
  const base = JSON.parse(
    readFileSync(join(process.cwd(), "messages", "en.json"), "utf8"),
  ) as Record<string, unknown>;
  const local = JSON.parse(
    readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
  ) as Record<string, unknown>;
  const messages = locale === "en" ? base : mergeMessages(base, local);

  return { locale, messages };
});
