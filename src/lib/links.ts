/** Shared outbound links used across CTAs, the navbar, and the floating button. */

export const REGISTER_URL = "https://chat.cekat.ai/register";
export const LOGIN_URL = "https://chat.cekat.ai/login";

/** Prefilled WhatsApp message, localized to match the visitor's region. */
export const WHATSAPP_MESSAGE_EN =
  "Hi! I saw Cekat.AI on your homepage. Could you explain what Cekat.AI is?";
export const WHATSAPP_MESSAGE_ID =
  "Halo! Saya melihat Cekat.AI di website Anda. Bisa dijelaskan apa itu Cekat.AI?";

/** Region-specific WhatsApp numbers, chosen by the visitor's country. */
export const WHATSAPP_NUMBERS = {
  /** Indonesia — CekatAI Verified. */
  id: "6287751700285",
  /** Malaysia & Singapore — CekatAI Malaysia Official. */
  my: "60186363670",
  /** Everywhere else — Cekat Global. */
  global: "15559925888",
} as const;

function whatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Picks the WhatsApp number for an ISO country code (from geo headers). */
export function whatsAppNumberForCountry(country?: string | null): string {
  switch ((country ?? "").toUpperCase()) {
    case "MY":
    case "SG":
      return WHATSAPP_NUMBERS.my;
    case "":
    case "XX":
    case "ID":
      // Unknown geo falls back to the Indonesian default (the primary market).
      return WHATSAPP_NUMBERS.id;
    default:
      return WHATSAPP_NUMBERS.global;
  }
}

/** Prefill message in the language of the page the visitor is reading. */
function whatsAppMessageForLocale(locale?: string | null): string {
  return locale === "en" ? WHATSAPP_MESSAGE_EN : WHATSAPP_MESSAGE_ID;
}

/**
 * WhatsApp click-to-chat URL: the number is chosen by the visitor's country
 * (which regional team handles them), while the prefilled message follows the
 * page's locale (the language they are actually reading) so it stays in sync
 * with a manual language switch, not just geo.
 */
export function whatsAppUrlFor(
  country?: string | null,
  locale?: string | null,
): string {
  return whatsAppUrl(
    whatsAppNumberForCountry(country),
    whatsAppMessageForLocale(locale),
  );
}

/** Default (Indonesian) link — used for SSR and before geo resolves client-side. */
export const WHATSAPP_NUMBER = WHATSAPP_NUMBERS.id;
export const WHATSAPP_URL = whatsAppUrl(WHATSAPP_NUMBERS.id, WHATSAPP_MESSAGE_ID);
