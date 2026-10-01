import type { Metadata } from "next";
import { faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { CaseStudy } from "@/components/preview-home-2/CaseStudy";
import { getContent } from "@/components/preview-home-2/content";
import { Faq } from "@/components/preview-home-2/Faq";
import { FinalCta } from "@/components/preview-home-2/FinalCta";
import { Footer } from "@/components/preview-home-2/Footer";
import { Hero } from "@/components/preview-home-2/Hero";
import { HowItWorks } from "@/components/preview-home-2/HowItWorks";
import { LoveWall } from "@/components/preview-home-2/LoveWall";
import { Nav } from "@/components/preview-home-2/Nav";
import { Pillars } from "@/components/preview-home-2/Pillars";
import { Pricing } from "@/components/preview-home-2/Pricing";
import { ProductDeck } from "@/components/preview-home-2/ProductDeck";
import { ProofStrip } from "@/components/preview-home-2/ProofStrip";
import { ScrollProgress } from "@/components/preview-home-2/ScrollProgress";
import { SignalsMarquee } from "@/components/preview-home-2/SignalsMarquee";
import { TrustBand } from "@/components/preview-home-2/TrustBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);
  return {
    title: content.meta.title,
    description: content.meta.description,
    // Draft: never indexed, never followed.
    robots: { index: false, follow: false },
  };
}

/**
 * /preview-home-2 — the light, diagram-first redesign described in DESIGN.md.
 *
 * Why a second page instead of editing preview-home: the two are different
 * design directions and both need to stay reviewable side by side. This one is
 * a Server Component tree with five small client islands (nav, hero email
 * form, hero stage, step rail, FAQ) — no `dangerouslySetInnerHTML`, no
 * duplicated HTML builder.
 *
 * Band order: nav → hero (dashboard + looping cards) → proof → signals →
 * pillars → how it works → product deck → case study → testimonial wall →
 * trust → FAQ → pricing → closer → footer.
 *
 * The hero's looping cards, the signal marquee, the product deck, and the
 * testimonial wall are ported from /preview-home (hero stage, sections 4, 5,
 * and 10), each rebuilt as React with the light palette instead of copied CSS
 * timelines. The loop lives inside the hero, as it does in /preview-home.
 */
export default async function PreviewHome2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(locale);
  const isEn = locale === "en";

  return (
    <div className="ph2-root">
      <ScrollProgress />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#101828] focus:shadow-lg"
      >
        {isEn ? "Skip to content" : "Lewati ke konten"}
      </a>

      {/* Same FAQ questions the page shows, now machine-readable. */}
      <JsonLd data={faqPageJsonLd(content.faq.items)} />

      <Nav content={content.nav} locale={locale} />

      <main id="main">
        <Hero content={content} />
        <ProofStrip content={content.proof} />
        <SignalsMarquee content={content.signals} />
        <Pillars content={content.pillars} />
        <HowItWorks content={content.howItWorks} />
        <ProductDeck content={content.deck} />
        <CaseStudy content={content.caseStudy} />
        <LoveWall content={content.love} />
        <TrustBand content={content.trust} />
        <Faq content={content.faq} />
        <Pricing content={content.pricing} />
        <FinalCta content={content.finalCta} />
      </main>

      <Footer content={content.footer} />
    </div>
  );
}
