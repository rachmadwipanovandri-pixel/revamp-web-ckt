import { describe, it, expect, vi } from "vitest";

vi.mock("./wordpress", () => ({
  getAllPostSlugs: vi.fn(async () => []),
  getAuthors: vi.fn(async () => []),
}));

import { pageUrls } from "./sitemap-data";

describe("pageUrls lastmod", () => {
  it("emits lastmod for landing content URLs when content files exist", () => {
    const urls = pageUrls();
    const landing = urls.find((u) => u.url.includes("/fitur/wa-blast"));
    expect(landing).toBeDefined();
    expect(landing?.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    // Static routes stay without lastmod (no accurate source).
    const home = urls.find((u) => u.url === "https://cekat.ai/");
    expect(home?.lastModified).toBeUndefined();
  });

  it("lists every registry landing in both locales with hreflang", () => {
    const urls = pageUrls();
    const feature = urls.find((u) => u.url === "https://cekat.ai/fitur/wa-blast");
    expect(feature?.languages).toEqual({
      en: "https://cekat.ai/en/features/whatsapp-blast",
      id: "https://cekat.ai/fitur/wa-blast",
      "x-default": "https://cekat.ai/fitur/wa-blast",
    });
  });
});
