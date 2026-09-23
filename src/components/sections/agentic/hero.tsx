import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/sections/agentic/hero-slider";
import { buildHeroSliderCopy } from "@/components/sections/agentic/hero-slides";

/**
 * Keynote void hero for the Agentic AI Ecosystem homepage — deep navy
 * stage, display type, and the staged phone chat demo on the right.
 *
 * Slide copy is resolved here on the server (full catalog from disk) and
 * passed into `HeroSlider` as props: the hero is a manual slide — ecosystem
 * first, then CRM / Mini Agent / OMS / Marketing / Consulting — and the
 * client never looks up `agentic.hero.slides.*` itself.
 */
export async function Hero() {
  const hero = await getTranslations("agentic.hero");
  const home = await getTranslations("home.hero");
  const copy = buildHeroSliderCopy({ hero, home });

  return (
    <section className="relative isolate overflow-hidden bg-ink-void text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-55"
      />
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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-20">
        <HeroSlider copy={copy} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}
