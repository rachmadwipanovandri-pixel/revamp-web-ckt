import { Band, Card, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 4 — the three pillars (Independent · Connected · Open), each with a
 * small "mini diagram" made of the index, an accent rule, and its points.
 */
export function Pillars({ content }: { content: HomeContent["pillars"] }) {
  return (
    <Band tone="white" labelledBy="ph2-pillars-title">
      <Shell>
        <SectionHead
          id="ph2-pillars-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {content.items.map((pillar) => (
            <li key={pillar.title}>
              <Card interactive className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-xl text-[0.8rem] font-bold text-white"
                    style={{ background: pillar.accent }}
                  >
                    {pillar.index}
                  </span>
                  <h3 className="text-[1.15rem] font-bold tracking-[-0.02em] text-[#101828]">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mt-4 text-[0.95rem] leading-[1.6] text-[#4B5563]">
                  {pillar.body}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5 border-t border-[#F1F5F9] pt-5">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[0.875rem] leading-[1.5] text-[#4B5563]"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: pillar.accent }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      </Shell>
    </Band>
  );
}
