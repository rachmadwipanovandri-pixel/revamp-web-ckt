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
import { Shell } from "./ui";
import type { HomeContent, SocialIcon } from "./types";

/**
 * Content-driven icon lookup. The content objects stay plain data (so `tsc` can
 * check both locales without importing React), and only this one switch maps a
 * name to an icon — adding a network means one entry here.
 */
const SOCIAL_ICONS: Record<SocialIcon, typeof mdiLinkedin> = {
  linkedin: mdiLinkedin,
  instagram: mdiInstagram,
  youtube: mdiYoutube,
  facebook: mdiFacebook,
};

function Column({
  title,
  links,
}: {
  title: string;
  links: HomeContent["footer"]["columns"][number]["links"];
}) {
  return (
    <div>
      <h2 className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block py-0.5 text-sm leading-snug text-white/70 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The single ink bookend at the bottom of an otherwise light page.
 *
 * Structure follows the production footer (src/components/layout/footer.tsx) —
 * Meta partner strip, brand + socials, per-country office tabs, app store
 * badges, link columns, bottom bar — but keeps preview-home-2's own bilingual
 * content object instead of reading `messages/*.json`, and reuses the shared
 * badge/logo/icon components rather than redrawing them.
 */
export function Footer({ content }: { content: HomeContent["footer"] }) {
  const [office, setOffice] = useState(0);
  const active = content.offices[office] ?? content.offices[0];

  return (
    <footer className="relative overflow-hidden bg-[#0B1220] text-white">
      {/* Meta partner strip */}
      <div className="border-b border-white/8">
        <Shell className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1.5">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="text-sm text-white/75 sm:text-base">
            {content.partner}
          </p>
        </Shell>
      </div>

      <Shell className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
        {/* Brand + socials + offices */}
        <div className="flex flex-col gap-10 lg:col-span-5 lg:pr-8">
          <div>
            <LogoWhite className="h-10 w-auto" />
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {content.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/70 transition-colors duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
                  >
                    <Icon
                      icon={SOCIAL_ICONS[social.icon]}
                      className="size-[1.15rem]"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[24rem] text-sm leading-[1.6] text-white/60">
              {content.about}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
              {content.officesHeading}
            </p>

            {/* One pill per country; the selected country's addresses replace
                each other. The tablist is what makes this navigable by keyboard
                and announced correctly, rather than a row of plain buttons. */}
            <div
              role="tablist"
              aria-label={content.officesHeading}
              className="flex w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit sm:flex-wrap"
            >
              {content.offices.map((group, index) => (
                <button
                  key={group.label}
                  type="button"
                  role="tab"
                  aria-selected={office === index}
                  onClick={() => setOffice(index)}
                  className={cn(
                    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-numeric text-sm whitespace-nowrap transition-colors duration-200 sm:px-4",
                    office === index
                      ? "bg-white text-[#0B1220]"
                      : "text-white/65 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="font-emoji">{group.flag}</span>
                  <span>{group.label}</span>
                </button>
              ))}
            </div>

            {/* min-h reserves the two-address height, so switching from
                Indonesia to Singapore does not jump the page. */}
            <div className="min-h-[7.5rem]">
              {active ? (
                <div
                  key={active.label}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {active.entries.map((entry) => (
                    <div
                      key={entry.name}
                      className="ph2-panel-in rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                    >
                      <p className="text-xs text-white/50">{entry.name}</p>
                      <p className="mt-1.5 text-sm font-semibold text-white">
                        {entry.company}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/60">
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
            <h2 className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
              {content.appsHeading}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {content.apps.map((app) => (
                <a
                  key={app.kind}
                  href={app.href}
                  aria-label={app.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl ring-1 ring-white/15 transition-colors hover:ring-white/35"
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
              <Column
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>
      </Shell>

      {/* Bottom bar. white/50 is 5.30:1 on the ink ground; the /35 this used to
          be is 3.20:1 and fails AA for 11px text. */}
      <div className="border-t border-white/8">
        <Shell className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <p className="text-xs font-medium tracking-wide text-white/50">
            {content.copyright} {content.rights}
          </p>
          <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.16em] text-white/50 uppercase">
            CekatAI
          </p>
        </Shell>
      </div>
    </footer>
  );
}
