"use client";

import { useEffect } from "react";
import { deriveMissingAdParams } from "@/lib/ad-params";

/**
 * Writes derived params (`c_source`, `c_adid`) into the address bar on an ad
 * landing. Returns `null` — zero DOM, zero network.
 *
 * Campaign context is NOT waiting on this component:
 * - `proxy.ts` captures the full UTM/click-id query into the `cekat_ads`
 *   cookie on the edge response (and `extractAdParams` already fills
 *   `c_source` / `c_adid` there), so GTM/Meta/HYROS reading cookies or the
 *   original URL see attribution before hydration.
 * - This only mirrors those derived keys into `location` for humans and any
 *   tag that reads the address bar after load. `replaceState` does not
 *   navigate or refetch.
 *
 * Run in an effect (post-paint) so it never competes with first contentful
 * paint. Organic landings are left untouched — see `deriveMissingAdParams`.
 */
export function AdParamsUrl() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!deriveMissingAdParams(url.searchParams)) return;
    window.history.replaceState(null, "", url.toString());
  }, []);

  return null;
}
