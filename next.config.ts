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
    ],
  },
};

export default withNextIntl(nextConfig);
