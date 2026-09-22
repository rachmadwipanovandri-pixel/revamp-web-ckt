"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import {
  plansFor,
  plansForCountry,
  type Plan,
  type PlanId,
} from "@/lib/pricing";

// Set once per session by the proxy and stable while the page is open, so
// there is nothing to subscribe to. Same contract as useWhatsAppUrl.
function subscribe() {
  return () => {};
}

function readCountry(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)wa_country=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * The tier lineup this visitor should see, chosen by where they are rather
 * than which language they picked: an Indonesian reading the English site is
 * still buying in Indonesia, so they keep the domestic lineup.
 *
 * The server snapshot is the locale's own lineup, which is what crawlers index
 * and what most visitors of that language get anyway; the cookie only corrects
 * the mismatched cases, chiefly an Indonesian who switched to English. With no
 * cookie the locale default stands, so nothing swaps for no reason.
 */
export function usePlans(): Record<PlanId, Plan> {
  const locale = useLocale() as Locale;
  return useSyncExternalStore(
    subscribe,
    () => {
      const country = readCountry();
      return country ? plansForCountry(country) : plansFor(locale);
    },
    () => plansFor(locale),
  );
}
