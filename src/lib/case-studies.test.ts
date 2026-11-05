import { describe, expect, it } from "vitest";
import {
  CASE_STUDIES,
  filterCaseStudies,
  getCaseStudy,
  getCaseStudyIndustry,
  localizeCaseStudy,
} from "./case-studies";

describe("published case studies", () => {
  it("includes all seven source cases and their detail content", () => {
    expect(CASE_STUDIES).toHaveLength(7);
    for (const study of CASE_STUDIES) {
      expect(study.about).not.toHaveLength(0);
      expect(study.solutions.steps).toHaveLength(3);
      expect(study.outcomes).toHaveLength(4);
      expect(getCaseStudy(study.slug)).toBe(study);
    }
  });

  it("filters the healthcare category to Euromedica", () => {
    expect(getCaseStudyIndustry("healthcare")).toBe("healthcare");
    expect(filterCaseStudies("healthcare").map((study) => study.slug)).toEqual([
      "euromedica",
    ]);
  });

  it("shows all cases for the unfiltered or unrecognized category", () => {
    expect(filterCaseStudies(undefined)).toHaveLength(7);
    expect(filterCaseStudies("not-a-category")).toHaveLength(7);
  });

  it("provides Japanese copy for every case without losing the source context", () => {
    const japaneseText = /[\u3040-\u30ff\u3400-\u9fff]/;

    for (const source of CASE_STUDIES) {
      const japanese = localizeCaseStudy(source, "jp");
      expect(japanese.title).not.toBe(source.title);
      expect(japanese.summary).toMatch(japaneseText);
      expect(japanese.industry).toMatch(japaneseText);
      expect(japanese.interview.role).toMatch(japaneseText);
      expect(
        japanese.about.every((paragraph) => japaneseText.test(paragraph)),
      ).toBe(true);
      expect(
        japanese.challenge.paragraphs.every((paragraph) =>
          japaneseText.test(paragraph),
        ),
      ).toBe(true);
      expect(japanese.challenge.quote).toMatch(japaneseText);
      expect(japanese.solutions.intro).toMatch(japaneseText);
      expect(japanese.solutions.quote).toMatch(japaneseText);
      expect(japanese.solutions.steps).toHaveLength(
        source.solutions.steps.length,
      );
      expect(
        japanese.solutions.steps.every(
          (step) =>
            japaneseText.test(step.title) && japaneseText.test(step.body),
        ),
      ).toBe(true);
      expect(japanese.outcomes).toHaveLength(source.outcomes.length);
      expect(
        japanese.outcomes.every(
          (outcome) =>
            japaneseText.test(outcome.label) &&
            japaneseText.test(outcome.detail),
        ),
      ).toBe(true);
      expect(japanese.results.intro).toMatch(japaneseText);
      expect(japanese.results.quote).toMatch(japaneseText);
      expect(japanese.profile.location).toMatch(japaneseText);
      expect(japanese.profile.companySize).toMatch(japaneseText);
      expect(
        japanese.profile.services.every((service) =>
          japaneseText.test(service),
        ),
      ).toBe(true);
      expect(japanese.image).toBe(source.image);
      expect(japanese.slug).toBe(source.slug);
    }
  });

  it.each([
    ["kr", /[\uac00-\ud7a3]/],
    ["cn", /[\u4e00-\u9fff]/],
  ] as const)(
    "provides complete %s copy and preserves reported facts",
    (locale, script) => {
      for (const source of CASE_STUDIES) {
        const localized = localizeCaseStudy(source, locale);
        expect(localized.title).not.toBe(source.title);
        expect(localized.title).toMatch(script);
        expect(localized.summary).toMatch(script);
        expect(localized.industry).toMatch(script);
        expect(localized.interview.role).toMatch(script);
        expect(
          localized.about.every((paragraph) => script.test(paragraph)),
        ).toBe(true);
        expect(
          localized.challenge.paragraphs.every((paragraph) =>
            script.test(paragraph),
          ),
        ).toBe(true);
        expect(localized.challenge.quote).toMatch(script);
        expect(localized.solutions.intro).toMatch(script);
        expect(localized.solutions.quote).toMatch(script);
        expect(localized.solutions.steps).toHaveLength(
          source.solutions.steps.length,
        );
        expect(
          localized.solutions.steps.every(
            (step) => script.test(step.title) && script.test(step.body),
          ),
        ).toBe(true);
        expect(localized.outcomes).toHaveLength(source.outcomes.length);
        for (const [index, outcome] of localized.outcomes.entries()) {
          const sourceOutcome = source.outcomes[index];
          const localizedMetric = `${outcome.value} ${outcome.label} ${outcome.detail}`;
          const numberTokens = (value: string) =>
            value.match(/\d+(?:[.,]\d+)?/g) ?? [];

          if (sourceOutcome.value === "24/7") {
            expect(outcome.value).toBe(locale === "kr" ? "24시간" : "全天候");
          } else {
            expect(numberTokens(outcome.value)).toEqual(
              numberTokens(sourceOutcome.value),
            );
          }
          if (sourceOutcome.value.startsWith("<")) {
            expect(localizedMetric).toMatch(/미만|少于|低于|以下/);
          }
          if (sourceOutcome.value.startsWith(">")) {
            expect(localizedMetric).toMatch(/이상|초과|超过|高于/);
          }
          expect(localizedMetric).toMatch(script);
        }
        expect(
          localized.outcomes.every(
            (outcome) =>
              script.test(outcome.label) && script.test(outcome.detail),
          ),
        ).toBe(true);
        expect(localized.results.intro).toMatch(script);
        expect(localized.results.quote).toMatch(script);
        expect(localized.profile.location).toMatch(script);
        expect(localized.profile.companySize).toMatch(script);
        expect(
          localized.profile.services.every((service) => script.test(service)),
        ).toBe(true);
        expect(localized.featuredOutcome).toBe(source.featuredOutcome);
        expect(localized.interview.name).toBe(source.interview.name);
        expect(localized.image).toBe(source.image);
        expect(localized.slug).toBe(source.slug);
      }
    },
  );
});
