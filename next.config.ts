import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Measured on/off again 2026-09-30 (Lighthouse 13.5, local, both routes).
  // inlineCss: true ships the sheet twice (SSR <style> + RSC payload) — with
  // preview-home's 91 KiB route CSS the document hit 179 KiB gz and cost
  // -3 performance points there (87 vs 90); /en scored 82 vs 83 with FCP
  // 1897 vs 1560ms. Keep false; re-measure only if the sheets shrink a lot.
  experimental: {
    inlineCss: false,
  },
  // Checked before the proxy and the filesystem, so these win over any
  // in-app redirect (Next 16 execution order: headers → redirects → proxy).
  redirects: async () => [
    // Apex is canonical. Cloudflare does this at the edge today, but the rule
    // existed nowhere in the repo — one dashboard change could silently drop
    // it, so it is pinned here where a test/review can see it.
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.cekat.ai" }],
      destination: "https://cekat.ai/:path*",
      permanent: true,
    },
    // Legacy redesign URLs. Permanent, not 307: the content moved for good,
    // and temporary tells crawlers to keep re-testing the dead path.
    { source: "/new", destination: "/", permanent: true },
    { source: "/new-2", destination: "/", permanent: true },
    { source: "/id/new", destination: "/", permanent: true },
    { source: "/id/new-2", destination: "/", permanent: true },
    { source: "/en/new", destination: "/en", permanent: true },
    { source: "/en/new-2", destination: "/en", permanent: true },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 narrowed the default to [75]. 50 is for large decorative
    // gradients (the hero sky), where the artefacts are invisible but the
    // saving is roughly half the bytes. Screenshots stay at 75.
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        // Headless WordPress media (blog featured images).
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/wp-content/**",
      },
      {
        // Event covers/speaker photos are pasted by the marketing team in the
        // admin, so the host can be anything https.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
