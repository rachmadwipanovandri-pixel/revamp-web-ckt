import { Ico } from "./Icon";
import { text } from "./content-types";
import {
  solar_global_bold,
  solar_key_minimalistic_bold,
  solar_shield_check_bold,
  solar_users_group_rounded_bold,
} from "./icons";
import { Section, SectionHead, Shell } from "./ui";
import type { Copy4 } from "./content-types";
const ICONS = [
  solar_global_bold,
  solar_key_minimalistic_bold,
  solar_shield_check_bold,
  solar_users_group_rounded_bold,
];
export function TrustBand4({
  copy,
  locale,
}: {
  copy: Copy4["trust"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section id="trust" tone="paper" rule={true} labelledBy="ph4-trust-title">
      <Shell>
        <SectionHead
          id="ph4-trust-title"
          index="07"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          accent={copy.accent}
          body={text(copy.body, en)}
        />
        <ul
          data-ph4-stagger={true}
          className="mt-10 grid gap-px overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-line)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {copy.badges.map((badge, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <li
                key={text(badge.label, en)}
                className="ph4-badge bg-[var(--ph4-white)]"
              >
                <span className="flex items-center gap-2">
                  <Ico
                    icon={Icon}
                    size={15}
                    className="shrink-0 text-[var(--ph4-accent)]"
                  />
                  <span className="ph4-badge-label">
                    {text(badge.label, en)}
                  </span>
                </span>
                <span className="ph4-badge-note">{text(badge.note, en)}</span>
              </li>
            );
          })}
        </ul>
        <div
          data-ph4-stagger={true}
          className="mt-px grid gap-px overflow-hidden rounded-[var(--ph4-r-md)] border border-t-0 border-[var(--ph4-line)] bg-[var(--ph4-line)] sm:grid-cols-2"
        >
          {copy.points.map((point) => (
            <div
              key={text(point.title, en)}
              className="bg-[var(--ph4-white)] px-5 py-6"
            >
              <h3 className="ph4-display text-[1rem]">
                {text(point.title, en)}
              </h3>
              <p className="mt-2 max-w-[34rem] text-[0.875rem] leading-[1.6] text-[var(--ph4-muted)]">
                {text(point.body, en)}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
