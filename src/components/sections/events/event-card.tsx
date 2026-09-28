import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventItem } from "@/lib/events/types";

/**
 * Event card for the /events listing: cover on top, date chip, title,
 * excerpt, then the logistics row and a detail link.
 */
export function EventCard({
  event,
  isPast,
}: {
  event: EventItem;
  isPast: boolean;
}) {
  const t = useTranslations("events");

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0px_0.6px_2.5px_-1.2px_rgba(0,0,0,0.17),0px_2.3px_9.6px_-2.3px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0px_0.6px_2.5px_-1.2px_rgba(0,0,0,0.2),0px_2.3px_9.6px_-2.3px_rgba(0,0,0,0.22),0px_10px_42px_-3.5px_rgba(0,0,0,0.12)]">
      <div className="relative h-44 w-full overflow-hidden bg-surface-muted">
        {event.cover ? (
          <Image
            src={event.cover}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-primary/15 via-accent-sky/10 to-transparent"
          />
        )}
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 font-numeric text-[11px] font-semibold tracking-[0.1em] uppercase backdrop-blur ${
            isPast
              ? "bg-slate-900/70 text-white"
              : "bg-white/90 text-primary"
          }`}
        >
          {isPast ? t("listing.past") : t("listing.upcoming")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-numeric text-xs font-semibold tracking-wide text-primary">
          {event.dateLabel || event.startsAt.slice(0, 10)}
          {event.timeLabel ? ` · ${event.timeLabel}` : ""}
        </p>

        <h3 className="text-lg leading-snug font-semibold text-foreground">
          <Link
            href={{ pathname: "/events/[slug]", params: { slug: event.slug } }}
            className="hover:text-primary focus-visible:text-primary"
          >
            {event.title}
          </Link>
        </h3>

        {event.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.excerpt}
          </p>
        )}

        <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 font-numeric text-xs text-muted-foreground">
          {event.locationLabel && <li>💻 {event.locationLabel}</li>}
          {event.priceLabel && <li>🎟️ {event.priceLabel}</li>}
        </ul>

        <Link
          href={{ pathname: "/events/[slug]", params: { slug: event.slug } }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          {t("listing.view")}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
