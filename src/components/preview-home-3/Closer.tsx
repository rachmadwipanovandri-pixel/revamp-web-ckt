import { Action, Eyebrow, Section, Shell, SplitHeading } from "./ui";
import { ConsoleGrid } from "./Problem";
import type { Copy3 } from "./content";

/**
 * The close.
 *
 * Full-bleed console rather than a rounded image plate. The dawn illustration
 * this replaces was the most decorative object on the page and the only one
 * carrying a mood the product does not have; the same hairline grid as the
 * opening band now bookends the page instead, which is a rhyme the reader
 * registers without having to notice it.
 */
export function Closer({ final }: { final: Copy3["finalCta"] }) {
  return (
    <Section
      tone="console"
      labelledBy="ph3-final-title"
      className="py-16 sm:py-20 lg:py-28"
    >
      <ConsoleGrid />

      <Shell className="relative">
        <div
          data-ph3-enter
          className="flex flex-col items-start gap-8 border-t border-[var(--ph3-console-line)] pt-12 lg:pt-16"
        >
          <Eyebrow tone="light">{final.eyebrow}</Eyebrow>

          <SplitHeading
            id="ph3-final-title"
            as="h2"
            text={final.heading}
            size="display-2"
            className="max-w-[16ch] text-[clamp(2.25rem,5.4vw,4rem)] [&_span_span]:!text-[var(--ph3-on-console)]"
          />

          <p className="ph3-lede max-w-[34rem] text-[1.0625rem] text-[var(--ph3-on-console-2)]">
            {final.body}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Action href={final.primary.href} variant="invert" arrow>
              {final.primary.label}
            </Action>
            <Action href={final.secondary.href} variant="ghost-invert">
              {final.secondary.label}
            </Action>
          </div>
        </div>
      </Shell>
    </Section>
  );
}