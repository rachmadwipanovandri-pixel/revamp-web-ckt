import { Section, SectionHead, Shell } from "./ui";
import type { Copy3 } from "./content";

/**
 * The challenge — the first console band.
 *
 * This is where the old design was most decorative: a 21:9 landscape
 * illustration in a rounded plate with a navy gradient behind it and the heading
 * overlaid on top. The same words now sit on near-black with a hairline grid,
 * and the three problems become a three-column ruled table rather than a
 * numbered list with generous air around it.
 *
 * Moving to ink this early is what gives the page its rhythm. Light, light,
 * dark, light, light — the alternation is doing structural work now, where
 * before every band was a near-identical pale blue.
 */
export function Problem({ copy }: { copy: Copy3["problem"] }) {
  return (
    <Section
      id="problem"
      tone="console"
      labelledBy="ph3-problem-title"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="ph3-console-grid absolute inset-0" aria-hidden />

      <Shell className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <SectionHead
            id="ph3-problem-title"
            index="01"
            eyebrow={copy.eyebrow}
            title={copy.heading}
            tone="console"
          />

          <p
            data-ph3-enter
            className="ph3-lede self-end text-[1.0625rem] text-[var(--ph3-on-console-2)] lg:pb-3"
          >
            {copy.body}
          </p>
        </div>

        <ol
          className="mt-12 grid list-none border-t border-[var(--ph3-console-line)] sm:mt-16 lg:grid-cols-3"
          data-ph3-rule
        >
          {copy.items.map((item, index) => (
            <li
              key={item.title}
              className={[
                "ph3-row border-[var(--ph3-console-line)] py-7 sm:px-6 lg:min-h-[16rem] lg:py-8",
                index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[var(--ph3-console-line)]",
              ].join(" ")}
            >
              <span className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="ph3-display mt-4 text-[1.25rem] leading-[1.2] text-[var(--ph3-on-console)]">
                {item.title}
              </h3>
              <p className="ph3-lede mt-3 text-[0.9375rem] text-[var(--ph3-on-console-2)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Shell>
    </Section>
  );
}

/**
 * The console backdrop, extracted so the closer and the pricing band can reuse
 * the same hairline field instead of each declaring its own.
 */
export function ConsoleGrid() {
  return <div className="ph3-console-grid absolute inset-0" aria-hidden />;
}