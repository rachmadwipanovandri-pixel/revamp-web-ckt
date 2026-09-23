import Script from "next/script";
import { onTrackerReady } from "@/lib/defer-third-party";

const CEKAT_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_CEKAT_ANALYTICS_ID ??
  "0eb00dec-432c-42cf-ac47-04fb54f4a332";

/**
 * Cekat Analytics after first interaction, or hybrid fallback (≤3s /
 * pagehide) so non-interacting visitors still send a pageview.
 *
 * The bootstrap queues `ckt(...)` until `cktevents.js` arrives, so events
 * pushed during the gap are not lost.
 */
export function CekatAnalytics() {
  if (!CEKAT_ANALYTICS_ID) return null;
  return (
    <Script id="cekat-analytics" strategy="lazyOnload">
      {onTrackerReady(
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
