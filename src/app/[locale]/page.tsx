import { getTranslations, setRequestLocale } from "next-intl/server";
import { faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Hero,
  LogoStrip,
  SoundWords,
  Proof,
  Features,
  HowItWorks,
  CaseStudy,
  Pricing,
  Results,
  OpenApi,
  Gallery,
  PhotoBand,
  Security,
  Faq,
  FinalCta,
  ScrollProgress,
} from "@/components/sections/agentic";
import { IndustryCarousel } from "@/components/sections/home/industry-carousel";

/**
 * Production homepage — incident.io editorial rhythm.
 *
 * Order: hero → logo wall → proof metrics → pillars → feature grid →
 * sticky how-it-works → industries → featured case study
 * → photo gallery → customer stories → photo band → pricing → integrations
 * → security → FAQ → closer.
 *
 * Hero is intentionally untouched. Palette: white canvas + #1352BF accent +
 * clean ink bookends. SEO lives on the locale layout.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Homepage FAQ renders q1..q6 in agentic/faq.tsx (COUNT = 6) but never
  // shipped FAQPage schema — same questions, now machine-readable.
  const t = await getTranslations({ locale, namespace: "agentic.faq" });
  const faqItems = Array.from({ length: 6 }, (_, index) => ({
    q: t(`q${index + 1}`),
    a: t(`a${index + 1}`),
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />
      <ScrollProgress />
      <Hero />
      <div className="cv-auto">
        <LogoStrip />
      </div>
      <div className="cv-auto">
        <Proof />
      </div>
      <div className="cv-auto">
        <SoundWords />
      </div>
      <div className="cv-auto">
        <Features />
      </div>
      {/* No cv-auto: content-visibility containment breaks position:sticky
          on the Live stage inside HowItWorks. */}
      <HowItWorks />
      <div className="cv-auto">
        <IndustryCarousel />
      </div>
      {/* Featured story photography — keep off content-visibility for sticky polish. */}
      <CaseStudy />
      <div className="cv-auto">
        <Gallery />
      </div>
      <div className="cv-auto">
        <Results />
      </div>
      <div className="cv-auto">
        <PhotoBand />
      </div>
      <div className="cv-auto">
        <Pricing />
      </div>
      <div className="cv-auto">
        <OpenApi />
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
