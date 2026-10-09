import Image from "next/image";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { Figure, Section, Shell } from "./ui";
import type { Copy3 } from "./content";

/**
 * Corrected intrinsic sizes for two entries in the shared `TRUSTED_LOGOS` list.
 *
 * The shared list declares `160×24` for Sekolah Ciputra; the file is actually
 * `578×87` (ratio 6.64, not 6.67). `next/image` emits those numbers as
 * `width`/`height` attributes and compares them against the rendered box, so the
 * mismatch is what produced the dev warning "has either width or height
 * modified, but not the other" — the fixed 24px height forced the width to round
 * to 158 against a declared 160.
 *
 * These are asserted from the real file headers (PNG `IHDR`, JPEG `SOFn`), not
 * guessed. The override lives here rather than in the shared module on purpose:
 * `TRUSTED_LOGOS` is also rendered by preview-home and preview-home-2, and this
 * draft must not change what those routes produce.
 */
const INTRINSIC: Record<string, { width: number; height: number }> = {
  "/images/home/logos/sekolah-ciputra.jpeg": { width: 578, height: 87 },
};

/**
 * Social proof, above the fold but outside the hero.
 *
 * Two changes from the old strip: the logos sit at a readable opacity instead of
 * being pushed through a heavy `contrast(0.35) brightness(0.35)` filter — a
 * strip that darkens its own proof reads as hiding it — and the figures are
 * left-aligned in ruled cells with monospace captions, the way a spec sheet sets
 * numbers rather than three centred stat cards.
 */
export function ProofStrip3({ copy }: { copy: Copy3["proof"] }) {
  return (
    <Section
      rule
      labelledBy="ph3-proof-heading"
      className="py-12 sm:py-14"
      id="proof"
    >
      <Shell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div data-ph3-enter>
            <p id="ph3-proof-heading" className="ph3-mono text-[0.625rem]">
              {copy.heading}
            </p>
          </div>

          <div data-ph3-enter>
            <div
              className="ph3-logo-mask -my-2 overflow-hidden"
              aria-label="Trusted brands"
            >
              <div className="ph3-logo-track flex w-max items-center gap-12 py-2">
                {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, index) => {
                  const intrinsic = INTRINSIC[logo.src] ?? {
                    width: logo.width,
                    height: logo.height,
                  };
                  return (
                    <span
                      key={`${logo.src}-${index}`}
                      aria-hidden={index >= TRUSTED_LOGOS.length || undefined}
                      className="flex h-6 shrink-0 items-center"
                    >
                      {/*
                        Both axes are set together through `style`.

                        `next/image` writes `width`/`height` attributes from the
                        props, and its dev check compares the *rendered* box
                        against them — warning when exactly one axis differs.
                        `height: 100%` with `width: auto` scales both from the
                        intrinsic ratio, so the row keeps a fixed height whether
                        a logo is portrait (PLN) or letterboxed (Siloam).
                      */}
                      <Image
                        src={logo.src}
                        alt={index >= TRUSTED_LOGOS.length ? "" : logo.alt}
                        width={intrinsic.width}
                        height={intrinsic.height}
                        sizes="120px"
                        style={{ height: "100%", width: "auto" }}
                        className="object-contain"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <ul
          className="mt-12 grid list-none border-t border-[var(--ph3-line)] sm:grid-cols-3"
          data-ph3-rule
        >
          {copy.stats.map((stat, index) => (
            <li
              key={stat.label}
              className={[
                "py-6 sm:px-6",
                index === 0 ? "sm:pl-0" : "sm:border-l sm:border-[var(--ph3-line)]",
                index > 0 ? "border-t border-[var(--ph3-line)] sm:border-t-0" : "",
              ].join(" ")}
            >
              <Figure value={stat.value} label={stat.label} />
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  );
}