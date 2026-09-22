import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export function Pillars({
  eyebrow,
  heading,
  pillars,
}: {
  eyebrow?: string;
  heading: string;
  pillars: Array<{ title: string; body: string }>;
}) {
  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border lg:px-0">
        <div className="px-6 py-12 lg:py-16">
          <SectionHeading eyebrow={eyebrow} heading={heading} />
        </div>

        <div
          className={cn(
            "grid grid-cols-1 border-t border-border",
            pillars.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-3",
          )}
        >
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={
                index > 0
                  ? "border-t border-border px-6 py-8 md:border-t-0 md:border-l lg:py-10"
                  : "px-6 py-8 lg:py-10"
              }
            >
              <span className="font-numeric text-sm font-semibold text-primary tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-numeric text-lg font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 font-numeric text-base text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
