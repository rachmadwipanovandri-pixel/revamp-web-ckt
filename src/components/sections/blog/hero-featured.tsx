import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { formatDate } from "@/lib/format-date";

/**
 * Horizontal white featured-post card (copy left, image right) that sits
 * full-width inside the blog hero, below the heading copy.
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
      className="group grid grid-cols-1 bg-white transition-colors hover:bg-surface-muted md:grid-cols-2"
    >
      <div className="flex flex-col justify-center p-6 lg:p-8">
        <div className="flex items-center gap-2">
          <span className="bg-primary px-2 py-0.5 font-numeric text-[11px] font-semibold tracking-wide text-white uppercase">
            {featuredLabel}
          </span>
          {post.category && (
            <span className="font-numeric text-xs font-semibold tracking-wide text-primary uppercase">
              {post.category.name}
            </span>
          )}
        </div>
        <h2 className="mt-3 line-clamp-3 font-numeric text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 font-numeric text-sm text-muted-foreground md:text-base">
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
        <span className="mt-5 inline-flex items-center gap-1 font-numeric text-sm font-semibold text-primary">
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
          <div className="absolute inset-0 bg-linear-to-br from-primary/15 to-surface-muted" />
        )}
      </div>
    </Link>
  );
}
