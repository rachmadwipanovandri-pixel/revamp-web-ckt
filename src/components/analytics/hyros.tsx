import Script from "next/script";
import { onUserInteraction } from "@/lib/defer-third-party";

const HYROS_ID =
  process.env.NEXT_PUBLIC_HYROS_ID ??
  "e5f74aff65eaf4cadebec537983f911b779f1a21461aed2e3ac41a94e2f9a44c";

/**
 * HYROS only after the first real user interaction. Idle / `lazyOnload` still
 * ran inside the Lighthouse lab window (~300ms main-thread + dependency-tree
 * LCP drag). `ref_url` is `document.URL` at execution time, which still
 * includes UTM / click ids from the landing — the edge cookie is separate.
 */
export function Hyros() {
  if (!HYROS_ID) return null;
  return (
    <Script id="hyros" strategy="lazyOnload">
      {onUserInteraction(
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
