import { pageUrls } from "@/lib/sitemap-data";
import { urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

export const revalidate = 3600;

/** Marketing pages: static routes plus the registry-driven landing pages. */
export function GET() {
  return xmlResponse(urlsetXml(pageUrls()));
}
