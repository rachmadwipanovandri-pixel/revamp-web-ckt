"use client";

import { Shell } from "./ui";
import { LogoWhite } from "@/components/layout/logo";
import {
  AppStoreBadge,
  MetaLogo,
  PlayStoreBadge,
} from "@/components/layout/store-badges";
import {
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiYoutube,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import type { HomeContent } from "@/components/preview-home-2/types";
import { useState } from "react";

/**
 * Content-driven icon lookup. The content objects stay plain data (so `tsc` can
 * check both locales without importing React), and only this switch maps a name
 * to an icon — adding a network means one entry here.
 */
const SOCIAL_ICONS = {
  linkedin: mdiLinkedin,
  instagram: mdiInstagram,
  youtube: mdiYoutube,
  facebook: mdiFacebook,
};

export function Footer4({ content }: { content: HomeContent["footer"] }) {
  const [office, setOffice] = useState(0);
  const active = content.offices[office] ?? content.offices[0];
  return (
    <footer className="bg-[var(--ph4-console)] text-white">
      <div className="border-b border-[var(--ph4-console-line)]">
        <Shell className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-[var(--ph4-r-sm)] border border-[var(--ph4-console-line)] bg-white/[0.04] px-2.5 py-1.5">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="text-[0.8125rem] text-[var(--ph4-on-console-2)] sm:text-sm">
            {content.partner}
          </p>
        </Shell>
      </div>

      <Shell className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-10 lg:col-span-5 lg:pr-8">
          <div>
            <LogoWhite className="h-9 w-auto" />
            <ul className="mt-5 flex flex-wrap gap-2">
              {content.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-[var(--ph4-r-sm)] border border-[var(--ph4-console-line)] text-[var(--ph4-on-console-2)] transition-colors duration-150 hover:border-[var(--ph4-console-line-2)] hover:text-white"
                  >
                    <Icon icon={SOCIAL_ICONS[social.icon]} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[22rem] text-[0.8125rem] leading-[1.65] text-[var(--ph4-on-console-3)]">
              {content.about}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="ph4-mono text-[0.625rem] text-[var(--ph4-on-console-3)]">
              {content.officesHeading}
            </p>
            <div
              role="tablist"
              aria-label={content.officesHeading}
              className="flex w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit sm:flex-wrap"
            >
              {content.offices.map((group, index) => (
                <button
                  key={group.label}
                  type="button"
                  role="tab"
                  aria-selected={office === index}
                  onClick={() => setOffice(index)}
                  className={cn(
                    "ph4-footer-tab shrink-0 cursor-pointer whitespace-nowrap",
                    office === index && "is-active",
                  )}
                >
                  <span className="font-emoji">{group.flag}</span> {group.label}
                </button>
              ))}
            </div>
            <div className="min-h-[7rem]">
              {active ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {active.entries.map((entry) => (
                    <div
                      key={entry.name}
                      className="rounded-[var(--ph4-r)] border border-[var(--ph4-console-line)] p-3.5"
                    >
                      <p className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
                        {entry.name}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] font-semibold">
                        {entry.company}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--ph4-on-console-3)]">
                        {entry.address}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-7 lg:pl-8">
          <div>
            <p className="ph4-mono text-[0.625rem] text-[var(--ph4-on-console-3)]">
              {content.appsHeading}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {content.apps.map((app) => (
                <a
                  key={app.href}
                  href={app.href}
                  aria-label={app.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[var(--ph4-r)] ring-1 ring-[var(--ph4-console-line)] transition-colors hover:ring-[var(--ph4-console-line-2)]"
                >
                  {app.kind === "play" ? (
                    <PlayStoreBadge className="h-10 w-auto" />
                  ) : (
                    <AppStoreBadge className="h-10 w-auto" />
                  )}
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4">
            {content.columns.map((column) => (
              <div key={column.title}>
                <h2 className="ph4-mono text-[0.625rem] text-[var(--ph4-on-console-3)]">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block py-0.5 text-[0.8125rem] leading-snug text-[var(--ph4-on-console-2)] transition-colors duration-150 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      <div className="border-t border-[var(--ph4-console-line)]">
        <Shell className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs font-medium tracking-wide text-[var(--ph4-on-console-3)]">
            {content.copyright} {content.rights}
          </p>
          <p className="ph4-mono text-[0.5625rem] text-[var(--ph4-on-console-3)]">
            CekatAI
          </p>
        </Shell>
      </div>
    </footer>
  );
}
