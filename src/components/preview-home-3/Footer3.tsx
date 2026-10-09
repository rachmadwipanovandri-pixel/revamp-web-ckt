"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/offline";
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
import type { HomeContent, SocialIcon } from "@/components/preview-home-2/types";
import { Shell } from "./ui";

/**
 * Content-driven icon lookup. The content objects stay plain data (so `tsc` can
 * check both locales without importing React), and only this switch maps a name
 * to an icon — adding a network means one entry here.
 */
const SOCIAL_ICONS: Record<SocialIcon, typeof mdiLinkedin> = {
  linkedin: mdiLinkedin,
  instagram: mdiInstagram,
  youtube: mdiYoutube,
  facebook: mdiFacebook,
};

/**
 * The footer's own component rather than preview-home-2's.
 *
 * The content object, the office tabs and the real badge/logo components are all
 * reused — none of that needed redesigning. What did: every radius. Round social
 * buttons, round office tabs and a 16px badge frame sat directly against 6px
 * buttons two sections up, and a footer is exactly where that mismatch reads as
 * an oversight. Everything here is now square-ish and set on hairlines, so the
 * page ends on the same geometry it started with.
 */
export function Footer3({ content }: { content: HomeContent["footer"] }) {
  const [office, setOffice] = useState(0);
  const active = content.offices[office] ?? content.offices[0];

  return (
    <footer className="bg-[var(--ph3-console)] text-white">
      {/* Meta partner strip */}
      <div className="border-b border-[var(--ph3-console-line)]">
        <Shell className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-[var(--ph3-r-sm)] border border-[var(--ph3-console-line)] bg-white/[0.04] px-2.5 py-1.5">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="text-[0.8125rem] text-[var(--ph3-on-console-2)] sm:text-sm">
            {content.partner}
          </p>
        </Shell>
      </div>

      <Shell className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10">
        {/* Brand + offices */}
        <div className="flex flex-col gap-10 lg:col-span-5 lg:pr-8">
          <div>
            <LogoWhite className="h-9 w-auto" />
            <ul className="mt-5 flex flex-wrap gap-2">
              {content.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-[var(--ph3-r-sm)] border border-[var(--ph3-console-line)] text-[var(--ph3-on-console-2)] transition-colors duration-150 hover:border-[var(--ph3-console-line-2)] hover:text-white"
                  >
                    <Icon
                      icon={SOCIAL_ICONS[social.icon]}
                      className="size-4"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[22rem] text-[0.8125rem] leading-[1.65] text-[var(--ph3-on-console-3)]">
              {content.about}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
              {content.officesHeading}
            </p>

            {/* One tab per country; the selected country's addresses replace
                each other. The tablist is what makes this navigable by keyboard
                and announced correctly, rather than a row of plain buttons. */}
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
                    "ph3-footer-tab shrink-0 cursor-pointer whitespace-nowrap",
                    office === index && "is-active",
                  )}
                >
                  <span className="font-emoji">{group.flag}</span>{" "}
                  {group.label}
                </button>
              ))}
            </div>

            {/* min-h reserves the two-address height, so switching from Indonesia
                to Singapore does not jump the page. */}
            <div className="min-h-[7rem]">
              {active ? (
                <div
                  key={active.label}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {active.entries.map((entry) => (
                    <div
                      key={entry.name}
                      className="rounded-[var(--ph3-r)] border border-[var(--ph3-console-line)] p-3.5"
                    >
                      <p className="ph3-mono text-[0.5625rem] text-[var(--ph3-on-console-3)]">
                          {entry.name}
                        </p>
                      <p className="mt-1.5 text-[0.8125rem] font-semibold">
                        {entry.company}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--ph3-on-console-3)]">
                        {entry.address}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Apps + link columns */}
        <div className="flex flex-col gap-10 lg:col-span-7 lg:pl-8">
          <div>
            <p className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
              {content.appsHeading}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {content.apps.map((app) => (
                <a
                  key={app.kind}
                  href={app.href}
                  aria-label={app.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[var(--ph3-r)] ring-1 ring-[var(--ph3-console-line)] transition-colors hover:ring-[var(--ph3-console-line-2)]"
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
                <h2 className="ph3-mono text-[0.625rem] text-[var(--ph3-on-console-3)]">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block py-0.5 text-[0.8125rem] leading-snug text-[var(--ph3-on-console-2)] transition-colors duration-150 hover:text-white"
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

      {/* Bottom bar. white/50 is 5.30:1 on the ink ground; white/35 would be
          3.20:1 and fails AA at this size. */}
      <div className="border-t border-[var(--ph3-console-line)]">
        <Shell className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs font-medium tracking-wide text-[var(--ph3-on-console-3)]">
            {content.copyright} {content.rights}
          </p>
          <p className="ph3-mono text-[0.5625rem] text-[var(--ph3-on-console-3)]">
            CekatAI
          </p>
        </Shell>
      </div>
    </footer>
  );
}