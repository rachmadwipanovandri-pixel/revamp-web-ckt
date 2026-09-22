import { describe, it, expect } from "vitest";
import {
  whatsAppNumberForCountry,
  whatsAppUrlFor,
  WHATSAPP_NUMBERS,
  WHATSAPP_MESSAGE_ID,
  WHATSAPP_MESSAGE_EN,
} from "./links";

describe("whatsAppNumberForCountry", () => {
  it("uses the Indonesian (Verified) number for ID", () => {
    expect(whatsAppNumberForCountry("ID")).toBe(WHATSAPP_NUMBERS.id);
    expect(WHATSAPP_NUMBERS.id).toBe("6287751700285");
  });

  it("uses the Malaysia Official number for MY and SG", () => {
    expect(whatsAppNumberForCountry("MY")).toBe(WHATSAPP_NUMBERS.my);
    expect(whatsAppNumberForCountry("SG")).toBe(WHATSAPP_NUMBERS.my);
    expect(WHATSAPP_NUMBERS.my).toBe("60186363670");
  });

  it("uses the Global number for any other country", () => {
    for (const cc of ["US", "GB", "AU", "IN", "JP"]) {
      expect(whatsAppNumberForCountry(cc)).toBe(WHATSAPP_NUMBERS.global);
    }
    expect(WHATSAPP_NUMBERS.global).toBe("15559925888");
  });

  it("falls back to the Indonesian number when geo is unknown", () => {
    expect(whatsAppNumberForCountry(null)).toBe(WHATSAPP_NUMBERS.id);
    expect(whatsAppNumberForCountry("")).toBe(WHATSAPP_NUMBERS.id);
    expect(whatsAppNumberForCountry("XX")).toBe(WHATSAPP_NUMBERS.id);
  });

  it("is case-insensitive", () => {
    expect(whatsAppNumberForCountry("my")).toBe(WHATSAPP_NUMBERS.my);
    expect(whatsAppNumberForCountry("us")).toBe(WHATSAPP_NUMBERS.global);
  });
});

describe("whatsAppUrlFor — message follows locale, number follows country", () => {
  const textOf = (url: string) =>
    decodeURIComponent(new URL(url).searchParams.get("text") ?? "");
  const numberOf = (url: string) => new URL(url).pathname.replace(/^\//, "");

  it("uses the Bahasa message on the id locale (any country)", () => {
    for (const cc of ["ID", "US", "MY", null]) {
      expect(textOf(whatsAppUrlFor(cc, "id"))).toBe(WHATSAPP_MESSAGE_ID);
    }
  });

  it("uses the English message on the en locale (any country)", () => {
    for (const cc of ["ID", "US", "SG", null]) {
      expect(textOf(whatsAppUrlFor(cc, "en"))).toBe(WHATSAPP_MESSAGE_EN);
    }
  });

  it("defaults to Bahasa when the locale is unset", () => {
    expect(textOf(whatsAppUrlFor("US"))).toBe(WHATSAPP_MESSAGE_ID);
  });

  it("still picks the number by country regardless of locale", () => {
    expect(numberOf(whatsAppUrlFor("US", "id"))).toBe(WHATSAPP_NUMBERS.global);
    expect(numberOf(whatsAppUrlFor("MY", "en"))).toBe(WHATSAPP_NUMBERS.my);
    expect(numberOf(whatsAppUrlFor("ID", "en"))).toBe(WHATSAPP_NUMBERS.id);
  });
});
