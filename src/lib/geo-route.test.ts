import { describe, it, expect } from "vitest";
import { toEnglishPath } from "./geo-route";

describe("toEnglishPath", () => {
  it("maps the root to /en", () => {
    expect(toEnglishPath("/")).toBe("/en");
  });

  it("prefixes same-slug routes (products, blog hub, contact, legal)", () => {
    expect(toEnglishPath("/chat")).toBe("/en/chat");
    expect(toEnglishPath("/blog")).toBe("/en/blog");
    expect(toEnglishPath("/privacy-policy")).toBe("/en/privacy-policy");
  });

  it("never redirects a blog article, whose translation may not exist", () => {
    // Regression guard: Indonesian-only posts have no /en/blog/<slug>, so
    // redirecting turned a healthy article into a 404 for every visitor (and
    // crawler) outside Indonesia.
    expect(toEnglishPath("/blog/retensi-pelanggan")).toBeNull();
    expect(toEnglishPath("/blog/any-slug-at-all")).toBeNull();
  });

  it("translates standalone pages whose slug differs per locale", () => {
    // /harga has an English twin at /en/pricing; sending it to /en/harga
    // would 404 for every visitor outside Indonesia.
    expect(toEnglishPath("/harga")).toBe("/en/pricing");
  });

  it("translates localized landing hub segments", () => {
    expect(toEnglishPath("/fitur")).toBe("/en/features");
    expect(toEnglishPath("/industri")).toBe("/en/industries");
    expect(toEnglishPath("/solusi")).toBe("/en/solutions");
  });

  it("translates localized landing slugs via the registry", () => {
    expect(toEnglishPath("/fitur/wa-blast")).toBe("/en/features/whatsapp-blast");
    expect(toEnglishPath("/fitur/chatbot")).toBe("/en/features/ai-chatbot");
  });

  it("does not redirect an Indonesian-only landing twin", () => {
    // Sending these to the English hub silently lost the page the visitor
    // actually asked for.
    expect(toEnglishPath("/fitur/whatsapp-bot")).toBeNull();
    expect(toEnglishPath("/fitur/slug-that-does-not-exist")).toBeNull();
  });
});
