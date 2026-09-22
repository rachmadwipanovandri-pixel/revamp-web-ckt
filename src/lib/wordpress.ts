import "server-only";
import { cache } from "react";

const API_BASE =
  process.env.WORDPRESS_API_URL ??
  "https://wordpress-1rwf.onrender.com/wp-json/wp/v2";

// The onrender free tier cold-starts, so cache aggressively and revalidate.
const REVALIDATE_SECONDS = 300;

/** Normalized blog post used across the UI. */
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  /** Site-local timestamps (no offset), used for display. */
  date: string;
  modified: string;
  /** Same instants in UTC with a `Z` suffix, for metadata and JSON-LD. */
  dateIso: string;
  modifiedIso: string;
  author: { name: string; avatar?: string; bio?: string };
  category?: { name: string; slug: string };
  categoryIds: number[];
  /** WP tag names, used as `keywords` in the BlogPosting JSON-LD. */
  tags: string[];
  image?: { url: string; alt: string; width?: number; height?: number };
  seo: { title?: string; description?: string; ogImage?: string };
}

export interface BlogCategory {
  /** All WP category ids sharing this name (Polylang splits per language). */
  ids: number[];
  name: string;
  slug: string;
  count: number;
}

export interface PostsPage {
  posts: BlogPost[];
  totalPages: number;
  total: number;
}

interface WpRendered {
  rendered: string;
}
interface WpPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  /** UTC equivalents WordPress returns alongside the local timestamps. */
  date_gmt?: string;
  modified_gmt?: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  categories: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
  };
  _embedded?: {
    author?: Array<{
      name?: string;
      description?: string;
      avatar_urls?: Record<string, string>;
    }>;
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  copy: "©",
  reg: "®",
  trade: "™",
};

// C1 controls, or a UTF-8 lead byte (Â/Ã/â) followed by a continuation byte —
// the fingerprint of UTF-8 text that was stored as individual Latin-1 code points.
const MOJIBAKE_SIGNATURE =
  /[\u0080-\u009F]|[\u00C2\u00C3\u00E2][\u0080-\u00BF]/;

/**
 * Some WordPress posts arrive double-encoded: the UTF-8 bytes for smart quotes
 * and dashes (“ ” – — ’ …) are stored as separate Latin-1 code points, so they
 * render as "â€œ", "â€"", etc. Reinterpret the code units as bytes and decode
 * them as UTF-8 to recover the intended characters. Runs only when the mojibake
 * fingerprint is present and the bytes are valid UTF-8, so clean text (and text
 * containing genuine multi-byte characters) is left untouched.
 */
function fixMojibake(input: string): string {
  if (!MOJIBAKE_SIGNATURE.test(input)) return input;
  for (let i = 0; i < input.length; i += 1) {
    if (input.charCodeAt(i) > 0xff) return input; // real multi-byte char present
  }
  try {
    const bytes = Uint8Array.from(input, (ch) => ch.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return input;
  }
}

/** Decodes HTML entities WordPress returns in title/excerpt (e.g. &#038; → &). */
function decodeEntities(input: string): string {
  return fixMojibake(input)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ""))
    .replace(/\[\s*…\s*\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * WordPress returns naive timestamps (no offset). Prefer the `_gmt` variant and
 * mark it UTC so metadata and JSON-LD carry an unambiguous instant.
 */
function toUtcIso(gmt: string | undefined, fallback: string): string {
  if (!gmt) return fallback;
  return gmt.endsWith("Z") ? gmt : `${gmt}Z`;
}

function normalizePost(post: WpPost): BlogPost {
  const embedded = post._embedded ?? {};
  const author = embedded.author?.[0];
  const media = embedded["wp:featuredmedia"]?.[0];
  const category = embedded["wp:term"]?.[0]?.[0];
  // wp:term groups terms by taxonomy: [0] categories, [1] tags.
  const tags = (embedded["wp:term"]?.[1] ?? []).map((term) =>
    decodeEntities(term.name),
  );

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: fixMojibake(post.content.rendered),
    date: post.date,
    modified: post.modified,
    dateIso: toUtcIso(post.date_gmt, post.date),
    modifiedIso: toUtcIso(post.modified_gmt, post.modified),
    author: {
      name: author?.name ? decodeEntities(author.name) : "Cekat.AI",
      avatar: author?.avatar_urls?.["96"],
      bio: author?.description ? decodeEntities(author.description) : undefined,
    },
    category: category
      ? { name: decodeEntities(category.name), slug: category.slug }
      : undefined,
    categoryIds: post.categories ?? [],
    tags,
    image: media?.source_url
      ? {
          url: media.source_url,
          alt: media.alt_text || stripHtml(post.title.rendered),
          width: media.media_details?.width,
          height: media.media_details?.height,
        }
      : undefined,
    seo: {
      title: post.yoast_head_json?.title
        ? decodeEntities(post.yoast_head_json.title)
        : undefined,
      description: post.yoast_head_json?.description
        ? decodeEntities(post.yoast_head_json.description)
        : post.yoast_head_json?.og_description
          ? decodeEntities(post.yoast_head_json.og_description)
          : stripHtml(post.excerpt.rendered),
      ogImage: post.yoast_head_json?.og_image?.[0]?.url || media?.source_url,
    },
  };
}

/**
 * Thrown when WordPress cannot be reached or answers with a server error.
 * Callers must let this propagate rather than degrade to "no content": a
 * failed upstream must surface as a 5xx (retryable) and never as a 404, which
 * search engines read as "permanently gone".
 */
export class WordPressUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordPressUnavailableError";
  }
}

