import Link from "next/link";
import { LogoWhite } from "@/components/layout/logo";
import { Shell } from "./ui";
import type { HomeContent } from "./types";

/** The single ink bookend at the bottom of an otherwise light page. */
export function Footer({ content }: { content: HomeContent["footer"] }) {
  return (
    <footer className="bg-[#0B1220] text-[#E2E8F0]">
      <Shell className="py-14 md:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div>
            <LogoWhite className="h-7 w-auto" />
            <p className="mt-4 max-w-[19rem] text-[0.85rem] leading-[1.6] text-[#94A3B8]">
              {content.about}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-[0.75rem] font-medium text-[#F1F5F9]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {content.partner}
            </p>
          </div>

          {content.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[0.7rem] font-bold tracking-[0.1em] text-[#94A3B8] uppercase">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-0.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block rounded py-1 text-[0.85rem] text-[#F1F5F9] transition-[color,transform] duration-150 hover:translate-x-0.5 hover:text-white motion-reduce:transition-none motion-reduce:hover:translate-x-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-[0.78rem] text-[#94A3B8] sm:flex-row sm:items-center">
          <p>{content.copyright}</p>
          <ul className="flex flex-wrap gap-5">
            {content.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="rounded transition-colors duration-150 hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </footer>
  );
}
