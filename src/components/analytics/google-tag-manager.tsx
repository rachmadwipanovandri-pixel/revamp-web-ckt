import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-5CWCQNBX";

/**
 * GTM loads at `lazyOnload` (after window load), not before paint.
 *
 * On the lab run GTM + its tags (TikTok, piqo, ads) were the bulk of TBT
 * (1.0s) and unused JS (~632 KiB). UTM / gclid / fbclid are already on the
 * landing URL and in the `cekat_ads` cookie (written in `proxy.ts` on the
 * edge) before any of this runs, so tags that read the URL or cookie still
 * see full campaign context. `dataLayer` buffers events pushed before
 * `gtm.js` arrives.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <Script id="google-tag-manager" strategy="lazyOnload">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
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