// The free host sleeps and cold-starts, so a first hit can bounce with a 5xx.
const RETRY_DELAYS_MS = [400, 1200];

async function wpFetch(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<Response> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let reason = "unknown error";
  for (let attempt = 0; ; attempt += 1) {
    try {
      const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
      // 4xx is a definitive answer from WordPress (e.g. unknown slug); only
      // server errors and rate limits are worth retrying.
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      reason = `HTTP ${res.status}`;
    } catch (error) {
      reason = error instanceof Error ? error.message : String(error);
    }
    if (attempt >= RETRY_DELAYS_MS.length) break;
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_DELAYS_MS[attempt]),
    );
  }
  throw new WordPressUnavailableError(
    `WordPress request failed for ${path}: ${reason}`,
  );
}

/**
 * Paginated posts. `lang` (Polylang) is accepted but unused by default so both
 * locales show the full catalogue for now, pass it to split later.
 */
export async function getPosts({
  page = 1,
  perPage = 9,
  categories,
  lang,
  search,
}: {
  page?: number;
  perPage?: number;
  categories?: number[];
  lang?: string;
  /** Free-text query, passed to WP's native `search` param. */
  search?: string;
} = {}): Promise<PostsPage> {
  // Throws WordPressUnavailableError upstream: an empty listing would render a
  // 200 "no articles" page, which reads as a soft 404 to search engines.
  const res = await wpFetch("/posts", {
    page,
    per_page: perPage,
    _embed: "1",
    categories: categories?.length ? categories.join(",") : undefined,
    lang,
    search: search?.trim() || undefined,
  });
  if (!res.ok) return { posts: [], totalPages: 0, total: 0 };
  const data = (await res.json()) as WpPost[];
  return {
    posts: data.map(normalizePost),
    totalPages: Number(res.headers.get("x-wp-totalpages") ?? 1),
    total: Number(res.headers.get("x-wp-total") ?? data.length),
  };
}

/**
 * A post by slug, or null when WordPress positively reports no such post.
 * An unreachable WordPress throws instead, so the caller renders a retryable
 * 5xx rather than a 404 that would deindex a perfectly good article.
 *
 * Request-scoped: `generateMetadata` and the page component both need the
 * post; without `cache()` each article render hit the cold WP host twice.
 */
export const getPostBySlug = cache(
  async (slug: string, lang?: string): Promise<BlogPost | null> => {
    const res = await wpFetch("/posts", { slug, _embed: "1", lang });
    if (!res.ok) return null;
    const data = (await res.json()) as WpPost[];
    return data[0] ? normalizePost(data[0]) : null;
  },
);

