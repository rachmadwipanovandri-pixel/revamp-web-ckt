"use client";

import { useEffect } from "react";

/**
 * The page's scroll entrances — everything below the hero that arrives rather
 * than simply being there.
 *
 * This is /preview-home-3's `Motion3`, ported: same three effects, same order,
 * same numbers, but driven by IntersectionObserver and CSS keyframes instead of
 * GSAP + ScrollTrigger + Lenis. `Motion3` exists because that page's whole
 * identity is motion and it has a scrubbed hero moment to run; this page is a
 * Server Component tree with a PageSpeed budget (see `SmoothScroll`), and what
 * it needs is one reveal per block — which is a viewport question, not a
 * timeline question.
 *
 * ── What it drives ──────────────────────────────────────────────────────────
 *
 *   `data-ph2-split`  a heading — the block lifts, its words rise out of masks.
 *   `data-ph2-enter`  any other block — cards, rows, stat cells, panels. The
 *                     20px lift and the fade, staggered across the siblings
 *                     that arrive together (`--ph2-i`, written at arm time).
 *   `data-ph2-rule`   a hairline that scales out from its left edge.
 *
 * The split is done on the server by `SplitText`; the keyframes are in
 * preview-home-2.css. The only job left for JavaScript is deciding *when*.
 *
 * ── The contract ───────────────────────────────────────────────────────────
 *
 * The resting CSS state is the finished state. Nothing is hidden until this
 * file has run and decided the block is still ahead of the visitor, so:
 *
 *   - JS off / blocked / crashing → every block is simply visible.
 *   - `prefers-reduced-motion` → this effect returns before arming anything,
 *     and the CSS side re-asserts `opacity: 1` as a second line of defence.
 *   - A block already on screen when hydration lands is left exactly as
 *     rendered. Arming it would hide content the visitor is already reading,
 *     and revealing it would flash the block out and back in for no reason.
 *
 * The reveal is the mirror image of the arming: it drops `data-ph2-armed` as
 * it writes `data-ph2-in`, so the armed state exists only in the gap between
 * arming and arrival. Nothing on this page hides copy through a rule that is
 * merely outranked by an animation — see the CSS contract for what happens
 * when that assumption is relied on.
 *
 * ── Why the scroll listener stays ──────────────────────────────────────────
 *
 * IntersectionObserver reports *transitions*. A block that crosses its whole
 * span between two delivered frames — an `href="#anchor"` jump, `End`,
 * PageDown, a fling of the trackpad — is "not intersecting" at both samples, so
 * no callback ever fires and the block stays at `opacity: 0` forever. That is
 * not hypothetical here: `useReveal` measured 11 of 37 reveals stuck invisible
 * on this exact page before it added the rect test. The observer is the primary
 * path for timing; a rect sweep on scroll, resize and tab-visibility is the
 * safety net for the case the observer structurally cannot see. See `sweep`
 * below for why that sweep deliberately has no `requestAnimationFrame` in it.
 *
 * ── Measuring inside `content-visibility: auto` ─────────────────────────────
 *
 * The bands opt into `content-visibility: auto`, and an off-screen one has not
 * laid out its contents — a block inside reports a zero-height box at the
 * band's origin. Measuring *that* would read as "already at the top of the
 * viewport" and skip the animation for roughly half the page. So a zero-height
 * box falls back to the band it lives in, which does have a real box
 * (`contain-intrinsic-size` reserves one).
 *
 * ── What was deliberately left in /preview-home-3 ──────────────────────────
 *
 * `Motion3` also counts figures up. This page does not, and the reason is not
 * oversight: of the three numbers in the proof strip, `10 M+` is the only one
 * that can be counted without either asserting a value the copy denies
 * (`<2 min` passes through `<0 min` and `<1 min` on the way up) or printing
 * intermediate figures in the wrong locale (`3,000+` counts as `1,234+`, which
 * in Indonesian reads as one thousand two hundred and thirty-four). One of
 * three animating looks like a bug, and `ProofStrip` already documents the
 * decision the other way: metrics are static text so they are correct in first
 * paint and cannot drift into the wrong locale. A count-up would reverse a
 * reasoned decision in exchange for a third of an effect.
 */

