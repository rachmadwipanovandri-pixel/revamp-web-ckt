import type { Metadata } from "next";
import { faqPageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { getContent } from "@/components/preview-home-2/content";
import { Nav4 } from "@/components/preview-home-4/Nav4";
import { Motion4 } from "@/components/preview-home-4/Motion4";
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
 * /preview-home-4 — "The product is the proof".
 *
 * The fourth draft, and the one built from the six references rather than from
 * the previous three. Where /preview-home-2 explained the product and
 * /preview-home-3 drew it, this page shows it.
 *
 * ── The rhythm is the design ───────────────────────────────────────────────
 *
 * The first version of this page had the right *contents* and the wrong
 * *picture*: thirteen evenly-weighted light bands, each a heading over a row of
 * hairline cards. Every reference this page was built from varies its weight
 * sharply — aira hands the whole viewport to a running dashboard and then drops
 * to three columns, arcade moves from a hero into a six-step sequence into
 * role tabs, vapi breaks the page with a five-figure band and a conference
 * banner. A document where every band is the same size reads as a template no
 * matter how good the type is, so the sequence below alternates deliberately:
 *
 *   paper → console → surface → console → surface → paper → surface → paper
 *   → surface → paper → console → surface → paper → console
 *
 * Three near-black bands, never two in a row, and each one is a moment the page
 * is asking something of the reader: the product at full size, the use cases,
 * the developer surface, and the close.
 *
 * The photography band is the only warm, full-bleed image moment in the document,
 * which is exactly what makes it read as one. Every other band is drawn — so the
 * photographs are the proof, and they land after the argument rather than
 * before it.
 *
 * ── Provenance ─────────────────────────────────────────────────────────────
 *
 * The product is DOM, not screenshots, because there is no honest capture of
 * `app.cekat.ai` in the repo (see `ProductSurface.tsx`). The photographs are the
 * team's own brand frames, recorded in `photos.ts`. The four case studies carry
 * the four customer photographs that actually exist. Two assets were deliberately
 * left out because they are not what their filenames claim.
 *
 * Nav and footer *content* come from /preview-home-2 so the drafts cannot drift
 * on the one thing a visitor compares between them.
 */
export default async function PreviewHome4Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getContent(locale);
  const copy = getCopy4(locale);
  const isEn = locale === "en";

  return (
    <div className="ph4-root">
      <Motion4 />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-[var(--ph4-r)] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        {isEn ? "Skip to content" : "Lewati ke konten"}
      </a>

      {/* The same questions the band renders, read from the same object — a
          schema that disagrees with the page is worse than no schema. */}
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
          /*
            The band restates the hero's own three figures rather than a second
            set, so the largest numbers on the page are the same three numbers
            everywhere they appear. `text()` is imported here rather than
            reaching for a client helper: the live band takes plain strings, so
            the two halves of the page do not need to agree on anything else.
          */
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
