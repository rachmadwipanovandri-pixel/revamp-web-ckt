import Script from "next/script";

const CEKAT_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_CEKAT_ANALYTICS_ID ??
  "0eb00dec-432c-42cf-ac47-04fb54f4a332";

/**
 * Cekat Analytics at idle. The inline bootstrap queues `ckt(...)` calls until
 * `cktevents.js` arrives, so early events are not lost.
 *
 * Idle (not `lazyOnload`) keeps the script out of the Lighthouse load window —
 * it was a top TBT / forced-reflow contributor on the mobile lab run.
 */
export function CekatAnalytics() {
  if (!CEKAT_ANALYTICS_ID) return null;
  return (
    <Script id="cekat-analytics" strategy="lazyOnload">
      {`(function(w,d){
var boot=function(){if(w.__cktBooted)return;w.__cktBooted=1;
w.ckt=w.ckt||function(){(w.ckt.q=w.ckt.q||[]).push(arguments)};
w.ckt.l=+new Date;
var a=d.createElement('script');a.async=true;a.src='https://t.cekat.ai/js/cktevents.js';
d.head.appendChild(a);w.ckt('${CEKAT_ANALYTICS_ID}');};
if("requestIdleCallback" in w)w.requestIdleCallback(boot,{timeout:1e4});
else w.setTimeout(boot,5e3);})(window,document);`}
    </Script>
  );
}
