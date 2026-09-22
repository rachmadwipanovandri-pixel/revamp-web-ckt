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
          <figure className="max-w-3xl rounded-[1.5rem] border border-foreground/8 bg-white p-6 shadow-[0_28px_56px_-40px_rgba(16,24,40,0.45)] md:p-8">
            <blockquote className="text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.45] font-medium tracking-[-0.02em] text-foreground">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 border-t border-foreground/10 pt-5">
              {testimonial.image && (
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="size-14 shrink-0 rounded-full object-cover ring-2 ring-primary/15"
                />
              )}
              <div>
                <p className="font-numeric text-base font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 font-numeric text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
