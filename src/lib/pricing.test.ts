import { describe, it, expect } from "vitest";
import id from "../../messages/id.json";
import en from "../../messages/en.json";
import {
  PLANS,
  plansFor,
  plansForCountry,
  isDomesticMarket,
  showsPrices,
  formatIDR,
  formatNumber,
  priceRangeIDR,
  TAGLINE_SLOTS,
  taglineSlot,
} from "./pricing";

const LOCALES = { id, en } as const;

/** Every plan any visitor can be served: either lineup, either language. */
const ALL_PLANS = [
  ...Object.values(plansForCountry("ID")),
  ...Object.values(plansForCountry("US")),
];

describe("formatIDR", () => {
  // "Rp" is glued to the amount with a non-breaking space so it can never be
  // orphaned onto its own line in a narrow card, which reads as a broken price.
  const NBSP = "\u00A0";

  it("uses the separator each locale expects", () => {
    expect(formatIDR(1_499_000, "id")).toBe(`Rp${NBSP}1.499.000`);
    expect(formatIDR(1_499_000, "en")).toBe(`Rp${NBSP}1,499,000`);
  });

  it("formats the minimum contract value", () => {
    expect(formatIDR(20_000_000, "id")).toBe(`Rp${NBSP}20.000.000`);
  });

  it("never emits a breaking space after Rp", () => {
    expect(formatIDR(5_799_000, "id")).not.toContain("Rp ");
  });
});

describe("formatNumber", () => {
  it("formats plain counts per locale", () => {
    expect(formatNumber(150_000, "id")).toBe("150.000");
    expect(formatNumber(150_000, "en")).toBe("150,000");
  });
});

describe("PLANS integrity", () => {
  it("gives every row exactly one cell per tier", () => {
    for (const plan of ALL_PLANS) {
      for (const row of plan.rows) {
        expect(
          row.cells.length,
          `${plan.id}.${row.id} has ${row.cells.length} cells for ${plan.tiers.length} tiers`,
        ).toBe(plan.tiers.length);
      }
    }
  });

  it("only surfaces card rows that actually exist", () => {
    for (const plan of ALL_PLANS) {
      const rowIds = new Set(plan.rows.map((row) => row.id));
      for (const id of plan.cardRowIds) {
        expect(rowIds.has(id), `${plan.id}.cardRowIds -> ${id}`).toBe(true);
      }
    }
  });

  it("marks exactly one recommended tier per plan", () => {
    for (const plan of ALL_PLANS) {
      const popular = plan.tiers.filter((tier) => tier.popular);
      expect(popular.length, `${plan.id}`).toBe(1);
    }
  });

  it("gives every plan exactly one quote-based tier", () => {
    for (const plan of ALL_PLANS) {
      const quote = plan.tiers.filter((tier) => tier.quoteOnly);
      expect(quote.length, `${plan.id}`).toBe(1);
      expect(quote[0].id).toBe("custom");
    }
  });

  it("keeps the Indonesian price data intact while it is withheld", () => {
    // The page hides these today, but the figures stay so re-enabling prices is
    // a change to showsPrices() alone. A missing one would surface as a blank
    // card the moment that happens.
    for (const plan of Object.values(plansFor("id"))) {
      for (const tier of plan.tiers) {
        if (tier.quoteOnly) continue;
        expect(tier.priceIDR, `${plan.id}.${tier.id}`).toBeTypeOf("number");
      }
    }
  });

  it("reports the advertised price range for JSON-LD", () => {
    // Lowest published price is CRM Pro; highest is Chat Enterprise.
    expect(priceRangeIDR()).toEqual({ low: 1_000_000, high: 5_799_000 });
  });
});

describe("per-locale plans", () => {
  it("withholds prices in both locales", () => {
    expect(showsPrices("id")).toBe(false);
    expect(showsPrices("en")).toBe(false);
  });

  it("shares CRM and Marketing across locales", () => {
    expect(plansFor("en").crm).toBe(PLANS.crm);
    expect(plansFor("en").marketing).toBe(PLANS.marketing);
  });

  it("sells a different Chat lineup per locale", () => {
    expect(plansFor("id").chat.tiers.map((tier) => tier.id)).toEqual([
      "pro",
      "business",
      "enterprise",
      "custom",
    ]);
    expect(plansFor("en").chat.tiers.map((tier) => tier.id)).toEqual([
      "starter",
      "pro",
      "business",
      "custom",
    ]);
  });

  it("publishes no price on the English Chat lineup", () => {
    // The page hides them, so a stray figure here could only leak by mistake.
    for (const tier of plansFor("en").chat.tiers) {
      expect(tier.priceIDR, tier.id).toBeNull();
    }
  });

  it("keeps English Pro and Business on the specs Indonesian sells", () => {
    // Starter is genuinely new; the other two only shift down a slot.
    const cellsFor = (locale: "id" | "en", row: string, tier: string) => {
      const plan = plansFor(locale).chat;
      const index = plan.tiers.findIndex((entry) => entry.id === tier);
      return plan.rows.find((entry) => entry.id === row)!.cells[index];
    };
    for (const row of ["waba", "mau", "aiCredits", "seats", "aiType"]) {
      for (const tier of ["pro", "business"]) {
        expect(cellsFor("en", row, tier), `${row}.${tier}`).toEqual(
          cellsFor("id", row, tier),
        );
      }
    }
  });
});

