import { describe, it, expect } from "vitest";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  profilePageJsonLd,
} from "./jsonld";

describe("articleJsonLd", () => {
  it("emits BlogPosting with reciprocal-friendly absolute fields", () => {
    const data = articleJsonLd({
      headline: "How to retain customers",
      description: "A practical guide.",
      url: "https://cekat.ai/blog/retain",
      image: {
        url: "https://example.com/cover.jpg",
        width: 1200,
        height: 630,
      },
      authorName: "Ayu",
      datePublished: "2026-01-01T00:00:00Z",
      dateModified: "2026-01-02T00:00:00Z",
      section: "CRM",
      language: "id-ID",
      keywords: ["retensi", "crm"],
      wordCount: 420,
    });

    expect(data["@type"]).toBe("BlogPosting");
    expect(data.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": "https://cekat.ai/blog/retain",
    });
    expect(Array.isArray(data.image)).toBe(true);
    expect(data.author).toMatchObject({ "@type": "Person", name: "Ayu" });
    expect(data.publisher).toMatchObject({ "@id": "https://cekat.ai/#organization" });
    expect(data.isPartOf).toMatchObject({ "@type": "Blog" });
    expect(data.keywords).toEqual(["retensi", "crm"]);
    expect(data.wordCount).toBe(420);
    expect(data.dateModified).toBe("2026-01-02T00:00:00Z");
  });
});

describe("breadcrumbJsonLd", () => {
  it("omits item on the last (current) node", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", url: "https://cekat.ai/" },
      { name: "Blog", url: "https://cekat.ai/blog" },
      { name: "Article title" },
    ]);
    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cekat.ai/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://cekat.ai/blog",
      },
      { "@type": "ListItem", position: 3, name: "Article title" },
    ]);
  });
});

describe("profilePageJsonLd", () => {
  it("emits ProfilePage with a Person mainEntity", () => {
    const data = profilePageJsonLd({
      url: "https://cekat.ai/blog/author/superadmin",
      name: "Cekat AI",
      description: "Writes about AI.",
      image: "https://example.com/a.png",
    });
    expect(data["@type"]).toBe("ProfilePage");
    expect(data.mainEntity).toMatchObject({
      "@type": "Person",
      name: "Cekat AI",
      description: "Writes about AI.",
      image: "https://example.com/a.png",
      url: "https://cekat.ai/blog/author/superadmin",
    });
  });
});