/** A block counts as arrived once its top crosses this fraction of the viewport. */
const REVEAL_AT = 0.92;

/** Everything this file can drive, in the order `kindOf` reads them back. */
const SELECTOR = "[data-ph2-split],[data-ph2-enter],[data-ph2-rule]";

type Kind = "split" | "enter" | "rule";

function kindOf(el: Element): Kind {
  if (el.hasAttribute("data-ph2-split")) return "split";
  if (el.hasAttribute("data-ph2-enter")) return "enter";
  return "rule";
}

type Item = { el: HTMLElement; kind: Kind };

export function TextMotion() {
  useEffect(() => {
    // Hard bypass: no observers, no listeners, and no `data-ph2-armed` — so the
    // armed hidden state cannot exist under reduced motion at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector<HTMLElement>(".ph2-root");
    if (!root) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
    if (!blocks.length) return;

    /** Blocks armed but not yet revealed. Shrinks to empty as they arrive. */
    const pending: Item[] = [];
    /** Reverse index, so an observer entry does not have to search the list. */
    const byTarget = new Map<Element, Item>();
    let observer: IntersectionObserver | undefined;
    let stopped = false;
    /**
     * Poll used only while the document is hidden — see `syncPoll`. Undefined
     * when nothing is being polled, which is the state for a page anyone can
     * actually see.
     */
    let poll: number | undefined;

    const rectOf = (el: HTMLElement): DOMRect => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) return rect;
      const host = el.closest<HTMLElement>('[data-defer="true"]');
      return host ? host.getBoundingClientRect() : rect;
    };

    /** True once the block has entered the viewport *or* been jumped over. */
    const arrived = (el: HTMLElement) =>
      rectOf(el).top < window.innerHeight * REVEAL_AT;

    function stop() {
      if (stopped) return;
      stopped = true;
      observer?.disconnect();
      if (poll !== undefined) {
        window.clearInterval(poll);
        poll = undefined;
      }
      window.removeEventListener("scroll", sweep);
      window.removeEventListener("resize", sweep);
      document.removeEventListener("visibilitychange", onVisibility);
    }

    function reveal(item: Item) {
      const at = pending.indexOf(item);
      if (at === -1) return;
      pending.splice(at, 1);
      byTarget.delete(item.el);
      /*
       * The armed state is a pre-state, so it ends the moment the block
       * arrives: `data-ph2-armed` hides with an ordinary declaration, and an
       * entrance that has to outrank that declaration for the rest of the
       * session is one missed detail away from stranding the copy again. This
       * file's previous contract kept both attributes, and the CSS answered by
       * giving every keyframe an explicit `to` — which is the right fix on
       * that side, but it leaves the hiding rule lying around masked rather
       * than gone. Dropping it also means the resting style is the visible
       * one, so a reveal whose animation never runs fails as "no entrance"
       * rather than "no text".
       *
       * All three kinds then get `data-ph2-in`; the CSS decides what that
       * means for each, and the lift it triggers on `[data-ph2-enter]` has no
       * rule for `[data-ph2-rule]`. So a hairline draws without also dropping
       * 20px — two movements on one 1px element read as a slip, not a gesture.
       */
      delete item.el.dataset.ph2Armed;
      /*
       * A hidden document does not advance CSS animations — measured here:
       * `currentTime` sat at 0 across 700ms of wall clock. Writing the
       * attribute anyway would pin the block at its keyframe `from` state, so
       * the very act of revealing it would hide it until the tab was shown.
       * Nobody is watching an entrance in a background tab, so it is skipped
       * and the copy is simply there.
       */
      if (document.visibilityState === "visible") item.el.dataset.ph2In = "true";
      observer?.unobserve(item.el);
      if (!pending.length) stop();
    }

    /*
     * The sweep runs synchronously off the event, with no `requestAnimationFrame`
     * in between.
     *
     * It used to be rAF-throttled, which is the reflex here — but the browser
     * already dispatches at most one scroll event per frame, so the throttle
     * bought nothing but a frame of latency. What it cost was real: rAF is
     * paused outright in a hidden tab, so the safety net went dead in exactly
     * the case it exists for. A page restored to a remembered offset while in
     * the background arms every block below the fold and then never releases
     * them — the visitor comes back to a document full of invisible copy. This
     * is the same argument `Motion3` makes for driving its sweep from the GSAP
     * ticker rather than a detached rAF; there is no ticker here, so the event
     * itself does the work.
     *
     * `visibilitychange` is the piece a scroll listener structurally cannot
     * cover: a hidden document does not reliably report scrolling at all, so
     * the sweep has to also run when the tab is shown, and again on the way out
     * for a page measured against a stale viewport.
     *
     * Copy the list: `reveal` splices the one it is working on.
     */
    function sweep() {
      for (const item of [...pending]) if (arrived(item.el)) reveal(item);
    }

    /**
     * While the document is hidden, neither of the two paths above can fire:
     * scroll events and IntersectionObserver callbacks are both queued off
     * rendering steps that a hidden document never runs. That is measurable on
     * this page, not hypothetical — scrolling to the bottom a hundred pixels at
     * a time released none of the 40 armed blocks, and the observer said
     * nothing either. Timers are the one thing a hidden document still
     * dispatches, so while it is hidden the sweep is polled instead.
     *
     * The poll is not a third reveal path for a page in front of anyone: it is
     * armed only by `document.hidden` and it retires the moment nothing is
     * pending. A page left open in a background tab keeps a handful of rect
     * reads on a timer until Chrome's own background throttling slows it to a
     * crawl, which is a fair trade for the alternative — a document restored
     * to a remembered offset that never releases what it armed.
     */
    function syncPoll() {
      if (stopped) return;
      const wanted = document.hidden && pending.length > 0;
      if (wanted && poll === undefined) {
        poll = window.setInterval(sweep, 400);
      } else if (!wanted && poll !== undefined) {
        window.clearInterval(poll);
        poll = undefined;
      }
    }

    function onVisibility() {
      sweep();
      syncPoll();
    }

    for (const el of blocks) {
      // Already readable on screen: leave it static rather than flash it.
      if (arrived(el)) continue;
      const item = { el, kind: kindOf(el) };
      el.dataset.ph2Armed = "true";
      pending.push(item);
      byTarget.set(el, item);
    }
    if (!pending.length) return;

    /*
     * The stagger index, counted among *armed* siblings only.
     *
     * Counting every sibling instead would give a grid whose first two cards
     * were already on screen a stagger starting at 4, so the first card that
     * actually moves would sit and wait for cards nothing is happening to.
     */
    const perParent = new Map<Element | null, number>();
    for (const item of pending) {
      if (item.kind !== "enter") continue;
      const parent = item.el.parentElement;
      const index = perParent.get(parent) ?? 0;
      perParent.set(parent, index + 1);
      item.el.style.setProperty("--ph2-i", String(index));
    }

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const item = byTarget.get(entry.target);
            if (item && entry.isIntersecting) reveal(item);
          }
        },
        { rootMargin: `0px 0px -${Math.round((1 - REVEAL_AT) * 100)}% 0px` },
      );
      for (const item of pending) observer.observe(item.el);
    }

    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);
    document.addEventListener("visibilitychange", onVisibility);
    syncPoll();

    return () => {
      stop();
      // Hand the DOM back in its resting state: the blocks are visible again
      // rather than stranded at whatever point the teardown interrupted.
      for (const el of blocks) {
        delete el.dataset.ph2Armed;
        delete el.dataset.ph2In;
        el.style.removeProperty("--ph2-i");
      }
    };
  }, []);

  return null;
}
