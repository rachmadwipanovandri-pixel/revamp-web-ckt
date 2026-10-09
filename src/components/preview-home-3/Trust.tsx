import { Ico } from "./Icon";
import { Section, SectionHead, Shell } from "./ui";
import {
  solar_key_minimalistic_bold,
  solar_shield_check_bold,
  solar_verified_check_bold,
  solar_widget_add_bold,
} from "./icons";
import type { Copy3 } from "./content";

/**
 * Security and control.
 *
 * Four points, so the band moves from a hairline checklist to a 2×2 grid of
 * ruled cells. Each cell gets a real Solar glyph instead of the old blue circle
 * around a lucide tick — four identical checkmarks in four identical circles
 * told the reader nothing about which control did what.
 */
export function Trust({ copy }: { copy: Copy3["trust"] }) {
  const icons = [
    solar_shield_check_bold,
    solar_widget_add_bold,
    solar_key_minimalistic_bold,
    solar_verified_check_bold,
  ];

  return (
    <Section
      id="trust"
      tone="surface"
      rule
      labelledBy="ph3-trust-title"
      className="scroll-mt-24"
    >
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHead
            id="ph3-trust-title"
            index="04"
            eyebrow={copy.eyebrow}
            title={copy.heading}
            body={copy.body}
          />

          <ul className="grid list-none border-t border-[var(--ph3-line)] sm:grid-cols-2 sm:border-l sm:border-[var(--ph3-line)]">
            {copy.points.map((point, index) => (
              <li
                key={point.title}
                className={[
                  "ph3-spec-cell",
                  "sm:border-r sm:border-[var(--ph3-line)]",
                ].join(" ")}
                data-ph3-enter
              >
                <div className="flex items-center gap-2.5">
                  <Ico
                    icon={icons[index] ?? solar_shield_check_bold}
                    size={17}
                    className="text-[var(--ph3-accent)]"
                  />
                  <span className="ph3-mono text-[0.5625rem]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-[-0.015em] text-[var(--ph3-ink)]">
                  {point.title}
                </h3>
                <p className="ph3-lede mt-2 text-[0.875rem]">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}