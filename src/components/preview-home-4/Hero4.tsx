import Image from "next/image";
import { Action, Section, Shell, SplitHeading } from "./ui";
import { Ico } from "./Icon";
import { solar_check_circle_bold } from "./icons";
import { text } from "./content-types";
import type { Copy4 } from "./content-types";

/**
 * The hero — full-bleed ambient video with the headline on top.
 *
 * Spread's opening move: no product mock squeezed beside the copy, just one
 * cinematic frame, oversized type, and two actions. The frame is a muted
 * 10-second office loop (Pexels 853822, trimmed) under the same navy scrim so
 * white type and the stat row stay legible; the team's own warehouse
 * photograph stays mounted underneath as the fallback layer — it shows before
 * the first video frame paints and is all that renders when
 * `prefers-reduced-motion` hides the video. The running product surface lives
 * one band down in the LiveBand, full width, where it has room to breathe.
 */
export function Hero4({
  copy,
  locale,
}: {
  copy: Copy4["hero"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <div className="ph4-hero-photo">
      <Image
        src="/images/ph3/field/warehouse.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="ph4-hero-photo-img"
      />
      {/*
        Decorative loop: `autoPlay muted loop playsInline` ships in the server
        HTML so it starts before hydration. No `poster` on purpose — the photo
        above already fills the frame, and a poster URL would bypass the
        Next-optimised copy and download the same image twice. `tabIndex={-1}`
        keeps a background video out of the tab order.
      */}
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-hidden={true}
        tabIndex={-1}
        className="ph4-hero-video absolute inset-0 h-full w-full"
      >
        <source src="/videos/ph4-hero-office.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="ph4-hero-photo-scrim" />

      <Section
        labelledBy="ph4-hero-title"
        tone="transparent"
        className="relative"
      >
        <Shell className="relative">
          <div className="mx-auto flex max-w-[60rem] flex-col items-center gap-6 py-16 text-center sm:py-24 lg:py-28">
            <span
              data-ph4-hero-item
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.8125rem] font-medium text-white backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="ph4-pulse h-1.5 w-1.5 rounded-full bg-[var(--ph4-ok-dot)] text-[var(--ph4-ok-dot)]"
              />
              {text(copy.pill, en)}
            </span>

            <SplitHeading
              id="ph4-hero-title"
              as="h1"
              text={copy.lead}
              accent={copy.accent}
              size="display-hero"
              motion="hero"
              className="text-[clamp(3rem,8vw,5.5rem)] text-white"
            />

            <p
              data-ph4-hero-item
              className="max-w-[42rem] text-[1.125rem] leading-[1.65] text-white/80 sm:text-[1.25rem]"
            >
              {text(copy.sub, en)}
            </p>

            {/* Real destinations: the draft hero previously faked an email
                capture whose submit went nowhere. */}
            <div
              data-ph4-hero-item
              className="flex w-full flex-wrap items-center justify-center gap-3"
            >
              <Action
                href="https://chat.cekat.ai/register"
                variant="invert"
                className="h-13 px-7"
                arrow={true}
              >
                {en ? "Start free 14 days" : "Coba gratis 14 hari"}
              </Action>
              <Action
                href={en ? "/en/contact-sales" : "/contact-sales"}
                variant="ghost-invert"
                className="h-13 px-7"
                arrow={true}
              >
                {en ? "Talk to sales" : "Hubungi sales"}
              </Action>
            </div>

            <p
              data-ph4-hero-item
              className="ph4-mono text-[0.625rem] text-white/60"
            >
              {text(copy.note, en)}
            </p>
          </div>

          {/* ---- proof strip pinned to the photo ---- */}
          <dl
            data-ph4-hero-item
            className="mx-auto grid max-w-[64rem] gap-px overflow-hidden rounded-[var(--ph4-r-md)] border border-white/15 bg-white/15 backdrop-blur-md sm:grid-cols-3"
          >
            {copy.stats.map((stat) => (
              <div
                key={stat.label.id}
                className="bg-[#0b1220]/55 px-6 py-6 text-center"
              >
                <dd
                  data-ph4-count={text(stat.value, en)}
                  className="ph4-display ph4-num text-[clamp(1.75rem,3vw,2.5rem)] text-white"
                >
                  {text(stat.value, en)}
                </dd>
                <dt className="mx-auto mt-1.5 max-w-[16rem] text-[0.75rem] leading-[1.5] text-white/65">
                  {text(stat.label, en)}
                </dt>
              </div>
            ))}
          </dl>

          <ul
            data-ph4-hero-item
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-4"
          >
            {[
              "ISO 9001 & 27001",
              en ? "Official Meta Business Partner" : "Partner resmi Meta",
              "UU PDP",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[0.8125rem] font-medium text-white/75"
              >
                <Ico
                  icon={solar_check_circle_bold}
                  size={14}
                  className="text-[var(--ph4-ok-dot)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </Shell>
      </Section>
    </div>
  );
}
