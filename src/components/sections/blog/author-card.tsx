import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/wordpress";

export function AuthorCard({
  author,
  label,
  role,
  fallbackBio,
  profileLabel,
}: {
  author: BlogPost["author"];
  label: string;
  role: string;
  fallbackBio: string;
  /** CTA to `/blog/author/[slug]` when the WP author has a slug. */
  profileLabel?: string;
}) {
  const profileHref = author.slug
    ? {
        pathname: "/blog/author/[slug]" as const,
        params: { slug: author.slug },
      }
    : null;

  const avatar = author.avatar ? (
    <Image
      src={author.avatar}
      alt={author.name}
      width={48}
      height={48}
      className="size-12 rounded-full"
      unoptimized
    />
  ) : (
    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-numeric text-base font-semibold text-primary">
      {author.name.charAt(0)}
    </span>
  );

  const identity = (
    <div className="flex items-center gap-3">
      {avatar}
      <div>
        <p className="font-numeric text-base font-semibold text-foreground group-hover:text-primary">
          {author.name}
        </p>
        <p className="font-numeric text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );

  return (
    <div className="rounded-[1.25rem] border border-foreground/8 bg-white p-5 shadow-[0_18px_40px_-36px_rgba(16,24,40,0.4)]">
      <p className="eyebrow-rule inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-primary uppercase">
        {label}
      </p>
      <div className="mt-4">
        {profileHref ? (
          <Link href={profileHref} className="group block">
            {identity}
          </Link>
        ) : (
          identity
        )}
      </div>
      <p className="mt-4 font-numeric text-sm leading-relaxed text-muted-foreground">
        {author.bio || fallbackBio}
      </p>
      {profileHref && profileLabel && (
        <Link
          href={profileHref}
          className="mt-3 inline-flex font-numeric text-sm font-semibold text-primary hover:underline"
        >
          {profileLabel}
        </Link>
      )}
    </div>
  );
}
