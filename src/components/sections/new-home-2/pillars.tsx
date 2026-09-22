import { useTranslations } from "next-intl";
import { lucideCheck } from "@/lib/icons";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SplitHeading, Eyebrow } from "./split-heading";
import { PillarGlyph } from "./isometric";

const PILLARS = [
  {
    key: "chat",
    glyph: "stack",
    hrefNote: "01",
  },
  {
    key: "crm",
    glyph: "path",
    hrefNote: "02",
  },
  {
    key: "marketing",
    glyph: "funnel",
    hrefNote: "03",
  },
  {
    key: "order",
    glyph: "orbit",
    hrefNote: "04",
  },
] as const;

/**
 * Four-product pillar grid — light canvas, wireframe glyphs, compact proof
 * pills. Composition follows the Sentry “built for…” row, copy from home.*.
 */
export function Pillars() {
  const t = useTranslations("home.featureAccordion");

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Platform</Eyebrow>
            <SplitHeading
              className="mt-5"
              lead="Four products,"
              accent="one platform"
            />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.key} delay={index * 60} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-surface-muted/50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]">
                <div className="relative border-b border-foreground/8 bg-white/70 px-5 pt-5 pb-2">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.04] to-transparent"
                  />
                  <div className="relative flex items-start justify-between gap-2">
                    <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-subtle-foreground">
                      {pillar.hrefNote}
                    </span>
                    <span className="font-numeric text-[0.62rem] font-semibold tracking-wider text-primary/70 uppercase">
                      Module
                    </span>
                  </div>
                  <div className="relative mt-3 px-2">
                    <PillarGlyph kind={pillar.glyph} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-numeric text-lg font-semibold tracking-[-0.025em] text-foreground">
                    {t(`${pillar.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-snug font-medium text-foreground/70">
                    {t(`${pillar.key}.lead`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`${pillar.key}.body`)}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2 border-t border-foreground/8 pt-4">
                    {(["pill1", "pill2", "pill3"] as const).map((pill) => (
                      <li
                        key={pill}
                        className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted-foreground"
                      >
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                          <SafeIcon
                            icon={lucideCheck}
                            className="size-2.5"
                            size="0.625rem"
                          />
                        </span>
                        {t(`${pillar.key}.${pill}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
