import { describe, it, expect } from "vitest";
import { buildToc, wordCount } from "./toc";

describe("buildToc", () => {
  it("demotes body h1 so the page keeps a single H1", () => {
    const { html, toc } = buildToc("<h1>Intro</h1><p>x</p>");
    expect(html).toContain('<h2 id="intro">Intro</h2>');
    expect(html).not.toContain("<h1");
    expect(toc).toEqual([{ id: "intro", text: "Intro", level: 2 }]);
  });

  it("stamps ids on h2–h4 and returns toc entries", () => {
    const { html, toc } = buildToc(
      "<h2>Alpha</h2><h3>Beta</h3><h4>Gamma</h4>",
    );
    expect(html).toContain('id="alpha"');
    expect(html).toContain('id="beta"');
    expect(html).toContain('id="gamma"');
    expect(toc.map((item) => item.level)).toEqual([2, 3, 4]);
    expect(toc.map((item) => item.text)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("dedupes repeated heading slugs", () => {
    const { toc } = buildToc("<h2>Same</h2><h2>Same</h2>");
    expect(toc[0].id).toBe("same");
    expect(toc[1].id).toBe("same-1");
  });
});

describe("wordCount", () => {
  it("counts words after stripping tags", () => {
    expect(wordCount("<p>one two three</p>")).toBe(3);
    expect(wordCount("")).toBe(0);
  });
});
