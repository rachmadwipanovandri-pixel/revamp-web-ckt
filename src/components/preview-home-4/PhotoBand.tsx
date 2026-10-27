import { text } from "./content-types";
import { PHOTOS4 } from "./photos";
import { Eyebrow, Section, Shell, SplitHeading } from "./ui";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Copy4 } from "./content-types";

/** Travel per cell, cycled: identical depth on every frame reads as a slide. */
const TRAVEL = [16, 10, 18, 12, 14];
export function PhotoBand({
  copy,
  locale,
}: {
  copy: Copy4["photos"];
  locale: string;
}) {
  const en = locale === "en";
  return (
    <Section id="field" tone="paper" rule={true} labelledBy="ph4-field-title">
      <Shell>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div
            data-ph4-split={true}
            className="flex max-w-[38rem] flex-col gap-3"
          >
            <Eyebrow>{text(copy.eyebrow, en)}</Eyebrow>
            <SplitHeading
              id="ph4-field-title"
              as="h2"
              text={copy.heading}
              accent={copy.accent}
              size="display-2"
              className="text-[clamp(1.6rem,3.6vw,2.75rem)]"
            />
          </div>
          <p
            data-ph4-enter={true}
            className="max-w-[24rem] text-[0.9375rem] leading-[1.6] text-[var(--ph4-muted)]"
          >
            {text(copy.body, en)}
          </p>
        </div>
        <div
          data-ph4-stagger={true}
          className="ph4-photo-grid mt-10 lg:mt-14"
        >
          {PHOTOS4.map((photo, index) => (
            <figure
              key={photo.source.href}
              className={`ph4-photo-cell ph4-photo-span-${photo.span}`}
              style={{
                aspectRatio: photo.ratio,
              }}
            >
              {/* Depth, not motion for its own sake: the layer carries the
                  scroll-linked translation and the image inside it is scaled
                  past the cell, so the travel never opens a gap at the edge.
                  Two elements because one cannot hold both — the animation
                  owns this transform, the hover zoom owns the image's. */}
              <span
                className="ph4-parallax absolute inset-0"
                style={
                  {
                    "--ph4-parallax-from": `${TRAVEL[index % TRAVEL.length]}px`,
                    "--ph4-parallax-to": `-${TRAVEL[index % TRAVEL.length]}px`,
                  } as CSSProperties
                }
              >
                <Image
                  src={photo.source.href}
                  alt={text(photo.alt, en)}
                  fill
                  // Declared against the rendered cell rather than the
                  // source file: the wide frame paints into a ~1200px slot,
                  // the panorama into a full-width one, and without this
                  // Next offers the 3840 master for all five.
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="scale-[1.09] object-cover"
                />
              </span>
              <figcaption className="ph4-photo-cap">
                {text(photo.caption, en)}
              </figcaption>
            </figure>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
