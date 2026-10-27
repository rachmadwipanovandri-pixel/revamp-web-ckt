import { Ico } from "./Icon";
import { text } from "./content-types";
import { solar_check_circle_bold } from "./icons";
import { Action, Eyebrow, Section, SectionHead, Shell } from "./ui";
import type { Copy4 } from "./content-types";
export function Pricing4({
  copy,
  locale,
}: {
  copy: Copy4["pricing"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section
      id="pricing"
      tone="paper"
      rule={true}
      labelledBy="ph4-pricing-title"
    >
      <Shell>
        <SectionHead
          id="ph4-pricing-title"
          index="08"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          body={text(copy.body, en)}
        />
        <div
          data-ph4-stagger={true}
          className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3"
        >
          {copy.plans.map((plan) => (
            <article
              key={text(plan.name, en)}
              data-ph4-spot={true}
              className={`ph4-plan ph4-spot ${plan.featured ? "is-featured" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="ph4-display text-[1.125rem]">
                  {text(plan.name, en)}
                </h3>
                {plan.featured ? (
                  <span className="ph4-mono rounded-[var(--ph4-r-xs)] border border-[var(--ph4-accent-line)] bg-[var(--ph4-accent-tint)] px-2 py-1 text-[0.5625rem] text-[var(--ph4-accent)]">
                    {text(plan.featuredLabel, en)}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.9375rem] leading-[1.5] text-[var(--ph4-ink)]">
                {text(plan.note, en)}
              </p>
              <ul className="ph4-included mt-5 flex flex-col gap-2 border-t border-[var(--ph4-line)] pt-5">
                {plan.points.map((point) => (
                  <li
                    key={text(point, en)}
                    className="flex items-start gap-2 text-[0.875rem] leading-[1.5]"
                  >
                    <Ico
                      icon={solar_check_circle_bold}
                      size={14}
                      className="mt-0.5 shrink-0"
                    />
                    {text(point, en)}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Action
                  href={
                    plan.name.id === "Enterprise"
                      ? en
                        ? "/en/contact-sales"
                        : "/contact-sales"
                      : "https://chat.cekat.ai/register"
                  }
                  variant={plan.featured ? "solid" : "outline"}
                  className="w-full"
                  arrow={true}
                >
                  {text(plan.cta, en)}
                </Action>
              </div>
            </article>
          ))}
        </div>
        <div
          data-ph4-enter={true}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--ph4-line)] pt-6"
        >
          <Eyebrow tone="muted">{text(copy.footnote, en)}</Eyebrow>
          <Action href={en ? "/en/pricing" : "/harga"} arrow={true}>
            {text(copy.compare, en)}
          </Action>
        </div>
      </Shell>
    </Section>
  );
}
