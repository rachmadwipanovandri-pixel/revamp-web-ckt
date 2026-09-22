import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * GEO: the entity definition rendered first in the body, a self-contained
 * 1–2 sentence answer engines can lift, followed by quotable stats.
 */
export function DefinitionBlock({
  definition,
  stats,
}: {
  definition: string;
  stats?: Array<{ value: string; label: string }>;
}) {
  return (
    <section className="bg-white">
      <Container
        className={cn(
          "px-4 pt-14 sm:px-6 lg:px-8 lg:pt-18",
          // Stats already carry their own bottom spacing, no extra section pad.
          stats && stats.length > 0 ? "pb-0" : "pb-14 lg:pb-18",
        )}
      >
        <p className="max-w-4xl text-[clamp(1.15rem,2.2vw,1.5rem)] leading-[1.55] font-medium tracking-[-0.02em] text-foreground">
          {definition}
        </p>

        {stats && stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-foreground/10 pt-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.25rem] border border-foreground/8 bg-surface-muted/70 p-5"
              >
                <dd className="font-numeric text-[clamp(1.5rem,3vw,2.25rem)] leading-none font-semibold tracking-[-0.04em] text-primary tabular-nums">
                  {stat.value}
                </dd>
                <dt className="mt-2 font-numeric text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
