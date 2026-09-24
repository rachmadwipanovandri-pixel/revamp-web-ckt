import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  PhotoOverlay,
} from "@/components/sections/agentic/shell";

const PROBLEMS = ["p1", "p2", "p3"] as const;
const SOLUTIONS = ["s1", "s2", "s3"] as const;

/**
 * Problem → Solution split (incident.io). Muted friction column vs. calm
 * brand solution column — no strike-through gimmicks.
 */
export async function ProblemSolution() {
  const t = await getTranslations("agentic.problemSolution");

  return (
    <SectionBand tone="soft" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white p-7 md:p-8">
              <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#667085] uppercase">
                {t("beforeLabel")}
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {PROBLEMS.map((key, index) => (
                  <li
                    key={key}
                    className="flex gap-3.5 rounded-2xl border border-[#0C111D]/[0.06] bg-[#F6F7F9] p-4 md:p-5"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 font-numeric text-xs font-semibold text-[#98A2B3]"
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-numeric text-base font-semibold tracking-[-0.02em] text-[#344054]">
                        {t(`${key}.title`)}
                      </p>
                      <p className="mt-1.5 text-sm leading-[1.6] text-[#667085]">
                        {t(`${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#0C111D]/10 bg-[#0B1220] p-7 text-white md:p-8">
              <PhotoOverlay
                src="/images/home/gallery-store.jpg"
                wash="from-[#0B1220]/92 via-[#0B1220]/82 to-[#0B1220]/90"
                className="opacity-40"
              />
              <p className="relative font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#8EC5FF] uppercase">
                {t("afterLabel")}
              </p>
              <ul className="relative mt-6 flex flex-1 flex-col gap-3">
                {SOLUTIONS.map((key, index) => (
                  <li
                    key={key}
                    className="relative flex gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition-colors duration-400 hover:bg-white/[0.08] md:p-5"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 font-numeric text-xs font-semibold text-[#8EC5FF]"
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-numeric text-base font-semibold tracking-[-0.02em] text-white">
                        {t(`${key}.title`)}
                      </p>
                      <p className="mt-1.5 text-sm leading-[1.6] text-white/65">
                        {t(`${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="relative mt-6 border-t border-white/10 pt-4 text-sm text-white/70">
                {t("note")}
              </p>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </SectionBand>
  );
}