/**
 * Categories with posts, deduped by name (Polylang creates per-language ids).
 * Degrades to an empty list on failure: the filter pills are cosmetic, so a
 * flaky upstream should not take down an otherwise-renderable page.
 */
export async function getCategories(lang?: string): Promise<BlogCategory[]> {
  try {
    const res = await wpFetch("/categories", {
      per_page: 100,
      orderby: "count",
      order: "desc",
      hide_empty: "true",
      lang,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      id: number;
      name: string;
      slug: string;
      count: number;
    }>;
    const byName = new Map<string, BlogCategory>();
    for (const cat of data) {
      if (cat.count <= 0) continue;
      const existing = byName.get(cat.name);
      if (existing) {
        existing.ids.push(cat.id);
        existing.count += cat.count;
      } else {
        byName.set(cat.name, {
          ids: [cat.id],
          name: cat.name,
          slug: cat.slug.replace(/-en$/, ""),
          count: cat.count,
        });
      }
    }
    return [...byName.values()];
  } catch {
    return [];
  }
}

export interface PostSlugInfo {
  id: number;
  slug: string;
  /** UTC-normalized (`Z`-suffixed) last-modified instant. */
  modified: string;
  lang: string;
  translations: Record<string, number>;
  /** Author display name when the lean slug payload includes it. */
  authorName?: string;
}

interface WpSlugRow extends Omit<PostSlugInfo, "modified"> {
  modified: string;
  modified_gmt?: string;
}

/** Lean slug list for the sitemap: locale + Polylang translation links. */
export const getAllPostSlugs = cache(async (): Promise<PostSlugInfo[]> => {
  try {
    const out: PostSlugInfo[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const res = await wpFetch("/posts", {
        page,
        per_page: 100,
        _fields: "id,slug,modified,modified_gmt,lang,translations",
      });
      if (!res.ok) break;
      const rows = (await res.json()) as WpSlugRow[];
      out.push(
        ...rows.map((row) => ({
          ...row,
          modified: toUtcIso(row.modified_gmt, row.modified),
        })),
      );
      totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
      page += 1;
    } while (page <= totalPages && page <= 10);
    return out;
  } catch {
    return [];
  }
});

/** What a slug resolves to when asked for in a locale it was not written in. */
export type CounterpartPost =
  /** A published translation exists; this is its slug in the target locale. */
  | { kind: "translated"; slug: string }
  /** The article exists, but has no published translation in the target locale. */
  | { kind: "untranslated" }
  /** No post anywhere uses this slug. */
  | { kind: "unknown" };

/**
 * Resolves a post slug across locales.
 *
 * Polylang stores each translation as a separate post with its OWN slug, so a
 * slug is only ever valid in the language it was written in. The language
 * switcher cannot know the counterpart (it renders in the layout, with no
 * access to the article), so it links to the same slug under the other locale
 * and this resolves the real destination server-side.
 *
 * Distinguishing "untranslated" from "unknown" matters: an article awaiting
 * translation should send the reader to the blog index, while a genuinely bad
 * slug must still 404 rather than soft-404 into a listing page.
 */
export const counterpartPostSlug = cache(
  async (slug: string, target: string): Promise<CounterpartPost> => {
    const posts = await getAllPostSlugs();
    const source = posts.find((post) => post.slug === slug);
    if (!source) return { kind: "unknown" };

    const translatedId = source.translations?.[target];
    const translated =
      translatedId === undefined
        ? undefined
        : posts.find((post) => post.id === translatedId);

    // A translation id can point at a draft or private post, which never appears
    // in the published list. Treat that as untranslated, not as a live page.
    return translated
      ? { kind: "translated", slug: translated.slug }
      : { kind: "untranslated" };
  },
);

/**
 * Related posts for the article footer. Degrades to an empty list: this is a
 * supplementary section, so it must never fail the article it sits under.
 */
export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
  lang?: string,
): Promise<BlogPost[]> {
  if (!post.categoryIds.length) return [];
  try {
    const { posts } = await getPosts({
      perPage: limit + 1,
      categories: post.categoryIds,
      lang,
    });
    return posts.filter((p) => p.id !== post.id).slice(0, limit);
  } catch {
    return [];
  }
}
