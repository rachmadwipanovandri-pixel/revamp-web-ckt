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
          "border-x border-border px-6 pt-12 lg:pt-16",
          // Stats already carry their own bottom spacing, no extra section pad.
          stats && stats.length > 0 ? "pb-0" : "pb-12 lg:pb-16",
        )}
      >
        <p className="max-w-4xl font-numeric text-xl leading-relaxed font-medium text-foreground md:text-2xl">
          {definition}
        </p>

        {stats && stats.length > 0 && (
          <dl className="mt-10 grid grid-cols-2 border-t border-border md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "py-6 pr-6",
                  index > 0 && "md:border-l md:border-border md:pl-6",
                )}
              >
                <dd className="font-numeric text-3xl font-semibold text-primary md:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 font-numeric text-sm leading-snug text-muted-foreground">
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
