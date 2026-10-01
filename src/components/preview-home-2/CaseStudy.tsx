import Image from "next/image";
import Link from "next/link";
import { ArrowText, Band, Eyebrow, Shell } from "./ui";
import type { HomeContent } from "./types";

/**
 * Band 8 — featured case study. Metrics are oversized, tabular, and static;
 * the photo is decorative (`alt=""`) because the narrative beside it carries
 * the meaning.
 */
export function CaseStudy({ content }: { content: HomeContent["caseStudy"] }) {
  return (
    <Band tone="white" labelledBy="ph2-case-title">
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-border bg-[#F8FAFF]">
              <Image
                src="/images/home/case-study-naturecraft.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden
              className="ph2-float absolute -bottom-5 left-5 hidden rounded-2xl border border-border bg-white px-5 py-3 shadow-[0_1px_2px_rgba(11,18,32,0.05),0_24px_48px_-30px_rgba(11,18,32,0.4)] sm:block"
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.08em] text-[#64748B] uppercase">
                {content.metrics[0]?.label}
              </p>
              <p className="mt-0.5 text-[1.35rem] font-bold tracking-[-0.02em] text-[#101828] tabular-nums">
                {content.metrics[0]?.value}
                <span className="text-primary">
                  {content.metrics[0]?.suffix}
                </span>
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <p className="mt-4 text-[0.8rem] font-bold tracking-[0.1em] text-[#64748B] uppercase">
              {content.client}
            </p>
            <h2
              id="ph2-case-title"
              className="mt-2 text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.15] font-bold tracking-[-0.025em] text-balance text-[#101828]"
            >
              {content.title}
            </h2>
            <p className="mt-4 text-[1rem] leading-[1.65] text-[#4B5563]">
              {content.body}
            </p>

            <blockquote className="mt-6 rounded-[18px] border-l-[3px] border-primary bg-[#F8FAFF] px-5 py-4">
              <p className="text-[0.95rem] leading-[1.6] text-[#101828] italic">
                “{content.quote}”
              </p>
              <footer className="mt-2.5 text-[0.8rem] font-semibold text-[#64748B]">
                {content.attribution}
              </footer>
            </blockquote>

            <dl className="mt-7 grid gap-6 border-t border-[#F1F5F9] pt-6 sm:grid-cols-3">
              {content.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="text-[clamp(1.5rem,2.6vw,1.9rem)] leading-none font-bold tracking-[-0.03em] text-[#101828] tabular-nums">
                    {metric.value}
                    <span className="text-primary">{metric.suffix}</span>
                  </dd>
                  <dt className="mt-2 text-[0.8rem] leading-[1.45] text-[#4B5563]">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            <Link
              href={content.cta.href}
              className="group mt-7 inline-flex items-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-[#101828] transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#BFDBFE] hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <ArrowText>{content.cta.label}</ArrowText>
            </Link>
          </div>
        </div>
      </Shell>
    </Band>
  );
}
