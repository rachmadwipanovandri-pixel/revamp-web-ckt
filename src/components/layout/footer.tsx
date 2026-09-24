"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { REGISTRY } from "@/lib/registry";
import { Icon } from "@iconify/react/offline";
import {
  mdiInstagram,
  mdiLinkedin,
  mdiYoutube,
  mdiFacebook,
} from "@/lib/icons";
import { Container } from "./container";
import { LogoWhite } from "./logo";
import { AppStoreBadge, MetaLogo, PlayStoreBadge } from "./store-badges";
import { cn } from "@/lib/utils";

const PRODUCT_LINKS = [
  { key: "chat", href: "/chat" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
  { key: "harga", href: "/pricing" },
] as const;

// Legal pages are served on this site (localized), mirroring the cekat.ai copy.
const LEGAL_LINKS = [
  { key: "terms", href: "/terms-and-conditions" },
  { key: "privacy", href: "/privacy-policy" },
  { key: "refund", href: "/return-refund-delivery-policy" },
] as const;

const SOCIALS = [
  {
    icon: mdiLinkedin,
    href: "https://www.linkedin.com/company/cekatai/",
    label: "LinkedIn",
  },
  {
    icon: mdiInstagram,
    href: "https://www.instagram.com/cekat.ai/",
    label: "Instagram",
  },
  {
    icon: mdiYoutube,
    href: "https://www.youtube.com/@cekatai",
    label: "YouTube",
  },
  {
    icon: mdiFacebook,
    href: "https://www.facebook.com/p/CekatAI-61551061527910/",
    label: "Facebook",
  },
] as const;

const OFFICE_COUNTRIES = [
  { flag: "🇮🇩", key: "indonesia", label: "Indonesia" },
  { flag: "🇸🇬", key: "singapore", label: "Singapore" },
  { flag: "🇲🇾", key: "malaysia", label: "Malaysia" },
] as const;

function LinkColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  className,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "text-sm leading-snug text-white/70 transition-colors duration-200 hover:text-white",
          className,
        )}
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [activeCountry, setActiveCountry] = useState<string>("indonesia");
  const shellRef = useRef<HTMLElement>(null);

  // Internal editor page — keep the chrome off so the save toolbar owns the viewport.
  // `/new-2` owns its exclusive SiteFooter — shared Footer must stay off.
  if (pathname === "/wireframe" || pathname === "/new-2") {
    return null;
  }

  const featureLinks = REGISTRY.features
    .filter((entry) => entry.slugs[locale] && !entry.switcherFallbackId)
    .sort((a, b) => (a.nav?.order ?? 99) - (b.nav?.order ?? 99))
    .slice(0, 6);
  const industryLinks = REGISTRY.industries
    .filter((entry) => entry.slugs[locale])
    .sort((a, b) => (a.nav?.order ?? 99) - (b.nav?.order ?? 99))
    .slice(0, 6);
  const solutionLinks = REGISTRY.solutions
    .filter((entry) => entry.slugs[locale])
    .sort((a, b) => (a.nav?.order ?? 99) - (b.nav?.order ?? 99));

  return (
    <footer
      ref={shellRef}
      className="relative overflow-hidden bg-[#0B1220] text-white"
    >
      {/* Meta partner strip */}
      <div className="border-b border-white/8">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1.5">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="text-sm text-white/75 sm:text-base">{t("metaPartner")}</p>
        </Container>
      </div>

      <div>
        <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
          {/* Brand + socials + offices */}
          <div className="flex flex-col gap-10 lg:col-span-5 lg:pr-8">
            <div>
              <LogoWhite className="h-10 w-auto" />
              <div className="mt-6 flex flex-wrap gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/70 transition-colors duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
                  >
                    <Icon icon={s.icon} className="size-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                {t("officeHeading")}
              </p>
              <div
                role="tablist"
                aria-label={t("officeHeading")}
                className="flex w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit sm:flex-wrap"
              >
                {OFFICE_COUNTRIES.map((c) => {
                  const isActive = activeCountry === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCountry(c.key)}
                      className={cn(
                        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-numeric text-sm whitespace-nowrap transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-white/30 focus-visible:outline-none sm:px-4",
                        isActive
                          ? "bg-white text-[#0B1220]"
                          : "text-white/65 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <span className="font-emoji">{c.flag}</span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[7.5rem]">
                {activeCountry === "indonesia" && (
                  <div
                    key="indonesia"
                    className="animate-fade-in-up-blur grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs text-white/50">
                        {t("jakartaOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-sm font-semibold text-white">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                        {t("jakartaOfficeAddress")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <p className="text-xs text-white/50">
                        {t("tangerangOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-sm font-semibold text-white">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                        {t("tangerangOfficeAddress")}
                      </p>
                    </div>
                  </div>
                )}

                {activeCountry === "singapore" && (
                  <div
                    key="singapore"
                    className="animate-fade-in-up-blur rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:max-w-md"
                  >
                    <p className="text-xs text-white/50">
                      {t("singaporeOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold text-white">
                      {t("singaporeCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {t("singaporeOfficeAddress")}
                    </p>
                  </div>
                )}

                {activeCountry === "malaysia" && (
                  <div
                    key="malaysia"
                    className="animate-fade-in-up-blur rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:max-w-md"
                  >
                    <p className="text-xs text-white/50">
                      {t("malaysiaOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold text-white">
                      {t("malaysiaCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {t("malaysiaOfficeAddress")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apps + link columns */}
          <div className="flex flex-col gap-10 lg:col-span-7 lg:pl-8">
            <div>
              <h3 className="font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-white/45 uppercase">
                {t("downloadApp")}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.cekatmobile&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl ring-1 ring-white/15 transition-colors hover:ring-white/35"
                >
                  <PlayStoreBadge className="h-10 w-auto" />
                </a>
                <a
                  href="https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl ring-1 ring-white/15 transition-colors hover:ring-white/35"
                >
                  <AppStoreBadge className="h-10 w-auto" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3">
              <LinkColumn title={t("productHeading")}>
                {PRODUCT_LINKS.map((l) => (
                  <FooterLink key={l.key} href={l.href}>
                    {tn(l.key)}
                  </FooterLink>
                ))}
              </LinkColumn>

              <LinkColumn title={t("legalHeading")}>
                {LEGAL_LINKS.map((l) => (
                  <FooterLink key={l.key} href={l.href}>
                    {t(l.key)}
                  </FooterLink>
                ))}
              </LinkColumn>

              <LinkColumn title={tn("fitur")}>
                {featureLinks.map((entry) => (
                  <FooterLink
                    key={entry.id}
                    href={{
                      pathname: "/features/[slug]",
                      params: { slug: entry.slugs[locale]! },
                    }}
                  >
                    {entry.title[locale]}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    {tn("viewAllFeatures")}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              </LinkColumn>

              <LinkColumn title={tn("industries")}>
                {industryLinks.map((entry) => (
                  <FooterLink
                    key={entry.id}
                    href={{
                      pathname: "/industries/[slug]",
                      params: { slug: entry.slugs[locale]! },
                    }}
                  >
                    {entry.title[locale]}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/industries"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    {tn("viewAllIndustries")}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              </LinkColumn>

              <LinkColumn title={tn("solutions")}>
                {solutionLinks.map((entry) => (
                  <FooterLink
                    key={entry.id}
                    href={{
                      pathname: "/solutions/[slug]",
                      params: { slug: entry.slugs[locale]! },
                    }}
                  >
                    {entry.title[locale]}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                  >
                    {tn("viewAllSolutions")}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              </LinkColumn>
            </div>
          </div>
        </Container>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          <Container className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
            <p className="text-xs font-medium tracking-wide text-white/45">
              Copyright &copy; {new Date().getFullYear()} CekatAI. {t("rights")}
            </p>
            <p className="font-numeric text-[0.7rem] font-semibold tracking-[0.16em] text-white/35 uppercase">
              CekatAI
            </p>
          </Container>
        </div>
      </div>
    </footer>
  );
}
