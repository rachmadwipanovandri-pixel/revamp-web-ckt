"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AnimGate } from "./AnimGate";
import { Eyebrow, Shell } from "./ui";
import { cn } from "@/lib/utils";
import type { Founder, Founders } from "./types";

/**
 * Founder stories — fun.xyz's "Trusted by founders on the frontier", rebuilt on
 * this page's light-dark ground.
 *
 * The interaction is the part worth copying, and it is not a carousel of equal
 * cards. On desktop the rail is one flex row where a single slide is **active**
 * and grows to fill while the others collapse to narrow slivers:
 *
 * - The active slide is the story: poster, name, role, company.
 * - A sliver is a promise: a cropped slice of the same poster and nothing else.
 *   Clicking it promotes it — the row re-flows, the previous
 *   active slide collapses back into a sliver, and no card ever changes
 *   position, so the eye never has to find the thing it was reading.
 * - Growth is animated on `flex-grow`, not on `width`, so the slivers absorb the
 *   leftover space instead of the whole row snapping as one slide resizes.
 * - A slide's whole surface is one button that does the mode-appropriate thing:
 *   promote it when it is a sliver, play it when it is already open. That is
 *   the same rule fun.xyz applies with a width check, and doing it from state
 *   rather than from a breakpoint means the touch and mouse paths cannot
 *   disagree with what is painted.
 *
 * Below `lg` the same markup becomes a scroll-snap carousel, one card per
 * screen, which is the only shape that survives a 360px viewport. Both modes
 * share one `active` index, so the story you are on is the story on both.
 *
 * On video: these are YouTube interviews, so a card shows the video's own
 * thumbnail and nothing plays until it is asked for. fun.xyz loops four muted
 * background videos here; four talking heads looping at once is a wall of noise,
 * and it would also pull the YouTube player into this page's initial load. The
 * player itself mounts only while the dialog is open.
 */
