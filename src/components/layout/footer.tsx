"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { REGISTRY } from "@/lib/registry";
import { localeValue } from "@/lib/locale-value";
import { Icon } from "@iconify/react/offline";
import {
  mdiInstagram,
  mdiLinkedin,
  mdiYoutube,
  mdiFacebook,
} from "@/lib/icons";
import { Container } from "./container";
import { LogoBlack, LogoFooterGradient } from "./logo";
import { AppStoreBadge, MetaLogo, PlayStoreBadge } from "./store-badges";
import { cn } from "@/lib/utils";
import { Meteors } from "@/components/ui/meteors";

const PRODUCT_LINKS = [
  { key: "chat", href: "/chat" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
  { key: "events", href: "/events" },
  { key: "harga", href: "/pricing" },
  // Contact was an orphan (zero internal links sitewide) and integrations had
  // no footer entry — both are money-page paths crawlers should reach.
  { key: "contact", href: "/contact" },
  { key: "integrations", href: "/integrations" },
  // About was likewise an orphan risk — company pages need a steady internal path.
  { key: "about", href: "/about" },
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
  { flag: "🇮🇩", key: "indonesia" },
  { flag: "🇸🇬", key: "singapore" },
  { flag: "🇲🇾", key: "malaysia" },
] as const;

const OFFICE_COUNTRY_LABELS: Record<
  Locale,
  Record<(typeof OFFICE_COUNTRIES)[number]["key"], string>
> = {
  en: { indonesia: "Indonesia", singapore: "Singapore", malaysia: "Malaysia" },
  id: { indonesia: "Indonesia", singapore: "Singapura", malaysia: "Malaysia" },
  cn: { indonesia: "印度尼西亚", singapore: "新加坡", malaysia: "马来西亚" },
  jp: {
    indonesia: "インドネシア",
    singapore: "シンガポール",
    malaysia: "マレーシア",
  },
  kr: {
    indonesia: "인도네시아",
    singapore: "싱가포르",
    malaysia: "말레이시아",
  },
};

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
      <h3 className="font-numeric text-base font-semibold text-foreground">
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
          "text-xs leading-relaxed font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground",
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
  const [activeCountry, setActiveCountry] = useState<string>("indonesia");
  const shellRef = useRef<HTMLElement>(null);

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
      className="relative overflow-hidden border-t border-border bg-white text-foreground"
    >
      {/* Meta partner strip */}
      <div className="border-b border-border">
        <Container className="flex flex-col items-center gap-3 border-x border-border py-6 font-numeric text-base text-foreground lg:flex-row lg:gap-6">
          <MetaLogo className="h-3 w-auto lg:h-5" />
          <p>{t("metaPartner")}</p>
        </Container>
      </div>

      <div className="relative z-10 overflow-hidden pt-10 lg:pt-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Meteors number={14} className="bg-[#64748b]" />
        </div>
        <Container className="relative z-20 grid gap-12 py-4 lg:grid-cols-12">
          {/* Brand + socials + offices */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="flex flex-col items-center lg:items-start">
              <LogoBlack className="h-11 w-auto" />
              <div className="mt-4 flex gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    <Icon icon={s.icon} className="size-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-numeric text-xs text-foreground">
                {t("officeHeading")}
              </p>
              <div
                role="tablist"
                aria-label={t("officeHeading")}
                className="flex w-full max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto rounded-xl border border-border bg-surface-muted p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit sm:flex-wrap"
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
                        "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-numeric text-sm whitespace-nowrap transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-primary/25 focus-visible:outline-none",
                        isActive
                          ? "border-border/60 bg-white font-medium text-foreground shadow-xs"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span className="font-emoji">{c.flag}</span>
                      <span>{OFFICE_COUNTRY_LABELS[locale][c.key]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[7.5rem] text-center lg:text-left">
                {activeCountry === "indonesia" && (
                  <div
                    key="indonesia"
                    className="animate-fade-in-up-blur grid grid-cols-1 gap-8 sm:grid-cols-2"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("jakartaOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold text-foreground">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                        {t("jakartaOfficeAddress")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("tangerangOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold text-foreground">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                        {t("tangerangOfficeAddress")}
                      </p>
                    </div>
                  </div>
                )}

                {activeCountry === "singapore" && (
                  <div
                    key="singapore"
                    className="animate-fade-in-up-blur sm:max-w-md"
                  >
                    <p className="text-xs text-muted-foreground">
                      {t("singaporeOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-foreground">
                      {t("singaporeCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {t("singaporeOfficeAddress")}
                    </p>
                  </div>
                )}

                {activeCountry === "malaysia" && (
                  <div
                    key="malaysia"
                    className="animate-fade-in-up-blur sm:max-w-md"
                  >
                    <p className="text-xs text-muted-foreground">
                      {t("malaysiaOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-foreground">
                      {t("malaysiaCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                      {t("malaysiaOfficeAddress")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apps + link columns */}
          <div className="flex flex-col gap-8 lg:col-span-5 lg:pl-12">
            <div>
              <h3 className="font-numeric text-xs text-foreground">
                {t("downloadApp")}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.cekatmobile&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <PlayStoreBadge className="h-9 w-auto" />
                </a>
                <a
                  href="https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <AppStoreBadge className="h-9 w-auto" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
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
                    {localeValue(entry.title, locale)}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
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
                    {localeValue(entry.title, locale)}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/industries"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
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
                    {localeValue(entry.title, locale)}
                  </FooterLink>
                ))}
                <li>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
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
        <div className="relative z-20 py-8">
          <Container>
            <p className="text-center text-xs font-medium text-muted-foreground">
              Copyright &copy; {new Date().getFullYear()} CekatAI. {t("rights")}
            </p>
          </Container>
        </div>
        <div className="relative z-0 flex justify-center overflow-hidden py-4">
          <LogoFooterGradient className="h-auto w-full max-w-5xl" />
        </div>
      </div>
    </footer>
  );
}
