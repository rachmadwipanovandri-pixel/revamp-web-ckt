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
import { LogoWhite, LogoFooterGradient } from "./logo";
import { AppStoreBadge, MetaLogo, PlayStoreBadge } from "./store-badges";
import { Meteors } from "@/components/ui/meteors";
import { useReveal } from "@/hooks/use-reveal";
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
      <h3 className="font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-sky-300 uppercase">
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
          "group inline-flex items-center gap-1.5 text-sm leading-snug text-white/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-0.5 hover:text-white",
          className,
        )}
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="translate-x-[-4px] text-sky-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        >
          →
        </span>
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
  const revealed = useReveal(shellRef, 0.08);

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
      className={cn(
        "reveal-on-scroll relative overflow-hidden bg-linear-to-b from-[#08214c] via-primary-dark to-[#0c3f96] text-white transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        revealed
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-8 opacity-0 blur-[3px]",
      )}
    >
      {/* Continuity edge from the closer above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-linear-to-r from-transparent via-sky-300/40 to-transparent"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-35"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute -top-28 right-[8%] h-72 w-72 rounded-full bg-sky-400/30 blur-[110px]" />
        <span
          className="animate-orb-drift absolute bottom-24 left-[4%] h-64 w-64 rounded-full bg-accent-teal/25 blur-[100px]"
          style={{ animationDelay: "-7s" }}
        />
        <span
          className="animate-orb-drift absolute top-1/3 left-1/2 h-52 w-52 rounded-full bg-primary/40 blur-[90px]"
          style={{ animationDelay: "-13s" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Meteors number={6} angle={70} className="bg-sky-200/70" />
        <Meteors
          number={5}
          angle={60}
          maxDuration={5}
          className="bg-white/40"
        />
      </div>

      {/* Meta partner strip */}
      <div className="relative z-10 border-b border-white/8">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-3 py-1.5 backdrop-blur">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="font-numeric text-sm text-white/80 sm:text-base">
            {t("metaPartner")}
          </p>
        </Container>
      </div>

      <div className="relative z-10">
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
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/12 hover:text-white hover:shadow-[0_10px_24px_-12px_rgba(16,185,229,0.35)]"
                  >
                    <Icon icon={s.icon} className="size-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-sky-300 uppercase">
                {t("officeHeading")}
              </p>
              <div
                role="tablist"
                aria-label={t("officeHeading")}
                className="flex w-fit max-w-full flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/6 p-1.5 backdrop-blur-md"
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
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 font-numeric text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-3 focus-visible:ring-sky-400/50 focus-visible:outline-none sm:px-4",
                        isActive
                          ? "bg-white text-primary-dark shadow-[0_8px_20px_-10px_rgba(255,255,255,0.35)]"
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
                    className="animate-fade-in-up-blur grid grid-cols-1 gap-6 sm:grid-cols-2"
                  >
                    <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                      <p className="text-xs text-sky-200/80">
                        {t("jakartaOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-sm font-semibold text-white">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                        {t("jakartaOfficeAddress")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                      <p className="text-xs text-sky-200/80">
                        {t("tangerangOfficeName")}
                      </p>
                      <h3 className="mt-1.5 text-sm font-semibold text-white">
                        {t("companyLegalName")}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                        {t("tangerangOfficeAddress")}
                      </p>
                    </div>
                  </div>
                )}

                {activeCountry === "singapore" && (
                  <div
                    key="singapore"
                    className="animate-fade-in-up-blur rounded-2xl border border-white/8 bg-white/[0.04] p-4 sm:max-w-md"
                  >
                    <p className="text-xs text-sky-200/80">
                      {t("singaporeOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold text-white">
                      {t("singaporeCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                      {t("singaporeOfficeAddress")}
                    </p>
                  </div>
                )}

                {activeCountry === "malaysia" && (
                  <div
                    key="malaysia"
                    className="animate-fade-in-up-blur rounded-2xl border border-white/8 bg-white/[0.04] p-4 sm:max-w-md"
                  >
                    <p className="text-xs text-sky-200/80">
                      {t("malaysiaOfficeName")}
                    </p>
                    <h3 className="mt-1.5 text-sm font-semibold text-white">
                      {t("malaysiaCompanyName")}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">
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
              <h3 className="font-numeric text-[0.68rem] font-semibold tracking-[0.18em] text-sky-300 uppercase">
                {t("downloadApp")}
              </h3>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.cekatmobile&pcampaignid=web_share&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:ring-sky-400/45 hover:shadow-[0_12px_28px_-14px_rgba(16,185,229,0.4)]"
                >
                  <PlayStoreBadge className="h-10 w-auto" />
                </a>
                <a
                  href="https://apps.apple.com/id/app/cekat-ai/id6499275234?l=id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:ring-sky-400/45 hover:shadow-[0_12px_28px_-14px_rgba(16,185,229,0.4)]"
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition-all duration-300 hover:gap-2.5 hover:text-white"
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition-all duration-300 hover:gap-2.5 hover:text-white"
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 transition-all duration-300 hover:gap-2.5 hover:text-white"
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
        <div className="relative border-t border-white/8">
          <Container className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
            <p className="font-numeric text-xs font-medium tracking-wide text-white/50">
              Copyright &copy; {new Date().getFullYear()} CekatAI. {t("rights")}
            </p>
            <p className="font-numeric text-[0.65rem] font-semibold tracking-[0.2em] text-sky-300/70 uppercase">
              CekatAI
            </p>
          </Container>
        </div>

        {/* Oversized wordmark — quiet brand moment at the end of the scroll */}
        <div
          aria-hidden
          className="relative flex justify-center overflow-hidden px-4 pb-8 opacity-35 sm:px-6 lg:px-8"
        >
          <LogoFooterGradient className="h-auto w-full max-w-5xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#0c3f96] to-transparent" />
        </div>
      </div>
    </footer>
  );
}
