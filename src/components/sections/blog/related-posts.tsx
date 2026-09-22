import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
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
    <section className="relative overflow-hidden bg-surface-muted py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <Reveal>
          <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
            Blog
          </p>
          <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
