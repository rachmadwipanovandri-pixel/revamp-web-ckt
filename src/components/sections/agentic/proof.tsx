import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";

const STATS = [
  { key: "stat1", valueKey: "stat1Value", labelKey: "stat1Label" },
  { key: "stat2", valueKey: "stat2Value", labelKey: "stat2Label" },
  { key: "stat3", valueKey: "stat3Value", labelKey: "stat3Label" },
] as const;

/**
 * Slim proof strip between the sound-words and product grid — three keynote
 * metrics on a soft brand wash.
 */
export async function Proof() {
  const t = await getTranslations("agentic.proof");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.04] to-white py-14 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="mb-8 text-center font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-subtle-foreground uppercase">
            {t("heading")}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-foreground/8 bg-white/85 px-5 py-6 text-center shadow-[0_16px_40px_-32px_rgba(19,82,191,0.45)] backdrop-blur"
              >
                <p className="font-numeric text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-semibold tracking-[-0.04em] text-primary tabular-nums break-words">
                  {t(stat.valueKey)}
                </p>
                <p className="mt-2.5 text-[0.72rem] leading-snug tracking-wide text-subtle-foreground uppercase">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
