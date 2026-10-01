import Image from "next/image";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { AnimGate } from "./AnimGate";
import { Band, Shell, Eyebrow } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 3 — proof strip. Metrics are static text (no count-up JS), so they are
 * correct in the first paint, readable by screen readers, and cannot drift into
 * the wrong number locale the way preview-home's `toLocaleString("id-ID")` did
 * on /en.
 */
export function ProofStrip({ content }: { content: HomeContent["proof"] }) {
  const half = TRUSTED_LOGOS.slice(0, 10);
  const loop = [...half, ...half];

  return (
    <Band tone="white" labelledBy="ph2-proof-title" className="py-16 md:py-20">
      <Shell>
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2
            id="ph2-proof-title"
            className="max-w-[38rem] text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.25] font-bold tracking-[-0.02em] text-[#101828]"
          >
            {content.heading}
          </h2>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-[20px] border border-border bg-border sm:grid-cols-3">
          {content.stats.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-8 text-center">
              <dd className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-none font-bold tracking-[-0.035em] text-[#101828] tabular-nums">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </dd>
              <dt className="mx-auto mt-3 max-w-[15rem] text-[0.9rem] leading-[1.5] text-[#4B5563]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        <AnimGate className="mt-12">
          <p className="text-center text-xs font-semibold tracking-[0.16em] text-[#64748B] uppercase">
            {content.logosLabel}
          </p>
          <div className="ph2-ticker-mask ph2-ticker-wrap mt-6 overflow-hidden">
            <div className="ph2-anim ph2-ticker flex w-max items-center gap-14 pr-14">
              {loop.map((logo, index) => {
                const duplicate = index >= half.length;
                return (
                  <span
                    key={`${logo.src}-${index}`}
                    className="flex h-9 items-center"
                    aria-hidden={duplicate || undefined}
                  >
                    <Image
                      src={logo.src}
                      alt={duplicate ? "" : logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className="h-7 w-auto object-contain opacity-65 grayscale"
                    />
                  </span>
                );
              })}
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-[#64748B]">
            {content.logosNote}
          </p>
        </AnimGate>
      </Shell>
    </Band>
  );
}
