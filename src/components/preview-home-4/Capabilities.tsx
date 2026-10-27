import { Ico } from "./Icon";
import { text } from "./content-types";
import { solar_arrow_right_up_bold, solar_check_circle_bold } from "./icons";
import { Section, SectionHead, Shell, SplitHeading } from "./ui";
import type { Copy4 } from "./content-types";
export function Capabilities({
  copy,
  locale,
}: {
  copy: Copy4["capabilities"];
  locale: string;
}) {
  const en = locale === "en";
  const hrefs = en
    ? ["/en/chat", "/en/crm", "/en/order", "/en/marketing"]
    : ["/chat", "/crm", "/order", "/marketing"];
  const [featured, ...rest] = copy.items;
  return (
    <Section
      id="capabilities"
      tone="surface"
      rule={true}
      labelledBy="ph4-cap-title"
    >
      <Shell>
        <SectionHead
          id="ph4-cap-title"
          index="04"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          accent={copy.accent}
          body={text(copy.body, en)}
        />
        {/* Growth Loop — the product story in one picture (from preview-home-2).
            Chat → CRM → Order → Marketing → back to Chat. Purely decorative:
            aria-hidden, since the surrounding copy already names each step. */}
        <div
          data-ph4-enter={true}
          aria-hidden={true}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-14"
        >
          {[
            en ? "Chat" : "Chat",
            en ? "Customers" : "Pelanggan",
            en ? "Orders" : "Order",
            en ? "Promos" : "Promo",
          ].map((label, i, arr) => (
            <span key={label} className="flex items-center gap-6">
              <span className="rounded-full border border-[var(--ph4-line)] bg-[var(--ph4-white)] px-4 py-2 text-[0.8125rem] font-medium text-[var(--ph4-ink)] shadow-[0_1px_2px_rgb(10_10_11/0.04)]">
                {label}
              </span>
              {i < arr.length - 1 ? (
                <span className="text-[var(--ph4-muted-3)]">→</span>
              ) : null}
            </span>
          ))}
          <span className="text-[var(--ph4-muted-3)]">↺</span>
        </div>
        <article
          data-ph4-enter={true}
          data-ph4-spot={true}
          className="ph4-cap ph4-spot mt-12 sm:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-14 lg:px-10 lg:py-10"
        >
          <div className="flex flex-col gap-3">
            <SplitHeading
              as="h3"
              size="none"
              text={text(featured.title, en)}
              className="text-[clamp(1.375rem,2.4vw,1.75rem)]"
            />
            <p className="max-w-[30rem] text-[0.9375rem] leading-[1.65] text-[var(--ph4-muted)]">
              {text(featured.body, en)}
            </p>
            <a
              href={hrefs[0]}
              className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.875rem] font-medium text-[var(--ph4-accent)]"
            >
              {text(featured.href, en)}
              <Ico
                icon={solar_arrow_right_up_bold}
                size={14}
                className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </a>
          </div>
          <ul className="mt-6 flex flex-col justify-center gap-2.5 border-t border-[var(--ph4-line)] pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
            {featured.points.map((point) => (
              <li
                key={text(point, en)}
                className="flex items-start gap-2.5 text-[0.875rem] leading-[1.5] text-[var(--ph4-muted-2)]"
              >
                <Ico
                  icon={solar_check_circle_bold}
                  size={14}
                  className="mt-px shrink-0 text-[var(--ph4-accent)]"
                />
                {text(point, en)}
              </li>
            ))}
          </ul>
        </article>
        <div
          data-ph4-stagger={true}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rest.map((item, restIndex) => (
            <article
              key={text(item.title, en)}
              data-ph4-spot={true}
              className="ph4-cap ph4-spot"
            >
              <h3 className="ph4-display text-[1.0625rem]">
                {text(item.title, en)}
              </h3>
              <p className="text-[0.875rem] leading-[1.6] text-[var(--ph4-muted)]">
                {text(item.body, en)}
              </p>
              <ul className="mt-auto flex flex-col gap-1.5 pt-2">
                {item.points.map((point) => (
                  <li
                    key={text(point, en)}
                    className="flex items-start gap-2 text-[0.8125rem] leading-[1.5] text-[var(--ph4-muted-2)]"
                  >
                    <Ico
                      icon={solar_check_circle_bold}
                      size={13}
                      className="mt-px shrink-0 text-[var(--ph4-accent)]"
                    />
                    {text(point, en)}
                  </li>
                ))}
              </ul>
              <a
                href={hrefs[restIndex + 1]}
                className="group mt-2 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-[var(--ph4-accent)]"
              >
                {text(item.href, en)}
                <Ico
                  icon={solar_arrow_right_up_bold}
                  size={14}
                  className="transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </a>
            </article>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
