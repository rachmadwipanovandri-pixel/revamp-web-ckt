import { getTranslations } from "next-intl/server";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  SoftCard,
} from "@/components/sections/agentic/shell";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PillarCard, type PillarKey } from "@/components/sections/agentic/pillar-card";
import { mdiApi, mdiLinkVariant, solarGlobalLinear } from "@/lib/icons";

const PILLARS: Array<{
  key: PillarKey;
  glyph: (typeof solarGlobalLinear) | (typeof mdiLinkVariant) | (typeof mdiApi);
  index: string;
}> = [
  { key: "independent", glyph: solarGlobalLinear, index: "01" },
  { key: "integrated", glyph: mdiLinkVariant, index: "02" },
  { key: "openApi", glyph: mdiApi, index: "03" },
];

/**
 * Why Cekat — three calm editorial pillars. Soft card row, not a noisy grid.
 */
export async function SoundWords() {
  const t = await getTranslations("agentic.pillars");

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

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.key} delay={index * 70} className="h-full">
              <SoftCard hover={false} className="h-full">
                <PillarCard glyph={pillar.glyph} index={pillar.index} pillarKey={pillar.key} />
              </SoftCard>
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </SectionBand>
  );
}
