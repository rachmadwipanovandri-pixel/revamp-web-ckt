"use client";

import { useEffect } from "react";

/**
 * The draft's whole motion stack, in one place.
 *
 * Two libraries, two jobs, no overlap:
 *
 *   - Lenis — the page's *only* smooth-scroll engine. It drives the real scroll
 *     position (no transform wrapper), so sticky nav, anchors and ScrollTrigger
 *     all read the same `window.scrollY`.
 *   - GSAP + ScrollTrigger — every entrance on the page, plus the one scrubbed
 *     moment (the hero settling as it leaves).
 *
 * They are wired the canonical way: Lenis runs with `autoRaf: false` and is
 * stepped from `gsap.ticker`, so there is exactly one rAF loop for the whole
 * page instead of two competing ones, and ScrollTrigger updates on the same
 * frame Lenis publishes to.
 *
 * Both are dynamically imported inside one idle callback, which keeps ~30 KB of
 * GSAP plus ~5 KB of Lenis out of the critical path entirely. Until it lands the
 * page is fully static and fully readable: the resting CSS state *is* the final
 * state, and GSAP only writes start values once it is running.
 *
 * Reduced motion is a hard bypass, not a shortened animation — no Lenis, no
 * GSAP, no rAF, and every element left in its final state.
 */

/**
 * Only the surface this file actually uses.
 *
 * `on`/`off` are declared narrowly rather than as `string` event names: Lenis
 * types its event union as the literals `"scroll"` and `"virtual-scroll"`, so a
 * wider signature here would be unsatisfiable by the real class.
 */
type LenisLike = {
  raf: (time: number) => void;
  destroy: () => void;
  on: (event: "scroll", handler: () => void) => void;
  scrollTo: (
    target: HTMLElement | string,
    options?: { offset?: number; duration?: number },
  ) => void;
  stop: () => void;
  start: () => void;
};

declare global {
  interface Window {
    /** See `scrollToSection` in Nav3 — one smooth-scroll path for every jump. */
    __ph3Lenis?: LenisLike;
  }
}

const EASE = "power3.out";

