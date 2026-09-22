import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { formatDate } from "@/lib/format-date";

/**
 * Horizontal featured-post card (copy left, image right) fused under the
 * blog void hero — glass-adjacent white card on the ink stage.
 */
export function HeroFeatured({
  post,
  locale,
  featuredLabel,
  readMore,
}: {
  post: BlogPost;
  locale: Locale;
  featuredLabel: string;
  readMore: string;
}) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group grid grid-cols-1 overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/95 shadow-[0_32px_70px_-40px_rgba(0,0,0,0.75)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_36px_80px_-40px_rgba(19,82,191,0.55)] md:grid-cols-2"
    >
      <div className="flex flex-col justify-center p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink-void px-3 py-1 font-numeric text-[0.65rem] font-semibold tracking-[0.14em] text-sky-300 uppercase">
            {featuredLabel}
          </span>
          {post.category && (
            <span className="font-numeric text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
              {post.category.name}
            </span>
          )}
        </div>
        <h2 className="mt-3 line-clamp-3 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-foreground">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 font-numeric text-sm leading-snug text-muted-foreground md:text-base">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-3">
          {post.author.avatar && (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={36}
              height={36}
              className="size-9 rounded-full"
              unoptimized
            />
          )}
          <div className="font-numeric text-xs">
            <p className="font-semibold text-foreground">{post.author.name}</p>
            <time dateTime={post.date} className="text-subtle-foreground">
              {formatDate(post.date, locale)}
            </time>
          </div>
        </div>
        <span className="mt-5 inline-flex w-fit items-center gap-1 rounded-full border border-foreground/12 bg-white px-4 py-2 font-numeric text-sm font-semibold text-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:text-primary">
          {readMore}
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
      <div className="relative order-first aspect-[16/10] overflow-hidden bg-surface-subtle md:order-last md:aspect-auto md:min-h-[20rem]">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-surface-muted" />
        )}
      </div>
    </Link>
  );
}
