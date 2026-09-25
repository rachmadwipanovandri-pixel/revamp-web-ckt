import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
} from "@/components/sections/agentic/shell";

const FEATURES = [
  { key: "chat", src: "/images/home/feature-chat-inbox.png" },
  { key: "order", src: "/images/home/feature-order-in-chat.png" },
  { key: "oms", src: "/images/home/feature-oms-orders.png" },
  { key: "crm", src: "/images/home/feature-crm-pipeline.png" },
  { key: "marketing", src: "/images/home/feature-marketing-loop.png" },
  { key: "consulting", src: "/images/home/feature-consulting-agent.png" },
  { key: "mini", src: "/images/home/feature-mini-agent.png" },
] as const;

/** Two identical halves keep the -50% keyframe seam invisible. */
const TICKER = [
  ...FEATURES,
  ...FEATURES,
  ...FEATURES,
  ...FEATURES,
];

/**
 * Four-job feature ticker — one row of illustration cards running right to
 * left, paused on hover (same CSS-only pattern as LogoStrip, no client JS).
 */
export async function Features() {
  const t = await getTranslations("agentic.features");

  return (
    <SectionBand tone="soft" className="border-y border-[#0C111D]/[0.06]">
      <SectionShell className="pt-20 pb-10 md:pt-28 md:pb-14 lg:pt-32">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>
      </SectionShell>

      <div className="feature-ticker-mask overflow-hidden pb-20 md:pb-28 lg:pb-32">
        <ul className="flex w-max animate-feature-ticker gap-5 pr-5 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {TICKER.map((feature, index) => (
            <li
              key={`${feature.key}-${index}`}
              aria-hidden={index >= FEATURES.length || undefined}
              className="w-[260px] shrink-0 sm:w-[300px] lg:w-[340px]"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white shadow-[0_1px_2px_rgba(12,17,29,0.04),0_18px_40px_-28px_rgba(12,17,29,0.18)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/25 hover:shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-30px_rgba(19,82,191,0.28)]">
                <div className="relative aspect-square overflow-hidden bg-[#DCE7FC]">
                  <Image
                    src={feature.src}
                    alt={t(`${feature.key}.title`)}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[#0C111D] md:text-lg">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.6] text-[#525C6B]">
                    {t(`${feature.key}.body`)}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </SectionBand>
  );
}
