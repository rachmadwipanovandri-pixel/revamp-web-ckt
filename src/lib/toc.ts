import "server-only";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
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
 * Injects stable ids into the article's h2/h3 headings and returns the
 * table-of-contents entries, so the sidebar can anchor-link and scroll-spy.
 */
export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match, lvl: string, attrs: string, inner: string) => {
      const text = decode(inner.replace(/<[^>]+>/g, "")).trim();
      if (!text) return match;
      let id = slugify(text) || "section";
      let n = 1;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      toc.push({ id, text, level: Number(lvl) as 2 | 3 });
      if (/\sid=/.test(attrs)) return match;
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
    },
  );

  return { html: withIds, toc };
}
