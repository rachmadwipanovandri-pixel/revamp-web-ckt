"use client";

import { useEffect, useState } from "react";
import { Ico } from "./Icon";
import { solar_check_circle_bold, solar_user_rounded_bold } from "./icons";
import { HERO_CHATS } from "./content";

/**
 * The hero's live conversation.
 *
 * A product mock that sits still reads as a screenshot; one that types, waits,
 * and answers reads as a product. So the exchange plays: the customer's message
 * lands, a typing indicator appears, the AI answers with the source it used, and
 * the whole thing resets to the next customer.
 *
 * Two things this deliberately does *not* do:
 *
 *   - It is not an `aria-live` region. A conversation that replays itself every
 *     few seconds would interrupt a screen-reader user forever, and nothing here
 *     is new information after the first read.
 *
 *   - It never removes text from the DOM. Every turn is always in the markup and
 *     only its opacity and offset change. That way assistive tech has the whole
 *     exchange available immediately, and a visitor who never sees the animation
 *     — reduced motion, a stalled script, a crawler — still gets the full
 *     conversation. The animation is decoration over real content, never a gate
 *     on it.
 *
 * Under `prefers-reduced-motion` nothing is scheduled at all: the first exchange
 * is rendered complete, in its final state, and stays there.
 */

/**
 * Beat offsets in ms from the start of one exchange.
 *
 * Four turns, not two. The complaint that started this was that the loop looked
 * thin — a question and an answer, then nothing — and it was true: the exchange
 * ended before the product did anything. So each conversation now runs to a
 * follow-up and closes on an action, which is the claim the page is actually
 * making. A link sent, an order created, a delivery rescheduled.
 *
 * The whole thing must finish inside the window's view dwell (`DWELL` in
 * HeroWindow3), or the rotation cuts the last turn off before its note appears.
 * It was 6s against a 5.4s cycle when first written; it is now 10.4s against an
 * 11s dwell, which leaves 600ms of slack and a full second of readable hold after
 * the final action lands.
 */
const BEAT = {
  visitor: 0,
  typing: 700,
  reply: 1900,
  note: 2500,
  followUp: 4600,
  typingAgain: 5600,
  confirm: 6800,
  action: 7400,
  /** Exchange is complete; hold it, then move to the next customer. */
  reset: 10400,
};

