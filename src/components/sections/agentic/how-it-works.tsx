import { getTranslations } from "next-intl/server";
import {
  HowItWorksRail,
  type HowItWorksStep,
} from "@/components/sections/agentic/how-it-works-rail";

const STEPS = ["chat", "crm", "mini", "consulting", "marketing"] as const;
const INDEXES = ["01", "02", "03", "04", "05"] as const;

/**
 * Server shell: resolves i18n copy into serializable steps for the client rail.
 */
export async function HowItWorks() {
  const t = await getTranslations("agentic.howItWorks");

  const steps: HowItWorksStep[] = STEPS.map((key, i) => ({
    key,
    index: INDEXES[i],
    title: t(`${key}.title`),
    body: t(`${key}.body`),
    hint: t(`${key}.hint`),
  }));

  return (
    <HowItWorksRail
      steps={steps}
      labels={{
        eyebrow: t("eyebrow"),
        headingLead: t("headingLead"),
        headingAccent: t("headingAccent"),
        body: t("body"),
        nav: t("eyebrow"),
        stageLabel: t("stageLabel"),
      }}
      footnote={t("footnote")}
    />
  );
}
