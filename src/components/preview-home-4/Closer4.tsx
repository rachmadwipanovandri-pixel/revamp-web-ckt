import { Ico } from "./Icon";
import { text } from "./content-types";
import { solar_check_circle_bold } from "./icons";
import { Action, Eyebrow, Section, Shell, SplitHeading } from "./ui";
import Image from "next/image";
import type { Copy4 } from "./content-types";
export function Closer4({
  copy,
  locale,
}: {
  copy: Copy4["finalCta"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section
      id="start"
      tone="console"
      rule={true}
      labelledBy="ph4-close-title"
      className="pb-16 sm:pb-20 lg:pb-24"
    >
      {/*
        Ambient closer loop, same pattern as the hero: a muted packing video
        under the navy scrim, poster photo underneath for first paint and
        reduced-motion. Pexels video 7855142 by Kampus Production (free
        license, no attribution required) — hands packing a parcel, no faces,
        so nobody reads as endorsing the product. Trimmed to an 8s loop at
        960w, matching the hero's weight budget.
      */}
      <Image
        src="/videos/ph4-closer-packing-poster.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
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
        <source src="/videos/ph4-closer-packing.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="ph4-hero-photo-scrim" />
      <Shell className="relative">
        <div
          data-ph4-stagger={true}
          className="mx-auto flex max-w-[52rem] flex-col items-center gap-6 text-center"
        >
          <Eyebrow tone="light">{text(copy.eyebrow, en)}</Eyebrow>
          <SplitHeading
            id="ph4-close-title"
            as="h2"
            text={copy.heading}
            accent={copy.accent}
            size="display-hero"
            className="text-[clamp(2.1rem,5.4vw,3.75rem)] text-[var(--ph4-on-console)] [&_span_span]:!text-[var(--ph4-on-console)]"
          />
          <p className="max-w-[38rem] text-[1.0625rem] leading-[1.6] text-[var(--ph4-on-console-2)]">
            {text(copy.body, en)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Action
              href="https://chat.cekat.ai/register"
              variant="invert"
              className="h-12 px-6"
              arrow={true}
            >
              {text(copy.primary, en)}
            </Action>
            <Action
              href={en ? "/en/contact-sales" : "/contact-sales"}
              variant="ghost-invert"
              className="h-12 px-6"
            >
              {text(copy.secondary, en)}
            </Action>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 pt-2">
            {copy.checks.map((check) => (
              <li
                key={text(check, en)}
                className="flex items-center gap-2 text-[0.8125rem] text-[var(--ph4-on-console-2)]"
              >
                <Ico
                  icon={solar_check_circle_bold}
                  size={14}
                  className="shrink-0 text-[var(--ph4-ok-dot)]"
                />
                {text(check, en)}
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
