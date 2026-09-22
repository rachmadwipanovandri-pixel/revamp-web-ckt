import { useTranslations } from "next-intl";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { mdiApi, mdiLinkVariant, solarGlobalLinear } from "@/lib/icons";

const PILLARS = [
  { key: "independent", glyph: solarGlobalLinear, index: "01" },
  { key: "integrated", glyph: mdiLinkVariant, index: "02" },
  { key: "openApi", glyph: mdiApi, index: "03" },
] as const;

/**
 * Keynote sound-word act — Independent · Integrated · Open API as three
 * large blueprint cards on a light canvas, bridging the void hero into the
 * product grid.
 */
export function SoundWords() {
  const t = useTranslations("agentic.pillars");

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {t("headingLead")}{" "}
              <span className="text-primary">{t("headingAccent")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.key} delay={index * 70} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-surface-muted/60 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)] md:p-7">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-white text-primary shadow-[0_10px_24px_-16px_rgba(19,82,191,0.5)]">
                    <SafeIcon icon={pillar.glyph} className="size-5" size="1.25rem" />
                  </span>
                  <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-subtle-foreground">
                    {pillar.index}
                  </span>
                </div>
                <h3 className="relative mt-6 font-numeric text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {t(`${pillar.key}.title`)}
                </h3>
                <p className="relative mt-2 text-sm leading-snug font-medium text-primary/90">
                  {t(`${pillar.key}.lead`)}
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`${pillar.key}.body`)}
                </p>
                <ul className="relative mt-5 flex flex-wrap gap-2 border-t border-foreground/8 pt-4">
                  {(["tag1", "tag2", "tag3"] as const).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-foreground/10 bg-white px-2.5 py-1 text-[0.7rem] font-medium text-foreground/75"
                    >
                      {t(`${pillar.key}.${tag}`)}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
