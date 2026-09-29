import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Re-enabled 2026-09-23 for Lighthouse mobile: render-blocking CSS was
  // ~690ms of savings and LCP element render delay ~1.7s. An earlier 2026-08-15
  // run saw FCP +~100ms from SSR+RSC duplication — watch FCP on the next
  // PageSpeed pass and revert if lab FCP regresses again.
  experimental: {
    inlineCss: true,
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
