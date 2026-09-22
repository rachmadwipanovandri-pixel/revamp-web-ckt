import { useTranslations } from "next-intl";
import Image from "next/image";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { HeroChatDemo } from "@/components/sections/home/hero-chat-demo";
import { SafeIcon } from "./safe-icon";
import { mdiWhatsapp } from "@/lib/icons";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";

/**
 * Radical hero: full-bleed ink void, extreme display type, and a staged
 * glass console — layered glow, orbit rings, sheen, status chips, side dock.
 * The chat demo uses drag-to-fold (Apple Duo style) on this stage.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-ink-void text-white lg:min-h-[84svh]">
      <Image
        src="/images/home/hero-background-sky.png"
        alt=""
        fill
        loading="eager"
        quality={40}
        sizes="100vw"
        className="object-cover object-top opacity-20 mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink-void/70 via-ink-void/85 to-ink-void"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-60"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute top-[12%] left-[8%] h-80 w-80 rounded-full bg-primary/40 blur-[100px]" />
        <span
          className="animate-orb-drift absolute top-[35%] right-[5%] h-96 w-96 rounded-full bg-accent-sky/30 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
        <span
          className="animate-orb-drift absolute bottom-[10%] left-[40%] h-64 w-64 rounded-full bg-accent-teal/20 blur-[100px]"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      <div className="absolute inset-x-0 top-0 z-20 border-b border-white/8 bg-white/4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
          <span className="shrink-0 font-numeric text-[0.65rem] font-semibold tracking-[0.22em] text-sky-300 uppercase">
            Live platform
          </span>
          <div className="min-w-0 flex-1 opacity-70 [&_img]:h-4! [&_img]:opacity-100! [&_img]:grayscale-0!">
            <MarqueeStrip logos={TRUSTED_LOGOS.slice(0, 8)} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 lg:pt-24 lg:pb-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="hero-stagger text-center lg:text-left">
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur">
              <span
                aria-hidden
                className="animate-pulse-soft size-1.5 rounded-full bg-sky-300"
              />
              {t("eyebrow")}
            </p>

            <h1 className="mx-auto max-w-[18ch] text-[clamp(1.85rem,4vw,3.15rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-white lg:mx-0 lg:max-w-[16ch]">
              {t("title")}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground-muted/90 lg:mx-0">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-primary-dark"
                nativeButton={false}
                render={
                  <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                }
              >
                <SafeIcon icon={mdiWhatsapp} className="size-4" size="1rem" />
                {t("ctaPrimary")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 rounded-full border-white/30 bg-white/8 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15"
                nativeButton={false}
                render={<AppAnchor href={REGISTER_URL} />}
              >
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>

          {/* Restored staged console */}
          <div className="hero-stagger relative">
            <div className="relative mx-auto w-full max-w-[32rem] lg:max-w-none">
              {/* Glow bed + orbit */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-4 bottom-10 -z-10"
              >
                <div className="absolute inset-x-[8%] top-[10%] bottom-[4%] rounded-full bg-primary/50 blur-[72px]" />
                <div className="absolute top-[20%] left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-accent-sky/35 blur-[56px]" />
                <div className="animate-[spin_48s_linear_infinite] absolute top-1/2 left-1/2 h-[92%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/15 motion-reduce:animate-none" />
                <div className="absolute bottom-0 left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-full bg-black/50 blur-2xl" />
              </div>

              {/* Status chips */}
              <div className="animate-float-soft absolute -top-5 left-2 z-30 flex items-center gap-2 rounded-2xl border border-sky-400/25 bg-ink-panel/95 px-4 py-2.5 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur sm:-left-4">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex size-full rounded-full bg-sky-400 opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky-300" />
                </span>
                <span className="font-numeric text-[0.7rem] font-semibold tracking-wide text-sky-100">
                  AI · always on
                </span>
              </div>
              <div
                className="animate-float-soft absolute right-2 -bottom-3 z-30 flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-ink-panel/95 px-4 py-2.5 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur sm:-right-3"
                style={{ animationDelay: "-3.2s" }}
              >
                <span className="size-1.5 rounded-full bg-emerald-300" />
                <span className="font-numeric text-[0.7rem] font-semibold tracking-wide text-emerald-200">
                  Closed-won auto
                </span>
              </div>

              {/* Glass console (the look you wanted back) */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-linear-to-b from-white/10 to-white/4 p-2.5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-xl sm:p-3">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-40 h-24 bg-linear-to-b from-white/10 to-transparent"
                />
                <HeroChatDemo stage="ink" className="w-full" />
              </div>

              <div
                aria-hidden
                className="mx-auto mt-3 h-7 w-[65%] rounded-full bg-linear-to-b from-sky-400/25 to-transparent blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}
