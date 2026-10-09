import { Fragment } from "react";
import Link from "next/link";
import type { HomeContent } from "@/components/preview-home-2/types";
import { HeroForm3 } from "./HeroForm3";
import { HeroWindow3 } from "./HeroWindow3";
import { Ico } from "./Icon";
import { Shell } from "./ui";
import { solar_chat_round_line_bold } from "./icons";

/**
 * The hero.
 *
 * Two changes carry the whole reframe:
 *
 *   - It is a split, not a centre stack. A centred headline above a centred
 *     form above a centred device was the template shape; a 7/5 grid with copy
 *     left and product right is how the product category actually lays this out,
 *     and it puts the message and the thing being sold in the same glance.
 *
 *   - The product UI *is* the image. There is no illustration behind it, no
 *     gradient plate, no soft wash. One crisp window, drawn in code so it stays
 *     sharp at any density and switches language with the page.
 */
export function Hero3({
  content,
  isEn,
}: {
  content: HomeContent;
  isEn: boolean;
}) {
  const hero = content.hero;

  return (
    <section
      id="hero"
      className="ph3-hero relative isolate overflow-hidden pb-14 pt-[104px] sm:pb-16 sm:pt-[120px] lg:pb-24 lg:pt-[136px]"
    >
      <div className="ph3-hero-grid absolute inset-0" aria-hidden />
      <div className="ph3-hero-light absolute inset-0" aria-hidden />

      <Shell className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 xl:gap-20">
          {/* ---------- copy ---------- */}
          <div className="flex flex-col items-start">
            <Link
              href={hero.pill.href}
              data-ph3-hero-item
              className="ph3-chip group gap-2 py-1 transition-colors duration-150 hover:border-[var(--ph3-line-3)] hover:text-[var(--ph3-ink)]"
            >
              <span
                aria-hidden
                className="ph3-pulse h-1.5 w-1.5 rounded-full bg-[var(--ph3-accent)] text-[var(--ph3-accent)]"
              />
              {hero.pill.label}
              <Ico
                icon={solar_chat_round_line_bold}
                size={13}
                className="ph3-arrow text-[var(--ph3-muted-3)]"
              />
            </Link>

            <SplitHeroHeading
              lead={hero.titleLead}
              accent={hero.titleAccent}
            />

            <p
              data-ph3-hero-item
              className="ph3-lede mt-6 max-w-[36rem] text-[1.0625rem] sm:text-[1.125rem]"
            >
              {hero.sub}
            </p>

            <div data-ph3-hero-item className="mt-8 w-full">
              <HeroForm3 form={hero.form} />
            </div>

            <Link
              href={hero.form.secondary.href}
              data-ph3-hero-item
              className="ph3-link group mt-6 text-[0.9375rem]"
            >
              {hero.form.secondary.label}
              <span aria-hidden className="ph3-arrow">
                →
              </span>
            </Link>
          </div>

          {/* ---------- product ---------- */}
          <div className="ph3-hero-stage relative">
            <HeroWindow3 isEn={isEn} />
          </div>
        </div>
      </Shell>
    </section>
  );
}

function SplitHeroHeading({
  lead,
  accent,
}: {
  lead: string;
  accent: string;
}) {
  const mask =
    "inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]";
  const words = (text: string, isAccent: boolean) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((token, index) => (
        // Space outside the mask — see the note in `SplitHeading`.
        <Fragment key={`${token}-${index}`}>
          <span className={mask}>
            <span
              data-ph3-hero-word=""
              className={[
                "inline-block will-change-transform",
                isAccent ? "text-[var(--ph3-accent)]" : "",
              ].join(" ")}
            >
              {token}
            </span>
          </span>{" "}
        </Fragment>
      ));

  return (
    // Optical scale, not just size.
    //
    // Measured against the references at an equal 1000px viewport: the strongest
    // of them sets its H1 at ~8.8vw, while this was at 4.6vw — roughly half the
    // optical weight. The fix is not only a bigger number but a *tighter* one:
    // `ph3-display-hero` takes tracking to −0.045em and line-height to 0.94,
    // which is what lets a headline this large read as confident rather than
    // merely loud.
    //
    // The cap is 6rem rather than something higher on purpose: past that the
    // headline drops to two lines and the accent word stops carrying the
    // composition.
    <h1 className="ph3-display ph3-display-hero mt-6 text-[clamp(2.5rem,7.2vw,6rem)]">
      {words(lead, false)}
      {words(accent, true)}
    </h1>
  );
}

