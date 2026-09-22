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
        <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
          eyebrow && "mt-2",
        )}
      >
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
