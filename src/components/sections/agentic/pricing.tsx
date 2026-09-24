import { getTranslations } from "next-intl/server";
import { mdiWhatsapp } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { PricingPlans } from "@/components/sections/new-home/pricing-plans";

/**
 * Pricing chapter — asymmetric header (beehiiv display energy), live plan
 * cards, shine-swept primary CTA.
 */
export async function Pricing() {
  const t = await getTranslations("agentic.pricing");
  const tp = await getTranslations("pricing");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.05] to-white py-14 md:py-28 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="animate-orb-drift absolute top-24 right-[8%] h-56 w-56 rounded-full bg-accent-sky/10 blur-[90px]" />
        <span className="animate-orb-drift absolute bottom-16 left-[4%] h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {t("headingLead")}{" "}
                <span className="text-primary">{t("headingAccent")}</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:pb-2 lg:text-lg">
              {t("body")}
            </p>
          </div>
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
            className="btn-shine h-12 rounded-full bg-ink-void px-7 text-sm text-white shadow-[0_16px_36px_-18px_rgba(15,31,58,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
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
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-foreground/15 bg-white/70 px-6 py-3 font-numeric text-sm font-semibold text-foreground backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:text-primary"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <p className="mt-6 text-center text-sm text-subtle-foreground">
          {tp("excludesVat")}
        </p>
      </div>
    </section>
  );
}
