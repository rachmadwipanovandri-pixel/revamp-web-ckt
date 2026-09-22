import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Every crawler may read the whole site; only /api/ is off limits, since those
// routes have no standalone search value and pages render server-side.
//
// The wildcard group additionally blocks /_next/, which is where every script,
// stylesheet, and font lives. That keeps generic bots from hauling down build
// output they have no use for.
//
// The rendering crawlers get their own groups WITHOUT that block, and this is
// the point of the split: robots.txt gives the most specific matching group
// precedence, so they ignore the wildcard entirely and keep full asset access.
// Each renders a page before judging it, and a renderer that cannot fetch CSS
// or JS sees an unstyled skeleton. Never add /_next/ to these groups.
//
// Google-InspectionTool is listed because it is a separate token from Googlebot
// and would otherwise fall through to the wildcard. It backs URL Inspection and
// the Rich Results Test, so blocking it would make Search Console report broken
// resources on healthy pages and bury real failures in the noise.
//
// AdsBot-Google needs no entry: Google's ad crawlers ignore wildcard rules and
// obey only groups that name them, so it already has full access.
//
// AI crawlers (GPTBot, ClaudeBot, PerplexityBot) fall through to the wildcard.
// They extract text rather than render, and our HTML is fully server-rendered,
// so the /_next/ block costs them nothing.
const RENDERS_BEFORE_JUDGING = ["Googlebot", "Bingbot", "Google-InspectionTool"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
      ...RENDERS_BEFORE_JUDGING.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
