import { Section, SectionHead, Shell } from "./ui";
import { FeatureExperience } from "./FeatureExperience";
import type { Copy3 } from "./content";

export function Features({
  copy,
  locale,
}: {
  copy: Copy3["features"];
  locale: string;
}) {
  return (
    <Section
      id="features"
      tone="surface"
      rule
      labelledBy="ph3-features-title"
      className="scroll-mt-24"
    >
      <Shell>
        <SectionHead
          id="ph3-features-title"
          index="03"
          eyebrow={copy.eyebrow}
          title={copy.heading}
          body={copy.body}
        />
        <FeatureExperience copy={copy} locale={locale} />
      </Shell>
    </Section>
  );
}