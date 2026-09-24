"use client";

import { useEffect } from "react";
import Script from "next/script";
import { onTrackerReadyIdle } from "@/lib/defer-third-party";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1023236368807376";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded?: boolean;
  version?: string;
};

type WindowWithFbq = Window & {
  fbq?: Fbq;
  _fbq?: unknown;
  __fbLoaded?: boolean;
};

/**
 * Meta Pixel without a render-blocking download.
 *
 * - Queue (`fbq` buffer + init + PageView) runs once in an effect — no
 *   React `<script>` (React 19 rejects executable scripts from components).
 * - Library injects on first interaction, 9s hybrid fallback, or pagehide,
 *   via `lazyOnload` `next/script` (DOM `createElement`, not JSX script).
 * - Attribution is on the URL + `cekat_ads` cookie from `proxy.ts`.
 */
export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;
    const w = window as WindowWithFbq;
    if (w.fbq) return;

    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as Fbq;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    w.fbq = fbq;
    if (!w._fbq) w._fbq = fbq;
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="lazyOnload">
        {onTrackerReadyIdle(`(function(f,b){
if(f.__fbLoaded)return;
f.__fbLoaded=1;
var s=b.createElement("script");
s.async=1;
s.src="https://connect.facebook.net/en_US/fbevents.js";
b.head.appendChild(s);
})(window,document);`)}
      </Script>
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
