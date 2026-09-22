import { describe, it, expect } from "vitest";
import { urlsetXml, sitemapIndexXml } from "./sitemap-xml";

function parse(xml: string) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const error = doc.querySelector("parsererror");
  if (error) throw new Error(`not well-formed: ${error.textContent}`);
  return doc;
}

describe("urlsetXml", () => {
  const xml = urlsetXml([
    {
      url: "https://cekat.ai/fitur/wa-blast",
      languages: {
        en: "https://cekat.ai/en/features/whatsapp-blast",
        id: "https://cekat.ai/fitur/wa-blast",
        "x-default": "https://cekat.ai/fitur/wa-blast",
      },
    },
    { url: "https://cekat.ai/fitur/whatsapp-bot" },
  ]);

  it("is well-formed XML rooted at urlset", () => {
    expect(parse(xml).documentElement.tagName).toBe("urlset");
  });

  it("declares the stylesheet so browsers render a readable table", () => {
    expect(xml).toContain(
      '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    );
    // The declaration must still come first or the document is invalid.
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it("emits hreflang alternates only for pages that have them", () => {
    const urls = [...parse(xml).getElementsByTagName("url")];
    expect(urls[0].getElementsByTagName("xhtml:link")).toHaveLength(3);
    expect(urls[1].getElementsByTagName("xhtml:link")).toHaveLength(0);
  });

  it("omits changefreq and priority, which Google ignores", () => {
    expect(xml).not.toContain("<changefreq>");
    expect(xml).not.toContain("<priority>");
  });

  it("escapes characters that would otherwise break the document", () => {
    const escaped = urlsetXml([
      { url: "https://cekat.ai/blog?a=1&b=2<x>" },
    ]);
    expect(escaped).toContain("&amp;");
    expect(escaped).not.toContain("&b=2");
    expect(parse(escaped).getElementsByTagName("loc")[0].textContent).toBe(
      "https://cekat.ai/blog?a=1&b=2<x>",
    );
  });

  it("includes lastmod only when supplied", () => {
    const withDate = urlsetXml([
      { url: "https://cekat.ai/blog/x", lastModified: "2026-07-29T10:39:22Z" },
    ]);
    expect(withDate).toContain("<lastmod>2026-07-29T10:39:22Z</lastmod>");
    expect(xml).not.toContain("<lastmod>");
  });
});

describe("sitemapIndexXml", () => {
  const xml = sitemapIndexXml([
    { url: "https://cekat.ai/sitemap-pages.xml" },
    {
      url: "https://cekat.ai/sitemap-blog.xml",
      lastModified: "2026-07-29T10:39:22Z",
    },
  ]);

  it("is well-formed XML rooted at sitemapindex", () => {
    expect(parse(xml).documentElement.tagName).toBe("sitemapindex");
  });

  it("lists each child sitemap", () => {
    const locs = [...parse(xml).getElementsByTagName("loc")].map(
      (node) => node.textContent,
    );
    expect(locs).toEqual([
      "https://cekat.ai/sitemap-pages.xml",
      "https://cekat.ai/sitemap-blog.xml",
    ]);
  });
});
