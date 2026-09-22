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
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border px-6 py-14 lg:py-20">
        <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
          {eyebrow}
        </p>

        {/* Asymmetric split with a gap column: the figures own the left third,
            the story starts at column six rather than five, so the rule has
            air on both sides instead of butting against the text. */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-4">
            <dl className="flex flex-col">
              {story.metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={
                    index > 0 ? "mt-6 border-t border-border pt-6" : undefined
                  }
                >
                  <dd className="font-numeric text-5xl leading-none font-semibold tracking-tight text-primary tabular-nums lg:text-6xl">
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

          <div className="lg:col-span-7 lg:col-start-6 lg:border-l lg:border-border lg:pl-10">
            <h2 className="font-numeric text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {story.title ?? story.client}
            </h2>
            <p className="mt-5 font-numeric text-base leading-relaxed text-muted-foreground md:text-lg">
              {story.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
