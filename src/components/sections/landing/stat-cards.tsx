import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { cn } from "@/lib/utils";

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
    <section className="relative overflow-hidden bg-surface-muted py-14 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 50} className="h-full">
              <div className="h-full rounded-[1.35rem] border border-foreground/8 bg-white p-6 shadow-[0_16px_40px_-36px_rgba(19,82,191,0.35)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/25">
                <dd
                  className={cn(
                    "font-numeric text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-semibold tracking-[-0.04em] text-primary tabular-nums break-words",
                  )}
                >
                  {stat.value}
                </dd>
                <dt className="mt-2.5 font-numeric text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
