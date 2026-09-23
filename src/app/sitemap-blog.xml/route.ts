import { blogAuthorUrls, blogUrls } from "@/lib/sitemap-data";
import { urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

/** Blog posts + author profiles, with reciprocal hreflang. */
export async function GET() {
  const [posts, authors] = await Promise.all([blogUrls(), blogAuthorUrls()]);
  return xmlResponse(urlsetXml([...posts, ...authors]));
}
