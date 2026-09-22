import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("declares id (default) and en with as-needed prefix and no auto-detection", () => {
    expect(routing.locales).toEqual(["en", "id"]);
    expect(routing.defaultLocale).toBe("id");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.localeDetection).toBe(false);
  });
});
