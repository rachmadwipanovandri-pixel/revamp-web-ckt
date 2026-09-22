import { setRequestLocale } from "next-intl/server";
import {
  Hero,
  SoundWords,
  Proof,
  Products,
  Pricing,
  Results,
  OpenApi,
  FinalCta,
} from "@/components/sections/agentic";

/**
 * Production homepage — Agentic AI Ecosystem story (promoted from `/new`).
 *
 * Chapter rhythm: void keynote hero (6-node hub) → light sound-words
 * (Independent · Integrated · Open API) → soft proof strip → muted product
 * grid (six agents) → brand-wash pricing → Results (metric quotes + video
 * wall + logos) → ink Open API + integrations → void closer.
 *
 * SEO lives on the locale layout (title, description, hreflang). Do not set
 * `robots: noindex` here — this is the canonical homepage.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <div className="cv-auto">
        <SoundWords />
      </div>
      <div className="cv-auto">
        <Proof />
      </div>
      <div className="cv-auto">
        <Products />
      </div>
      <div className="cv-auto">
        <Pricing />
      </div>
      <div className="cv-auto">
        <Results />
      </div>
      <div className="cv-auto">
        <OpenApi />
      </div>
      <div className="cv-auto">
        <FinalCta />
      </div>
    </>
  );
}
