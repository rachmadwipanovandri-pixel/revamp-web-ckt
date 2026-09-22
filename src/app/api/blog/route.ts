import { NextResponse } from "next/server";
import { getCategories, getPosts } from "@/lib/wordpress";

export const revalidate = 300;

// Client-side infinite scroll pages against this endpoint.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const categorySlug = searchParams.get("category") ?? undefined;
  const lang = searchParams.get("lang") ?? undefined;
  const search = searchParams.get("q") ?? undefined;

  let categoryIds: number[] | undefined;
  if (categorySlug) {
    const categories = await getCategories(lang);
    categoryIds = categories.find((c) => c.slug === categorySlug)?.ids;
  }

  try {
    const { posts, totalPages } = await getPosts({
      page,
      perPage: 9,
      categories: categoryIds,
      lang,
      search,
    });

    // Cards don't render the article body, drop it to shrink the client payload.
    return NextResponse.json({
      posts: posts.map((p) => ({ ...p, content: "" })),
      totalPages,
      page,
    });
  } catch {
    // Signal "try again" rather than an empty page the client would treat as
    // the end of the feed.
    return NextResponse.json(
      { error: "upstream_unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
