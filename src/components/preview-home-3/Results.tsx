import {
  Eyebrow,
  Figure,
  Section,
  Shell,
  SplitHeading,
  TextLink,
} from "./ui";
import type { Copy3 } from "./content";

/**
 * Customer story.
 *
 * The old band had a rounded still-life plate sitting beside the quote, and an
 * initials monogram as the customer's "photo". Both were doing visual work the
 * content could not support: there is no photograph of this customer, and a
 * monogram built from a name implies a likeness that does not exist.
 *
 * So the right-hand column is a data panel instead — two bars plotting the only
 * two numbers the customer's own sentence states — and the credit is purely
 * typographic. The quote stays the largest thing in the band, which is where it
 * belongs.
 */
export function Results({ copy }: { copy: Copy3["results"] }) {
  const [name, role] = splitAttribution(copy.attribution);
  const ceiling = Math.max(...copy.series.bars.map((bar) => bar.value));

  return (
    <Section
      id="results"
      rule
      labelledBy="ph3-results-title"
      className="scroll-mt-24"
    >
      <Shell>
        <div data-ph3-enter>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SplitHeading
            id="ph3-results-title"
            as="h2"
            text={copy.heading}
            size="display-2"
            className="mt-4 max-w-[24ch] text-[clamp(1.75rem,4.6vw,3.5rem)]"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div data-ph3-enter>
            <blockquote className="ph3-quote">
              <span aria-hidden className="ph3-mono text-[var(--ph3-accent)]">
                “
              </span>
              {copy.quote}
            </blockquote>

            <figcaption className="mt-7 flex flex-col gap-0.5 border-l-2 border-[var(--ph3-line-2)] pl-4">
              <span className="ph3-credit-name">{name}</span>
              <span className="ph3-credit-role">{role}</span>
            </figcaption>

            <TextLink href={copy.cta.href} className="mt-6">
              {copy.cta.label}
            </TextLink>
          </div>

          {/* ---- data panel ---- */}
          <div data-ph3-enter className="ph3-panel self-start p-5 sm:p-6">
            <p className="ph3-mono text-[0.625rem] text-[var(--ph3-ink)]">
              {copy.series.caption}
            </p>

            <ul className="mt-6 flex flex-col gap-5">
              {copy.series.bars.map((bar) => (
                <li key={bar.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.8125rem] text-[var(--ph3-muted)]">
                      {bar.label}
                    </span>
                    <span className="text-[0.8125rem] font-semibold tabular-nums">
                      {bar.value}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--ph3-surface-2)]">
                    <span
                      className={[
                        "block h-full rounded-full",
                        bar.now
                          ? "bg-[var(--ph3-accent)]"
                          : "bg-[var(--ph3-line-2)]",
                      ].join(" ")}
                      style={{ width: `${(bar.value / ceiling) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="ph3-lede mt-6 border-t border-[var(--ph3-line)] pt-4 text-[0.8125rem]">
              {copy.body}
            </p>
          </div>
        </div>

        {/* ---- metrics ---- */}
        <ul
          className="mt-12 grid list-none border-t border-[var(--ph3-line)] sm:mt-16 sm:grid-cols-3"
          data-ph3-rule
        >
          {copy.metrics.map((metric, index) => (
            <li
              key={metric.label}
              className={[
                "py-6 sm:px-6",
                index === 0 ? "sm:pl-0" : "sm:border-l sm:border-[var(--ph3-line)]",
                index > 0 ? "border-t border-[var(--ph3-line)] sm:border-t-0" : "",
              ].join(" ")}
            >
              <Figure value={metric.value} label={metric.label} />
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  );
}

/** "Hariyudi, Director, Nature Craft Indonesia" → name + the rest as role. */
function splitAttribution(attribution: string): [string, string] {
  const [first, ...rest] = attribution.split(",").map((part) => part.trim());
  return [first || attribution, rest.join(", ")];
}