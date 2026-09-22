import { Container } from "@/components/layout/container";
import type { LandingContent } from "@/lib/registry/types";

type Story = NonNullable<LandingContent["caseStudy"]>;

/**
 * One named client's result, led by the figure rather than the prose.
 *
 * The previous version buried "+50%" mid-sentence inside a bordered card and
 * left two thirds of the row empty. Here the numbers are the largest thing on
 * the page and the narrative sits across a rule from them, in the proportions
 * of a magazine sidebar: the reader gets the claim in one glance and the
 * substantiation in the next.
 *
 * Every figure is the client's own, reported by them and never independently
 * audited, which the attribution line states outright. Naming who each number
 * belongs to is what separates this from a generic "3x faster" banner.
 */
export function CaseStudy({
  eyebrow,
  attribution,
  story,
}: {
  eyebrow: string;
  attribution: string;
  story: Story;
}) {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>

        {/* Asymmetric split with a gap column: the figures own the left third,
            the story starts at column six rather than five, so the rule has
            air on both sides instead of butting against the text. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-4">
            <dl className="flex flex-col">
              {story.metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={
                    index > 0 ? "mt-6 border-t border-foreground/10 pt-6" : undefined
                  }
                >
                  <dd className="font-numeric text-[clamp(2.5rem,6vw,3.75rem)] leading-none font-semibold tracking-[-0.05em] text-primary tabular-nums">
                    {metric.value}
                  </dd>
                  <dt className="mt-2.5 max-w-[16rem] font-numeric text-sm leading-snug text-muted-foreground">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-[16rem] font-numeric text-xs leading-relaxed text-subtle-foreground">
              {attribution}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:border-l lg:border-foreground/10 lg:pl-10">
            <h2 className="text-[clamp(1.5rem,3vw,2.15rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-foreground">
              {story.title ?? story.client}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {story.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
