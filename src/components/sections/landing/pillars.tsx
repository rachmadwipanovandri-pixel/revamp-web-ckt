import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SectionHeading } from "./section-heading";
import { Icon } from "@iconify/react/offline";
import { sceneBolt, sceneLayers } from "./scene-icons";

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
    <section className="capability-chapter relative overflow-hidden border-t border-[#e5e9ef] bg-white py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="capability-grid mt-12">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 60} className="h-full">
              <article className={`capability-card ${index === 0 ? "capability-card--lead" : ""}`}>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="capability-card__top">
                <span className="capability-card__icon" aria-hidden>
                  <Icon icon={index % 2 === 0 ? sceneBolt : sceneLayers} width={32} />
                </span>
                <span className="relative font-numeric text-xs font-semibold tracking-[0.16em] opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                </div>
                <h3 className="relative mt-5 text-xl font-semibold tracking-[-0.03em] text-[#09214c]">
                  {pillar.title}
                </h3>
                <p className="relative mt-3 text-base leading-[1.6] text-[#3a4960]">
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
