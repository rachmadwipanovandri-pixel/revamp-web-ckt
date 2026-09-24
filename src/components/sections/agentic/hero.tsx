import { getTranslations } from "next-intl/server";
import { HeroSlider } from "@/components/sections/agentic/hero-slider";
import { buildHeroSliderCopy } from "@/components/sections/agentic/hero-slides";

/**
 * Keynote void hero — blueprint grid + drifting orbs + staged phone demo.
 * Slide copy is resolved on the server and passed into HeroSlider; the
 * client never looks up `agentic.hero.slides.*` itself.
 */
export async function Hero() {
  const hero = await getTranslations("agentic.hero");
  const home = await getTranslations("home.hero");
  const copy = buildHeroSliderCopy({ hero, home });

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink-void text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-55"
      />
      {/* Blueprint grid — slow drift, masked to the center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-grid-drift opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(125,211,252,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 0%, transparent 72%)",
        }}
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-24 pb-14 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
        <HeroSlider copy={copy} />
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <span className="flex flex-col items-center gap-2 text-white/45">
          <span className="font-numeric text-[0.6rem] tracking-[0.22em] uppercase">
            Scroll
          </span>
          <span className="h-10 w-px bg-linear-to-b from-white/50 to-transparent" />
        </span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
      />
    </section>
  );
}
