import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  PhotoOverlay,
} from "@/components/sections/agentic/shell";

const ITEMS = [
  { key: "pdp", index: "01" },
  { key: "rbac", index: "02" },
  { key: "meta", index: "03" },
  { key: "iso", index: "04" },
] as const;

const TRUST = ["UU PDP", "Meta Partner", "RBAC", "ISO 27001 *"] as const;

/**
 * Enterprise readiness — calm trust chapter on soft dark ink.
 * ISO status stays honest (in progress).
 */
export async function Security() {
  const t = await getTranslations("agentic.security");

  return (
    <SectionBand tone="ink" className="relative isolate overflow-hidden py-20 md:py-28 lg:py-32">
      <PhotoOverlay
        src="/images/home/gallery-desk.jpg"
        wash="from-[#0B1220]/94 via-[#0B1220]/88 to-[#0B1220]/94"
      />
      <SectionShell className="relative">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

        <Reveal delay={40} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {TRUST.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-numeric text-[0.72rem] font-semibold tracking-[0.06em] text-white/85"
              >
                {chip}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, index) => (
            <Reveal key={item.key} delay={index * 60} className="h-full">
              <article className="flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6">
                <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-white/45">
                  {item.index}
                </span>
                <h3 className="mt-4 font-numeric text-lg font-semibold tracking-[-0.025em] text-white">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-[1.65] text-white/65">
                  {t(`${item.key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-8">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-white/45">
            {t("note")}
          </p>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}
