import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowText, Band, Card, SectionHead, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 10a — pricing teaser. Contact-led: the tiers show what is included
 * (capacity, credits, seats) without quoting numbers that the pricing page
 * would have to keep in sync.
 */
export function Pricing({ content }: { content: HomeContent["pricing"] }) {
  return (
    <Band tone="white" labelledBy="ph2-pricing-title">
      <Shell>
        <SectionHead
          id="ph2-pricing-title"
          eyebrow={content.eyebrow}
          title={content.heading}
          body={content.body}
        />

        <ul className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {content.tiers.map((tier) => (
            <li key={tier.name} className="flex">
              <Card
                className={cn(
                  "relative flex w-full flex-col p-6",
                  tier.popular && "border-primary/45 shadow-[0_1px_2px_rgba(11,18,32,0.05),0_30px_56px_-32px_rgba(19,82,191,0.5)]",
                )}
              >
                {tier.popular ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#0B1220] px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-white uppercase">
                    {content.popularLabel}
                  </span>
                ) : null}

                <h3 className="text-[1.25rem] font-bold tracking-[-0.02em] text-[#101828]">
                  {tier.name}
                </h3>
                <p className="mt-2 min-h-[3rem] text-[0.875rem] leading-[1.55] text-[#4B5563]">
                  {tier.tag}
                </p>

                <Link
                  href={tier.cta.href}
                  className={cn(
                    "mt-5 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    tier.popular
                      ? "bg-primary text-white hover:bg-[#2563EB]"
                      : "border border-border bg-white text-[#101828] hover:border-[#BFDBFE] hover:text-primary",
                  )}
                >
                  {tier.cta.label}
                </Link>

                <dl className="mt-6 flex flex-col gap-3 border-t border-[#F1F5F9] pt-5">
                  {tier.rows.map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#EFF6FF]"
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="#1352BF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 3 4.5 9 2 6.5" />
                        </svg>
                      </span>
                      <dt className="text-[0.85rem] text-[#4B5563]">{row.label}</dt>
                      <dd className="ml-auto text-[0.85rem] font-semibold text-[#101828] tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-2">
          <Link href={content.compare.href} className="group">
            <ArrowText>{content.compare.label}</ArrowText>
          </Link>
          <p className="text-[0.8rem] text-[#64748B]">{content.note}</p>
        </div>
      </Shell>
    </Band>
  );
}
