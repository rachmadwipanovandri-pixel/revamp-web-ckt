import type { Locale } from "@/i18n/routing";

/**
 * Pricing matrix.
 *
 * Prices and numbers live here, NOT in the message files. Duplicating them per
 * locale guarantees drift, and a wrong price is a commercial problem rather
 * than a typo. Only prose (tier names, row labels, text values) is translated,
 * referenced from here by message key. Same split as `home/comparison-table`.
 */

/** One cell of the feature matrix. */
export type Cell =
  | boolean
  /** An integer, formatted per locale, optionally prefixed ("Up to 10,000"). */
  | { number: number; prefixKey?: string }
  /** Prose, resolved from `pricing.values.<textKey>`. */
  | { textKey: string };

export interface Tier {
  /** Stable id; also the message key under `pricing.<plan>.tiers`. */
  id: "starter" | "pro" | "business" | "enterprise" | "custom";
  /** Monthly price in IDR, or null where none is published. */
  priceIDR: number | null;
  /**
   * Quote-based tier: renders "Custom" and sends the visitor to sales. Kept
   * separate from `priceIDR === null` because a locale can withhold prices
   * entirely (see `showsPrices`), and an unpriced tier is not a bespoke one.
   */
  quoteOnly?: boolean;
  /** Highlighted as the recommended tier. */
  popular?: boolean;
  /** Minimum contract value, shown under the price where it applies. */
  minBillingIDR?: number;
}

export interface PlanRow {
  /** Message key under `pricing.<plan>.rows`. */
  id: string;
  /** One cell per tier, in tier order. */
  cells: Cell[];
}

export interface Plan {
  id: PlanId;
  tiers: Tier[];
  rows: PlanRow[];
  /** Rows surfaced on the card itself; the rest live in the comparison table. */
  cardRowIds: string[];
}

export type PlanId = "chat" | "crm" | "marketing";

/** Tab order on the page. `threeSixty` is a contact block, not a price grid. */
export const PLAN_TABS = ["chat", "crm", "marketing", "threeSixty"] as const;
export type PlanTab = (typeof PLAN_TABS)[number];

const TRUE_ALL: Cell[] = [true, true, true, true];

