import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { routing } from "./routing";

const messagesDir = path.resolve(__dirname, "../../messages");

function leafPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      leafPaths(item, `${prefix}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      leafPaths(item, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function read(locale: string) {
  return JSON.parse(
    fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf8"),
  ) as unknown;
}

describe("message catalog consistency", () => {
  it("keeps every locale catalog structurally complete", () => {
    const expected = leafPaths(read("en")).sort();
    for (const locale of routing.locales) {
      expect(leafPaths(read(locale)).sort(), `${locale}.json`).toEqual(
        expected,
      );
    }
  });

  it("localizes the shared secondary-page chrome in cn, jp, and kr", () => {
    const expected = {
      cn: ["产品", "客户故事", "联系销售"],
      jp: ["プロダクト", "導入事例", "営業に相談"],
      kr: ["제품", "고객 사례", "영업팀 문의"],
    };

    for (const [locale, values] of Object.entries(expected)) {
      const text = JSON.stringify(read(locale));
      for (const value of values)
        expect(text, `${locale}.json`).toContain(value);
    }
  });

  it("does not ship English copies of commercial page content", () => {
    const namespaces = [
      "pricing",
      "chat",
      "crm",
      "marketing",
      "order",
      "industriesHub",
      "featuresHub",
      "solutionsHub",
    ];
    const leafValues = (value: unknown): string[] => {
      if (Array.isArray(value)) return value.flatMap(leafValues);
      if (value && typeof value === "object") {
        return Object.values(value).flatMap(leafValues);
      }
      return typeof value === "string" ? [value] : [];
    };

    const english = read("en") as Record<string, unknown>;
    for (const locale of ["cn", "jp", "kr"] as const) {
      const localized = read(locale) as Record<string, unknown>;
      for (const namespace of namespaces) {
        const source = leafValues(english[namespace]);
        const target = leafValues(localized[namespace]);
        const identical = source.filter(
          (value, index) => value === target[index],
        );
        // Brand names, acronyms, and FAQ are expected to remain identical.
        expect(
          identical.length,
          `${locale}.${namespace} is still mostly English`,
        ).toBeLessThanOrEqual(namespace === "pricing" ? 6 : 3);
      }
    }
  });

  it("localizes company, integration, and shared landing-page copy", () => {
    const namespaces = ["about", "integrations", "landing"];
    const stringLeaves = (value: unknown): string[] => {
      if (Array.isArray(value)) return value.flatMap(stringLeaves);
      if (value && typeof value === "object") {
        return Object.values(value).flatMap(stringLeaves);
      }
      return typeof value === "string" ? [value] : [];
    };
    const english = read("en") as Record<string, unknown>;
    const allowed = new Set(["3,000+", "Meta"]);

    for (const locale of ["cn", "jp", "kr"] as const) {
      const localized = read(locale) as Record<string, unknown>;
      for (const namespace of namespaces) {
        const source = stringLeaves(english[namespace]);
        const target = stringLeaves(localized[namespace]);
        const remainingEnglish = source.filter(
          (value, index) => value === target[index] && !allowed.has(value),
        );
        expect(
          remainingEnglish,
          `${locale}.${namespace} contains untranslated copy`,
        ).toEqual([]);
      }
    }
  });

  it("localizes the rendered secondary routes and story details", () => {
    const english = read("en") as Record<string, unknown>;
    const getPath = (value: unknown, path: string): unknown =>
      path.split(".").reduce<unknown>((current, key) => {
        if (!current || typeof current !== "object") return undefined;
        return (current as Record<string, unknown>)[key];
      }, value);
    const routeNamespaces = [
      "contact",
      "contactSales",
      "events",
      "careers",
      "blog",
      "comparison",
    ];
    const copyPaths = [
      "home.testimonials.heading",
      "home.testimonials.body",
      "home.trustedBy.heading",
      ...[
        "natureCraft",
        "wallStreet",
        "putiih",
        "threeland",
        "rumahZakat",
      ].flatMap((story) =>
        ["quote", "industry", "function", "role", "metricLabel"].map(
          (field) => `home.testimonials.${story}.${field}`,
        ),
      ),
      ...["moir", "rumahZakat", "mnp", "vio", "dokterhub", "threeland"].map(
        (story) => `home.testimonials.videos.${story}.role`,
      ),
      ...[
        "agentic.security.headingLead",
        "agentic.security.headingAccent",
        "agentic.security.body",
        "agentic.security.pdp.title",
        "agentic.security.pdp.body",
        "agentic.security.rbac.title",
        "agentic.security.rbac.body",
        "agentic.security.meta.body",
        "agentic.security.iso.title",
        "agentic.security.iso.body",
        "agentic.security.note",
        "agentic.caseStudy.eyebrow",
        "agentic.caseStudy.title",
        "agentic.caseStudy.body",
        "agentic.caseStudy.outcome",
        "agentic.caseStudy.metric1.label",
        "agentic.caseStudy.metric2.label",
        "agentic.caseStudy.metric3.label",
        "agentic.caseStudy.attribution",
        "agentic.caseStudy.readStory",
      ],
    ];

    for (const locale of ["cn", "jp", "kr"] as const) {
      const localized = read(locale) as Record<string, unknown>;
      for (const namespace of routeNamespaces) {
        const source = getPath(english, namespace);
        const target = getPath(localized, namespace);
        const leaves = (value: unknown): string[] => {
          if (Array.isArray(value)) return value.flatMap(leaves);
          if (value && typeof value === "object") {
            return Object.values(value).flatMap(leaves);
          }
          return typeof value === "string" ? [value] : [];
        };
        const sourceStrings = leaves(source);
        const targetStrings = leaves(target);
        const identical = sourceStrings
          .filter((value) => value.length > 3)
          .filter((value, index) => value === targetStrings[index]);
        const allowed =
          namespace === "contactSales"
            ? 2
            : namespace === "careers"
              ? 1
              : namespace === "comparison"
                ? 5
                : 0;
        expect(
          identical.length,
          `${locale}.${namespace} still contains English copy`,
        ).toBeLessThanOrEqual(allowed);
      }

      for (const path of copyPaths) {
        expect(
          getPath(localized, path),
          `${locale}.${path} should be localized`,
        ).not.toBe(getPath(english, path));
      }

      // Localizing the surrounding copy must not alter customer or company names.
      expect(getPath(localized, "home.testimonials.natureCraft.name")).toBe(
        getPath(english, "home.testimonials.natureCraft.name"),
      );
      expect(getPath(localized, "home.testimonials.natureCraft.company")).toBe(
        getPath(english, "home.testimonials.natureCraft.company"),
      );
    }
  });

  it("keeps Indonesian comparison and customer-story labels in Indonesian", () => {
    const english = read("en") as Record<string, unknown>;
    const indonesian = read("id") as Record<string, unknown>;
    for (const path of [
      "comparison.pillars.circles.marketing",
      "comparison.pillars.awareness.title",
      "comparison.pillars.conversion.title",
      "comparison.pillars.retention.title",
      "comparison.tables.channels.heading",
      "comparison.tables.channels.rows.email",
      "comparison.tables.marketing.heading",
      "comparison.tables.marketing.rows.tiktokAds",
      "comparison.tables.marketing.rows.metaAds",
      "comparison.tables.marketing.rows.googleAds",
      "comparison.tables.marketing.rows.waBroadcast",
      "home.testimonials.natureCraft.industry",
      "home.testimonials.natureCraft.function",
      "home.testimonials.wallStreet.industry",
      "home.testimonials.wallStreet.function",
      "home.testimonials.wallStreet.role",
      "home.testimonials.putiih.industry",
      "home.testimonials.putiih.function",
      "home.testimonials.putiih.role",
      "home.testimonials.threeland.industry",
      "home.testimonials.threeland.function",
      "home.testimonials.rumahZakat.industry",
      "home.testimonials.rumahZakat.function",
      "home.testimonials.rumahZakat.role",
    ]) {
      const getPath = (value: unknown): unknown =>
        path.split(".").reduce<unknown>((current, key) => {
          if (!current || typeof current !== "object") return undefined;
          return (current as Record<string, unknown>)[key];
        }, value);
      expect(getPath(indonesian), `${path} should be localized`).not.toBe(
        getPath(english),
      );
    }
  });
});
