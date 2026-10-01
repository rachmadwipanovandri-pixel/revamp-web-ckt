import Link from "next/link";
import { Band, Shell } from "./ui";
import type { HomeContent } from "./types";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Band 10b — closing CTA. Bright brand field rather than another dark void:
 * the light direction keeps the whole page on one tonal track, and the footer
 * below supplies the single ink bookend.
 */
export function FinalCta({ content }: { content: HomeContent["finalCta"] }) {
  return (
    <Band tone="white" className="pt-0 pb-20 md:pb-28">
      <Shell>
        <div className="ph2-grid-bg relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1352BF] to-[#0B1220] px-6 py-14 text-center sm:px-10 md:py-16">
          <div className="relative mx-auto flex max-w-[46rem] flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.75rem] font-semibold text-white">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[#BFDBFE]"
              />
              {content.eyebrow}
            </span>

            <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-white">
              {content.titleLead}{" "}
              <span className="text-[#BFDBFE] italic">
                {content.titleAccent}
              </span>
            </h2>

            <p className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.6] text-white/80">
              {content.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={content.ctaPrimary.href}
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[0.95rem] font-semibold text-[#0B1220] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {content.ctaPrimary.label}
              </a>
              <Link
                href={content.ctaSecondary.href}
                className="inline-flex h-12 items-center rounded-full border border-white/30 bg-white/10 px-6 text-[0.95rem] font-semibold text-white transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {content.ctaSecondary.label}
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[0.85rem] text-white/85">
              {content.checks.map((check) => (
                <li key={check} className="inline-flex items-center gap-2">
                  <span className="text-[#BBF7D0]">
                    <CheckIcon />
                  </span>
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Shell>
    </Band>
  );
}
