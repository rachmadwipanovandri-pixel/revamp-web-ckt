import Image from "next/image";
import { Section, SectionHead, Shell } from "./ui";
import { CONTEXT_PHOTOS, type ContextPhoto } from "./content";

/**
 * The field band — the product where it is actually used.
 *
 * Every other band on this page is drawn: hairlines, monospace labels, product
 * interface. That is the correct register for a spec sheet and the wrong one for
 * proof, and this is the proof: the same claims the diagrams and the hero window
 * make, shown happening in a warehouse, at a desk, in a car.
 *
 * Layout is deliberately asymmetric. Five equal cells would read as a stock
 * contact sheet, which is exactly what these are not. Instead one frame holds a
 * double cell to anchor the grid, two small ones sit under it, and a single
 * 21:9 strip closes the band — the eye lands on the warehouse first and reads
 * downward.
 *
 * Captions describe the *scene*, never the person. These are illustrative
 * frames, and a caption shaped like a testimonial — a name, a company, a result —
 * would invent a customer who does not exist. So each line says what the work is
 * doing and stops there.
 *
 * Renders nothing while `CONTEXT_PHOTOS` is empty, so an unsourced band never
 * ships as blank rectangles.
 *
 * No `index` on the section head, unlike `Problem` through `Trust`. The band
 * sits in the unnumbered interlude beside `Results`, and numbering it would
 * collide with `Trust` — or force `Trust` and `Faq` to renumber the moment the
 * first photograph lands, which is not a change to make conditional on content.
 */
export function ContextBand3({
  copy,
  locale,
}: {
  copy: { eyebrow: string; heading: string; body: string };
  locale: string;
}) {
  if (CONTEXT_PHOTOS.length === 0) return null;
  const en = locale === "en";

  return (
    <Section id="context" rule labelledBy="ph3-context-title">
      <Shell>
        <SectionHead
          id="ph3-context-title"
          eyebrow={copy.eyebrow}
          title={copy.heading}
          body={copy.body}
        />

        {/*
          `grid-cols-2` below `lg`, not one column. Five 4:3 frames stacked in a
          single column is ~3000px of photographs between the product and the
          next band, which on a tablet is a scroll the visitor gives up on. Two
          up keeps the band to roughly two screens; the asymmetric spans only
          engage once there are four columns to span.

          Heights come from `aspect-ratio` on the frame rather than from
          `auto-rows`, so every cell resolves before the bytes arrive and the
          grid does not reflow as five images land in sequence.
        */}
        <ul
          className="ph3-field mt-12 grid list-none grid-cols-2 gap-4 sm:mt-16 lg:grid-cols-4"
          data-ph3-enter
        >
          {CONTEXT_PHOTOS.map((photo, index) => (
            <FieldFigure
              key={photo.source.href}
              photo={photo}
              en={en}
              index={index}
            />
          ))}
        </ul>
      </Shell>
    </Section>
  );
}

/** How many of the four desktop columns this frame occupies. */
const SPAN: Record<ContextPhoto["span"], string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  4: "lg:col-span-4",
};

/**
 * The wide strip has to span both of the two narrow columns as well, or it sits
 * in one 4:3 cell and the band ends on a square next to a portrait band above.
 */
const WIDE = "col-span-2 lg:col-span-4";

function FieldFigure({
  photo,
  en,
  index,
}: {
  photo: ContextPhoto;
  en: boolean;
  index: number;
}) {
  return (
    <li
      className={`ph3-field-cell ${
        photo.span === 4 ? WIDE : SPAN[photo.span]
      }`}
    >
      <div
        className="ph3-photo relative overflow-hidden"
        style={
          // Inline only for the strip, because at ≥1024px it becomes 21:9 across
          // four columns and the class-based ratios below cannot express that.
          photo.span === 4 ? { aspectRatio: "21 / 9" } : undefined
        }
      >
        <Image
          src={photo.source.href}
          alt={en ? photo.alt.en : photo.alt.id}
          fill
          // Below the fold and not LCP: the hero window is the first viewport's
          // image, and a five-frame band competes for the same connection.
          loading="lazy"
          sizes={
            photo.span === 4
              ? "100vw"
              : photo.span === 2
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 1024px) 25vw, 50vw"
          }
          quality={75}
          className="object-cover"
        />
      </div>

      <div className="mt-2.5 flex items-baseline gap-2.5">
        <span className="ph3-mono shrink-0 text-[0.5625rem] text-[var(--ph3-accent)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="min-w-0 flex-1 text-[0.8125rem] leading-snug text-[var(--ph3-muted)]">
          {en ? photo.caption.en : photo.caption.id}
        </p>
      </div>
    </li>
  );
}