export const PLANS: Record<PlanId, Plan> = {
  chat: {
    id: "chat",
    tiers: [
      { id: "pro", priceIDR: 1_499_000 },
      { id: "business", priceIDR: 3_799_000, popular: true },
      { id: "enterprise", priceIDR: 5_799_000 },
      { id: "custom", priceIDR: null, quoteOnly: true },
    ],
    cardRowIds: ["waba", "mau", "aiCredits", "seats", "aiType"],
    rows: [
      { id: "channels", cells: [true, true, true, { textKey: "custom" }] },
      {
        id: "waba",
        cells: [
          { number: 1 },
          { number: 3 },
          { number: 5 },
          { textKey: "custom" },
        ],
      },
      {
        id: "mau",
        cells: [
          { number: 3_000 },
          { number: 10_000 },
          { number: 30_000 },
          { textKey: "unlimited" },
        ],
      },
      {
        id: "aiCredits",
        cells: [
          { number: 15_000 },
          { number: 50_000 },
          { number: 150_000 },
          { textKey: "custom" },
        ],
      },
      {
        id: "aiType",
        cells: [
          { textKey: "aiSimple" },
          { textKey: "aiFull" },
          { textKey: "aiFull" },
          { textKey: "aiFull" },
        ],
      },
      {
        id: "seats",
        cells: [
          { number: 5 },
          { number: 7 },
          { number: 10 },
          { textKey: "custom" },
        ],
      },
      { id: "openApi", cells: TRUE_ALL },
      { id: "analytics", cells: TRUE_ALL },
      {
        id: "support",
        cells: [
          { textKey: "supportPro" },
          { textKey: "supportBusiness" },
          { textKey: "supportEnterprise" },
          { textKey: "supportEnterprise" },
        ],
      },
      { id: "flow", cells: [false, true, true, true] },
      { id: "followUp", cells: [false, true, true, true] },
      { id: "ticketing", cells: [false, true, true, true] },
      { id: "automation", cells: [false, false, true, true] },
      { id: "csat", cells: [false, false, true, true] },
    ],
  },

  crm: {
    id: "crm",
    tiers: [
      { id: "pro", priceIDR: 1_000_000 },
      { id: "business", priceIDR: 2_000_000, popular: true },
      { id: "enterprise", priceIDR: 3_000_000 },
      { id: "custom", priceIDR: null, quoteOnly: true },
    ],
    cardRowIds: ["contactStorage", "agents", "unifiedData", "automations"],
    rows: [
      { id: "contactList", cells: TRUE_ALL },
      { id: "unifiedData", cells: TRUE_ALL },
      { id: "boards", cells: TRUE_ALL },
      { id: "views", cells: TRUE_ALL },
      {
        id: "contactStorage",
        cells: [
          { number: 10_000, prefixKey: "upTo" },
          { number: 50_000, prefixKey: "upTo" },
          { number: 100_000, prefixKey: "upTo" },
          { textKey: "unlimited" },
        ],
      },
      {
        id: "agents",
        cells: [
          { textKey: "agentsUpgradable" },
          { textKey: "agentsUpgradable" },
          { textKey: "agentsUpgradable" },
          { textKey: "agentsUpgradable" },
        ],
      },
      { id: "automations", cells: TRUE_ALL },
      { id: "openApi", cells: TRUE_ALL },
    ],
  },

  marketing: {
    id: "marketing",
    tiers: [
      { id: "pro", priceIDR: 2_000_000 },
      { id: "business", priceIDR: 4_000_000, popular: true },
      { id: "enterprise", priceIDR: 5_000_000 },
      { id: "custom", priceIDR: null, quoteOnly: true },
    ],
    cardRowIds: ["mau", "adsTracking", "analytics", "setup"],
    rows: [
      {
        id: "mau",
        cells: [
          { number: 3_000, prefixKey: "upTo" },
          { number: 10_000, prefixKey: "upTo" },
          { number: 30_000, prefixKey: "upTo" },
          { textKey: "custom" },
        ],
      },
      { id: "support", cells: TRUE_ALL },
      { id: "analytics", cells: TRUE_ALL },
      { id: "adsTracking", cells: TRUE_ALL },
      { id: "tools", cells: TRUE_ALL },
      { id: "setup", cells: TRUE_ALL },
    ],
  },
};

/**
 * Chat, as sold to the English-speaking market: a cheaper Starter below Pro,
 * and no Enterprise tier. Pro and Business carry the exact specs they have in
 * PLANS, one slot further down.
 *
 * Prices are deliberately absent, not unknown. English visitors are largely
 * outside Indonesia (see `whatsAppNumberForCountry`), so a Rupiah figure is
 * noise; `showsPrices` keeps this page contact-led. Publishing prices here
 * means supplying all four, Starter included.
 */
const CHAT_EN: Plan = {
  id: "chat",
  tiers: [
    { id: "starter", priceIDR: null },
    { id: "pro", priceIDR: null },
    { id: "business", priceIDR: null, popular: true },
    { id: "custom", priceIDR: null, quoteOnly: true },
  ],
  cardRowIds: ["waba", "mau", "aiCredits", "seats", "aiType"],
  rows: [
    { id: "channels", cells: [true, true, true, { textKey: "custom" }] },
    {
      id: "waba",
      cells: [
        { number: 1 },
        { number: 1 },
        { number: 3 },
        { textKey: "custom" },
      ],
    },
    {
      id: "mau",
      cells: [
        { number: 1_000 },
        { number: 3_000 },
        { number: 10_000 },
        { textKey: "custom" },
      ],
    },
    {
      id: "aiCredits",
      cells: [
        { number: 5_000 },
        { number: 15_000 },
        { number: 50_000 },
        { textKey: "custom" },
      ],
    },
    {
      id: "aiType",
      cells: [
        { textKey: "aiSimple" },
        { textKey: "aiSimple" },
        { textKey: "aiFull" },
        { textKey: "aiFull" },
      ],
    },
    {
      id: "seats",
      cells: [
        { number: 3 },
        { number: 5 },
        { number: 7 },
        { textKey: "custom" },
      ],
    },
    { id: "openApi", cells: TRUE_ALL },
    { id: "analytics", cells: TRUE_ALL },
    {
      id: "support",
      cells: [
        { textKey: "supportStarter" },
        { textKey: "supportPro" },
        { textKey: "supportBusiness" },
        { textKey: "supportEnterprise" },
      ],
    },
    { id: "flow", cells: [false, false, true, true] },
    { id: "followUp", cells: [false, false, true, true] },
    { id: "ticketing", cells: [false, false, true, true] },
    // Automation and CSAT sat at Enterprise, which this lineup retires, so they
    // stay above Business rather than dropping into it.
    { id: "automation", cells: [false, false, false, true] },
    { id: "csat", cells: [false, false, false, true] },
  ],
};

