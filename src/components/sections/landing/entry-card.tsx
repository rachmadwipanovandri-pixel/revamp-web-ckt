import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { RegistryIcon } from "@/components/layout/registry-icon";

export interface EntryCardData {
  href: ComponentProps<typeof Link>["href"];
  icon?: string;
  title: string;
  tagline?: string;
}

/** A single flush-grid cell: icon tile + title + tagline (+ optional read-more). */
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
      className="group flex flex-col gap-3 border-r border-b border-border p-6 transition-colors hover:bg-surface-muted"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-surface-subtle text-muted-foreground ring-1 ring-transparent transition-colors group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/15">
        <RegistryIcon name={icon} className="size-5" />
      </span>
      <div>
        <h3 className="font-numeric text-base font-semibold text-foreground">
          {title}
        </h3>
        {tagline && (
          <p className="mt-1 font-numeric text-sm leading-snug text-muted-foreground">
            {tagline}
          </p>
        )}
      </div>
      {readMore && (
        <span className="mt-auto inline-flex items-center gap-1 pt-2 font-numeric text-sm font-semibold text-primary">
          {readMore}
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      )}
    </Link>
  );
}

/**
 * A flush hairline grid of EntryCards. Filler cells pad the list to a multiple
 * of four so the grid stays a clean rectangle in both the 2- and 4-column
 * layouts. Shared by the hub and the related-links section.
 */
export function EntryGrid({
  items,
  readMore,
}: {
  items: EntryCardData[];
  readMore?: string;
}) {
  const fillers = (4 - (items.length % 4)) % 4;
  return (
    <div className="grid grid-cols-2 border-t border-l border-border lg:grid-cols-4">
      {items.map((item) => (
        <EntryCard key={item.title} {...item} readMore={readMore} />
      ))}
      {Array.from({ length: fillers }).map((_, i) => (
        <div
          key={`filler-${i}`}
          aria-hidden
          className="border-r border-b border-border"
        />
      ))}
    </div>
  );
}
