"use client";

import { useEffect } from "react";

/*
 * iOS-style entrances for /preview-home-5.
 *
 * Same engine contract as Motion4 (one Lenis loop stepped from gsap.ticker,
 * ScrollTrigger.batch + a rect sweep safety net, hard reduced-motion bypass)
 * but every entrance runs the iOS triplet: a short rise, a slight scale-up
 * and a blur-to-sharp settle on an expo-out curve — the way iOS resolves a
 * pushed view rather than the way a spec sheet fades in.
 *
 * Only transform/opacity/filter animate, so everything stays on the
 * compositor. Blur is brief (sub-second) and cleared on completion.
 */

const EASE = "expo.out";

declare global {
  interface Window {
    __ph5Lenis?: { destroy(): void; stop(): void; start(): void };
  }
}

export function Motion5() {
  useEffect(() => {
    // Hard bypass. Nothing below runs, and nothing below is even downloaded.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector(".ph5-root");
    if (!root) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;
    /** Pointer-spotlight listeners, torn down with the timeline above. */
    let spotHandlers: (() => void)[] | undefined;
    /** Hoisted so `teardown` can detach it; assigned once triggers exist. */ let sweepEnterables:
      (() => void) | undefined;
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
          // Anchored links glide instead of jumping. Lenis computes its target
          // from the rect and ignores CSS scroll-margin, so the offset has to be
          // declared here or the target lands under the nav.
          anchors: {
            offset: -88,
          },
        });
        window.__ph5Lenis = lenis;
        let lastSweptAt = -1;
        const tick = (time: number) => {
          lenis.raf(time * 1000);
          /*
           * The sweep runs from the ticker rather than from a bare
           * `requestAnimationFrame` callback or ScrollTrigger's `scrollEnd`.
           * `scrollEnd` needs a native scroll-end signal the eased engine never
           * produces, and a detached rAF is throttled away in backgrounded tabs —
           * which leaves the safety net dead precisely when the page is being
           * scrolled by something other than a human dragging a wheel. The
           * ticker is the one loop that provably runs, since Lenis is stepped
           * from it.
           *
           * Gated on the scroll actually having moved: the ticker runs every
           * frame whether or not anything is scrolling, and there is no reason
           * to re-read every block's geometry while the page is still.
           */ const at = Math.round(window.scrollY);
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
          // ---- hero: one composed opening, iOS push ---------------------
          const heroWords = gsap.utils.toArray<HTMLElement>(
            "[data-ph4-hero-word]",
          );
          const heroRest = gsap.utils.toArray<HTMLElement>(
            "[data-ph4-hero-item]",
          );
          const heroStage = root.querySelector(".ph4-hero-stage");
          if (heroWords.length || heroRest.length || heroStage) {
            const intro = gsap.timeline({
              defaults: {
                ease: EASE,
                duration: 0.9,
              },
              delay: 0.08,
            });
            if (heroWords.length) {
              intro.fromTo(
                heroWords,
                {
                  yPercent: 110,
                },
                {
                  yPercent: 0,
                  duration: 1.1,
                  stagger: 0.04,
                  ease: EASE,
                },
              );
            }
            if (heroRest.length) {
              intro.from(
                heroRest,
                {
                  y: 20,
                  opacity: 0,
                  scale: 0.97,
                  filter: "blur(8px)",
                  clearProps: "filter",
                  stagger: 0.08,
                  duration: 0.9,
                },
                heroWords.length ? "-=0.7" : 0,
              );
            }
            if (heroStage) {
              intro.from(
                heroStage,
                {
                  y: 48,
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(14px)",
                  clearProps: "filter",
                  duration: 1.2,
                },
                "-=0.9",
              );
            }
          }
          // ---- section entrances: rise + settle + focus -----------------
          // `data-ph4-enter` marks a block whose start values GSAP writes.
          // (The attributes keep their `ph4` names: the components are reused,
          // not forked, and the behaviour contract is identical — only the
          // curve and the start values changed.)
          //
          // Order matters: the hidden state is written *before* the triggers
          // are created. ScrollTrigger evaluates each trigger as it is built, so
          // anything already inside the start line fires `onEnter` immediately
          // — and a `gsap.set` afterwards would stamp the hidden values back over
          // that finished reveal, stranding visible content at opacity 0.
          const enterables =
            gsap.utils.toArray<HTMLElement>("[data-ph4-enter]");
          // Everything whose hidden state GSAP writes — plain enterables and
          // stagger children alike — so the sweep below can cover both.
          const sweepables: HTMLElement[] = [...enterables];
          if (enterables.length) {
            gsap.set(enterables, {
              y: 28,
              opacity: 0,
              scale: 0.97,
              filter: "blur(10px)",
            });
            // GSAP types `BatchCallback` as `(targets: Element[]) => void`.
            // Narrowing the parameter to `HTMLElement[]` is contravariantly
            // wrong, so the callback is typed the way GSAP calls it.
            const revealBatch = (batch: Element[]) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.9,
                stagger: 0.08,
                ease: EASE,
                // Hand the transform and filter back to CSS when the reveal is
                // done, so the hover lifts on cards are not pinned dead by an
                // inline `translate(0px, 0px)` and no blur lingers to soften
                // text rendering.
                clearProps: "transform,filter",
              });
            ScrollTrigger.batch(enterables, {
              start: "top 88%",
              once: true,
              onEnter: revealBatch,
            });
          }
          // ---- staggered grids -----------------------------------------
          // `data-ph4-stagger` marks a container whose *children* enter one
          // after another rather than as one block: the workflow steps, the
          // proof figures, the case cards, the plan cards, the photo cells.
          // Same hidden-state contract as above — set before the trigger is
          // built — and the children join `sweepables` so a fast scroll can
          // never strand them at opacity 0.
          for (const group of gsap.utils.toArray<HTMLElement>(
            "[data-ph4-stagger]",
          )) {
            const items = Array.from(group.children) as HTMLElement[];
            if (!items.length) continue;
            sweepables.push(...items);
            gsap.set(items, {
              y: 32,
              opacity: 0,
              scale: 0.96,
              filter: "blur(10px)",
            });
            const reveal = () =>
              gsap.to(items, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.85,
                stagger: 0.1,
                ease: EASE,
                clearProps: "transform,filter",
              });
            const trigger = ScrollTrigger.create({
              trigger: group,
              start: "top 88%",
              once: true,
              onEnter: reveal,
            });
            // See the heading note: a trigger created already past its start
            // line never fires `onEnter`, so the grid would sit at opacity 0.
            if (trigger.isActive) reveal();
          }
          // ---- drift: scroll-driven stages ------------------------------
          // `data-ph4-drift` marks a large stage that leans into the scroll:
          // it rises and settles to full scale across its own entry, scrubbed
          // against the viewport rather than fired once — so the reader drives
          // the entrance by scrolling. Transform-only, never opacity or blur:
          // a paused mid-scroll frame reads as perspective, not as broken
          // content, and blur under scrub smears text while settling. A
          // scrubbed tween always renders its true progress, so unlike the
          // fire-once entrances above this needs no sweep safety net.
          for (const stage of gsap.utils.toArray<HTMLElement>(
            "[data-ph4-drift]",
          )) {
            gsap.fromTo(
              stage,
              { y: 48, scale: 0.97 },
              {
                y: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: "top 92%",
                  end: "top 38%",
                  scrub: 0.6,
                },
              },
            );
          }
          // ---- marquee velocity skew ----------------------------------
          // The text marquee runs on CSS time, so scroll velocity leans the
          // whole band a few degrees and eases it back — the one place the
          // page visibly reacts to *how fast* the reader moves. Skew lives on
          // the band, never the track: the track's own keyframes own its
          // transform, and a CSS animation wins over any inline style.
          const marquee =
            root.querySelector<HTMLElement>(".ph4-marquee-band");
          if (marquee) {
            const clampSkew = gsap.utils.clamp(-5, 5);
            const skewTo = gsap.quickTo(marquee, "skewX", {
              duration: 0.35,
              ease: "power3.out",
            });
            let settleCall: gsap.core.Tween | undefined;
            lenis.on("scroll", (e) => {
              const velocity =
                (e as unknown as { velocity?: number }).velocity ?? 0;
              skewTo(clampSkew(velocity * -0.35));
              settleCall?.kill();
              settleCall = gsap.delayedCall(0.18, () => skewTo(0));
            });
          }
          /*
           * Geometry sweep, for blocks a fast scroll skipped.
           *
           * `ScrollTrigger.batch` reports the transition *into* range, and a
           * block can cross its whole span between two updates without ever
           * producing that edge — a `href="#anchor"` jump, `End`, PageDown, a
           * fling of the trackpad.
           *
           * This must `set`, never tween. A tween here is interrupted by the
           * next sweep frame, and `overwrite` then kills the one still in
           * flight: the inline style ends up as `translate: none` beside
           * `opacity: 0`, so the page looks broken exactly when it matters. A
           * `set` is instant and cannot be interrupted, which is what a safety
           * net has to be.
           *
           * `revealed` keeps the sweep to one `getBoundingClientRect` per block
           * for the rest of the page's life.
           */ const revealed = new Set();
          sweepEnterables = () => {
            const past = [];
            for (const el of sweepables) {
              if (revealed.has(el)) continue;
              const rect = el.getBoundingClientRect();
              if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
                revealed.add(el);
                past.push(el);
              }
            }
            if (past.length)
              gsap.set(past, {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                clearProps: "transform,filter",
              });
          };
          sweepEnterables();
          ScrollTrigger.addEventListener("refresh", sweepEnterables);
          // ---- headings: word by word ----------------------------------
          // Restrained on purpose: a fast stagger with an overlap so a long
          // line resolves as one gesture, not a wave.
          const splitBlocks =
            gsap.utils.toArray<HTMLElement>("[data-ph4-split]");
          for (const block of splitBlocks) {
            const words = block.querySelectorAll("[data-ph4-word]");
            if (!words.length) continue;
            gsap.set(words, {
              yPercent: 110,
            });
            const reveal = () =>
              gsap.to(words, {
                yPercent: 0,
                duration: 1.0,
                stagger: 0.03,
                ease: EASE,
                overwrite: true,
              });
            const trigger = ScrollTrigger.create({
              trigger: block,
              start: "top 86%",
              once: true,
              onEnter: reveal,
            });
            // `ScrollTrigger.create` does not fire `onEnter` for an element that
            // already sits past its start line, and the band headings do on a
            // long page or after a refresh. Reveal those explicitly so "already
            // on screen" can never mean "stuck at yPercent 110".
            if (trigger.isActive) reveal();
          }
          // ---- the scrubbed statement ---------------------------------
          // Same words, different contract: `data-ph4-scrub` fills in against
          // the scroll position instead of firing once, so the sentence reads
          // as something the reader writes by scrolling rather than as another
          // entrance. The band is tall and the statement is parked under the
          // nav by CSS (`position: sticky`) — no GSAP pin, so Lenis never has
          // to reconcile a pin-spacer with its own measurement.
          for (const block of gsap.utils.toArray<HTMLElement>(
            "[data-ph4-scrub]",
          )) {
            const words = block.querySelectorAll("[data-ph4-word]");
            if (!words.length) continue;
            // The trigger is the *band*, not the statement. The statement is
            // the sticky child, so its rect stops changing the moment it
            // pins — measured against itself the timeline would jump to its
            // end and stay there. The band keeps scrolling, and its two
            // edges are what define how much travel the sentence gets.
            const band = block.closest<HTMLElement>(".ph4-scrub-band") ?? block;
            gsap.set(words, {
              opacity: 0.14,
              yPercent: 34,
            });
            gsap.to(words, {
              opacity: 1,
              yPercent: 0,
              ease: "none",
              stagger: 0.6,
              scrollTrigger: {
                trigger: band,
                start: "top 65%",
                end: "bottom bottom",
                scrub: 0.5,
              },
            });
          }
          // ---- hairline rules draw themselves -------------------------
          // `from` tweens are safe here: GSAP renders a `from` tween's end
          // state immediately when its trigger is already active, so a rule
          // that starts on screen cannot be left at `scaleX: 0`.
          for (const rule of gsap.utils.toArray<HTMLElement>(
            "[data-ph4-rule]",
          )) {
            gsap.from(rule, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.1,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: rule,
                start: "top 92%",
                once: true,
              },
            });
          }
          // ---- count-up figures ---------------------------------------
          for (const node of gsap.utils.toArray<HTMLElement>(
            "[data-ph4-count]",
          )) {
            const raw = node.dataset.ph4Count ?? "";
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
             *   "3.000+" / "3,000+" — a grouped thousands run. `toFixed(3)`
             *     would print intermediate values like `1.234+`, which in
             *     Indonesian reads as one thousand two hundred and thirty-four.
             *     A dot or comma followed by exactly three digits is therefore
             *     treated as grouping, not a decimal, and the figure stays
             *     static.
             *   "24/7" — digits in the suffix; that suffix is part of the value,
             *     not decoration.
             *   "<2 min" — a comparator prefix. Counting toward 2 passes through
             *     "<0 min" and "<1 min", asserting values the copy denies.
             *
             * A figure that is briefly wrong on its way to being right is worse
             * than one that simply never moves.
             */ if (/[0-9]/.test(suffix)) continue;
            if (/[<>≤≥~≈]/.test(prefix)) continue;
            if (/^[.,][0-9]{3}$/.test(digits)) continue;
            const decimals = digits.split(".")[1]?.length ?? 0;
            const state = {
              n: 0,
            };
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
            // See the heading note: a trigger created already past its start
            // line never fires `onEnter`, so the stat would sit at 0.
            if (trigger.isActive) count();
          }
          // ---- pointer spotlight --------------------------------------
          // `data-ph4-spot` marks a card that lights up under the cursor. One
          // listener per card writes two custom properties; the glow itself is
          // a CSS radial-gradient, so nothing reads layout per frame and no
          // React state moves. Gated on a device that actually has a hover —
          // a touch pointer would otherwise park the light wherever the
          // finger last landed.
          const spotCleanups: (() => void)[] = [];
          spotHandlers = spotCleanups;
          if (window.matchMedia("(hover: hover)").matches) {
            for (const card of gsap.utils.toArray<HTMLElement>(
              "[data-ph4-spot]",
            )) {
              const onMove = (event: PointerEvent) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty(
                  "--ph4-spot-x",
                  `${event.clientX - rect.left}px`,
                );
                card.style.setProperty(
                  "--ph4-spot-y",
                  `${event.clientY - rect.top}px`,
                );
              };
              card.addEventListener("pointermove", onMove);
              spotCleanups.push(() =>
                card.removeEventListener("pointermove", onMove),
              );
            }
          }
          // ---- the one scrubbed moment --------------------------------
          // The hero surface settles back as it leaves the fold. It is the only
          // scroll-linked transform on the page, so it stays legible as a depth
          // cue instead of turning into parallax theatre.
          if (heroStage) {
            gsap.to(heroStage, {
              yPercent: 6,
              scale: 0.97,
              ease: "none",
              scrollTrigger: {
                trigger: root.querySelector(".ph4-hero"),
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        }, root);
        // Measurements are wrong until the brand face lands, so refresh once
        // after fonts resolve and again on load.
        ScrollTrigger.refresh();
        const fonts = document.fonts;
        void fonts?.ready.then(() => ScrollTrigger.refresh());
        window.addEventListener("load", () => ScrollTrigger.refresh());
        teardown = () => {
          ctx.revert();
          for (const off of spotHandlers ?? []) off();
          spotHandlers = undefined;
          if (sweepEnterables) {
            ScrollTrigger.removeEventListener("refresh", sweepEnterables);
          }
          gsap.ticker.remove(tick);
          lenis.destroy();
          if (window.__ph5Lenis === lenis) window.__ph5Lenis = undefined;
        };
      });
    });
    return () => {
      cancelled = true;
      cancelIdle(handle);
      teardown?.();
    };
  }, []);
  return null;
}
