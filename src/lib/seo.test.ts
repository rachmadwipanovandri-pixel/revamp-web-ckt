import { describe, it, expect } from "vitest";
import {
  htmlLang,
  localizedPath,
  alternates,
  alternatesFor,
} from "@/lib/seo";

describe("htmlLang", () => {
  it("maps id to id-ID and everything else to en", () => {
    expect(htmlLang("id")).toBe("id-ID");
    expect(htmlLang("en")).toBe("en");
  });
});

describe("localizedPath", () => {
  it("keeps default locale (id) at root without prefix", () => {
    expect(localizedPath("id", "/crm")).toBe("/crm");
    expect(localizedPath("id", "/")).toBe("/");
  });
  it("prefixes non-default locale (en) with /en", () => {
    expect(localizedPath("en", "/crm")).toBe("/en/crm");
    expect(localizedPath("en", "/")).toBe("/en");
  });
});

describe("alternates", () => {
  it("builds the same hreflang languages map regardless of current locale", () => {
    const result = alternates("en", "/crm");
    expect(result.languages).toEqual({
      en: "https://cekat.ai/en/crm",
      id: "https://cekat.ai/crm",
      "x-default": "https://cekat.ai/crm",
    });
  });

  it("self-references the canonical for the default locale (id)", () => {
    expect(alternates("id", "/crm").canonical).toBe("https://cekat.ai/crm");
  });

  it("self-references the canonical for a non-default locale (en)", () => {
    expect(alternates("en", "/crm").canonical).toBe("https://cekat.ai/en/crm");
  });
});

describe("localized pathname segments", () => {
  it("maps /features to the localized /fitur segment for id", () => {
    expect(localizedPath("en", "/features")).toBe("/en/features");
    expect(localizedPath("id", "/features")).toBe("/fitur");
  });
});

describe("alternatesFor", () => {
  it("emits hreflang with per-locale slugs when both locales exist", () => {
    const paths = { en: "/en/features/whatsapp-blast", id: "/fitur/wa-blast" };
    expect(alternatesFor("id", paths)).toEqual({
      canonical: "https://cekat.ai/fitur/wa-blast",
      languages: {
        en: "https://cekat.ai/en/features/whatsapp-blast",
        id: "https://cekat.ai/fitur/wa-blast",
        "x-default": "https://cekat.ai/fitur/wa-blast",
      },
    });
  });

  it("emits canonical only (no hreflang) for a single-locale page", () => {
    const result = alternatesFor("id", { id: "/fitur/whatsapp-bulk" });
    expect(result.canonical).toBe("https://cekat.ai/fitur/whatsapp-bulk");
    expect(result.languages).toBeUndefined();
  });

  it("throws when the page does not exist in the requested locale", () => {
    expect(() => alternatesFor("en", { id: "/fitur/wa-blast" })).toThrow();
  });
});
