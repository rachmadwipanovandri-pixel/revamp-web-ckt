import { Container } from "@/components/layout/container";
import { RegistryIcon } from "@/components/layout/registry-icon";

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
    <section className="bg-white">
      <Container className="border-x border-border py-16 lg:py-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          {heading}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-surface-muted p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RegistryIcon
                  name={item.icon ?? "LifeBuoy"}
                  className="size-5"
                />
              </span>
              <h3 className="mt-4 font-numeric text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
