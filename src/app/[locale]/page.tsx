import { setRequestLocale } from "next-intl/server";
import {
  Hero,
  LogoStrip,
  SoundWords,
  Proof,
  Products,
  ProblemSolution,
  HowItWorks,
  CaseStudy,
  Pricing,
  Results,
  OpenApi,
  CipherBand,
  Security,
  Faq,
  FinalCta,
  ScrollProgress,
} from "@/components/sections/agentic";
import { IndustryCarousel } from "@/components/sections/home/industry-carousel";

/**
 * Production homepage — redesigned chapter rhythm.
 *
 * Order: void hero → logo ticker → pillars → giant proof → bento products →
 * problem/solution → sticky how-it-works with visual stage → industry rail →
 * editorial case study → pricing → results → open API → cipher band →
 * security vault + trust chips → FAQ → void closer.
 *
 * Palette stays on brand tokens (#1352bf / ink-void / sky).
 * SEO lives on the locale layout. Do not set `robots: noindex` here.
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
      <ScrollProgress />
      <Hero />
      <div className="cv-auto">
        <LogoStrip />
      </div>
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
        <ProblemSolution />
      </div>
      {/* No cv-auto: content-visibility containment breaks position:sticky
          on the Live stage inside HowItWorks. */}
      <HowItWorks />
      <div className="cv-auto">
        <IndustryCarousel />
      </div>
      {/* Case-study metrics also use sticky — keep off content-visibility. */}
      <CaseStudy />
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
        <CipherBand />
      </div>
      <div className="cv-auto">
        <Security />
      </div>
      {/* FAQ sticky title — no content-visibility wrapper. */}
      <Faq />
      <div className="cv-auto">
        <FinalCta />
      </div>
    </>
  );
}
