"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { PostCard } from "./post-card";

export function BlogFeed({
  initialPosts,
  initialPage,
  totalPages,
  categorySlug,
  query,
  locale,
}: {
  initialPosts: BlogPost[];
  initialPage: number;
  totalPages: number;
  categorySlug?: string;
  query?: string;
  locale: Locale;
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    const next = page + 1;
    try {
      const params = new URLSearchParams({ page: String(next), lang: locale });
      if (categorySlug) params.set("category", categorySlug);
      if (query) params.set("q", query);
      const res = await fetch(`/api/blog?${params}`);
      if (res.ok) {
        const data = (await res.json()) as { posts: BlogPost[] };
        setPosts((prev) => [...prev, ...data.posts]);
        setPage(next);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, page, totalPages, categorySlug, query, locale]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} locale={locale} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-10"
          aria-hidden
        >
          <span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      )}
    </div>
  );
}
