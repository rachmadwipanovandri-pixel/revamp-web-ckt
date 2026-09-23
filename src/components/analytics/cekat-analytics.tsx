import Script from "next/script";
import { onTrackerReadyIdle } from "@/lib/defer-third-party";

const CEKAT_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_CEKAT_ANALYTICS_ID ??
  "0eb00dec-432c-42cf-ac47-04fb54f4a332";

/**
 * Cekat Analytics after interaction / 9s / pagehide, then idle — `cktevents.js`
 * was the top long-task source (~1.8s+ CPU). The bootstrap queues `ckt(...)`
 * until the library arrives, so pageviews and events are not lost.
 */
export function CekatAnalytics() {
  if (!CEKAT_ANALYTICS_ID) return null;
  return (
    <Script id="cekat-analytics" strategy="lazyOnload">
      {onTrackerReadyIdle(
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
