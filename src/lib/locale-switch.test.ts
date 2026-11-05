import { describe, expect, it } from "vitest";
import { switchLocaleHref } from "./locale-switch";

describe("switchLocaleHref", () => {
  it.each(["en", "id", "jp", "kr", "cn"] as const)(
    "keeps the case-study detail when switching from cn to %s",
    (locale) => {
      expect(
        switchLocaleHref("/case-studies/[slug]", "holywings", "cn", locale),
      ).toEqual({
        pathname: "/case-studies/[slug]",
        params: { slug: "holywings" },
      });
    },
  );
});
