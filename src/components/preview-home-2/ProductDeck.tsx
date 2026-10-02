"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Band, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Below this width the fanned stack becomes a horizontal snap carousel — the
 * same switch /preview-home makes at 960px. Kept in JS (not just CSS) because
 * the collapsed panels are `inert`, and `inert` is a DOM property: in the
 * carousel every card must be open and reachable, which CSS cannot decide.
 *
 * Must stay in sync with the `.ph2-deck-*` breakpoint in preview-home-2.css.
 */
const CAROUSEL = "(max-width: 1023px)";

function useCarouselLayout() {
  const [carousel, setCarousel] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(CAROUSEL);
    const sync = () => setCarousel(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return carousel;
}

/**
 * Product deck — preview-home's fanned "pillars" cards, reimplemented in React.
 *
 * The original moved DOM nodes with `appendChild()` on click, which silently
 * reorders the tab sequence, and sized the stack with a JS height tracker. Here
 * the order is state, each header is a real `aria-expanded` button, and the
 * collapsed panels are `inert`, so a closed card is neither announced nor
 * tabbable.
 *
 * Two layouts, one set of cards:
 *   • `lg+` — the fan (see `.ph2-deck-*` in preview-home-2.css). `--ph2-pos`
 *     runs 0 (furthest back) → 3 (front); the CSS derives the 32px vertical
 *     step, the 10% width step and the z-order from it, and lifts a recessed
 *     card on hover.
 *   • below `lg` — a full-bleed horizontal snap carousel, one card per screen,
 *     all expanded. Collapsing cards on a phone would mean the copy is only
 *     reachable behind a tap on a 420px-wide strip.
 */
export function ProductDeck({ content }: { content: HomeContent["deck"] }) {
  const items = content.items;
  const carousel = useCarouselLayout();
  /**
   * Rendered order, back to front. Reversed to start, so the first content
   * item is the open one — same as /preview-home, which renders a reversed
   * list and marks `items[0]` open.
   */
  const [order, setOrder] = useState<number[]>(() =>
    items.map((_, index) => index).reverse(),
  );
  const front = order[order.length - 1];

  const promote = (index: number) =>
    setOrder((previous) => [...previous.filter((i) => i !== index), index]);

  return (
    <Band tone="white" labelledBy="ph2-deck-title" defer>
      <Shell>
        <SectionHead
          id="ph2-deck-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />
        {/* Only meaningful while the cards collapse into one another. */}
        <p className="mt-3 hidden text-sm text-[#64748B] lg:block">
          {content.hint}
        </p>

        <div className="ph2-deck-stack">
          {order.map((itemIndex, position) => {
            const item = items[itemIndex];
            const isFront = itemIndex === front;
            // In the carousel every card is its own front, so nothing is
            // recessed and nothing collapses.
            const expanded = carousel || isFront;

            return (
              <article
                key={item.title}
                /**
                 * The only per-card input the fan reads — and it is the
                 * position in the rendered order, *not* the distance from the
                 * end. Position 0 sits furthest back (narrowest, highest,
                 * lowest z-index); the last position is the front card
                 * (widest, 32px lower, on top). Inverting this puts the open
                 * card behind the closed ones.
                 */
                style={{ "--ph2-pos": position } as React.CSSProperties}
                className={cn(
                  "ph2-deck-card",
                  !carousel && isFront && "ph2-front",
                )}
              >
                <h3>
                  <button
                    type="button"
                    // Collapsed panels are inert below lg, so the trigger is
                    // not a real control there — it must not read as one.
                    aria-expanded={carousel ? undefined : isFront}
                    aria-controls={`ph2-deck-panel-${itemIndex}`}
                    tabIndex={carousel ? -1 : undefined}
                    onClick={() => promote(itemIndex)}
                    className="ph2-deck-head"
                  >
                    <span
                      aria-hidden
                      className="ph2-deck-dot"
                      style={{ background: item.accent }}
                    />
                    <span className="ph2-deck-label">{item.title}</span>
                    {/* The +/- affordance only exists while the card collapses. */}
                    {carousel ? null : (
                      <span
                        aria-hidden
                        className="ml-auto text-xs font-semibold text-[#64748B]"
                      >
                        {isFront ? "−" : "+"}
                      </span>
                    )}
                  </button>
                </h3>

                <div
                  id={`ph2-deck-panel-${itemIndex}`}
                  inert={carousel ? undefined : !isFront}
                  className={cn("ph2-deck-body", expanded && "ph2-open")}
                >
                  <div className="ph2-deck-inner">
                    <div>
                      <h4 className="ph2-deck-title">{item.headline}</h4>
                      <p className="ph2-deck-text">{item.body}</p>
                      {/*
                        Feature checklist, not wrapped pills: each point gets a
                        check in the card's own accent, so the list reads as
                        "what's inside" rather than decoration.
                      */}
                      <ul className="ph2-deck-checks">
                        {item.points.map((point) => (
                          <li key={point}>
                            <span aria-hidden className="ph2-deck-check">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                                stroke={item.accent}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 3 4.5 9 2 6.5" />
                              </svg>
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={item.cta.href}
                        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                      >
                        {item.cta.label}
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                        >
                          →
                        </span>
                      </Link>
                    </div>

                    {/**
                     * Square, because the four deck screenshots are 980×980.
                     * Forcing 4:3 here crops them *and* costs ~127px of card
                     * height, which left the open card 126px short of
                     * /preview-home's and left dead space inside the 700px
                     * stack box.
                     *
                     * `sizes` is the whole story for these four images. They are
                     * 980×980 sources, so without it Next offers `w=3840` — an
                     * upscale, and four of them on a page that only ever shows
                     * one card at a time. The card is full-bleed on a phone and
                     * half a two-column grid from `lg`, and the Shell's own
                     * `px-5 sm:px-8 lg:px-10` is subtracted rather than ignored,
                     * so the browser picks a source that matches what it paints.
                     */}
                    <div className="ph2-deck-media aspect-square">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 1023px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 4rem), 520px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Shell>
    </Band>
  );
}
