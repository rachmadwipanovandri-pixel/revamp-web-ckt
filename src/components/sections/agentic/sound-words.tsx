import { getTranslations } from "next-intl/server";
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
 * Three pillar cards — asymmetric editorial stagger: middle card drops
 * slightly on desktop so the row reads as a composition, not a grid.
 * Server shell; interactive spotlight lives in `PillarCard` (client).
 */
export async function SoundWords() {
  const t = await getTranslations("agentic.pillars");

  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {PILLARS.map((pillar, index) => (
            <Reveal
              key={pillar.key}
              delay={index * 80}
              className={
                index === 1 ? "md:mt-10" : index === 2 ? "md:mt-4" : undefined
              }
            >
              <PillarCard
                glyph={pillar.glyph}
                index={pillar.index}
                pillarKey={pillar.key}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
