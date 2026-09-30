import { describe, expect, it } from "vitest";
import { buildPage } from "./render";
import { DATA } from "./data";
import { DATA_EN } from "./data-en";

describe("preview-home industries section", () => {
  it("runs directly after the video wall in both locales", () => {
    for (const data of [DATA, DATA_EN]) {
      expect(data.order.indexOf("industries")).toBe(
        data.order.indexOf("videos") + 1,
      );
    }
  });

  it("links each tile to its industry page with a real photo", () => {
    const id = buildPage(undefined, "id");
    expect(id).toContain('class="industries"');
    expect(id).toContain('href="/industri/kesehatan"');
    expect(id).toContain('href="/industri/salon-kecantikan"');
    expect(id).toContain("/images/industries/healthcare.webp");
    expect(id).toContain('href="/industri"');

    const en = buildPage(undefined, "en");
    expect(en).toContain('href="/en/industries/retail-ecommerce"');
    expect(en).toContain('href="/en/industries/food-beverage"');
    expect(en).toContain('href="/en/industries"');
  });
});

describe("preview-home pricing section", () => {
  const section = (html: string) => {
    const start = html.indexOf('<section class="pricing"');
    const end = html.indexOf("</section>", start);
    return html.slice(start, end);
  };

  it("runs after the testimonial wall in both locales", () => {
    for (const data of [DATA, DATA_EN]) {
      expect(data.order.indexOf("pricing")).toBe(
        data.order.indexOf("love") + 1,
      );
    }
  });

  it("lists the plans with the popular tier highlighted, no prices", () => {
    const pricing = section(buildPage(undefined, "id"));
    expect(pricing).toContain('class="plan reveal popular"');
    expect(pricing).toContain("Paling Dipilih");
    expect(pricing).toContain("Hubungi Sales");
    expect(pricing).toContain('href="/harga"');
    expect(pricing).not.toMatch(/Rp\s?[\d.]+/);
    expect(pricing).not.toContain("/bulan");
  });

  it("keeps the English locale equally price-free", () => {
    const pricing = section(buildPage(undefined, "en"));
    expect(pricing).toContain("Most Popular");
    expect(pricing).toContain("Contact Sales");
    expect(pricing).toContain('href="/en/pricing"');
    expect(pricing).not.toMatch(/Rp\s?[\d.]+/);
    expect(pricing).not.toContain("/month");
  });
});
