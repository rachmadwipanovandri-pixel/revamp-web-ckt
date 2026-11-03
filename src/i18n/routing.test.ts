import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing", () => {
  it("declares five locales with id as default and no auto-detection", () => {
    expect(routing.locales).toEqual(["en", "id", "cn", "jp", "kr"]);
    expect(routing.defaultLocale).toBe("id");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.localeDetection).toBe(false);
  });

  it("serves the sales enquiry route at the public contact-us slug", () => {
    expect(routing.pathnames["/contact-sales"]).toBe("/contact-us");
    expect(routing.pathnames["/blog"]).toBe("/blog");
  });
});
