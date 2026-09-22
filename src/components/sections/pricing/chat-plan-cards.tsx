"use client";

import { usePlans } from "@/hooks/use-plans";
import { PricingCards } from "./pricing-cards";

/**
 * The Chat tier cards, with the lineup chosen by the visitor's country rather
 * than the page's language. A thin client wrapper exists only so a server
 * component (the homepage teaser) can render geo-aware cards without becoming
 * dynamic itself: the page stays static and the lineup settles on hydration.
 */
export function ChatPlanCards() {
  return <PricingCards plan={usePlans().chat} />;
}
