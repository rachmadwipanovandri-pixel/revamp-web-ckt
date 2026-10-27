import type { Metadata } from "next";
import { faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { getContent } from "@/components/preview-home-2/content";
import { Nav4 } from "@/components/preview-home-4/Nav4";
import { Motion5 } from "@/components/preview-home-5/Motion5";
import { Footer4 } from "@/components/preview-home-4/Footer4";
import { getCopy4 } from "@/components/preview-home-4/content";
import { text } from "@/components/preview-home-4/content-types";
import { AnnouncementBar } from "@/components/preview-home-4/AnnouncementBar";
import { Hero4 } from "@/components/preview-home-4/Hero4";
import { MarqueeBand } from "@/components/preview-home-4/MarqueeBand";
import { LiveBand } from "@/components/preview-home-4/LiveBand";
import { Proof4 } from "@/components/preview-home-4/Proof4";
import { UseCases } from "@/components/preview-home-4/UseCases";
import { PhotoBand } from "@/components/preview-home-4/PhotoBand";
import { Workflow } from "@/components/preview-home-4/Workflow";
import { Capabilities } from "@/components/preview-home-4/Capabilities";
import { CaseGrid } from "@/components/preview-home-4/CaseGrid";
import { ScrubBand } from "@/components/preview-home-4/ScrubBand";
import { Voices } from "@/components/preview-home-4/Voices";
import { TrustBand4 } from "@/components/preview-home-4/TrustBand4";
import { ApiBand } from "@/components/preview-home-4/ApiBand";
import { Faq4 } from "@/components/preview-home-4/Faq4";
import { Pricing4 } from "@/components/preview-home-4/Pricing4";
import { Closer4 } from "@/components/preview-home-4/Closer4";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCopy4(locale);
  return {
    title: `${copy.hero.lead} ${copy.hero.accent} — Cekat.AI`,
    description: copy.hero.sub.en,
    // Draft: never indexed, never followed.
    robots: { index: false, follow: false },
  };
}

/**
 * /preview-home-5 — ph4's contents, light rhythm, iOS entrances.
 *
 * Same sections and copy as /preview-home-4 (single source of truth, no
 * component fork), but the dark bands are minimised to the opening hero, the
 * closer and the footer. Live, API and the featured plan render light via
 * `preview-home-5.css` overrides. Entrances are iOS-style: spring ease,
 * short rise, slight scale, blur-to-sharp — see `Motion5`.
 */
export default async function PreviewHome5Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(locale);
  const copy = getCopy4(locale);
  const isEn = locale === "en";

  return (
    <div className="ph4-root ph5-root">
      <Motion5 />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[var(--ph4-r)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        {isEn ? "Skip to content" : "Lewati ke konten"}
      </a>

      <JsonLd data={faqPageJsonLd(copy.faq.items)} />

      <AnnouncementBar copy={copy.announcement} locale={locale} />
      <Nav4 content={content.nav} locale={locale} />

      <main id="main">
        <Hero4 copy={copy.hero} locale={locale} />
        <MarqueeBand locale={locale} />
        <LiveBand
          eyebrow={text(copy.live.eyebrow, isEn)}
          heading={copy.live.heading}
          accent={copy.live.accent}
          body={text(copy.live.body, isEn)}
          url={text(copy.live.url, isEn)}
          figures={copy.hero.stats.map((stat) => ({
            value: stat.value[isEn ? "en" : "id"],
            label: stat.label[isEn ? "en" : "id"],
          }))}
          en={isEn}
        />
        <Proof4 copy={copy.proof} locale={locale} />
        <UseCases copy={copy.useCases} locale={locale} />
        <PhotoBand copy={copy.photos} locale={locale} />
        <Workflow copy={copy.workflow} locale={locale} />
        <Capabilities copy={copy.capabilities} locale={locale} />
        <CaseGrid copy={copy.cases} locale={locale} />
        <ScrubBand copy={copy.statement} locale={locale} />
        <Voices copy={copy.voices} locale={locale} />
        <TrustBand4 copy={copy.trust} locale={locale} />
        <ApiBand copy={copy.api} locale={locale} />
        <Faq4 copy={copy.faq} locale={locale} />
        <Pricing4 copy={copy.pricing} locale={locale} />
        <Closer4 copy={copy.finalCta} locale={locale} />
      </main>

      <Footer4 content={content.footer} />
    </div>
  );
}