export function Founders({ content }: { content: Founders }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Founder | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const total = content.items.length;

  /**
   * Promoting a slide has to work in both modes, and they scroll differently:
   * on desktop `active` alone re-flows the flex row; below `lg` the row is a
   * scroll container, so the card also has to be brought into view. `nearest`
   * plus `inline: center` keeps a desktop press from scrolling the page.
   */
  const goTo = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), total - 1);
      setActive(next);
      const card = railRef.current?.querySelectorAll<HTMLElement>(
        "[data-founder-card]",
      )[next];
      // Feature-detected rather than assumed: `goTo` runs from a click handler,
      // and on desktop there is nothing to scroll — the row re-flows around the
      // active slide instead. An unguarded call would throw in any environment
      // that does not implement it and take the click down with it.
      if (typeof card?.scrollIntoView === "function") {
        card.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    },
    [total],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section
      aria-labelledby="ph2-founders-title"
      className="relative overflow-hidden bg-[#0B1220] py-20 text-white md:py-28"
    >
      <Shell>
        <div className="flex flex-col gap-6 min-[992px]:flex-row min-[992px]:items-end min-[992px]:justify-between">
          <div className="max-w-2xl">
            <Eyebrow tone="light">{content.eyebrow}</Eyebrow>
            <h2
              id="ph2-founders-title"
              className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.12] font-bold tracking-[-0.03em] text-balance"
            >
              {content.heading}
            </h2>
            <p className="mt-4 text-[1rem] leading-[1.65] text-white/60">
              {content.body}
            </p>
          </div>

          <nav
            aria-label={content.pager}
            // Arrows drive the cascade, which only exists from 992px. Below it the
            // dots would be the only control, so they move into the track instead
            // of appearing beside a heading that has no room for them.
            className="hidden shrink-0 items-center gap-4 min-[992px]:flex"
          >
            <RailButton
              direction={-1}
              label={content.previous}
              disabled={active === 0}
              onPress={() => goTo(active - 1)}
            />
            <ol className="flex items-center gap-1.5">
              {content.items.map((founder, index) => (
                <li key={founder.yt}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={index === active ? "true" : undefined}
                    aria-label={`${content.pager}: ${founder.name}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === active
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/25 hover:bg-white/50",
                    )}
                  />
                </li>
              ))}
            </ol>
            <RailButton
              direction={1}
              label={content.next}
              disabled={active === total - 1}
              onPress={() => goTo(active + 1)}
            />
          </nav>
        </div>
      </Shell>

      <AnimGate>
        <div
          ref={railRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={content.pager}
          tabIndex={0}
          onKeyDown={onKeyDown}
          // `min-[992px]` rather than `lg` on every rule in this section: the
          // cascade is defined in `preview-home-2.css` at 992px (fun.xyz's own
          // breakpoint), and Tailwind's `lg` is 1024px. A track that stops
          // scrolling at 1024px while the cards start growing at 992px gives you
          // a 32px band where the row is neither a carousel nor a cascade.
          className="ph2-rail-track mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:gap-4 sm:px-8 min-[992px]:mt-14 min-[992px]:snap-none min-[992px]:gap-4 min-[992px]:overflow-x-visible min-[992px]:px-10"
        >
          {content.items.map((founder, index) => (
            <FounderSlide
              key={founder.yt}
              founder={founder}
              index={index}
              total={total}
              active={index === active}
              content={content}
              onActivate={() => goTo(index)}
              onPlay={() => setOpen(founder)}
            />
          ))}
        </div>
      </AnimGate>

      {open ? (
        <FounderDialog
          founder={open}
          closeLabel={content.close}
          channelLabel={content.channel}
          onClose={close}
        />
      ) : null}
    </section>
  );
}

function RailButton({
  direction,
  label,
  disabled,
  onPress,
}: {
  direction: 1 | -1;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200",
        disabled
          ? "cursor-default border-white/10 text-white/25"
          : "border-white/20 text-white/70 hover:border-white/45 hover:text-white",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <path
          d={direction === 1 ? "M4 2l5 5-5 5" : "M10 2L5 7l5 5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function FounderSlide({
  founder,
  index,
  total,
  active,
  content,
  onActivate,
  onPlay,
}: {
  founder: Founder;
  index: number;
  total: number;
  active: boolean;
  content: Founders;
  onActivate: () => void;
  onPlay: () => void;
}) {
  return (
    <article
      data-founder-card
      data-active={active ? "true" : "false"}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      className={cn(
        "ph2-rail-card relative h-[380px] w-[84vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-[20px] border border-white/10",
        "sm:h-[420px]",
        // From 992px up this becomes the cascading row: `flex-basis: 0` hands all
        // sizing to `flex-grow`, and the widths above are overridden so the card
        // is sized purely by its share of the row. Growth, hover, the poster's
        // counter-scale and the content timing all live in `preview-home-2.css`
        // under the same 992px breakpoint — the breakpoint matches fun.xyz so the
        // two layouts hand over at the same width, and keeping it in one file is
        // what stops the grow and the fades drifting onto different clocks.
        "min-[992px]:h-[460px] min-[992px]:w-auto min-[992px]:max-w-none min-[992px]:shrink min-[992px]:basis-0 min-[992px]:grow",
      )}
    >
      {/*
        One control for the whole slide, and it is a real button rather than a
        click handler on a div so the rail is reachable by keyboard. Its label
        says which of the two jobs it will do, so a screen reader is not asked
        to guess whether a tap promotes or plays.
      */}
      <button
        type="button"
        onClick={active ? onPlay : onActivate}
        aria-label={
          active
            ? `${content.play}: ${founder.name}, ${founder.company}`
            : `${content.show}: ${founder.name}`
        }
        className="absolute inset-0 h-full w-full cursor-pointer"
      >
        <Image
          // Derived from the video id, so a reel can never show the wrong face.
          src={`https://i.ytimg.com/vi/${founder.yt}/maxresdefault.jpg`}
          alt=""
          fill
          loading="lazy"
          /*
           * `maxresdefault.jpg` is 1280×720, so anything wider is an upscale.
           * What matters more is the mobile half: below 992px these cards are
           * 84vw in a scroll-snap carousel, one filling most of the screen, so
           * `sizes` has to say that rather than a nominal `100vw` — otherwise a
           * DPR-3 phone pulls a source sized for a desktop card. From 992px it is
           * the cascade, whose open card is ~62% of a 1400px row.
           */
          sizes="(max-width: 991px) 84vw, 62vw"
          // The scale that counteracts the frame resizing is in the stylesheet,
          // on the same 300ms clock as the grow — a longer transition here would
          // outlive the card's own movement and read as a separate, slower action.
          className="object-cover"
        />
        {/*
          The scrim. Its opacity is in the stylesheet on the cascade's clock,
          because it is part of the same gesture: an open card needs the full
          gradient to keep white text legible over a bright poster, and a
          collapsed card needs almost none of it or the face behind the glass
          disappears and the sliver becomes a grey slab.
        */}
        <span
          aria-hidden
          className="ph2-rail-scrim absolute inset-0 bg-linear-to-t from-[#0B1220] via-[#0B1220]/55 to-[#0B1220]/10"
        />

        {/*
          Nothing else goes on a collapsed card.

          fun.xyz fills its slivers with the company's mark. We do not have those
          logos, and every substitute tried here — initials, then the company
          name set vertically — was worse than the empty sliver: a mark the
          visitor cannot read competes with the poster for attention, and
          vertical text in a 60px column is not text anyone reads.

          The cropped face is the affordance. It is a real person from the same
          set as the open card, so the row reads as four stories waiting rather
          than four empty panels, and the hover growth below is what says the
          sliver is a control.
        */}
      </button>

      {/*
        Story state, outside the button and non-interactive, so the name never
        sits inside the tap target's text. The 400ms delay matches fun.xyz: the
        slide finishes growing before its label finishes arriving.
      */}
      <div
        data-founder-story
        aria-hidden={active ? undefined : "true"}
        className="pointer-events-none absolute inset-x-0 bottom-0 p-5 opacity-100 sm:p-6"
      >
        <p className="text-[1.05rem] font-bold tracking-[-0.02em]">
          {founder.name}
        </p>
        <p className="mt-1 text-[0.82rem] text-white/60">{founder.role}</p>
        <p className="mt-2 text-[0.82rem] font-semibold text-white/40">
          {founder.company}
        </p>
      </div>
    </article>
  );
}

/**
 * The player.
 *
 * The iframe only exists while the dialog is open, which is the entire point:
 * YouTube's player is roughly a megabyte of JavaScript, and a page that keeps
 * it out of the initial load keeps its score. `youtube-nocookie` sets no
 * tracking cookies until the frame is actually played.
 */
function FounderDialog({
  founder,
  closeLabel,
  channelLabel,
  onClose,
}: {
  founder: Founder;
  closeLabel: string;
  channelLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Scroll lock, matching Nav: body overflow alone does not stop Lenis.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__ph2Lenis?.stop();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.__ph2Lenis?.start();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={founder.name}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1220]/92 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-black shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${founder.yt}?autoplay=1&rel=0`}
            title={founder.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.9rem] text-white/80">
            <span className="font-semibold text-white">{founder.name}</span>
            <span className="text-white/50"> · {founder.role}</span>
          </p>
          <div className="flex items-center gap-2">
            {/*
              fun.xyz drops its "Learn more" affordance under 991px rather than
              wrapping it, because a text button on a phone-width footer row
              competes with the close control instead of sitting beside it. The
              video is already open here, so the link is a convenience, not the
              way out.
            */}
            <a
              href={`https://www.youtube.com/watch?v=${founder.yt}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-[0.75rem] font-semibold text-white/75 transition-colors duration-200 hover:border-white/45 hover:text-white max-[991px]:hidden"
            >
              {channelLabel}
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/75 transition-colors duration-200 hover:border-white/45 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}