/**
 * The international lineup, assembled once. Identity matters: `usePlans`
 * hands these to useSyncExternalStore, which compares snapshots by
 * reference, so building this per call re-renders forever.
 */
const PLANS_INTL: Record<PlanId, Plan> = { ...PLANS, chat: CHAT_EN };

/**
 * Taglines follow the SLOT, not the tier id.
 *
 * A tier id means the same specs in both lineups: Pro is one WABA number,
 * 3.000 MAU and five seats either way. What changes is which end tier the
 * lineup carries, so Pro is the entry tier at home and the middle tier abroad,
 * and the sentence that fits it changes with the slot rather than the id.
 * Names stay keyed by id, because Pro is called Pro wherever it sits.
 *
 * Indexed because every lineup is exactly four tiers, cheapest first and the
 * quote-based one last; `pricing.test.ts` holds that shape so this cannot rot.
 */
export const TAGLINE_SLOTS = ["entry", "mid", "top", "custom"] as const;

export function taglineSlot(index: number): (typeof TAGLINE_SLOTS)[number] {
  return TAGLINE_SLOTS[index] ?? "custom";
}

/**
 * The lineup a locale sells, used for server rendering. It is also what
 * crawlers index, so it stays keyed to the language rather than to geography,
 * which no static render can know. Only Chat differs; CRM and Marketing are
 * shared.
 */
export function plansFor(locale: Locale): Record<PlanId, Plan> {
  return locale === "en" ? PLANS_INTL : PLANS;
}

/**
 * Indonesia buys the domestic lineup, which tops out at Enterprise; everywhere
 * else gets the international one, which opens at Starter instead. Unknown geo
 * falls back to the domestic lineup, matching `whatsAppNumberForCountry`: the
 * primary market is the safer default.
 *
 * Geography rather than language, because an Indonesian reading the site in
 * English is still buying in Indonesia. Resolved client-side from the
 * `wa_country` cookie, so pages stay static; see `usePlans`.
 */
export function isDomesticMarket(country?: string | null): boolean {
  const code = (country ?? "").toUpperCase();
  return code === "" || code === "XX" || code === "ID";
}

export function plansForCountry(country?: string | null): Record<PlanId, Plan> {
  return isDomesticMarket(country) ? PLANS : PLANS_INTL;
}

/**
 * Locales that advertise prices. Empty today: both pages are contact-led, so
 * cards and table headers omit the price entirely and every CTA goes to
 * WhatsApp. The `priceIDR` figures in PLANS stay put, because prices are being
 * withheld rather than retired; re-enabling a locale means adding it here.
 */
const PRICED_LOCALES: readonly Locale[] = [];

export function showsPrices(locale: Locale): boolean {
  return PRICED_LOCALES.includes(locale);
}

/**
 * Locale-aware Rupiah, e.g. "Rp 1.499.000" (id) / "Rp 1,499,000" (en).
 * The separator is a NON-BREAKING space: wherever this lands (card, table
 * header, or mid-sentence) the "Rp" must never be orphaned onto its own line,
 * which reads as a broken price.
 */
export function formatIDR(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(
    locale === "id" ? "id-ID" : "en-US",
  ).format(amount);
  return `Rp\u00A0${formatted}`;
}

/** Locale-aware plain integer, e.g. "10.000" (id) / "10,000" (en). */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US").format(
    value,
  );
}

/** Lowest and highest advertised monthly price, for AggregateOffer JSON-LD. */
export function priceRangeIDR(): { low: number; high: number } {
  const prices = Object.values(PLANS)
    .flatMap((plan) => plan.tiers)
    .map((tier) => tier.priceIDR)
    .filter((price): price is number => price !== null);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}
