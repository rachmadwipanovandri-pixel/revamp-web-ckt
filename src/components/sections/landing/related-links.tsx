import { Container } from "@/components/layout/container";
import { SectionHeading } from "./section-heading";
import { EntryGrid, type EntryCardData } from "./entry-card";

export type RelatedLink = EntryCardData;

export function RelatedLinks({
  eyebrow,
  heading,
  links,
  readMore,
}: {
  eyebrow?: string;
  heading: string;
  links: RelatedLink[];
  readMore?: string;
}) {
  if (links.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-t border-foreground/8 bg-surface-muted py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(19,82,191,0.1) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-8">
          <EntryGrid items={links} readMore={readMore} />
        </div>
      </Container>
    </section>
  );
}
