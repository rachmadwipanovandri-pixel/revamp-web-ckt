/**
 * Sitemap XML builders.
 *
 * Hand-rolled rather than using Next's `sitemap.ts` convention because that
 * only emits a single `<urlset>`; Google wants a `<sitemapindex>` once a site
 * is split across several files. Every document also references an XSL
 * stylesheet so browsers render a readable table instead of raw markup —
 * crawlers ignore the stylesheet entirely.
 *
 * Deliberately omits `<changefreq>` and `<priority>`: Google ignores both, so
 * they are noise that only inflates the file.
 */

/** Path of the stylesheet that makes sitemaps human-readable in a browser. */
export const SITEMAP_STYLESHEET = "/sitemap.xsl";

export interface SitemapUrl {
  url: string;
  /** W3C datetime. Only set it where the value is genuinely accurate. */
  lastModified?: string;
  /** hreflang map, including a self-reference and x-default. */
  languages?: Record<string, string>;
}

export interface SitemapIndexEntry {
  url: string;
  lastModified?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const HEADER = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${SITEMAP_STYLESHEET}"?>`;

/** A `<urlset>` document: the actual page listing. */
export function urlsetXml(urls: SitemapUrl[]): string {
  const body = urls
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.url)}</loc>`];
      if (entry.lastModified) {
        lines.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
      }
      for (const [hreflang, href] of Object.entries(entry.languages ?? {})) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
        );
      }
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `${HEADER}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}

/** A `<sitemapindex>` document: the parent that points at the child sitemaps. */
export function sitemapIndexXml(sitemaps: SitemapIndexEntry[]): string {
  const body = sitemaps
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.url)}</loc>`];
      if (entry.lastModified) {
        lines.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
      }
      return `  <sitemap>\n${lines.join("\n")}\n  </sitemap>`;
    })
    .join("\n");

  return `${HEADER}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

/** Shared response shape: correct content type, revalidated like the pages. */
export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
