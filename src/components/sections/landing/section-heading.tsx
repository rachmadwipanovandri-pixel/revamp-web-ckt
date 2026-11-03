import { cn } from "@/lib/utils";
import { HeadingWords } from "@/components/sections/shared/heading-words";

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
    <div className={cn("max-w-[800px]", className)}>
      {eyebrow && (
        <p className="eyebrow-rule mb-4 inline-flex text-sm font-semibold text-[#1352bf]">
          {eyebrow}
        </p>
      )}
      <HeadingWords text={heading} className="text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-balance text-[#09214c]" />
      {intro && (
        <p className="mt-5 max-w-[650px] text-base leading-[1.6] text-[#3a4960] md:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
