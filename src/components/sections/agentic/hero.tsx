import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { mdiWhatsapp } from "@/lib/icons";
import { EcosystemHub } from "./ecosystem-hub";

const KEYNOTE = ["Independent", "Integrated", "Open API"] as const;

/**
 * Keynote void hero for the Agentic AI Ecosystem homepage — deep navy
 * stage, display type, and a six-node ecosystem map that names every product
 * before the scroll begins.
 */
export function Hero() {
  const t = useTranslations("agentic.hero");
  const th = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden bg-ink-void text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]"
      />
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-55" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute top-[8%] left-[6%] h-80 w-80 rounded-full bg-primary/45 blur-[110px]" />
        <span
          className="animate-orb-drift absolute top-[28%] right-[4%] h-96 w-96 rounded-full bg-accent-sky/30 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
        <span
          className="animate-orb-drift absolute bottom-[8%] left-[38%] h-64 w-64 rounded-full bg-[#1352bf]/35 blur-[100px]"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-36 pb-16 sm:px-6 lg:px-8 lg:pt-40 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="hero-stagger text-center lg:text-left">
            <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-sky-200 uppercase backdrop-blur">
              <span aria-hidden className="animate-pulse-soft size-1.5 rounded-full bg-sky-300" />
              {t("eyebrow")}
            </p>

            {/* LCP candidate: fully opaque in the first paint (no opacity-from-0). */}
            <h1 className="mx-auto max-w-[16ch] text-[clamp(2.1rem,5.2vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-white lg:mx-0 lg:max-w-[14ch]">
              {t("titleLead")}{" "}
              <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                {t("titleAccent")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sky-50/85 lg:mx-0 lg:text-lg">
              {t("subtitle")}
            </p>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {KEYNOTE.map((word) => (
                <li
                  key={word}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-numeric text-[0.72rem] font-semibold tracking-[0.12em] text-sky-100 uppercase backdrop-blur"
                >
                  {word}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
                nativeButton={false}
                render={<WhatsAppAnchor target="_blank" rel="noopener noreferrer" />}
              >
                <SafeIcon icon={mdiWhatsapp} className="size-4" size="1rem" />
                {th("ctaPrimary")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 rounded-full border-white/30 bg-white/8 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15"
                nativeButton={false}
                render={<AppAnchor href={REGISTER_URL} />}
              >
                {th("ctaSecondary")}
              </Button>
            </div>
          </div>

          <div className="hero-stagger relative mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/35 blur-3xl"
            />
            <div className="relative rounded-[1.75rem] border border-white/12 bg-white/6 p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur-md sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-numeric text-[0.65rem] font-semibold tracking-[0.18em] text-sky-300 uppercase">
                  {t("hubLabel")}
                </span>
                <span className="font-numeric text-[0.65rem] font-medium tracking-wider text-sky-200/80">
                  Multi Agents Orchestration
                </span>
              </div>
              <EcosystemHub />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}
