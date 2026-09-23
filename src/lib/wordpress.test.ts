import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAuthorBySlug,
  getPostBySlug,
  getPosts,
  getRelatedPosts,
  WordPressUnavailableError,
} from "./wordpress";

function wpPost(overrides: Record<string, unknown> = {}) {
  return {
    id: 978,
    slug: "retensi-pelanggan",
    date: "2026-07-29T17:30:18",
    date_gmt: "2026-07-29T10:30:18",
    modified: "2026-07-29T17:39:22",
    modified_gmt: "2026-07-29T10:39:22",
    title: { rendered: "Retensi Pelanggan" },
    excerpt: { rendered: "<p>Ringkasan.</p>" },
    content: { rendered: "<p>Isi.</p>" },
    categories: [7],
    ...overrides,
  };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getPostBySlug", () => {
  // Distinct slugs per case: getPostBySlug is wrapped in React.cache so
  // generateMetadata + the page share one fetch. A shared slug across tests
  // would hit the previous mock's cached result.
  it("returns the post when WordPress has it", async () => {
    fetchMock.mockResolvedValue(json([wpPost({ slug: "cache-hit" })]));
    const post = await getPostBySlug("cache-hit", "id");
    expect(post?.slug).toBe("cache-hit");
    // Naive WP timestamps are normalized to an unambiguous UTC instant.
    expect(post?.dateIso).toBe("2026-07-29T10:30:18Z");
  });

  it("returns null only when WordPress positively reports no such post", async () => {
    fetchMock.mockResolvedValue(json([]));
    await expect(getPostBySlug("does-not-exist", "id")).resolves.toBeNull();
  });

  it("THROWS instead of returning null when WordPress is unavailable", async () => {
    // Regression guard: a 5xx used to collapse into null -> notFound() -> a
    // cached 404, which tells Google a healthy article is permanently gone.
    fetchMock.mockResolvedValue(json({ error: "bad gateway" }, 502));
    await expect(getPostBySlug("unavailable-post", "id")).rejects.toThrow(
      WordPressUnavailableError,
    );
  });

  it("throws when the request itself fails", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNRESET"));
    await expect(getPostBySlug("conn-reset-post", "id")).rejects.toThrow(
      WordPressUnavailableError,
    );
  });

  it("retries a cold-start 5xx and succeeds on a later attempt", async () => {
    fetchMock
      .mockResolvedValueOnce(json({}, 503))
      .mockResolvedValueOnce(json([wpPost({ slug: "cold-start-post" })]));
    const post = await getPostBySlug("cold-start-post", "id");
    expect(post?.slug).toBe("cold-start-post");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry a definitive 4xx", async () => {
    fetchMock.mockResolvedValue(json({}, 400));
    await expect(getPostBySlug("weird-slug", "id")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("getPosts", () => {
  it("throws when WordPress is unavailable, rather than rendering an empty list", async () => {
    fetchMock.mockResolvedValue(json({}, 500));
    await expect(getPosts({ lang: "id" })).rejects.toThrow(
      WordPressUnavailableError,
    );
  });
});

describe("getRelatedPosts", () => {
  it("degrades to an empty list so a flaky upstream cannot break the article", async () => {
    fetchMock.mockResolvedValue(json({}, 500));
    const post = { id: 1, categoryIds: [7] } as Parameters<
      typeof getRelatedPosts
    >[0];
    await expect(getRelatedPosts(post, 3, "id")).resolves.toEqual([]);
  });
});

describe("getAuthorBySlug", () => {
  it("returns the author when WordPress has them", async () => {
    fetchMock.mockResolvedValue(
      json([
        {
          id: 1,
          name: "Cekat AI",
          slug: "author-profile-hit",
          description: "Writes about AI.",
          avatar_urls: { "96": "https://example.com/a.png" },
        },
      ]),
    );
    const author = await getAuthorBySlug("author-profile-hit");
    expect(author).toMatchObject({
      id: 1,
      slug: "author-profile-hit",
      name: "Cekat AI",
      bio: "Writes about AI.",
      avatar: "https://example.com/a.png",
    });
  });

  it("returns null only when WordPress positively reports no such author", async () => {
    fetchMock.mockResolvedValue(json([]));
    await expect(getAuthorBySlug("no-such-writer")).resolves.toBeNull();
  });

  it("THROWS instead of returning null when WordPress is unavailable", async () => {
    fetchMock.mockResolvedValue(json({}, 502));
    await expect(getAuthorBySlug("author-unavailable")).rejects.toThrow(
      WordPressUnavailableError,
    );
  });
});
