import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // experimental.inlineCss was measured and rejected on 2026-08-15. It inlines
  // the sheet twice (SSR <style> + RSC payload), so the document grew 62->97KiB
  // to drop a 17KiB stylesheet that was already loading in parallel. Median
  // mobile FCP regressed 1064->1162ms over 5 runs with third-party blocked.
  // Next's "atomic CSS stays small" premise does not hold at our sheet size.
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
