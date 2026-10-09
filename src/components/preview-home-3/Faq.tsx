import { Section, SectionHead, Shell } from "./ui";
import type { Copy3 } from "./content";

/**
 * FAQ.
 *
 * Native `<details>`: no JS, no state to desync, and keyboard and screen-reader
 * behaviour already correct. The marker is a 12px square that rotates into a
 * close — a circle here would quietly undo the geometry the rest of the page is
 * built on.
 */
export function Faq({ copy }: { copy: Copy3["faq"] }) {
  return (
    <Section
      id="faq"
      rule
      labelledBy="ph3-faq-title"
      className="scroll-mt-24"
    >
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <SectionHead
            id="ph3-faq-title"
            index="05"
            eyebrow={copy.eyebrow}
            title={copy.heading}
          />

          <div className="border-t border-[var(--ph3-line)]">
            {copy.items.map((item, index) => (
              <details
                key={item.q}
                className="group border-b border-[var(--ph3-line)]"
                data-ph3-enter
              >
                <summary className="flex items-start justify-between gap-6 py-5 text-[0.9375rem] font-medium text-[var(--ph3-ink)] sm:py-6 sm:text-[1rem]">
                  <span className="flex gap-4">
                    <span className="ph3-mono mt-1 shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.q}
                  </span>
                  {/* The glyph is decorative — the question text is the control's accessible
                      name — so it is hidden from assistive tech and the whole
                      mark is carried by the wrapper's own `aria-hidden`. */}
                  <span className="ph3-faq-toggle" aria-hidden>
                    <svg
                      viewBox="0 0 12 12"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M6 1.5v9M1.5 6h9" />
                    </svg>
                  </span>
                </summary>

                <div className="ph3-faq-body">
                  <p className="ph3-lede max-w-[40rem] pb-5 pl-0 text-[0.9375rem] sm:pb-6 sm:pl-8">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Shell>
    </Section>
  );
}