describe("lineup by market", () => {
  it("keeps Indonesia, and unknown geo, on the domestic lineup", () => {
    for (const country of ["ID", "id", "", "XX", null, undefined]) {
      expect(isDomesticMarket(country), `${country}`).toBe(true);
      expect(plansForCountry(country).chat.tiers.map((t) => t.id)).toEqual([
        "pro",
        "business",
        "enterprise",
        "custom",
      ]);
    }
  });

  it("opens at Starter everywhere else", () => {
    for (const country of ["US", "SG", "MY", "AU"]) {
      expect(isDomesticMarket(country), country).toBe(false);
      expect(plansForCountry(country).chat.tiers.map((t) => t.id)).toEqual([
        "starter",
        "pro",
        "business",
        "custom",
      ]);
    }
  });

  it("varies only Chat, since CRM and Marketing sell one lineup", () => {
    const home = plansForCountry("ID");
    const away = plansForCountry("US");
    expect(away.crm).toBe(home.crm);
    expect(away.marketing).toBe(home.marketing);
    expect(away.chat).not.toBe(home.chat);
  });

  it("gives a tier id the same specs in either lineup", () => {
    // Pro is Pro wherever it sits; only the end tiers differ. This is what
    // lets names key off the id while taglines key off the slot.
    const home = plansForCountry("ID").chat;
    const away = plansForCountry("US").chat;
    for (const id of ["pro", "business"] as const) {
      const at = (plan: typeof home) =>
        plan.tiers.findIndex((t) => t.id === id);
      for (const row of ["waba", "mau", "aiCredits", "seats"]) {
        const cellOf = (plan: typeof home) =>
          plan.rows.find((r) => r.id === row)?.cells[at(plan)];
        expect(cellOf(away), `${id}.${row}`).toEqual(cellOf(home));
      }
    }
  });

  it("returns a stable object per market, not a fresh one per call", () => {
    // usePlans feeds useSyncExternalStore, which compares snapshots by
    // identity. A spread per call renders forever, which is exactly what
    // happened before this was pinned.
    expect(plansForCountry("ID")).toBe(plansForCountry("ID"));
    expect(plansForCountry("US")).toBe(plansForCountry("SG"));
    expect(plansFor("en")).toBe(plansForCountry("US"));
    expect(plansFor("id")).toBe(plansForCountry("ID"));
  });

  it("keeps every lineup four tiers deep, so slot indexing holds", () => {
    for (const plan of ALL_PLANS) {
      expect(plan.tiers.length, `${plan.id}`).toBe(TAGLINE_SLOTS.length);
      expect(taglineSlot(plan.tiers.length - 1)).toBe("custom");
    }
  });
});

describe("pricing copy", () => {
  it.each(["id", "en"] as const)(
    "%s resolves every message key the matrix references",
    (locale) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- walking raw message JSON
      const pricing = (LOCALES[locale] as any).pricing;
      const values: Record<string, string> = pricing.values;

      // Both lineups, because geography picks one and language the other: an
      // Indonesian reading English gets the domestic tiers from EN messages.
      const lineups = [plansForCountry("ID"), plansForCountry("US")];
      for (const plan of lineups.flatMap((lineup) => Object.values(lineup))) {
        const copy = pricing[plan.id];
        expect(copy, `pricing.${plan.id}`).toBeTruthy();

        for (const tier of plan.tiers) {
          const tierCopy = copy.tiers[tier.id];
          expect(
            tierCopy?.name,
            `${plan.id}.tiers.${tier.id}.name`,
          ).toBeTruthy();
        }

        plan.tiers.forEach((_, index) => {
          const slot = taglineSlot(index);
          expect(
            copy.taglines?.[slot],
            `${plan.id}.taglines.${slot}`,
          ).toBeTruthy();
        });

        for (const row of plan.rows) {
          expect(copy.rows[row.id], `${plan.id}.rows.${row.id}`).toBeTruthy();

          for (const cell of row.cells) {
            if (typeof cell === "boolean") continue;
            const key = "textKey" in cell ? cell.textKey : cell.prefixKey;
            if (!key) continue;
            expect(values[key], `pricing.values.${key}`).toBeTruthy();
          }
        }
      }
    },
  );

  it.each(["id", "en"] as const)("%s uses no em dashes", (locale) => {
    expect(JSON.stringify(LOCALES[locale].pricing)).not.toContain("—");
  });
});
