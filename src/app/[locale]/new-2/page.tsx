import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/sections/new-home-2/site-header";
import { SiteFooter } from "@/components/sections/new-home-2/site-footer";
import { Hero } from "@/components/sections/new-home-2/hero";
import { Pillars } from "@/components/sections/new-home-2/pillars";
import { Workspace } from "@/components/sections/new-home-2/workspace";
import { CapabilityRows } from "@/components/sections/new-home-2/capability-rows";
import { Integrations } from "@/components/sections/new-home-2/integrations";
import { ProofPricing } from "@/components/sections/new-home-2/proof-pricing";
import { Results } from "@/components/sections/new-home-2/results";
import { FinalCta } from "@/components/sections/new-home-2/final-cta";

export function generateStaticParams() {
  return [{ locale: "id" }, { locale: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "New Homepage v2 | CekatAI",
    robots: { index: false, follow: false },
  };
}

/**
 * Second redesign pass for the homepage — isolated on /new-2 so /new stays
 * untouched. Direction: Sentry-lineage blue gradient hero with an isometric
 * platform map, then airy light product chapters (two-tone display headings,
 * wireframe pillar glyphs, floating UI cards), closed by a reverse gradient.
 *
 * Chrome is exclusive: shared Navbar/Footer return null on this pathname, and
 * SiteHeader + SiteFooter render here only — never on `/` or `/new`.
 *
 * Rhythm: site header → gradient hero → white pillars → wash workspace →
 * white capability rows → muted integrations → wash proof+pricing → muted
 * results → gradient closer → site footer.
 */
export default async function New2HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <Hero />
      <div className="cv-auto">
        <Pillars />
      </div>
      <div className="cv-auto">
        <Workspace />
      </div>
      <div className="cv-auto">
        <CapabilityRows />
      </div>
      <div className="cv-auto">
        <Integrations />
      </div>
      <div className="cv-auto">
        <ProofPricing />
      </div>
      <div className="cv-auto">
        <Results />
      </div>
      <div className="cv-auto">
        <FinalCta />
      </div>
      <SiteFooter />
    </>
  );
}
