import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SectionHeading } from "./section-heading";

export function LandingTestimonial({
  eyebrow,
  heading,
  testimonial,
}: {
  eyebrow?: string;
  heading: string;
  testimonial: {
    quote: string;
    name: string;
    role: string;
    image?: string;
  };
}) {
  return (
    <section className="relative overflow-hidden bg-surface-muted py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} heading={heading} />

        <Reveal className="mt-10">
          <figure className={`overflow-hidden rounded-[28px] border border-[#ccdaf1] bg-white ${testimonial.image ? "grid lg:grid-cols-[.7fr_1.3fr]" : ""}`}>
            {testimonial.image && (
              <div className="relative min-h-[300px] bg-[#e4ebf9] lg:min-h-[420px]">
                <Image src={testimonial.image} alt={testimonial.name} fill sizes="(max-width: 1024px) 100vw, 450px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-col justify-center p-7 lg:p-12">
            <blockquote className="text-[clamp(1.35rem,2.6vw,2.2rem)] leading-[1.4] font-medium tracking-[-0.03em] text-[#09214c]">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-foreground/10 pt-5">
              <div>
                <p className="font-numeric text-base font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 font-numeric text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </figcaption>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
