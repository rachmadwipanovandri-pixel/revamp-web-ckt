import { AnimGate } from "./AnimGate";
import { Band, Card, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 9 — security and integrations.
 *
 * The constellation is a rotating ring of chips with counter-rotating labels,
 * so the text stays upright while the network drifts. It is gated by AnimGate:
 * no rotation while the band is off-screen or the tab is hidden.
 */
export function TrustBand({ content }: { content: HomeContent["trust"] }) {
  const nodes = content.integrations;
  const radius = 38;

  return (
    <Band tone="white" labelledBy="ph2-trust-title" className="overflow-hidden">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
          <div>
            <SectionHead
              id="ph2-trust-title"
              eyebrow={content.eyebrow}
              title={content.heading}
              body={content.body}
            />

            <ul className="mt-7 flex flex-wrap gap-2">
              {content.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-1.5 text-[0.75rem] font-semibold text-[#101828]"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <ul className="mt-9 grid gap-4 sm:grid-cols-2">
              {content.cards.map((card) => (
                <li key={card.title}>
                  <Card className="h-full p-5">
                    <span className="text-[0.7rem] font-bold tracking-[0.14em] text-[#64748B]">
                      {card.index}
                    </span>
                    <h3 className="mt-2 text-[1rem] font-bold tracking-[-0.02em] text-[#101828]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-[1.6] text-[#4B5563]">
                      {card.body}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-xs font-semibold tracking-[0.08em] text-[#64748B] uppercase">
              {content.integrationsLabel}
            </p>

            <AnimGate className="mt-6 w-full">
              <div className="relative mx-auto aspect-square w-full max-w-[400px]">
                <svg
                  viewBox="0 0 320 320"
                  aria-hidden
                  className="absolute inset-0 h-full w-full"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="122"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    strokeDasharray="3 7"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="86"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="ph2-anim ph2-orbit absolute inset-0">
                  {nodes.map((label, index) => {
                    const angle =
                      (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
                    return (
                      <span
                        key={label}
                        className="ph2-anim ph2-orbit-counter absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${50 + radius * Math.cos(angle)}%`,
                          top: `${50 + radius * Math.sin(angle)}%`,
                        }}
                      >
                        <span className="inline-flex rounded-full border border-border bg-white px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap text-[#4B5563] shadow-[0_8px_20px_-14px_rgba(11,18,32,0.5)]">
                          {label}
                        </span>
                      </span>
                    );
                  })}
                </div>

                <div className="absolute top-1/2 left-1/2 grid h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#BFDBFE] bg-white text-center shadow-[0_1px_2px_rgba(11,18,32,0.05),0_24px_48px_-28px_rgba(19,82,191,0.5)]">
                  <span className="text-[0.95rem] font-bold tracking-[-0.02em] text-primary">
                    Cekat.AI
                  </span>
                </div>
              </div>
            </AnimGate>

            <p className="mt-6 max-w-[26rem] text-center text-[0.8rem] text-[#64748B]">
              {content.integrationsNote}
            </p>
          </div>
        </div>
      </Shell>
    </Band>
  );
}
