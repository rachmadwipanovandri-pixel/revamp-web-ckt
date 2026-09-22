import { getTranslations } from "next-intl/server";
import { FeatureShowcase } from "./feature-showcase";

const IMAGES = {
  feature1:
    "/images/home/track-and-optimize-your-marketing-performance-in-one-unified-platform.png",
  feature2: "/images/home/automate-your-business-logic-no-coding-needed.png",
  feature3: "/images/home/your-crm-built-for-growth-and-real-conversations.png",
} as const;

export async function PlatformOverview() {
  const t = await getTranslations("home.platformOverview");
  const features = (["feature1", "feature2", "feature3"] as const).map(
    (key) => ({
      key,
      image: IMAGES[key],
      title: t(`${key}.title`),
      description: t(`${key}.description`),
    }),
  );

  // No page-level H2 in source copy — tabs carry the story.
  return <FeatureShowcase features={features} layout="media-top" surface="white" />;
}
