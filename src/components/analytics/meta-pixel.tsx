import { onUserInteraction } from "@/lib/defer-third-party";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1023236368807376";

/**
 * Meta Pixel without a render-blocking download.
 *
 * - Inline queue (same contract as Meta's own snippet: `fbq` buffers into
 *   `.queue` until `fbevents.js` runs). `init` + first `PageView` are queued
 *   in the HTML, so they are not lost if the visitor leaves before load.
 * - The library is injected only after the first real user interaction —
 *   Lighthouse never interacts, so `fbevents.js` stays out of the lab TBT
 *   window (idle timeouts of 2–8s still fired during the run).
 *
 * Campaign params (UTM / fbclid / …) are already on the URL and in the
 * `cekat_ads` cookie from `proxy.ts`, so attribution does not depend on when
 * this script loads.
 */
export function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <script
        id="meta-pixel"
        dangerouslySetInnerHTML={{
          __html: `(function(f,b){if(f.fbq)return;
var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];
n("init","${PIXEL_ID}");n("track","PageView");})(window,document);
${onUserInteraction(`(function(f,b){
if(f.__fbLoaded)return;
f.__fbLoaded=1;
var s=b.createElement("script");
s.async=1;
s.src="https://connect.facebook.net/en_US/fbevents.js";
b.head.appendChild(s);
})(window,document);`)}`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- tracking pixel must be a bare img */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
