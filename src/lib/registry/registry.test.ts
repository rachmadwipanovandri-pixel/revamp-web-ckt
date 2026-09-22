import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { routing, type Locale } from "@/i18n/routing";
import {
  REGISTRY,
  allNavEntries,
  entryPaths,
  counterpartSlug,
  getEntryById,
} from "./index";
import type { LandingContent, LandingKind } from "./types";

const KINDS = Object.keys(REGISTRY) as LandingKind[];
const CONTENT_ROOT = path.resolve(__dirname, "../../content");
const PUBLIC_ROOT = path.resolve(__dirname, "../../../public");
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function contentFile(kind: LandingKind, id: string, locale: Locale) {
  return path.join(CONTENT_ROOT, kind, id, `${locale}.json`);
}

describe("registry integrity", () => {
  it("has unique ids and valid, unique slugs per kind and locale", () => {
    for (const kind of KINDS) {
      const ids = REGISTRY[kind].map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const locale of routing.locales) {
        const slugs = REGISTRY[kind].flatMap(
          (entry) => entry.slugs[locale] ?? [],
        );
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) expect(slug).toMatch(SLUG_RE);
      }

      for (const entry of REGISTRY[kind]) {
        expect(Object.keys(entry.slugs).length).toBeGreaterThan(0);
        // Every slugged locale must have a nav/breadcrumb title.
        for (const locale of Object.keys(entry.slugs) as Locale[]) {
          expect(
            entry.title[locale],
            `${kind}/${entry.id} missing title.${locale}`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("resolves every switcherFallbackId to an entry covering the other locale", () => {
    for (const kind of KINDS) {
      for (const entry of REGISTRY[kind]) {
        if (!entry.switcherFallbackId) continue;
        const target = getEntryById(kind, entry.switcherFallbackId);
        expect(
          target,
          `${kind}/${entry.id} fallback ${entry.switcherFallbackId} not found`,
        ).toBeDefined();
        const ownLocales = Object.keys(entry.slugs) as Locale[];
        const missing = routing.locales.filter(
          (locale) => !ownLocales.includes(locale),
        );
        for (const locale of missing) {
          expect(
            target!.slugs[locale],
            `${kind}/${entry.id} fallback has no ${locale} slug`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("has a content file for every (entry, locale) and no orphan content", () => {
    for (const kind of KINDS) {
      for (const entry of REGISTRY[kind]) {
        for (const locale of Object.keys(entry.slugs) as Locale[]) {
          expect(
            fs.existsSync(contentFile(kind, entry.id, locale)),
            `missing content: ${kind}/${entry.id}/${locale}.json`,
          ).toBe(true);
        }
      }

      const kindDir = path.join(CONTENT_ROOT, kind);
      if (!fs.existsSync(kindDir)) continue;
      for (const id of fs.readdirSync(kindDir)) {
        const entry = getEntryById(kind, id);
        expect(entry, `orphan content dir: ${kind}/${id}`).toBeDefined();
        for (const file of fs.readdirSync(path.join(kindDir, id))) {
          const locale = file.replace(/\.json$/, "") as Locale;
          expect(
            entry!.slugs[locale],
            `orphan content file: ${kind}/${id}/${file} (no ${locale} slug in registry)`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("content files are valid: schema fields, FAQ depth, existing images", () => {
    for (const kind of KINDS) {
      for (const entry of REGISTRY[kind]) {
        for (const locale of Object.keys(entry.slugs) as Locale[]) {
          const file = contentFile(kind, entry.id, locale);
          if (!fs.existsSync(file)) continue; // reported by the previous test
          const content = JSON.parse(
            fs.readFileSync(file, "utf8"),
          ) as LandingContent;
          const label = `${kind}/${entry.id}/${locale}`;

          expect(content.meta?.title, `${label} meta.title`).toBeTruthy();
          expect(
            content.meta?.description,
            `${label} meta.description`,
          ).toBeTruthy();
          expect(
            content.meta.description.length,
            `${label} meta.description length`,
          ).toBeLessThanOrEqual(170);
          expect(content.hero?.title, `${label} hero.title`).toBeTruthy();
          expect(content.definition, `${label} definition`).toBeTruthy();
          expect(
            content.benefits?.length,
            `${label} benefits`,
          ).toBeGreaterThanOrEqual(3);
          expect(
            content.pillars?.length,
            `${label} pillars`,
          ).toBeGreaterThanOrEqual(2);
          expect(
            content.faq?.length,
            `${label} faq count`,
          ).toBeGreaterThanOrEqual(8);
          expect(content.faq.length, `${label} faq count`).toBeLessThanOrEqual(
            15,
          );
          expect(content.cta?.heading, `${label} cta.heading`).toBeTruthy();

          const images = [
            ...content.benefits.map((benefit) => benefit.image),
            ...(content.tabs ?? []).map((tab) => tab.image),
            content.testimonial?.image,
          ].filter((src): src is string => Boolean(src));
          for (const src of images) {
            expect(
              fs.existsSync(path.join(PUBLIC_ROOT, src)),
              `${label} missing image ${src}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("builds localized paths with per-locale slugs", () => {
    const entry = getEntryById("features", "whatsapp-blast")!;
    expect(entryPaths("features", entry)).toEqual({
      en: "/en/features/whatsapp-blast",
      id: "/fitur/wa-blast",
    });
  });

  it("offers every industry and role in the nav, not just the curated few", () => {
    // The mega menu renders these lists client-side, so nothing in the built
    // HTML proves the count. This is the guard: a new industry must show up in
    // the menu by existing, without anyone remembering a nav flag.
    for (const kind of ["industries", "solutions"] as const) {
      const canonical = REGISTRY[kind].filter(
        (entry) => entry.slugs.id && !entry.switcherFallbackId,
      );
      expect(allNavEntries(kind, "id")).toHaveLength(canonical.length);
    }
    expect(allNavEntries("industries", "id").length).toBeGreaterThanOrEqual(29);
    expect(allNavEntries("solutions", "id")).toHaveLength(5);
  });

  it("fills the AI menu column with exactly the curated five", () => {
    // The mega menu renders client-side, so no built HTML proves the column.
    const ai = REGISTRY.features.filter(
      (entry) => entry.category === "ai" && entry.nav?.megaMenu,
    );
    expect(ai.map((entry) => entry.id).sort()).toEqual([
      "agentic-ai",
      "ai-agent-builder",
      "ai-agent-settings",
      "ai-evaluation",
      "ai-function-calling",
    ]);
    // Chatbot AI deliberately stays the chat column's flagship.
    const flagship = REGISTRY.features.find((entry) => entry.id === "ai-agent");
    expect(flagship?.category).toBe("chat");
  });

  it("puts curated nav.order entries first, then sorts the rest by title", () => {
    const industries = allNavEntries("industries", "id");
    const ordered = industries.filter(
      (entry) => entry.nav?.order !== undefined,
    );
    const rest = industries.slice(ordered.length);

    expect(industries.slice(0, ordered.length)).toEqual(ordered);
    expect(ordered.map((entry) => entry.nav!.order)).toEqual(
      [...ordered.map((entry) => entry.nav!.order)].sort((a, b) => a! - b!),
    );
    const restTitles = rest.map((entry) => entry.title.id ?? "");
    expect(restTitles).toEqual(
      [...restTitles].sort((a, b) => a.localeCompare(b)),
    );
  });

  it("routes the language switcher through the fallback for one-locale twins", () => {
    expect(counterpartSlug("features", "whatsapp-bulk", "id", "en")).toBe(
      "whatsapp-blast",
    );
    expect(counterpartSlug("features", "wa-blast", "id", "en")).toBe(
      "whatsapp-blast",
    );
    expect(counterpartSlug("features", "whatsapp-blast", "en", "id")).toBe(
      "wa-blast",
    );
  });
});
