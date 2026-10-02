import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimGate } from "./AnimGate";
import { Band, SectionHead, Shell } from "./ui";
import type { HomeContent, LoveCard } from "./types";

/** Per-column drift speed; adjacent columns use opposite directions. */
const SPEEDS = ["48s", "58s", "52s", "64s"];

function TestimonialCard({
  card,
  className,
}: {
  card: LoveCard;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-[18px] border border-border bg-white p-5 shadow-[0_1px_2px_rgba(11,18,32,0.04)]",
        className,
      )}
    >
      <blockquote className="text-[0.9rem] leading-[1.6] text-[#101828]">
        “{card.quote}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {card.avatar ? (
          /*
            The avatars are 780×780 source photos painted into a 40px circle, and
            the wall renders every card twice to make the drift loop seamless.
            `sizes` is therefore the whole job: without it Next offers `w=256`
            for a 40px box at DPR 1 and `w=384` at DPR 2 — 4–10× the pixels the
            browser needs, on an image that is a decorative face next to the
            name it duplicates. Declared at its true rendered size, the same
            sources resolve to 64w/128w.
          */
          <Image
            src={card.avatar}
            alt=""
            width={80}
            height={80}
            sizes="40px"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold text-white"
            style={{ background: card.accent }}
          >
            {card.initials}
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[0.85rem] font-bold text-[#101828]">
            {card.name}
          </span>
          <span className="block text-[0.75rem] leading-[1.35] text-[#64748B]">
            {card.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Testimonial wall — four drifting columns, ported from preview-home's dark
 * "love" band into the light palette.
 *
 * Fixes the responsive hole in the original, which hid three of four columns on
 * a phone: below `md` the drift stops, the mask lifts, the duplicated half is
 * removed, and the wall unfolds into a plain list of every testimonial.
 *
 * Deliberately NOT `defer`red (see `Band`): the drift is
 * `translateY(-50%)` of the column's own measured height, and each column is
 * `[...column, ...column]` — so the loop is only seamless because the duplicate
 * is exactly half of what is laid out. Under `content-visibility` the band's
 * height is a `contain-intrinsic-size` guess until it first scrolls in, and the
 * animation would resolve its percentage against that guess. The other bands on
 * this page are static flow content and defer safely; this one is not.
 */
export function LoveWall({ content }: { content: HomeContent["love"] }) {
  return (
    <Band tone="wash" labelledBy="ph2-love-title" className="overflow-hidden">
      <Shell>
        <SectionHead
          id="ph2-love-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
          align="center"
        />

        <AnimGate className="ph2-love-wrap mt-12">
          <div className="ph2-love-mask ph2-love-viewport h-[560px] overflow-hidden">
            <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4">
              {content.columns.map((column, columnIndex) => {
                const up = columnIndex % 2 === 0;
                return (
                  <div
                    key={columnIndex}
                    className={cn(
                      "ph2-love-col ph2-anim flex h-max flex-col gap-4 self-start",
                      up ? "ph2-love-up" : "ph2-love-down",
                    )}
                    style={
                      {
                        "--ph2-spd": SPEEDS[columnIndex % SPEEDS.length],
                      } as CSSProperties
                    }
                  >
                    {[...column, ...column].map((card, index) => (
                      <TestimonialCard
                        key={`${card.name}-${index}`}
                        card={card}
                        className={
                          index >= column.length ? "ph2-love-dupe" : undefined
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimGate>
      </Shell>
    </Band>
  );
}
