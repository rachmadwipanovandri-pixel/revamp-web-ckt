import { text } from "./content-types";
import { Eyebrow, Section, Shell, SplitHeading } from "./ui";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import Image from "next/image";
import type { Copy4 } from "./content-types";
export function Proof4({
  copy,
  locale,
}: {
  copy: Copy4["proof"];
  locale: string;
}) {
  const en = locale === "en";
  const logos = [...TRUSTED_LOGOS.slice(0, 12), ...TRUSTED_LOGOS.slice(0, 12)];
  return (
    <Section tone="surface" rule={true} labelledBy="ph4-proof-title">
      <Shell>
        <div
          data-ph4-split={true}
          className="flex flex-col items-center gap-3 text-center"
        >
          <Eyebrow>
            <span className="ph4-mono mr-3 text-[0.625rem]">06</span>
            {text(copy.logosLabel, en)}
          </Eyebrow>
          <SplitHeading
            id="ph4-proof-title"
            as="h2"
            text={copy.heading}
            size="display-2"
            className="max-w-[40rem] text-[clamp(1.5rem,3.2vw,2.25rem)]"
          />
        </div>
        <dl
          data-ph4-stagger={true}
          className="mt-10 grid gap-px overflow-hidden rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-line)] sm:grid-cols-3"
        >
          {copy.stats.map((stat) => (
            <div
              key={text(stat.label, en)}
              className="flex flex-col bg-[var(--ph4-white)] px-6 py-8 text-center"
            >
              <dd
                data-ph4-count={text(stat.value, en)}
                className="ph4-display ph4-num text-[clamp(2.25rem,4.4vw,3.25rem)]"
              >
                {text(stat.value, en)}
              </dd>
              <dt className="mx-auto mt-2.5 max-w-[16rem] text-[0.875rem] leading-[1.5] text-[var(--ph4-muted)]">
                {text(stat.label, en)}
              </dt>
            </div>
          ))}
        </dl>
        <div
          data-ph4-enter={true}
          className="ph4-logo-mask mt-12 overflow-hidden"
        >
          <div className="ph4-logo-track flex w-max items-center gap-14 pr-14">
            {logos.map((logo, index) => (
              <span
                key={`${logo.alt}-${index}`}
                className="flex h-10 shrink-0 items-center"
                aria-hidden={index >= TRUSTED_LOGOS.slice(0, 12).length}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height} // Each mark paints into a 28px box while the natural widths
                  // run to 160px, so without a `sizes` hint Next offers w=384
                  // for a 28px asset. The strip duplicates the set to loop, so
                  // that would be twenty-four requests for twelve files.
                  sizes="28px"
                  className="h-9 w-auto object-contain opacity-65 grayscale"
                />
              </span>
            ))}
          </div>
        </div>
        <p
          data-ph4-enter={true}
          className="mt-6 text-center text-[0.8125rem] text-[var(--ph4-muted-3)]"
        >
          {text(copy.logosNote, en)}
        </p>
      </Shell>
    </Section>
  );
}
