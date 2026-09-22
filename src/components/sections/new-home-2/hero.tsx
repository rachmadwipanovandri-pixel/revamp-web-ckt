import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { mdiWhatsapp } from "@/lib/icons";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { SplitHeading, Eyebrow } from "./split-heading";
import { IsometricStack } from "./isometric";

/**
 * Sentry-lineage hero for /new-2: full-bleed electric-blue gradient that
 * dissolves into the light body, left-aligned display type, right-hand
 * isometric stack, trust marquee riding the fade.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const [lead, accent] = splitTitle(t("title"));

  return (
    <section className="relative isolate overflow-hidden text-white">
      {/* Gradient stage: deep navy → electric blue → soft sky → white */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-[#050b18] from-0% via-[#1546c4] via-28% via-[#3b82f6] via-55% via-[#93c5fd] via-78% to-[#ffffff] to-100%"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute top-[12%] left-[6%] h-72 w-72 rounded-full bg-sky-400/35 blur-[100px]" />
        <span className="absolute top-[30%] right-[8%] h-80 w-80 rounded-full bg-blue-500/30 blur-[110px]" />
      </div>

      {/* Live strip sits under the exclusive SiteHeader (h-16) */}
      <div className="absolute inset-x-0 top-16 z-20 border-b border-white/10 bg-black/15 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
          <span className="flex shrink-0 items-center gap-2 font-numeric text-[0.65rem] font-semibold tracking-[0.18em] text-sky-200 uppercase">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Live platform
          </span>
          <div className="min-w-0 flex-1 opacity-75 [&_img]:h-4! [&_img]:opacity-100! [&_img]:grayscale-0!">
            <MarqueeStrip logos={TRUSTED_LOGOS.slice(0, 8)} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-40 pb-40 sm:px-6 sm:pt-44 lg:px-8 lg:pt-44 lg:pb-52">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="hero-stagger text-center lg:text-left">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-100 uppercase backdrop-blur">
              <span
                aria-hidden
                className="animate-pulse-soft size-1.5 rounded-full bg-sky-300"
              />
              {t("eyebrow")}
            </p>

            <SplitHeading
              as="h1"
              lead={lead}
              accent={accent}
              tone="ink"
              size="hero"
              className="mx-auto lg:mx-0 [&>span:first-child]:text-white/55 [&>span:last-child]:text-white"
            />

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sky-50/85 lg:mx-0 lg:text-lg">
              {t("subtitle")}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="h-13 rounded-full bg-white px-8 text-sm text-[#0b1f4a] shadow-[0_18px_40px_-16px_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
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
                className="h-13 rounded-full border-white/35 bg-white/10 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15"
                nativeButton={false}
                render={<AppAnchor href={REGISTER_URL} />}
              >
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>

          <div className="hero-stagger relative mx-auto w-full max-w-[28rem] lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-sky-300/20 blur-3xl"
            />
            <div className="relative rounded-[1.75rem] border border-white/15 bg-white/8 p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/12 pb-3">
                <Eyebrow tone="ink" className="!text-[0.62rem]">
                  Platform map
                </Eyebrow>
                <span className="font-numeric text-[0.65rem] font-medium tracking-wider text-sky-200/80">
                  ID · EN
                </span>
              </div>
              <IsometricStack />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    ["Inbox", "all channels"],
                    ["Agent", "qualify · close"],
                    ["Revenue", "tracked live"],
                  ] as const
                ).map(([label, note]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/12 bg-white/6 px-2 py-2 text-center"
                  >
                    <p className="font-numeric text-[0.68rem] font-semibold text-white">
                      {label}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] leading-tight text-sky-100/75">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust row sits in the blue→white dissolve */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <p className="mb-5 text-center font-numeric text-[0.65rem] font-semibold tracking-[0.2em] text-[#0b1f4a]/55 uppercase">
          Trusted by 3,000+ businesses across Asia
        </p>
        <div className="rounded-2xl border border-[#1352bf]/12 bg-white/70 px-4 py-4 shadow-[0_20px_50px_-36px_rgba(19,82,191,0.45)] backdrop-blur">
          <div className="[&_img]:h-6! [&_img]:opacity-80! [&_img]:grayscale!">
            <MarqueeStrip logos={TRUSTED_LOGOS} />
          </div>
        </div>
      </div>

      {/* Spacer that lands exactly on pure white for the next section */}
      <div aria-hidden className="h-10 bg-white" />
    </section>
  );
}

/** Split "Lead. Accent." (or mid-sentence) into two-tone hero clauses. */
function splitTitle(full: string): [string, string] {
  const period = full.indexOf(". ");
  if (period !== -1) {
    return [full.slice(0, period + 1), full.slice(period + 2)];
  }
  const colon = full.indexOf(": ");
  if (colon !== -1) {
    return [full.slice(0, colon + 1), full.slice(colon + 2)];
  }
  const comma = full.lastIndexOf(", ");
  if (comma !== -1) {
    return [full.slice(0, comma + 1), full.slice(comma + 2)];
  }
  return [full, ""];
}
