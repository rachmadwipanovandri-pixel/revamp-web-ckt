import { cn } from "@/lib/utils";

/** Eyebrow + heading (+ optional intro), the shared section header rhythm. */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  className,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
        {heading}
      </h2>
      {intro && (
        <p className="mt-4 font-numeric text-base text-muted-foreground md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
