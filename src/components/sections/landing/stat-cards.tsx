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
        <dl className="stat-rail grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 50} className="h-full">
              <div className="h-full border-t-2 border-[#ccdaf1] bg-white p-6">
                <dd
                  className={cn(
                    "font-numeric leading-none font-semibold tracking-[-0.055em] text-primary tabular-nums break-words",
                    stat.value.length > 8
                      ? "text-[clamp(2rem,3vw,2.4rem)]"
                      : "text-[clamp(2rem,4vw,3.5rem)]",
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
