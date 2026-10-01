import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Test harness route for the FeatureVideo element. Lives outside the (site)
 * group so production chrome (navbar/footer) never wraps it, and is excluded
 * from sitemap-data — `robots` keeps Google from indexing it entirely.
 */
export const metadata: Metadata = {
  title: "Test — FeatureVideo",
  robots: { index: false, follow: false },
};

export default function FeatureVideoTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
