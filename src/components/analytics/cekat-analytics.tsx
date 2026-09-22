import Script from "next/script";
import { onUserInteraction } from "@/lib/defer-third-party";

const CEKAT_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_CEKAT_ANALYTICS_ID ??
  "0eb00dec-432c-42cf-ac47-04fb54f4a332";

/**
 * Cekat Analytics after the first real user interaction. The bootstrap queues
 * `ckt(...)` calls until `cktevents.js` arrives, so early events are not lost.
 *
 * Idle (and a 10s timeout) still fired inside the Lighthouse lab window —
 * `cktevents.js` was a top long-task / forced-reflow source. Interaction gating
 * keeps it out of lab TBT without losing on-site events for real visitors.
 */
export function CekatAnalytics() {
  if (!CEKAT_ANALYTICS_ID) return null;
  return (
    <Script id="cekat-analytics" strategy="lazyOnload">
      {onUserInteraction(
        `(function(w,d){
if(w.__cktBooted)return;
w.__cktBooted=1;
w.ckt=w.ckt||function(){(w.ckt.q=w.ckt.q||[]).push(arguments)};
w.ckt.l=+new Date;
var a=d.createElement('script');
a.async=true;
a.src='https://t.cekat.ai/js/cktevents.js';
d.head.appendChild(a);
w.ckt(${JSON.stringify(CEKAT_ANALYTICS_ID)});
})(window,document);`,
      )}
    </Script>
  );
}
