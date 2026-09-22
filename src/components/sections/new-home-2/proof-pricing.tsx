import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SplitHeading, Eyebrow } from "./split-heading";
import { PricingPlans } from "@/components/sections/new-home/pricing-plans";

/**
 * Proof band + pricing cards on a soft brand wash. Stats reuse trustedBy
 * copy; pricing reuses the shared PlanCards so /new-2 stays in sync with
 * live plan data.
 */
export async function ProofPricing() {
  const tStats = await getTranslations("home.trustedBy");
  const tPricing = await getTranslations("home.pricingTeaser");
  const tPricingNs = await getTranslations("pricing");

  // Second stat label lives under stat2Label, not the value key.
  const stats = [
    {
      value: tStats("stat1Value"),
      label: tStats("stat1Label"),
    },
    {
      value: tStats("stat2Value"),
      label: tStats("stat2Label"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.04] to-white py-20 md:py-28 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="absolute top-24 right-[6%] h-56 w-56 rounded-full bg-accent-sky/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-7">
              <Eyebrow>{tPricingNs("hero.eyebrow")}</Eyebrow>
              <SplitHeading
                className="mt-5"
                lead="Pricing that follows"
                accent="what you need"
              />
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {tPricing("body")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-foreground/8 bg-white/80 p-5 backdrop-blur"
                >
                  <p className="font-numeric text-[clamp(1.25rem,2.4vw,1.75rem)] leading-none font-semibold tracking-[-0.04em] text-primary tabular-nums break-words">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[0.72rem] leading-snug tracking-wide text-subtle-foreground uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <PricingPlans />
        </Reveal>

        <Reveal
          delay={40}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink-void px-7 py-3 font-numeric text-sm font-semibold text-white shadow-[0_16px_36px_-18px_rgba(15,31,58,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary"
          >
            {tPricing("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <p className="mt-6 text-center text-sm text-subtle-foreground">
          {tPricingNs("excludesVat")}
        </p>
      </div>
    </section>
  );
}
