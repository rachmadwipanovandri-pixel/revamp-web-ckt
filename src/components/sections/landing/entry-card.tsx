import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { RegistryIcon } from "@/components/layout/registry-icon";

export interface EntryCardData {
  href: ComponentProps<typeof Link>["href"];
  icon?: string;
  title: string;
  tagline?: string;
}

/** A single rounded entry card: icon plate + title + tagline (+ optional read-more). */
export function EntryCard({
  href,
  icon,
  title,
  tagline,
  readMore,
}: EntryCardData & { readMore?: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="relative flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-surface-muted text-primary shadow-[0_10px_24px_-16px_rgba(19,82,191,0.45)] transition-colors duration-300 group-hover:bg-white">
        <RegistryIcon name={icon} className="size-5" />
      </span>
      <div className="relative">
        <h3 className="font-numeric text-base font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h3>
        {tagline && (
          <p className="mt-1 font-numeric text-sm leading-snug text-muted-foreground">
            {tagline}
          </p>
        )}
      </div>
      {readMore && (
        <span className="relative mt-auto inline-flex items-center gap-1 pt-2 font-numeric text-sm font-semibold text-primary">
          {readMore}
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}

/** Gap grid of EntryCards. */
export function EntryGrid({
  items,
  readMore,
}: {
  items: EntryCardData[];
  readMore?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <EntryCard key={item.title} {...item} readMore={readMore} />
      ))}
    </div>
  );
}
