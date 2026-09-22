import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Read from disk (not a bundler import) so the wireframe editor can rewrite
  // messages/id.json and the next render picks it up after revalidatePath.
  const messages = JSON.parse(
    readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"),
  );

  return { locale, messages };
});
