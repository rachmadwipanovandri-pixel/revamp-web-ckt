import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";

const METRICS = [
  { key: "metric1" },
  { key: "metric2" },
  { key: "metric3" },
] as const;

/**
 * Editorial case study — sticky metric column on the left (Stripe proof
 * density), narrative on the right. Figures rise with metricRise on reveal.
 */
export async function CaseStudy() {
  const t = await getTranslations("agentic.caseStudy");

  // No overflow-hidden on the section: cancels sticky on the metric column.
  // Decorative orb is clipped by its own wrapper so it cannot cause
  // horizontal page scroll on mobile.
  return (
    <section className="relative bg-surface-muted py-14 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow-rule mb-8 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
            {t("eyebrow")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <dl className="flex flex-col rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-[0_24px_50px_-40px_rgba(16,24,40,0.4)] md:p-8">
                {METRICS.map((metric, index) => (
                  <div
                    key={metric.key}
                    className={
                      index > 0
                        ? "mt-6 border-t border-foreground/10 pt-6"
                        : undefined
                    }
                  >
                    <dd
                      className="animate-metric-rise font-numeric text-[clamp(2.5rem,6vw,3.75rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {t(`${metric.key}.value`)}
                    </dd>
                    <dt className="mt-2.5 max-w-[16rem] font-numeric text-sm leading-snug text-muted-foreground">
                      {t(`${metric.key}.label`)}
                    </dt>
                  </div>
                ))}
              </dl>
              <p className="mt-5 max-w-[20rem] font-numeric text-xs leading-relaxed text-subtle-foreground">
                {t("attribution")}
              </p>
            </div>
          </div>

          <Reveal
            delay={60}
            className="lg:col-span-7 lg:col-start-6 lg:border-l lg:border-foreground/10 lg:pl-10"
          >
            <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-subtle-foreground uppercase">
              {t("client")}
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {t("title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body")}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed border-l-2 border-primary/40 pl-4 text-foreground/80">
              {t("outcome")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
