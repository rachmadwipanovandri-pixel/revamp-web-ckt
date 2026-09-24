"use client";

import { useTranslations } from "next-intl";
import type { IconifyIcon } from "@iconify/react/offline";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";

export type PillarKey = "independent" | "integrated" | "openApi";

/**
 * Client pillar card — calm editorial panel. Outer SoftCard owns the frame.
 */
export function PillarCard({
  glyph,
  index,
  pillarKey,
}: {
  glyph: IconifyIcon;
  index: string;
  pillarKey: PillarKey;
}) {
  const t = useTranslations("agentic.pillars");

  return (
    <article className="flex h-full flex-col p-7 md:p-8">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-[#EEF4FF] text-primary">
          <SafeIcon icon={glyph} className="size-5" size="1.25rem" />
        </span>
        <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#98A2B3]">
          {index}
        </span>
      </div>
      <h3 className="mt-7 font-numeric text-2xl font-semibold tracking-[-0.035em] text-[#0C111D]">
        {t(`${pillarKey}.title`)}
      </h3>
      <p className="mt-2 text-sm font-medium text-primary">{t(`${pillarKey}.lead`)}</p>
      <p className="mt-3 text-sm leading-[1.65] text-[#525C6B]">{t(`${pillarKey}.body`)}</p>
      <ul className="mt-auto flex flex-wrap gap-2 border-t border-[#0C111D]/[0.06] pt-5">
        {(["tag1", "tag2", "tag3"] as const).map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-[#0C111D]/10 bg-[#F6F7F9] px-2.5 py-1 text-[0.72rem] font-medium text-[#525C6B]"
          >
            {t(`${pillarKey}.${tag}`)}
          </li>
        ))}
      </ul>
    </article>
  );
}
