import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BlogPost } from "@/lib/wordpress";
import { formatDate } from "@/lib/format-date";

export function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group flex flex-col border-r border-b border-border transition-colors hover:bg-surface-muted"
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
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-surface-muted" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.category && (
          <span className="font-numeric text-xs font-semibold tracking-wide text-primary uppercase">
            {post.category.name}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 font-numeric text-lg font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-numeric text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-2 pt-4 font-numeric text-xs text-subtle-foreground">
          <span className="font-semibold text-foreground">
            {post.author.name}
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </div>
      </div>
    </Link>
  );
}
