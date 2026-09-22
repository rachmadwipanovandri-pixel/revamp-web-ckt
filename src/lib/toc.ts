import "server-only";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
};

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => NAMED[n.toLowerCase()] ?? m);
}

function slugify(text: string): string {
  return decode(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Injects stable ids into the article's h2–h4 headings and returns the
 * table-of-contents entries, so the sidebar can anchor-link and scroll-spy.
 *
 * Also demotes any body `h1` to `h2`: the page already has exactly one `h1`
 * (the article title), and a second one from WordPress is a classic on-page
 * hierarchy bug.
 */
export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const demoted = html
    .replace(/<h1(\s|>)/gi, "<h2$1")
    .replace(/<\/h1\s*>/gi, "</h2>");

  const toc: TocItem[] = [];
  const used = new Set<string>();

  const withIds = demoted.replace(
    /<h([234])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, lvl: string, attrs: string, inner: string) => {
      const text = decode(inner.replace(/<[^>]+>/g, "")).trim();
      if (!text) return match;
      let id = slugify(text) || "section";
      let n = 1;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      toc.push({ id, text, level: Number(lvl) as 2 | 3 | 4 });
      if (/\sid=/.test(attrs)) return match;
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
    },
  );

  return { html: withIds, toc };
}

/** Approximate word count for BlogPosting JSON-LD (tags stripped). */
export function wordCount(html: string): number {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return 0;
  return text.split(" ").length;
}
