import { blogUrls } from "@/lib/sitemap-data";
import { urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

/** Blog posts, with reciprocal hreflang for translated pairs. */
export async function GET() {
  return xmlResponse(urlsetXml(await blogUrls()));
}
