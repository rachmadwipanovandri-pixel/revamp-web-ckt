import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { usePlans } from "./use-plans";

function Lineup() {
  return (
    <span data-testid="lineup">
      {usePlans()
        .chat.tiers.map((tier) => tier.id)
        .join(",")}
    </span>
  );
}

/** Mounts fresh each call, so a test can check several cases in a row. */
function renderAt(locale: "id" | "en") {
  cleanup();
  render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <Lineup />
    </NextIntlClientProvider>,
  );
  return screen.getByTestId("lineup").textContent;
}

const DOMESTIC = "pro,business,enterprise,custom";
const INTERNATIONAL = "starter,pro,business,custom";

function setCountry(code: string | null) {
  document.cookie = code
    ? `wa_country=${code}; path=/`
    : "wa_country=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

afterEach(() => setCountry(null));

describe("usePlans", () => {
  it("keeps an Indonesian visitor on the domestic lineup in English", () => {
    // The case this exists for: someone in Indonesia who switched to English
    // is still buying in Indonesia, so Enterprise stays and Starter does not
    // appear.
    setCountry("ID");
    expect(renderAt("en")).toBe(DOMESTIC);
  });

  it("gives a foreign visitor the international lineup on Indonesian pages", () => {
    setCountry("US");
    expect(renderAt("id")).toBe(INTERNATIONAL);
  });

  it("agrees with the page when country and language already match", () => {
    setCountry("ID");
    expect(renderAt("id")).toBe(DOMESTIC);
    setCountry("SG");
    expect(renderAt("en")).toBe(INTERNATIONAL);
  });

  it("falls back to the locale's own lineup with no cookie", () => {
    // Crawlers and the first paint land here, so this is what gets indexed.
    setCountry(null);
    expect(renderAt("id")).toBe(DOMESTIC);
    expect(renderAt("en")).toBe(INTERNATIONAL);
  });
});
