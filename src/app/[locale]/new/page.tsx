import type { Metadata } from "next";
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

export function generateStaticParams() {
  return [{ locale: "id" }, { locale: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Agentic AI Ecosystem | CekatAI",
    robots: { index: false, follow: false },
  };
}

/**
 * Design playground for the homepage redesign — Agentic AI Ecosystem story
 * (Innov 25 Keynote). Production homepage stays on `sections/home/*`.
 *
 * Chapter rhythm: void keynote hero (6-node hub) → light sound-words
 * (Independent · Integrated · Open API) → soft proof strip → muted product
 * grid (six agents) → brand-wash pricing → muted “Bukti Nyata” video wall →
 * ink Open API + integrations → void closer.
 */
export default async function NewHomePage({
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
