import { SITE_URL } from "@/lib/seo";
import { blogUrls, latestLastModified } from "@/lib/sitemap-data";
import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

/**
 * Sitemap index. Google's recommended shape once a site spans several
 * sitemaps: one parent listing the children, each child grouped by content
 * type so it stays small and legible.
 */
export async function GET() {
  const blog = await blogUrls();

  return xmlResponse(
    sitemapIndexXml([
      { url: `${SITE_URL}/sitemap-pages.xml` },
      {
        url: `${SITE_URL}/sitemap-blog.xml`,
        lastModified: latestLastModified(blog),
      },
    ]),
  );
}
