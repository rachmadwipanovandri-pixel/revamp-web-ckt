import { Container } from "@/components/layout/container";

/**
 * The reference's stat-card row. Same numbers the plain stats strip carries,
 * given card weight for industry pages: a vertical's proof points are the
 * thing a reader scans for first.
 *
 * No new figures are introduced here. Every value comes from the page's own
 * stats array, where client-specific numbers stay attributed in their label.
 */
export function StatCards({
  stats,
}: {
  stats: Array<{ value: string; label: string }>;
}) {
  return (
    <section className="border-t border-border bg-surface-muted">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-white p-6"
            >
              <dd className="font-numeric text-3xl font-semibold text-primary md:text-4xl">
                {stat.value}
              </dd>
              <dt className="mt-2 font-numeric text-sm leading-snug text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
