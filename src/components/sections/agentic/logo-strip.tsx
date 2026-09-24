import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";

/**
 * Infinite logo ticker under the hero — edge-faded, pauses on hover.
 * Instant credibility without a static grid that dies below the fold.
 */
export async function LogoStrip() {
  const t = await getTranslations("agentic.logoStrip");
  // Double the list so the -50% loop has a seamless second copy.
  const loop = [...TRUSTED_LOGOS.slice(0, 10), ...TRUSTED_LOGOS.slice(0, 10)];

  return (
    <section
      aria-label={t("heading")}
      className="relative border-b border-foreground/8 bg-white py-8 md:py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-subtle-foreground uppercase">
          {t("heading")}
        </p>
      </div>

      <div className="logo-ticker-mask mt-6 overflow-hidden">
        <div
          className="flex w-max animate-logo-ticker gap-12 pr-12 hover:[animation-play-state:paused] motion-reduce:animate-none"
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
                className="h-6 w-auto object-contain opacity-55 grayscale transition duration-300 hover:opacity-95 hover:grayscale-0 sm:h-7"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-subtle-foreground">{t("note")}</p>
    </section>
  );
}
