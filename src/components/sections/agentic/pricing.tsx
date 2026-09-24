import { getTranslations } from "next-intl/server";
import { mdiWhatsapp } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { PricingPlans } from "@/components/sections/new-home/pricing-plans";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
} from "@/components/sections/agentic/shell";

/**
 * Pricing chapter — calm header, live plan cards, quiet dual CTA.
 */
export async function Pricing() {
  const t = await getTranslations("agentic.pricing");
  const tp = await getTranslations("pricing");

  return (
    <SectionBand tone="white" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <PricingPlans />
        </Reveal>

        <Reveal
          delay={40}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            className="h-12 rounded-full bg-[#0B1220] px-7 text-sm text-white hover:bg-primary"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <SafeIcon icon={mdiWhatsapp} className="size-4" size="1rem" />
            {tp("ctaWhatsApp")}
          </Button>
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#0C111D]/12 bg-white px-6 py-3 font-numeric text-sm font-semibold text-[#0C111D] transition-all duration-300 hover:border-primary/40 hover:text-primary"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <p className="mt-6 text-center text-sm text-[#667085]">
          {tp("excludesVat")}
        </p>
      </SectionShell>
    </SectionBand>
  );
}
