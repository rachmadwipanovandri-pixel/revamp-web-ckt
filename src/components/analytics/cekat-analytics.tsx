import Script from "next/script";

const CEKAT_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_CEKAT_ANALYTICS_ID ??
  "0eb00dec-432c-42cf-ac47-04fb54f4a332";

/**
 * Cekat Analytics at idle. The inline bootstrap queues `ckt(...)` calls until
 * `cktevents.js` arrives, so early events are not lost.
 */
export function CekatAnalytics() {
  if (!CEKAT_ANALYTICS_ID) return null;
  return (
    <Script id="cekat-analytics" strategy="lazyOnload">
      {`!function(c,e,k,a,t){c.ckt=c.ckt||function(){(c.ckt.q=c.ckt.q||[]).push(arguments)};c.ckt.l=+new Date;t=e.getElementsByTagName(k)[0];a=e.createElement(k);a.async=true;a.src='https://t.cekat.ai/js/cktevents.js';t.parentNode.insertBefore(a,t)}(window,document,'script');ckt('${CEKAT_ANALYTICS_ID}');`}
    </Script>
  );
}
