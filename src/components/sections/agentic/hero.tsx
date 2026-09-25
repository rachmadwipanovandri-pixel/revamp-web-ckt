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
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#061a3a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#0b2f78] via-[#0a1e4a] to-[#123a8a]"
      />
      {/* Vivid color washes — keep the void from reading as flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, rgba(56,189,248,0.35) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 15% 75%, rgba(99,102,241,0.3) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 55% 100%, rgba(34,211,238,0.25) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-40"
      />
      {/* Blueprint grid — slow drift, masked to the center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-grid-drift opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(125,211,252,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 0%, transparent 72%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute top-[8%] left-[6%] h-80 w-80 rounded-full bg-sky-400/40 blur-[110px]" />
        <span
          className="animate-orb-drift absolute top-[20%] right-[4%] h-96 w-96 rounded-full bg-cyan-400/35 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
        <span
          className="animate-orb-drift absolute bottom-[8%] left-[38%] h-64 w-64 rounded-full bg-indigo-500/35 blur-[100px]"
          style={{ animationDelay: "-12s" }}
        />
        <span
          className="animate-orb-drift absolute top-[55%] right-[18%] h-56 w-56 rounded-full bg-amber-300/20 blur-[100px]"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-center px-4 pt-24 pb-14 sm:px-6 lg:px-10 lg:pt-24 lg:pb-36">
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
