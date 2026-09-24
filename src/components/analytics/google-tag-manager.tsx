"use client";

import Script from "next/script";
import { onTrackerReadyIdle } from "@/lib/defer-third-party";
import { DataLayerBuffer } from "@/components/analytics/data-layer-buffer";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5CWCQNBX";

/**
 * GTM after first interaction / 9s fallback / pagehide, then idle.
 *
 * `dataLayer` is primed by `DataLayerBuffer` (client, no script tag).
 * The loader itself is `lazyOnload` — `next/script` injects that via
 * `document.createElement`, never as a React `<script>` child.
 * Attribution lives in the URL + `cekat_ads` cookie from `proxy.ts`.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <>
      <DataLayerBuffer />
      <Script id="google-tag-manager" strategy="lazyOnload">
        {onTrackerReadyIdle(
          `(function(w,d,s,l,i){
w[l]=w[l]||[];
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`,
        )}
      </Script>
    </>
  );
}

/** GTM <noscript> fallback — must render immediately after <body> opens. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
