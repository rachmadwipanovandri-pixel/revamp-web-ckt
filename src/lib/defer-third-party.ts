/**
 * Hybrid load gate for third-party trackers (GTM, Meta, Cekat, HYROS, …).
 *
 * Load when **any** of these fires first:
 * 1. Real user interaction — engaged visitors get tags without waiting.
 * 2. Fallback timeout (default 9s) — non-interacting visitors still send
 *    a pageview. Long enough that Lighthouse’s early TBT window stays mostly
 *    free of third-party CPU; real idle sessions still count.
 * 3. `pagehide` / tab hidden — short bounces flush **immediately** (no idle
 *    wait, or the browser may kill the page first).
 *
 * Attribution does not depend on load timing — UTM / click ids are on the
 * URL and in the `cekat_ads` cookie from the edge (`proxy.ts`).
 *
 * `start` is inlined as statements (not JSON-stringified and called).
 */
export const TRACKER_FALLBACK_MS = 9000;

function gate(source: string, fallbackMs: number): string {
  const ms =
    Number.isFinite(fallbackMs) && fallbackMs >= 0
      ? Math.floor(fallbackMs)
      : TRACKER_FALLBACK_MS;
  return source.replace("__FALLBACK_MS__", String(ms));
}

export function onTrackerReady(
  start: string,
  fallbackMs: number = TRACKER_FALLBACK_MS,
): string {
  return gate(
    `(function(w,d){
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
var timer=w.setTimeout(run,__FALLBACK_MS__);
})(window,document);`,
    fallbackMs,
  );
}

/**
 * Hybrid gate where the heavy body waits for a main-thread idle slot after
 * the gate opens (interaction / timeout). `pagehide` and `visibilitychange`
 * still run `start` synchronously so a bounce can flush queued pageviews.
 *
 * Cuts long tasks from cktevents / gtm.js / fbevents without delaying the
 * *decision* to load.
 */
export function onTrackerReadyIdle(
  start: string,
  fallbackMs: number = TRACKER_FALLBACK_MS,
): string {
  return gate(
    `(function(w,d){
var events=["pointerdown","keydown","touchstart","wheel","touchmove","scroll"];
var done=0;
function boot(immediate){
  if(done)return;
  done=1;
  for(var i=0;i<events.length;i++)w.removeEventListener(events[i],run,true);
  w.clearTimeout(timer);
  w.removeEventListener("pagehide",onHide);
  d.removeEventListener("visibilitychange",onVis);
  function go(){${start}}
  if(immediate||!w.requestIdleCallback){go();return;}
  w.requestIdleCallback(go,{timeout:2000});
}
function run(){boot(false);}
function onHide(){boot(true);}
function onVis(){
  if(d.visibilityState==="hidden")boot(true);
}
for(var i=0;i<events.length;i++)w.addEventListener(events[i],run,true);
w.addEventListener("pagehide",onHide);
d.addEventListener("visibilitychange",onVis);
var timer=w.setTimeout(run,__FALLBACK_MS__);
})(window,document);`,
    fallbackMs,
  );
}

/** @deprecated Use {@link onTrackerReady} — same gate, name matches hybrid behavior. */
export const onUserInteraction = onTrackerReady;
