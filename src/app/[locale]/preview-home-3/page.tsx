import type { Metadata } from "next";
import { faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { getContent } from "@/components/preview-home-2/content";
import { Hero3 } from "@/components/preview-home-3/Hero3";
import { Nav3 } from "@/components/preview-home-3/Nav3";
import { Motion3 } from "@/components/preview-home-3/Motion3";
import { Footer3 } from "@/components/preview-home-3/Footer3";
import { getCopy3 } from "@/components/preview-home-3/content";
import { Closer } from "@/components/preview-home-3/Closer";
import { Faq } from "@/components/preview-home-3/Faq";
import { Features } from "@/components/preview-home-3/Features";
import { HowItWorks } from "@/components/preview-home-3/HowItWorks";
import { Problem } from "@/components/preview-home-3/Problem";
import { Results } from "@/components/preview-home-3/Results";
import { Trust } from "@/components/preview-home-3/Trust";
import { ProofStrip3 } from "@/components/preview-home-3/ProofStrip3";
import { Pricing3 } from "@/components/preview-home-3/Pricing3";
import { ContextBand3 } from "@/components/preview-home-3/ContextBand3";
import { Sandbox3 } from "@/components/preview-home-3/Sandbox3";

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
 * /preview-home-3 — "Precision Ledger", the US B2B SaaS redesign.
 *
 * Nav, hero scaffolding and footer *content* come from /preview-home-2 so the two
 * drafts cannot drift; every band, primitive and stylesheet rule is local to this
 * route and scoped under `.ph3-root`, so nothing here can reach a production page.
 *
 * Section order is the argument the page makes: light hero, proof, dark problem,
 * light how-it-works, light-grey product, story, grey security, dark pricing,
 * light FAQ, dark close. The dark bands land on the three moments where a
 * decision is being asked for.
 */
export default async function PreviewHome3Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(locale);
  const copy = getCopy3(locale);
  const isEn = locale === "en";

  return (
    <div className="ph3-root">
      <Motion3 />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[var(--ph3-r)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        {isEn ? "Skip to content" : "Lewati ke konten"}
      </a>

      <JsonLd data={faqPageJsonLd(copy.faq.items)} />

      <Nav3 content={content.nav} locale={locale} />

      <main id="main">
        <Hero3 content={content} isEn={isEn} />
        <ProofStrip3 copy={copy.proof} />
        <Problem copy={copy.problem} />
        <HowItWorks copy={copy.how} />
        <Features copy={copy.features} locale={locale} />
        <Sandbox3 copy={copy.sandbox} locale={locale} />
        <ContextBand3
          copy={copy.context}
          locale={locale}
        />
        <Results copy={copy.results} />
        <Trust copy={copy.trust} />
        <Pricing3 copy={copy.pricing} />
        <Faq copy={copy.faq} />
        <Closer final={copy.finalCta} />
      </main>

      <Footer3 content={content.footer} />
    </div>
  );
}