import Script from "next/script";

const HYROS_ID =
  process.env.NEXT_PUBLIC_HYROS_ID ??
  "e5f74aff65eaf4cadebec537983f911b779f1a21461aed2e3ac41a94e2f9a44c";

/**
 * HYROS only after the browser is idle. `lazyOnload` still landed inside the
 * Lighthouse lab window and added ~300ms to LCP via the network dependency
 * tree. `ref_url` is `document.URL` at execution time, which still includes
 * UTM / click ids from the landing — the edge cookie is separate.
 */
export function Hyros() {
  if (!HYROS_ID) return null;
  return (
    <Script id="hyros" strategy="lazyOnload">
      {`(function(w,d){
var load=function(){if(w.__hyrosLoaded)return;w.__hyrosLoaded=1;
var s=d.createElement('script');s.src="https://grw.cekat.ai/v1/lst/universal-script?ph=${HYROS_ID}&tag=!clicked&ref_url="+encodeURI(d.URL);
d.head.appendChild(s);};
if("requestIdleCallback" in w)w.requestIdleCallback(load,{timeout:1e4});
else w.setTimeout(load,5e3);})(window,document);`}
    </Script>
  );
}
