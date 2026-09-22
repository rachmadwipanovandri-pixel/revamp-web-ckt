import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { Container } from "@/components/layout/container";
import { PostCard } from "./post-card";

export function RelatedPosts({
  posts,
  heading,
  locale,
}: {
  posts: BlogPost[];
  heading: string;
  locale: Locale;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface-muted">
      <Container className="px-6 py-12 lg:px-0 lg:py-16">
        <h2 className="font-numeric text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {heading}
        </h2>
        <div className="mt-8 grid grid-cols-1 border-t border-l border-border bg-white md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
          {Array.from({ length: (3 - (posts.length % 3)) % 3 }).map((_, i) => (
            <div
              key={`filler-${i}`}
              aria-hidden
              className="hidden border-r border-b border-border md:block"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
