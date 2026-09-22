import { Container } from "@/components/layout/container";
import { RegistryIcon } from "@/components/layout/registry-icon";
import { Reveal } from "@/components/sections/new-home/reveal";

/**
 * The three problems a role lives with before the platform, as cards. The
 * heading names the role's pain in its own words; the benefits section that
 * follows answers card by card.
 */
export function PainPoints({
  heading,
  items,
}: {
  heading: string;
  items: Array<{ icon?: string; title: string; body: string }>;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <h2 className="max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-foreground">
          {heading}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="h-full">
              <article className="group h-full rounded-[1.35rem] border border-foreground/8 bg-surface-muted/70 p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-white text-primary shadow-[0_10px_24px_-16px_rgba(19,82,191,0.45)]">
                  <RegistryIcon
                    name={item.icon ?? "LifeBuoy"}
                    className="size-5"
                  />
                </span>
                <h3 className="mt-4 font-numeric text-lg font-semibold tracking-[-0.02em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
