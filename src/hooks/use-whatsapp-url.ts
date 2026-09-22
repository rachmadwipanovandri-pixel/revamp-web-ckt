"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { whatsAppUrlFor } from "@/lib/links";

// The cookie is set once per session by the middleware and doesn't change
// while the page is open, so there is nothing to subscribe to.
function subscribe() {
  return () => {};
}

function readCountry(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)wa_country=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Region-specific WhatsApp URL. The number resolves client-side from the
 * `wa_country` cookie (set by the middleware from geo headers); the prefilled
 * message follows the current locale, so it always matches the page language
 * (SSR-stable, no flip on hydration). Only the number adapts after hydration,
 * keeping pages statically rendered.
 */
export function useWhatsAppUrl(): string {
  const locale = useLocale();
  return useSyncExternalStore(
    subscribe,
    () => whatsAppUrlFor(readCountry(), locale),
    () => whatsAppUrlFor(null, locale),
  );
}
