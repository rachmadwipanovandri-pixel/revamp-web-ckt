import { describe, it, expect } from "vitest";
import {
  htmlLang,
  localizedPath,
  alternates,
  alternatesFor,
  metaSnippet,
  reciprocalLanguages,
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

describe("metaSnippet", () => {
  it("returns cleaned text under the limit unchanged", () => {
    expect(metaSnippet("  Short   description.  ")).toBe("Short description.");
  });

  it("truncates on a sentence boundary when one fits", () => {
    const text =
      "Learn how AI agents handle WhatsApp support end to end for retail teams. This is a long trailing clause that must be cut because it blows past the snippet budget for SERPs.";
    const result = metaSnippet(text, 80);
    expect(result.endsWith(".")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(80);
  });

  it("falls back to a word boundary with an ellipsis", () => {
    const result = metaSnippet("word ".repeat(40), 40);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(41);
  });

  it("returns empty string for missing copy", () => {
    expect(metaSnippet(undefined)).toBe("");
    expect(metaSnippet("   ")).toBe("");
  });
});

describe("reciprocalLanguages", () => {
  it("uses en/id keys (not id-ID) with x-default → Indonesian", () => {
    expect(
      reciprocalLanguages({ en: "/en/blog/post", id: "/blog/post-id" }),
    ).toEqual({
      en: "https://cekat.ai/en/blog/post",
      id: "https://cekat.ai/blog/post-id",
      "x-default": "https://cekat.ai/blog/post-id",
    });
  });
});
