import type { ComponentProps } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { RegistryIcon } from "@/components/layout/registry-icon";
import { cn } from "@/lib/utils";

export interface EntryCardData {
  href: ComponentProps<typeof Link>["href"];
  icon?: string;
  title: string;
  tagline?: string;
  /**
   * Optional cover photo. With one, the card opens on a 16:10 band and the
   * icon shrinks to a corner chip; without one it keeps the plain icon plate,
   * so a hub that has art and one that doesn't each stay internally uniform.
   */
  image?: string;
}

/** One shared cover frame: every card in a grid ends up the same height. */
const COVER_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 300px";

/** A single rounded entry card: optional cover + title + tagline (+ read-more). */
export function EntryCard({
  href,
  icon,
  title,
  tagline,
  image,
  readMore,
}: EntryCardData & { readMore?: string }) {
  return (
    <Link
      href={href}
      className="secondary-entry-card group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e5e9ef] bg-white shadow-[0_1px_2px_rgba(9,33,76,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9eb8e5] hover:shadow-[0_18px_40px_-22px_rgba(9,33,76,0.27)] focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none motion-reduce:transform-none"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {image && (
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface-subtle">
          <Image
            src={image}
            alt=""
            fill
            sizes={COVER_SIZES}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
          />
          {icon && (
            <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-xl border border-white/70 bg-white/92 text-primary shadow-[0_6px_16px_-8px_rgba(11,18,32,0.45)] backdrop-blur-sm">
              <RegistryIcon name={icon} className="size-4" />
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-1 flex-col gap-3",
          image ? "p-6" : "p-7",
        )}
      >
        {!image && (
          <span className="flex size-12 items-center justify-center rounded-xl bg-[#e4ebf9] text-[#1352bf] transition-colors duration-300 group-hover:bg-[#ccdaf1]">
            <RegistryIcon name={icon} className="size-5" />
          </span>
        )}
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#09214c]">
            {title}
          </h3>
          {tagline && (
            <p className="mt-2 text-sm leading-[1.6] text-[#505f73]">
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
      </div>

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
    <div className="secondary-entry-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <EntryCard key={item.title} {...item} readMore={readMore} />
      ))}
    </div>
  );
}
