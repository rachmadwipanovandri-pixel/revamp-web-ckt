import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { SectionBand, SectionShell } from "@/components/sections/agentic/shell";

/**
 * Quiet credibility strip under the hero — incident.io logo wall energy.
 * Grayscale marks, generous letter-spacing label, no glow.
 */
export async function LogoStrip() {
  const t = await getTranslations("agentic.logoStrip");
  const loop = [...TRUSTED_LOGOS.slice(0, 10), ...TRUSTED_LOGOS.slice(0, 10)];

  return (
    <SectionBand tone="white" className="border-b border-[#0C111D]/[0.06]">
      <SectionShell className="py-12 md:py-16">
        <p className="text-center font-numeric text-[0.7rem] font-semibold tracking-[0.16em] text-[#667085] uppercase">
          {t("heading")}
        </p>

        <div className="logo-ticker-mask mt-8 overflow-hidden">
          <div
            className="flex w-max animate-logo-ticker items-center gap-14 pr-14 hover:[animation-play-state:paused] motion-reduce:animate-none"
            role="list"
          >
            {loop.map((logo, index) => (
              <div key={`${logo.src}-${index}`} role="listitem" className="flex items-center">
                <Image
                  src={logo.src}
                  alt={index >= TRUSTED_LOGOS.length ? "" : logo.alt}
                  aria-hidden={index >= TRUSTED_LOGOS.length || undefined}
                  width={logo.width}
                  height={logo.height}
                  className="h-7 w-auto object-contain opacity-45 grayscale transition duration-300 hover:opacity-80 hover:grayscale-0 sm:h-8"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[#667085]">{t("note")}</p>
      </SectionShell>
    </SectionBand>
  );
}
