import Link from "next/link";
import { AnimGate } from "./AnimGate";
import { HeroAurora } from "./HeroAurora";
import { HeroForm } from "./HeroForm";
import { HeroStage } from "./HeroStage";
import { Accent, Band, Shell } from "./ui";
import type { HomeContent } from "./types";

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22C55E"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Band 2 — hero.
 *
 * Composition follows /preview-home and Amplemarket: centred copy, then a
 * single conversion action (an inline email field rather than two competing
 * buttons), then a full-width stage where the looping product cards float on
 * top of the Cekat dashboard. The loop is therefore part of the hero, not a
 * section of its own; the Growth Loop diagram now has its own band below.
 */
export function Hero({ content }: { content: HomeContent }) {
  const hero = content.hero;

  return (
    <Band
      id="hero"
      tone="white"
      className="ph2-grid-bg overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20"
    >
      {/* Sits behind the copy and the stage; the gate div spans the whole band
          so the aurora keeps drifting only while the hero is actually on
          screen. */}
      <AnimGate className="ph2-aurora-gate">
        <HeroAurora />
      </AnimGate>

      <Shell className="relative">
        <div className="mx-auto flex max-w-[54rem] flex-col items-center text-center">
          <Link
            href={hero.pill.href}
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-1.5 text-[0.8rem] font-semibold text-[#101828] transition-colors duration-200 hover:border-primary/40"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
            {hero.pill.label}
            <span
              aria-hidden
              className="text-primary transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>

          <h1 className="mt-6 text-[clamp(2.35rem,5.2vw,4.15rem)] leading-[1.04] font-bold tracking-[-0.03em] text-balance text-[#101828]">
            {hero.titleLead} <Accent>{hero.titleAccent}</Accent>
          </h1>

          <p className="mt-5 max-w-[38rem] text-[1.125rem] leading-[1.6] text-[#4B5563]">
            {hero.sub}
          </p>

          <HeroForm form={hero.form} />

          <Link
            href={hero.form.secondary.href}
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            {hero.form.secondary.label}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[0.85rem] text-[#4B5563]">
            {hero.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Shell>

      <Shell className="relative mt-12 md:mt-16">
        <HeroStage dashboard={content.dashboard} stage={content.liveStage} />
      </Shell>
    </Band>
  );
}
