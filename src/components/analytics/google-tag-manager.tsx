import Script from "next/script";
import { onTrackerReady } from "@/lib/defer-third-party";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5CWCQNBX";

/**
 * GTM after first interaction, or by the hybrid fallback (≤3s / pagehide)
 * so idle visitors still get a pageview.
 *
 * `dataLayer` is primed in the HTML so early `push` calls buffer before
 * `gtm.js` arrives. UTM / gclid / fbclid stay on the landing URL and in the
 * `cekat_ads` cookie from `proxy.ts` — attribution does not depend on when
 * this script loads.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <>
      <script
        id="dataLayer-buffer"
        dangerouslySetInnerHTML={{
          __html: `(function(w){w.dataLayer=w.dataLayer||[];})(window);`,
        }}
      />
      <Script id="google-tag-manager" strategy="lazyOnload">
        {onTrackerReady(
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
