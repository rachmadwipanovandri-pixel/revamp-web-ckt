import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { formatDate } from "@/lib/format-date";

export function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-subtle">
        {post.image ? (
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/15 to-surface-muted" />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-void/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          {post.category && (
            <span className="font-numeric text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
              {post.category.name}
            </span>
          )}
          <span
            aria-hidden
            className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-subtle-foreground"
          >
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-numeric text-lg font-semibold tracking-[-0.025em] text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-numeric text-sm leading-snug text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 border-t border-foreground/8 pt-4 font-numeric text-xs text-subtle-foreground">
          <span className="font-semibold text-foreground">
            {post.author.name}
          </span>
        </div>
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </Link>
  );
}
