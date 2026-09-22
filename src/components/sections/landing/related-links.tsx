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
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <div className="mt-8">
          <EntryGrid items={links} readMore={readMore} />
        </div>
      </Container>
    </section>
  );
}
