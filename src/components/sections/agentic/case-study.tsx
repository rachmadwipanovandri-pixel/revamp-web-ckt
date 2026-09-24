import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  MetricChip,
  TextLink,
  SoftCard,
} from "@/components/sections/agentic/shell";
import { Reveal } from "@/components/sections/new-home/reveal";

const METRICS = ["metric1", "metric2", "metric3"] as const;

/**
 * Featured customer story — incident.io Zendesk moment. Large photography,
 * oversized metric column, calm narrative.
 */
export async function CaseStudy() {
  const t = await getTranslations("agentic.caseStudy");

  return (
    <SectionBand tone="white" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} lead={t("title")} />
        </Reveal>

        <Reveal delay={60} className="mt-12">
          <SoftCard hover={false} className="overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="relative min-h-[280px] lg:col-span-5 lg:min-h-[460px]">
                <Image
                  src="/images/home/case-study-naturecraft.jpg"
                  alt={t("client")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Soft photo wash so the client label always stays legible. */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0B1220]/70 via-[#0B1220]/15 to-transparent" />
                <div className="absolute right-5 bottom-5 left-5">
                  <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/90 uppercase">
                    {t("client")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-8 p-7 md:p-10 lg:col-span-7">
                <div>
                  <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#667085] uppercase">
                    {t("client")}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.5rem,2.8vw,2.15rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-[#0C111D]">
                    {t("title")}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-[1.65] text-[#525C6B]">
                    {t("body")}
                  </p>
                  <p className="mt-5 max-w-xl border-l-2 border-primary/40 pl-4 text-sm leading-[1.65] text-[#344054]">
                    {t("outcome")}
                  </p>
                </div>

                <div>
                  <dl className="grid gap-6 sm:grid-cols-3">
                    {METRICS.map((metric) => (
                      <MetricChip
                        key={metric}
                        tone="brand"
                        value={t(`${metric}.value`)}
                        label={t(`${metric}.label`)}
                      />
                    ))}
                  </dl>
                  <p className="mt-6 text-xs leading-relaxed text-[#98A2B3]">
                    {t("attribution")}
                  </p>
                  <div className="mt-6">
                    <TextLink href="#stories">{t("readStory")}</TextLink>
                  </div>
                </div>
              </div>
            </div>
          </SoftCard>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}
