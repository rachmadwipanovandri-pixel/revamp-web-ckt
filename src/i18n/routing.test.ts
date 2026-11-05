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

  it("exposes case-study listings and details at the studi-kasus paths", () => {
    expect(routing.pathnames["/case-studies"]).toMatchObject({
      en: "/studi-kasus",
      id: "/studi-kasus",
    });
    expect(routing.pathnames["/case-studies/[slug]"]).toMatchObject({
      en: "/studi-kasus/[slug]",
      id: "/studi-kasus/[slug]",
      jp: "/case-studies/[slug]",
    });
    expect(routing.pathnames["/case-studies"]).toMatchObject({
      jp: "/case-studies",
    });
  });
});
