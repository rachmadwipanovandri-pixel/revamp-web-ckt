import { getTranslations } from "next-intl/server";
import {
  SectionBand,
  SectionShell,
  Eyebrow,
} from "@/components/sections/agentic/shell";
import { Reveal } from "@/components/sections/new-home/reveal";

const STATS = [
  { key: "stat1", valueKey: "stat1Value", labelKey: "stat1Label" },
  { key: "stat2", valueKey: "stat2Value", labelKey: "stat2Label" },
  { key: "stat3", valueKey: "stat3Value", labelKey: "stat3Label" },
] as const;

/**
 * Authority metric band — hairline dividers, oversized tabular figures.
 * Stripe / incident.io proof density without card chrome.
 */
export async function Proof() {
  const t = await getTranslations("agentic.proof");

  return (
    <SectionBand tone="soft" className="border-y border-[#0C111D]/[0.06]">
      <SectionShell className="py-14 md:py-20">
        <Reveal>
          <div className="mb-10 flex justify-center">
            <Eyebrow tone="ink">{t("heading")}</Eyebrow>
          </div>
          <dl className="grid divide-y divide-[#0C111D]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat) => (
              <div key={stat.key} className="px-2 py-8 text-center sm:px-6">
                <dd className="font-numeric text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-[-0.045em] text-[#0C111D] tabular-nums">
                  {t(stat.valueKey)}
                </dd>
                <dt className="mx-auto mt-3 max-w-[15rem] text-sm leading-snug text-[#525C6B]">
                  {t(stat.labelKey)}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}
