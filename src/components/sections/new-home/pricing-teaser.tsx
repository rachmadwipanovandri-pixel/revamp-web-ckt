import { getTranslations } from "next-intl/server";
import { mdiWhatsapp } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { Button } from "@/components/ui/button";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SafeIcon } from "./safe-icon";
import { PricingPlans } from "./pricing-plans";

export async function PricingTeaser() {
  const t = await getTranslations("home.pricingTeaser");
  const tp = await getTranslations("pricing");

  return (
    <SectionShell surface="brand-soft">
      {/* Soft brand wash so the light pricing act still feels alive */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-primary/12 blur-[100px]" />
        <span
          className="animate-orb-drift absolute bottom-8 left-[4%] h-64 w-64 rounded-full bg-accent-sky/15 blur-[90px]"
          style={{ animationDelay: "-8s" }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
        />
      </div>

      <div className="relative">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-8">
              <SectionHeading
                chapter="09"
                eyebrow={tp("hero.eyebrow")}
                title={t("heading")}
                lede={t("body")}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <PricingPlans />
        </Reveal>

        <Reveal
          delay={40}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            className="h-12 rounded-full bg-ink-void px-7 text-sm text-white shadow-[0_16px_36px_-18px_rgba(15,31,58,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
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

        <p className="mt-7 text-center text-sm text-subtle-foreground">
          {tp("excludesVat")}
        </p>
      </div>
    </SectionShell>
  );
}
