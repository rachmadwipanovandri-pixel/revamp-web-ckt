import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";

const STATS = [
  { key: "stat1", valueKey: "stat1Value", labelKey: "stat1Label" },
  { key: "stat2", valueKey: "stat2Value", labelKey: "stat2Label" },
  { key: "stat3", valueKey: "stat3Value", labelKey: "stat3Label" },
] as const;

/**
 * Full-bleed metric band — Stripe-style authority strip. Giant tabular
 * figures on a soft brand wash with hairline dividers instead of cards.
 */
export async function Proof() {
  const t = await getTranslations("agentic.proof");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.06] to-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(19,82,191,0.18) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="mb-10 text-center font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-subtle-foreground uppercase">
            {t("heading")}
          </p>
          <dl className="grid divide-y divide-foreground/10 border-y border-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div
                key={stat.key}
                className="px-4 py-8 text-center transition-colors duration-500 hover:bg-white/60 sm:px-6"
              >
                <dd className="animate-metric-rise font-numeric text-[clamp(2.25rem,6vw,3.75rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums break-words">
                  {t(stat.valueKey)}
                </dd>
                <dt className="mx-auto mt-3 max-w-[16rem] font-numeric text-[0.72rem] leading-snug tracking-wide text-subtle-foreground uppercase">
                  {t(stat.labelKey)}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
