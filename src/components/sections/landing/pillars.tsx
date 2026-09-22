import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
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
    <section className="relative overflow-hidden border-t border-foreground/8 bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 60} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-surface-muted/60 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative font-numeric text-[0.7rem] font-bold tracking-[0.16em] text-subtle-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="relative mt-4 font-numeric text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {pillar.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
