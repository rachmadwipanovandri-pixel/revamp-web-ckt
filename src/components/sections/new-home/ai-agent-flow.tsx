import { getTranslations } from "next-intl/server";
import { FeatureShowcase } from "./feature-showcase";

const IMAGES = {
  feature1: "/images/home/multiple-specialized-agents.png",
  feature2: "/images/home/visual-flow-designer.png",
  feature3: "/images/home/ai-working-hours.png",
} as const;

export async function AIAgentFlow() {
  const t = await getTranslations("home.aiAgentFlow");
  const features = (["feature1", "feature2", "feature3"] as const).map(
    (key) => ({
      key,
      image: IMAGES[key],
      title: t(`${key}.title`),
      description: t(`${key}.description`),
    }),
  );

  return (
    <FeatureShowcase
      features={features}
      layout="media-left"
      surface="ink"
      chapter="08"
      heading={t("heading")}
      lede={t("body")}
      backgroundImage="/images/home/ai-agent-flow-background.png"
    />
  );
}
