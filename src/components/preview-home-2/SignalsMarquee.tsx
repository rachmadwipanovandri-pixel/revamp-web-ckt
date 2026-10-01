import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimGate } from "./AnimGate";
import { Band, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Customer-signal marquee — three rows of chips drifting in alternating
 * directions, ported from preview-home's dark signals band into the light
 * palette.
 *
 * Each row is duplicated exactly once so `translateX(-50%)` loops seamlessly;
 * the duplicate half is `aria-hidden` so assistive tech reads the list once.
 */
export function SignalsMarquee({ content }: { content: HomeContent["signals"] }) {
  return (
    <Band tone="wash" labelledBy="ph2-signals-title" className="overflow-hidden">
      <Shell>
        <SectionHead
          id="ph2-signals-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
          align="center"
        />
      </Shell>

      <AnimGate className="ph2-mq-wrap mt-12">
        <div className="ph2-mq-mask flex flex-col gap-3.5 overflow-hidden">
          {content.rows.map((row, rowIndex) => {
            const reverse = rowIndex % 2 === 1;
            const chips = [...row, ...row];
            return (
              <div
                key={rowIndex}
                className={cn(
                  "ph2-mq-row ph2-anim",
                  reverse ? "ph2-mq-right" : "ph2-mq-left",
                )}
              >
                {chips.map((chip, index) => (
                  <span
                    key={`${chip.text}-${index}`}
                    aria-hidden={index >= row.length || undefined}
                    className="inline-flex items-center gap-2.5 rounded-full border border-border bg-white px-4 py-2.5 text-[0.875rem] font-medium whitespace-nowrap text-[#4B5563] shadow-[0_1px_2px_rgba(11,18,32,0.03)]"
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                      style={{ background: chip.accent }}
                    />
                    {chip.text}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </AnimGate>

      <Shell className="mt-10 text-center">
        <Link
          href={content.cta.href}
          className="inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-[#101828] transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {content.cta.label}
        </Link>
      </Shell>
    </Band>
  );
}
