import { describe, expect, it } from "vitest";
import { revampHeaderMarkup } from "./revamp-header-markup";
import { localizeRevampHeaderMarkup } from "./revamp-header";

describe("revamp header links", () => {
  it.each([
    ["en", "/en/blog", "/en/contact-us", "Blog", "Talk to sales"],
    ["id", "/blog", "/contact-us", "Blog", "Hubungi tim sales"],
    ["cn", "/cn/blog", "/cn/contact-us", "博客", "联系销售"],
    ["jp", "/jp/blog", "/jp/contact-us", "ブログ", "営業に相談"],
    ["kr", "/kr/blog", "/kr/contact-us", "블로그", "영업팀 문의"],
  ] as const)(
    "adds Blog and links sales CTAs to Contact Us in %s",
    (locale, blogHref, contactHref, blogLabel, salesLabel) => {
      const markup = localizeRevampHeaderMarkup(revampHeaderMarkup, locale);

      expect(markup).toContain(
        `<a class="mnav__link" href="${blogHref}">${blogLabel}</a>`,
      );
      expect(markup).toContain(
        `<a class="btn btn--ghost" href="${contactHref}">${salesLabel}</a>`,
      );
      expect(markup).not.toContain("data-demo>Talk to sales</button>");
    },
  );

  it("localizes the Indonesian dropdown previews", () => {
    const markup = localizeRevampHeaderMarkup(revampHeaderMarkup, "id");

    for (const translated of [
      "Ketahui iklan dan kreator yang menghasilkan pendapatan.",
      "Apakah ini masih tersedia?",
      "Perlengkapan kantor",
      "Kirim tips perawatan via WhatsApp",
      "Lihat semua industri",
    ]) {
      expect(markup).toContain(translated);
    }

    for (const source of [
      "Know which ads and creators bring revenue.",
      "Is this still in stock?",
      "Office supply",
      "Send care tips on WhatsApp",
      "Explore all industries",
    ]) {
      expect(markup).not.toContain(source);
    }
  });
});
