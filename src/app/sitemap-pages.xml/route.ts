import { SITE_URL } from "@/lib/seo";
import { pageUrls } from "@/lib/sitemap-data";
import { urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

/** Marketing pages: static routes plus the registry-driven landing pages. */
export function GET() {
  return xmlResponse(
    urlsetXml([
      ...pageUrls(),
      // AI-model discovery file (GEO): listed without hreflang, it is one
      // locale-neutral document, so crawlers find it alongside the pages.
      // shortcut: served as a static urlset entry, not a sitemapindex child.
      { url: `${SITE_URL}/llms.txt` },
    ]),
  );
}
