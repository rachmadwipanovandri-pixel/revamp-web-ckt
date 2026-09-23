import Script from "next/script";
import { onTrackerReady } from "@/lib/defer-third-party";

const HYROS_ID =
  process.env.NEXT_PUBLIC_HYROS_ID ??
  "e5f74aff65eaf4cadebec537983f911b779f1a21461aed2e3ac41a94e2f9a44c";

/**
 * HYROS after first interaction, or hybrid fallback (≤3s / pagehide) so
 * idle visitors are still attributed. `ref_url` is `document.URL` at
 * execution time and still includes UTM / click ids from the landing.
 */
export function Hyros() {
  if (!HYROS_ID) return null;
  return (
    <Script id="hyros" strategy="lazyOnload">
      {onTrackerReady(
        `(function(w,d){
if(w.__hyrosLoaded)return;
w.__hyrosLoaded=1;
var s=d.createElement('script');
s.src="https://grw.cekat.ai/v1/lst/universal-script?ph=${HYROS_ID}&tag=!clicked&ref_url="+encodeURI(d.URL);
d.head.appendChild(s);
})(window,document);`,
      )}
    </Script>
  );
}
