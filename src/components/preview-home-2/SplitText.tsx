import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Heading copy split into masked words, for the entrance reveal ported from
 * /preview-home-3 (`SplitHeading` + `Motion3`'s word tween).
 *
 * The structure is the part that makes the effect work: every word sits in an
 * `overflow: hidden` mask, and the animation translates the *inner* span down
 * and out of it, so a word rises into place instead of merely fading. The mask
 * is `padding-bottom`/`negative margin-bottom` rather than a snug box because a
 * tight `overflow: hidden` clips descenders — "Dari Leads Sampai Jadi
 * Pelanggan" would shave the tail off every `g` and `p`.
 *
 * The space between words lives *outside* the mask as a sibling text node. A
 * mask clips trailing whitespace, so a space inside it disappears and every
 * word runs together into one string — visible as `…LeadsSampaiJadi…`.
 *
 * Accessibility is untouched: the accessible name of the heading is still the
 * original string, split only on whitespace, so a screen reader reads one
 * sentence rather than a list of boxes. And nothing is hidden in CSS — the
 * resting state is the finished state, so the heading is complete and readable
 * before any script runs. `TextMotion` is what writes the start transform.
 *
 * `--i` is the word's position in the heading, which is all the stagger needs:
 * `animation-delay: calc(var(--i) * 45ms)` cascades across the line without a
 * single line of JavaScript.
 */
export function SplitText({
  text,
  accent,
  /** Applied to the words in `accent` — colour (and italic, if the face has it). */
  accentClassName = "text-primary italic",
}: {
  /** The heading text. A plain string, because it gets split into words. */
  text: string;
  /** Trailing accent phrase. Kept separate so it can carry the brand colour. */
  accent?: string;
  accentClassName?: string;
}) {
  let index = 0;

  const words = (chunk: string, isAccent: boolean) =>
    chunk
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => {
        const i = index++;
        const style = { "--i": i } as CSSProperties;
        return (
          <Fragment key={`${i}-${token}`}>
            <span className="ph2-word-mask">
              <span data-ph2-word="" style={style} className={cn("ph2-word", isAccent && accentClassName)}>
                {token}
              </span>
            </span>{" "}
          </Fragment>
        );
      });

  return (
    <>
      {words(text, false)}
      {accent ? words(accent, true) : null}
    </>
  );
}
