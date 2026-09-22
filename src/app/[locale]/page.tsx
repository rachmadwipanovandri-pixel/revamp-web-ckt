import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/home/hero";
import { TrustedBy } from "@/components/sections/home/trusted-by";
import { FeatureAccordion } from "@/components/sections/home/feature-accordion";
import { IndustryCarousel } from "@/components/sections/home/industry-carousel";
import { Integrations } from "@/components/sections/home/integrations";
import { PlatformOverview } from "@/components/sections/home/platform-overview";
import { BuildAIAgent } from "@/components/sections/home/build-ai-agent";
import { AIAgentFlow } from "@/components/sections/home/ai-agent-flow";
import { PricingTeaser } from "@/components/sections/home/pricing-teaser";
import { RealResults } from "@/components/sections/home/real-results";
import { FinalCTA } from "@/components/sections/home/final-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero and TrustedBy render normally: they are above the fold, and
          content-visibility there would delay the first paint rather than help
          it. Everything below is skipped until scrolled near. */}
      <Hero />
      <TrustedBy />
      {/* Features then industries: what the product does, then who it is
          for, then what it connects to. */}
      <div className="cv-auto">
        <FeatureAccordion />
      </div>
      <div className="cv-auto">
        <IndustryCarousel />
      </div>
      <div className="cv-auto">
        <Integrations />
      </div>
      <div className="cv-auto">
        <PlatformOverview />
      </div>
      <div className="cv-auto">
        <BuildAIAgent />
      </div>
      <div className="cv-auto">
        <AIAgentFlow />
      </div>
      <div className="cv-auto">
        <PricingTeaser />
      </div>
      <div className="cv-auto">
        <RealResults />
      </div>
      <div className="cv-auto">
        <FinalCTA />
      </div>
    </>
  );
}