export function ChatPlayback({
  isEn,
  paused,
  reduced,
}: {
  isEn: boolean;
  /** Shared with the window's pause control, so one button stops everything. */
  paused: boolean;
  reduced: boolean;
}) {
  const [chat, setChat] = useState(0);
  // Starts complete, so the very first frame already shows a full exchange
  // rather than an empty panel waiting for a timer.
  const [beat, setBeat] = useState(BEAT.reset);

  useEffect(() => {
    if (reduced || paused) return;

    // `setTimeout` rather than rAF or GSAP: this is a discrete script with long
    // beats, not a scroll-linked sequence, and it must not depend on the
    // animation ticker that `Motion3` owns.
    const timers = [
      window.setTimeout(() => setBeat(BEAT.visitor), 60),
      window.setTimeout(() => setBeat(BEAT.typing), BEAT.typing),
      window.setTimeout(() => setBeat(BEAT.reply), BEAT.reply),
      window.setTimeout(() => setBeat(BEAT.note), BEAT.note),
      window.setTimeout(() => setBeat(BEAT.followUp), BEAT.followUp),
      window.setTimeout(() => setBeat(BEAT.typingAgain), BEAT.typingAgain),
      window.setTimeout(() => setBeat(BEAT.confirm), BEAT.confirm),
      window.setTimeout(() => setBeat(BEAT.action), BEAT.action),
      window.setTimeout(() => {
        setChat((current) => (current + 1) % HERO_CHATS.length);
        setBeat(BEAT.visitor);
      }, BEAT.reset),
    ];

    return () => timers.forEach(window.clearTimeout);
  }, [chat, paused, reduced]);

  const current = HERO_CHATS[chat];
  /*
   * Reduced motion or paused lands on the complete exchange rather than freezing
   * mid-conversation.
   *
   * Derived, not stored. Writing `BEAT.reset` back with a `setState` in the
   * effect body was a synchronous setState on pause — an extra render pass to
   * arrive at a value already known at render time, which is the cascading
   * render `react-hooks/set-state-in-effect` warns about.
   */
  const shown = reduced || paused ? BEAT.reset : beat;
  const showVisitor = shown >= BEAT.visitor;
  const showTyping = shown >= BEAT.typing && shown < BEAT.reply;
  const showReply = shown >= BEAT.reply;
  const showNote = shown >= BEAT.note;
  const showFollowUp = shown >= BEAT.followUp;
  const showTypingAgain = shown >= BEAT.typingAgain && shown < BEAT.confirm;
  const showConfirm = shown >= BEAT.confirm;
  const showAction = shown >= BEAT.action;

  return (
    <div className="flex h-full flex-col px-4 py-4">
      <div className="flex items-center gap-2.5 border-b border-[var(--ph3-line)] pb-3">
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] bg-[var(--ph3-surface)] text-[var(--ph3-muted-3)]"
        >
          <Ico icon={solar_user_rounded_bold} size={14} />
        </span>
        <p className="min-w-0 truncate text-[0.8125rem] font-medium text-[var(--ph3-ink)]">
          {current.who}
        </p>
        <span className="ph3-mono ml-auto shrink-0 text-[0.5625rem]">
          {isEn ? current.channelEn : current.channel}
        </span>
      </div>

      {/*
        The exchange. `aria-live` is deliberately absent — see the note above.

        The column is bottom-aligned with a reserved height rather than a fixed
        one: four bubbles of bilingual copy at two-thirds width wrap to
        different heights, and a hard `min-h` sized for the short Indonesian
        text overflowed the panel the moment the English wrapped to three lines —
        which pushed the stat strip down and jumped the whole window. Reserving
        for the worst case keeps every view the same height, and the strip below
        never moves.
      */}
      <div className="flex min-h-[16.5rem] flex-col justify-end gap-2 pt-3">
        <p
          className={`ph3-bubble ph3-bubble-in max-w-[88%] self-start ${showVisitor ? "is-in" : ""}`}
        >
          {isEn ? current.turns[0].textEn : current.turns[0].text}
        </p>

        {showTyping ? (
          <p
            aria-hidden
            className="ph3-bubble ph3-bubble-in max-w-[60%] self-end"
          >
            <span className="ph3-typing">
              <span />
              <span />
              <span />
            </span>
          </p>
        ) : null}

        <div
          className={`ph3-bubble ph3-bubble-ai max-w-[92%] self-end ${showReply ? "is-in" : ""}`}
        >
          {isEn ? current.turns[1].textEn : current.turns[1].text}
          {showNote ? (
            <span className="ph3-grounded flex items-center gap-1.5">
              <Ico icon={solar_check_circle_bold} size={12} />
              {isEn ? current.turns[1].noteEn : current.turns[1].note}
            </span>
          ) : null}
        </div>

        {showFollowUp ? (
          <p
            className={`ph3-bubble ph3-bubble-in max-w-[88%] self-start ${showFollowUp ? "is-in" : ""}`}
          >
            {isEn ? current.turns[2].textEn : current.turns[2].text}
          </p>
        ) : null}

        {showTypingAgain ? (
          <p
            aria-hidden
            className="ph3-bubble ph3-bubble-in max-w-[60%] self-end"
          >
            <span className="ph3-typing">
              <span />
              <span />
              <span />
            </span>
          </p>
        ) : null}

        {showConfirm ? (
          <div
            className={`ph3-bubble ph3-bubble-ai max-w-[92%] self-end ${showConfirm ? "is-in" : ""}`}
          >
            {isEn ? current.turns[3].textEn : current.turns[3].text}
            {showAction ? (
              <span className="ph3-grounded flex items-center gap-1.5">
                <Ico icon={solar_check_circle_bold} size={12} />
                {isEn ? current.turns[3].noteEn : current.turns[3].note}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}