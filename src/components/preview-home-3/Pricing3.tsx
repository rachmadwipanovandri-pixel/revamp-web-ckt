import { Action, Eyebrow, Section, Shell, SplitHeading, TextLink } from "./ui";
import { ConsoleGrid } from "./Problem";
import { Ico } from "./Icon";
import { solar_check_circle_bold } from "./icons";
import type { Copy3 } from "./content";

/**
 * Plans.
 *
 * The featured card is now near-black rather than navy, matching the action
 * buttons — one system for "this is the thing to press". It sits on a console
 * band for the same reason: pricing is the decision point, and the page darkens
 * around the decision.
 *
 * Prices are shown as figures because a pricing band without a number is a
 * brochure. `rate` and `period` are separate content fields so the number and
 * its qualifier can be read, tabelled and translated independently.
 */
export function Pricing3({ copy }: { copy: Copy3["pricing"] }) {
  return (
    <Section
      id="pricing"
      tone="console"
      labelledBy="ph3-pricing-title"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24"
    >
      <ConsoleGrid />

      <Shell className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          {/* ---- pitch ---- */}
          <div data-ph3-enter>
            <Eyebrow tone="light">{copy.eyebrow}</Eyebrow>

            <SplitHeading
              id="ph3-pricing-title"
              as="h2"
              text={copy.heading}
              size="display-2"
              className="mt-5 max-w-[18ch] text-[clamp(1.75rem,4.6vw,3.5rem)] [&_span_span]:!text-[var(--ph3-on-console)]"
            />

            <p className="ph3-lede mt-5 max-w-[30rem] text-[1.0625rem] text-[var(--ph3-on-console-2)]">
              {copy.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Action href={copy.cta.href} variant="invert" arrow>
                {copy.cta.label}
              </Action>
              <TextLink
                href={copy.compare.href}
                className="text-[var(--ph3-on-console-2)] hover:text-white"
              >
                {copy.compare.label}
              </TextLink>
            </div>
          </div>

          {/* ---- the plan ---- */}
          <div data-ph3-enter className="ph3-plan is-featured p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
                  Cekat.AI
                </p>
                <h3 className="mt-2 text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--ph3-on-console)]">
                  {copy.planName}
                </h3>
              </div>
              <span className="ph3-chip border-[var(--ph3-console-line-2)] text-[var(--ph3-on-console-2)]">
                {copy.trial}
              </span>
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="ph3-price text-[var(--ph3-on-console)]">
                {copy.rate}
              </span>
              <span className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
                {copy.period}
              </span>
            </div>
            <p className="ph3-mono mt-3 text-[0.625rem] text-[var(--ph3-on-console-3)]">
              {copy.rateNote}
            </p>

            <ul className="mt-7 grid list-none gap-3 border-t border-[var(--ph3-console-line)] pt-6 sm:grid-cols-2">
              {copy.included.map((item) => (
                <li
                  key={item}
                  className="ph3-included text-[var(--ph3-on-console-2)]"
                >
                  <Ico icon={solar_check_circle_bold} size={14} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Action
                href={copy.cta.href}
                variant="invert"
                arrow
                className="flex-1"
              >
                {copy.cta.label}
              </Action>
              <Action
                href={copy.compare.href}
                variant="ghost-invert"
                className="flex-1"
              >
                {copy.compare.label}
              </Action>
            </div>

            <p className="ph3-mono mt-5 text-[0.5625rem] leading-[1.7] text-[var(--ph3-on-console-3)]">
              {copy.footnote}
            </p>
          </div>
        </div>

        {/*
          What the plan includes, as a ruled table rather than another set of
          checkmarks. The card above says "everything included"; this says what
          "everything" is, and a spec table is what a B2B buyer actually scans.
          Rows are authored in `compare`, so nothing here is inferred.
        */}
        <div data-ph3-enter className="mt-14 sm:mt-16">
          <p className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
            {copy.compareHeading}
          </p>

          <dl className="mt-4 border-t border-[var(--ph3-console-line)]">
            {copy.compareRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-6 border-b border-[var(--ph3-console-line)] py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)_minmax(0,0.45fr)]"
              >
                <dt className="text-[0.875rem] text-[var(--ph3-on-console-2)]">
                  {row.label}
                </dt>
                <dd className="text-[0.875rem] font-medium text-[var(--ph3-on-console)] sm:text-center">
                  {row.featured}
                </dd>
                {/*
                  The third column only renders when the content supplies a
                  second option. An empty cell would read as "the alternative
                  does something we haven't written down", which is a different
                  claim from "there is no honest alternative to name here".
                */}
                {row.alternative ? (
                  <dd className="hidden text-[0.8125rem] text-[var(--ph3-on-console-3)] sm:block sm:text-center">
                    {row.alternative}
                  </dd>
                ) : (
                  <span aria-hidden className="hidden sm:block" />
                )}
              </div>
            ))}
          </dl>
        </div>
      </Shell>
    </Section>
  );
}