import Image from "next/image";
import { Container } from "@/components/layout/container";
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
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        <SectionHeading eyebrow={eyebrow} heading={heading} />

        <figure className="mt-10 max-w-3xl">
          <blockquote className="font-numeric text-lg leading-snug text-foreground md:text-xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            {testimonial.image && (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={64}
                height={64}
                className="size-16 shrink-0 object-cover"
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
      </Container>
    </section>
  );
}
