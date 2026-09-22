import { getTranslations } from "next-intl/server";
import { FeatureShowcase } from "./feature-showcase";

const IMAGES = {
  feature1: "/images/home/simpler-ai-builder.png",
  feature2: "/images/home/knowledge-source.png",
  feature3: "/images/home/api-integration.png",
} as const;

export async function BuildAIAgent() {
  const t = await getTranslations("home.buildAiAgent");
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
      layout="media-top"
      surface="muted"
      chapter="07"
      heading={t("heading")}
      lede={t("body")}
      backgroundImage="/images/home/build-ai-agent-background.png"
    />
  );
}
