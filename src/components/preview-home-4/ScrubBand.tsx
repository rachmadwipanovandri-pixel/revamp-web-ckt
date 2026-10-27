import { text } from "./content-types";
import { Eyebrow, Section, Shell, SplitHeading } from "./ui";
import type { Copy4 } from "./content-types";

/**
 * The scrubbed statement.
 *
 * One sentence, parked under the nav by CSS `position: sticky`, filled in word
 * by word against the scroll position by Motion4 (`data-ph4-scrub`). The band
 * is tall and the statement is short on purpose: the sentence has to be partly
 * readable at *every* scroll position, which is the only thing a trigger-based
 * reveal cannot do.
 *
 * `clip` stays off — a sticky descendant needs the viewport as its scrollport,
 * and clipping the band would pin it in place and silently kill the stick.
 */
export function ScrubBand({
  copy,
  locale,
}: {
  copy: Copy4["statement"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section
      id="statement"
      tone="paper"
      rule={true}
      clip={false}
      labelledBy="ph4-statement-title"
      className="ph4-scrub-band"
    >
      <div className="ph4-scrub-sticky">
        <Shell>
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>
              {/*
                No index number here. Every other band's number is static
                editorial copy, and they do not form a sequence — 02, 03, 04,
                05, 06, 07, 08, then 11 for Voices. The nav carries a live
                index that counts all sixteen bands, so a second, differently
                ordered number in this band would contradict the one directly
                above it. The eyebrow is the label; the nav is the position.
              */}
              {text(copy.eyebrow, en)}
            </Eyebrow>
            <SplitHeading
              id="ph4-statement-title"
              as="p"
              text={copy.line1}
              accent={copy.accent}
              size="display-2"
              motion="scrub"
              className="max-w-[22ch] text-[clamp(1.85rem,5.4vw,3.9rem)] leading-[1.08]"
            />
            <p
              data-ph4-enter={true}
              className="max-w-[34rem] border-l border-[var(--ph4-line)] pl-5 text-[0.9375rem] leading-[1.65] text-[var(--ph4-muted)]"
            >
              {text(copy.note, en)}
            </p>
          </div>
        </Shell>
      </div>
    </Section>
  );
}
