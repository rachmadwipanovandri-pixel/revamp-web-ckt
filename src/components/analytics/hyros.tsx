import Script from "next/script";

const HYROS_ID =
  process.env.NEXT_PUBLIC_HYROS_ID ??
  "e5f74aff65eaf4cadebec537983f911b779f1a21461aed2e3ac41a94e2f9a44c";

/**
 * HYROS at idle. `ref_url` is `document.URL` at execution time, which still
 * includes UTM / click ids from the landing — the edge cookie is separate.
 */
export function Hyros() {
  if (!HYROS_ID) return null;
  return (
    <Script id="hyros" strategy="lazyOnload">
      {`var head=document.head;var script=document.createElement('script');script.type='text/javascript';script.src="https://grw.cekat.ai/v1/lst/universal-script?ph=${HYROS_ID}&tag=!clicked&ref_url="+encodeURI(document.URL);head.appendChild(script);`}
    </Script>
  );
}
