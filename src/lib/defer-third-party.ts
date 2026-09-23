/**
 * Hybrid load gate for third-party trackers (GTM, Meta, Cekat, HYROS, …).
 *
 * Load when **any** of these fires first:
 * 1. Real user interaction — engaged visitors get tags without waiting.
 * 2. Fallback timeout (default 3s) — non-interacting visitors still send
 *    a pageview (open the page and leave without scrolling/clicking).
 * 3. `pagehide` / tab hidden — short bounces and background tabs still
 *    kick the loader before the document goes away.
 *
 * Interaction alone would drop pageviews for idle visitors; a timeout alone
 * re-enters Lighthouse's lab TBT window on every run. Hybrid keeps both:
 * real visitors counted, engaged ones not blocked, lab still sees interaction
 * as the fast path (timeout is the safety net, not the primary).
 *
 * Attribution does not depend on load timing — UTM / click ids are on the
 * URL and in the `cekat_ads` cookie from the edge (`proxy.ts`).
 *
 * `start` is inlined as statements (not JSON-stringified and called).
 */
export const TRACKER_FALLBACK_MS = 3000;

export function onTrackerReady(
  start: string,
  fallbackMs: number = TRACKER_FALLBACK_MS,
): string {
  const ms = Number.isFinite(fallbackMs) && fallbackMs >= 0
    ? Math.floor(fallbackMs)
    : TRACKER_FALLBACK_MS;

  return `(function(w,d){
var events=["pointerdown","keydown","touchstart","wheel","touchmove","scroll"];
var done=0;
function run(){
  if(done)return;
  done=1;
  for(var i=0;i<events.length;i++)w.removeEventListener(events[i],run,true);
  w.clearTimeout(timer);
  w.removeEventListener("pagehide",run);
  d.removeEventListener("visibilitychange",onVis);
  ${start}
}
function onVis(){
  if(d.visibilityState==="hidden")run();
}
for(var i=0;i<events.length;i++)w.addEventListener(events[i],run,true);
w.addEventListener("pagehide",run);
d.addEventListener("visibilitychange",onVis);
var timer=w.setTimeout(run,${ms});
})(window,document);`;
}

/** @deprecated Use {@link onTrackerReady} — same gate, name matches hybrid behavior. */
export const onUserInteraction = onTrackerReady;
