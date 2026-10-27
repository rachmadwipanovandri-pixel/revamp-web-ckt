import { text } from "./content-types";
import { Section, SectionHead, Shell } from "./ui";
import type { Copy4 } from "./content-types";
export function Workflow({
  copy,
  locale,
}: {
  copy: Copy4["workflow"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section id="how" tone="paper" rule={true} labelledBy="ph4-workflow-title">
      <Shell>
        <SectionHead
          id="ph4-workflow-title"
          index="03"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          accent={copy.accent}
          body={text(copy.body, en)}
        />
        <ol
          data-ph4-stagger={true}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {copy.steps.map((step) => (
            <li key={text(step.index, en)} className="ph4-step">
              <div className="flex items-baseline justify-between gap-3">
                <span className="ph4-mono text-[0.625rem] text-[var(--ph4-accent)]">
                  {text(step.index, en)}
                </span>
                <span className="ph4-mono text-[0.5625rem] text-[var(--ph4-muted-3)]">
                  {text(step.hint, en)}
                </span>
              </div>
              <h3 className="ph4-display text-[1.0625rem]">
                {text(step.title, en)}
              </h3>
              <p className="text-[0.875rem] leading-[1.6] text-[var(--ph4-muted)]">
                {text(step.body, en)}
              </p>
            </li>
          ))}
        </ol>
      </Shell>
    </Section>
  );
}
