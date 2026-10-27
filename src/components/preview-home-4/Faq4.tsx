import { text } from "./content-types";
import { Section, SectionHead, Shell } from "./ui";
import type { Copy4 } from "./content-types";
export function Faq4({ copy, locale }: { copy: Copy4["faq"]; locale: string }) {
  const en = locale === "en";
  return (
    <Section id="faq" tone="surface" rule={true} labelledBy="ph4-faq-title">
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <SectionHead
            id="ph4-faq-title"
            eyebrow={text(copy.eyebrow, en)}
            title={copy.heading}
          />
          <div
            data-ph4-stagger={true}
            className="border-t border-[var(--ph4-line)]"
          >
            {copy.items.map((item) => (
              <details
                key={item.q}
                className="group border-b border-[var(--ph4-line)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[0.9375rem] font-medium">
                  {item.q}
                  <span className="ph4-faq-toggle relative block h-[10px] w-[16px] shrink-0">
                    <span className="absolute inset-x-0 top-1/2 h-px w-full bg-current" />
                    <span className="absolute inset-y-0 left-1/2 h-full w-px bg-current transition-transform duration-200 group-open:rotate-90 group-open:scale-y-0" />
                  </span>
                </summary>
                <div className="ph4-faq-body pb-5 pr-10 text-[0.9375rem] leading-[1.65] text-[var(--ph4-muted)]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </Shell>
    </Section>
  );
}
