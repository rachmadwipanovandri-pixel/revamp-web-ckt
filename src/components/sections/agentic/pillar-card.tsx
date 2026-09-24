"use client";

import { useTranslations } from "next-intl";
import type { IconifyIcon } from "@iconify/react/offline";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { useSpotlight } from "@/components/sections/agentic/motion-hooks";

export type PillarKey = "independent" | "integrated" | "openApi";

/**
 * Client pillar card — spotlight + hover. Glyph is a serializable icon
 * object prop from the server shell; copy resolves in the client boundary.
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
  const ref = useSpotlight<HTMLElement>();

  return (
    <article
      ref={ref}
      className="spotlight-card group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-surface-muted/70 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_32px_60px_-36px_rgba(19,82,191,0.45)] md:p-8"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-white text-primary shadow-[0_10px_24px_-16px_rgba(19,82,191,0.5)] transition-transform duration-500 group-hover:scale-105">
          <SafeIcon icon={glyph} className="size-5" size="1.25rem" />
        </span>
        <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-subtle-foreground">
          {index}
        </span>
      </div>
      <h3 className="relative mt-7 font-numeric text-2xl font-semibold tracking-[-0.035em] text-foreground">
        {t(`${pillarKey}.title`)}
      </h3>
      <p className="relative mt-2 text-sm leading-snug font-medium text-primary/90">
        {t(`${pillarKey}.lead`)}
      </p>
      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
        {t(`${pillarKey}.body`)}
      </p>
      <ul className="relative mt-auto flex flex-wrap gap-2 border-t border-foreground/8 pt-5">
        {(["tag1", "tag2", "tag3"] as const).map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-foreground/10 bg-white px-2.5 py-1 text-[0.7rem] font-medium text-foreground/75 transition-colors duration-300 group-hover:border-primary/25 group-hover:text-foreground"
          >
            {t(`${pillarKey}.${tag}`)}
          </li>
        ))}
      </ul>
    </article>
  );
}