export function Motion3() {
  useEffect(() => {
    // Hard bypass. Nothing below runs, and nothing below is even downloaded.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector<HTMLElement>(".ph3-root");
    if (!root) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;
    /** Hoisted so `teardown` can detach it; assigned once triggers exist. */
    let sweepEnterables: (() => void) | undefined;

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 200);
    const cancelIdle =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : (id: number) => window.clearTimeout(id);

    const handle = idle(() => {
      void Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]).then(([gsapMod, stMod, lenisMod]) => {
        if (cancelled) return;

        const gsap = gsapMod.default ?? gsapMod.gsap;
        const ScrollTrigger = stMod.ScrollTrigger;
        const Lenis = lenisMod.default;

        gsap.registerPlugin(ScrollTrigger);

        // ---- one scroll engine -------------------------------------------
        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.1,
          // Anchored links (`#how-it-works`) glide instead of jumping. Lenis
          // computes its target from the rect and ignores CSS scroll-margin, so
          // the offset has to be declared here or the target lands under the nav.
          anchors: { offset: -88 },
        });
        window.__ph3Lenis = lenis;

        let lastSweptAt = -1;
        const tick = (time: number) => {
          lenis.raf(time * 1000);
          /*
           * The sweep runs from the ticker rather than from a bare
           * `requestAnimationFrame` callback or ScrollTrigger's `scrollEnd`.
           * `scrollEnd` needs a native scroll-end signal the eased engine never
           * produces, and a detached rAF is throttled away in backgrounded tabs
           * — which leaves the safety net dead precisely when the page is being
           * scrolled by something other than a human dragging a wheel. The
           * ticker is the one loop that provably runs, since Lenis is stepped
           * from it.
           *
           * Gated on the scroll actually having moved: the ticker runs every
           * frame whether or not anything is scrolling, and there is no reason
           * to re-read every block's geometry while the page is still.
           */
          const at = Math.round(window.scrollY);
          if (at !== lastSweptAt) {
            lastSweptAt = at;
            sweepEnterables?.();
          }
        };
        const onScroll = () => ScrollTrigger.update();
        gsap.ticker.add(tick);
        lenis.on("scroll", onScroll);

        // Everything below is scoped to `ctx`, so one revert() tears the whole
        // timeline set down — including tweens, ScrollTriggers and inline styles.
        const ctx = gsap.context(() => {
          // ---- hero: one composed opening -----------------------------
          const heroWords = gsap.utils.toArray<HTMLElement>(
            "[data-ph3-hero-word]",
          );
          const heroRest = gsap.utils.toArray<HTMLElement>(
            "[data-ph3-hero-item]",
          );
          const heroStage = root.querySelector<HTMLElement>(".ph3-hero-stage");

          if (heroWords.length || heroRest.length || heroStage) {
            const intro = gsap.timeline({
              defaults: { ease: EASE, duration: 0.9 },
              delay: 0.08,
            });

            if (heroWords.length) {
              intro.fromTo(
                heroWords,
                { yPercent: 108 },
                {
                  yPercent: 0,
                  duration: 1.05,
                  stagger: 0.045,
                  ease: "power4.out",
                },
              );
            }
            if (heroRest.length) {
              intro.from(
                heroRest,
                { y: 16, opacity: 0, stagger: 0.07, duration: 0.75 },
                heroWords.length ? "-=0.62" : 0,
              );
            }
            if (heroStage) {
              intro.from(
                heroStage,
                { y: 34, opacity: 0, scale: 0.985, duration: 1.1 },
                "-=0.85",
              );
            }
          }

          // ---- section entrances --------------------------------------
          // `data-ph3-enter` marks a block whose start values GSAP writes.
          //
          // Order matters: the hidden state is written *before* the triggers
          // are created. ScrollTrigger evaluates each trigger as it is built, so
          // anything already inside the start line fires `onEnter` immediately —
          // and a `gsap.set` afterwards would stamp the hidden values back over
          // that finished reveal, stranding visible content at opacity 0.
          const enterables = gsap.utils.toArray<HTMLElement>(
            "[data-ph3-enter]",
          );
          if (enterables.length) {
            gsap.set(enterables, { y: 20, opacity: 0 });

            // GSAP types `BatchCallback` as `(targets: Element[]) => void`.
            // Narrowing the parameter to `HTMLElement[]` is contravariantly
            // wrong, so the callback is typed the way GSAP calls it.
            const revealBatch = (batch: Element[]) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: EASE,
              });

            ScrollTrigger.batch(enterables, {
              start: "top 88%",
              once: true,
              onEnter: revealBatch,
            });

            /*
             * Geometry sweep, for blocks a fast scroll skipped.
             *
             * Measured: reading the page a band at a time revealed everything,
             * but stepping ~600px per 260ms — a trackpad flick or scrollbar
             * drag — left 28 blocks at opacity 0 with 44 heading words still
             * parked under their masks. `ScrollTrigger.batch` reports the
             * transition *into* range, and a block can cross its whole span
             * between two updates without ever producing that edge.
             *
             * This must `set`, never tween. The first version tweened here with
             * `overwrite: true`, and because the sweep runs on every scroll
             * frame each new tween killed the one still in flight: the inline
             * style ended up as `translate: none` (y arrived) beside
             * `opacity: 0` (the fade never completed), so the page looked broken
             * exactly when it mattered. A `set` is instant and cannot be
             * interrupted, which is what a safety net has to be.
             *
             * `revealed` keeps the sweep to a single `getBoundingClientRect`
             * per block for the rest of the page's life.
             */
            const revealed = new Set<HTMLElement>();
            sweepEnterables = () => {
              const past: HTMLElement[] = [];
              for (const el of enterables) {
                if (revealed.has(el)) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
                  revealed.add(el);
                  past.push(el);
                }
              }
              if (past.length) gsap.set(past, { y: 0, opacity: 1 });
            };
            sweepEnterables();
            ScrollTrigger.addEventListener("refresh", sweepEnterables);
          }

          // ---- headings: word by word ----------------------------------
          // Restrained on purpose: a fast stagger with an overlap so a long
          // line resolves as one gesture, not a wave.
          const splitBlocks = gsap.utils.toArray<HTMLElement>(
            "[data-ph3-split]",
          );
          for (const block of splitBlocks) {
            const words = block.querySelectorAll<HTMLElement>(
              "[data-ph3-word]",
            );
            if (!words.length) continue;

            gsap.set(words, { yPercent: 105 });

            const reveal = () =>
              gsap.to(words, {
                yPercent: 0,
                duration: 0.95,
                stagger: 0.028,
                ease: "power4.out",
                overwrite: true,
              });

            const trigger = ScrollTrigger.create({
              trigger: block,
              start: "top 86%",
              once: true,
              onEnter: reveal,
            });

            // `ScrollTrigger.create` does not fire `onEnter` for an element
            // that already sits past its start line, and the band headings do
            // on a long page or after a refresh. Reveal those explicitly so
            // "already on screen" can never mean "stuck at yPercent 105".
            if (trigger.isActive) reveal();
          }

          // ---- hairline rules draw themselves -------------------------
          // `from` tweens are safe here: GSAP renders a `from` tween's end
          // state immediately when its trigger is already active, so a rule
          // that starts on screen cannot be left at `scaleX: 0`.
          for (const rule of gsap.utils.toArray<HTMLElement>("[data-ph3-rule]")) {
            gsap.from(rule, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.1,
              ease: "power2.inOut",
              scrollTrigger: { trigger: rule, start: "top 92%", once: true },
            });
          }

          // ---- count-up figures ---------------------------------------
          for (const node of gsap.utils.toArray<HTMLElement>(
            "[data-ph3-count]",
          )) {
            const raw = node.dataset.ph3Count ?? "";
            // Only the leading number animates; "10M+", "<2 min" and "24/7"
            // keep their symbols and suffixes exactly as written.
            const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
            if (!match) continue;

            const [, prefix, digits, suffix] = match;
            const target = Number(digits);
            if (!Number.isFinite(target) || target === 0) continue;

            /*
             * A stat is only counted when the animated run *is* the whole claim.
             * Everything else is left exactly as authored:
             *
             *   "3.000+" — a grouped thousands run in Indonesian. `toFixed(3)`
             *     would print intermediate values like `1.234+`, which in
             *     Indonesian reads as one thousand two hundred and thirty-four.
             *     A dot followed by exactly three digits is therefore treated as
             *     grouping, not a decimal, and the figure stays static.
             *   "3,000+" / "24/7" — digits in the suffix; that suffix is part of
             *     the value, not decoration.
             *   "<2 min" — a comparator prefix. Counting toward 2 passes through
             *     "<0 min" and "<1 min", asserting values the copy denies.
             *
             * A figure that is briefly wrong on its way to being right is worse
             * than one that simply never moves.
             */
            if (/[0-9]/.test(suffix)) continue;
            if (/[<>≤≥~≈]/.test(prefix)) continue;
            if (/\.[0-9]{3}$/.test(digits)) continue;

            const decimals = digits.split(".")[1]?.length ?? 0;
            const state = { n: 0 };
            node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

            const count = () =>
              gsap.to(state, {
                n: target,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                  const value = state.n.toFixed(decimals);
                  node.textContent = `${prefix}${value}${suffix}`;
                },
                onComplete: () => {
                  // Restore the authored string rather than a formatted
                  // approximation, so the final value is always exactly what
                  // the copy says.
                  node.textContent = `${prefix}${digits}${suffix}`;
                },
              });

            const trigger = ScrollTrigger.create({
              trigger: node,
              start: "top 92%",
              once: true,
              onEnter: count,
            });

            // See the note on heading reveals: a trigger created already past
            // its start line never fires `onEnter`, so the stat would sit at 0.
            if (trigger.isActive) count();
          }

          // ---- the one scrubbed moment --------------------------------
          // The hero console window settles back as it leaves the fold. It is
          // the only scroll-linked transform on the page, so it stays legible
          // as a depth cue instead of turning into parallax theatre.
          if (heroStage) {
            gsap.to(heroStage, {
              yPercent: 6,
              scale: 0.97,
              ease: "none",
              scrollTrigger: {
                trigger: root.querySelector<HTMLElement>(".ph3-hero"),
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        }, root);

        // Measurements are wrong until the brand face lands and the hero
        // window has its final box, so refresh once each and again on resize.
        ScrollTrigger.refresh();
        const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
        void fonts?.ready.then(() => ScrollTrigger.refresh());
        window.addEventListener("load", () => ScrollTrigger.refresh());

        teardown = () => {
          ctx.revert();
          if (sweepEnterables) {
            ScrollTrigger.removeEventListener("refresh", sweepEnterables);
          }
          gsap.ticker.remove(tick);
          lenis.destroy();
          if (window.__ph3Lenis === lenis) window.__ph3Lenis = undefined;
        };
      });
    });

    return () => {
      cancelled = true;
      cancelIdle(handle as number);
      teardown?.();
    };
  }, []);

  return null;
}