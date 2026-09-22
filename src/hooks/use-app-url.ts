"use client";

import { useSyncExternalStore } from "react";
import { AD_COOKIE, appendAdParams } from "@/lib/ad-params";

// The cookie is set by the middleware on landing and doesn't change while the
// page is open, so there is nothing to subscribe to.
function subscribe() {
  return () => {};
}

function readStored(): string {
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + AD_COOKIE + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Returns an app-subdomain URL (chat.cekat.ai/...) with the captured ad-
 * attribution params appended, read client-side from the `cekat_ads` cookie.
 * SSR renders the bare base URL, then it adapts after hydration — so pages
 * stay statically rendered.
 */
export function useAppUrl(base: string): string {
  return useSyncExternalStore(
    subscribe,
    () => appendAdParams(base, readStored()),
    () => base,
  );
}
