import Image from "next/image";
import type { BlogPost } from "@/lib/wordpress";

export function AuthorCard({
  author,
  label,
  role,
  fallbackBio,
}: {
  author: BlogPost["author"];
  label: string;
  role: string;
  fallbackBio: string;
}) {
  return (
    <div className="border border-border bg-surface-muted p-5">
      <p className="font-numeric text-xs font-semibold tracking-[0.08em] text-subtle-foreground uppercase">
        {label}
      </p>
      <div className="mt-4 flex items-center gap-3">
        {author.avatar ? (
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
        )}
        <div>
          <p className="font-numeric text-base font-semibold text-foreground">
            {author.name}
          </p>
          <p className="font-numeric text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="mt-4 font-numeric text-sm leading-relaxed text-muted-foreground">
        {author.bio || fallbackBio}
      </p>
    </div>
  );
}
