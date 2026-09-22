"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import {
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiYoutube,
} from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { LogoWhite } from "@/components/layout/logo";
import { MetaLogo } from "@/components/layout/store-badges";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

const PRODUCT_LINKS = [
  { key: "chat", href: "/chat" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
  { key: "harga", href: "/pricing" },
] as const;

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

const FEATURE_SLUGS = [
  "ai-agent",
  "whatsapp-chatbot",
  "crm-application",
  "lead-management",
] as const;

function Column({
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
      <h3 className="font-numeric text-[0.65rem] font-semibold tracking-[0.18em] text-sky-300/85 uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function Item({
  href,
  children,
  onClick,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="inline-flex min-h-7 items-center text-sm text-white/65 transition-colors duration-200 hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * Footer exclusive to /new-2. Continues the reverse-gradient closer into deep
 * navy, then settles into a compact link grid — no shared Footer chrome.
 */
export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const locale = useLocale() as Locale;
  const year = new Date().getFullYear();

  // Compact feature labels from the registry when slugs resolve; otherwise
  // fall back to product-level labels already in the nav dictionary.
  const featureLabels: { id: string; title: string; slug: string }[] = [];
  try {
    // Lazy require keeps this client bundle from pulling the full registry
    // when tree-shaking still includes the module for other pages.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { REGISTRY } = require("@/lib/registry") as typeof import("@/lib/registry");
    for (const id of FEATURE_SLUGS) {
      const entry = REGISTRY.features.find((f) => f.id === id);
      const slug = entry?.slugs[locale];
      if (entry && slug) {
        featureLabels.push({ id, title: entry.title[locale] ?? id, slug });
      }
    }
  } catch {
    // Registry unavailable — product columns still render.
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#050b18] text-white">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -top-32 right-[10%] h-64 w-64 rounded-full bg-primary/30 blur-[110px]" />
        <span
          className="absolute bottom-10 left-[4%] h-56 w-56 rounded-full bg-sky-500/20 blur-[100px]"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      {/* Meta partner strip */}
      <div className="relative border-b border-white/8">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1.5">
            <MetaLogo className="h-3 w-auto brightness-0 invert lg:h-4" />
          </span>
          <p className="font-numeric text-sm text-white/75 sm:text-base">
            {t("metaPartner")}
          </p>
        </Container>
      </div>

      <div className="relative">
        <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <LogoWhite className="h-9 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {t("companyLegalName")} — AI agent, omnichannel CRM, and
              automation for teams that live in chat.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-white/10 hover:text-white"
                >
                  <Icon icon={s.icon} className="size-[1.05rem]" />
                </a>
              ))}
            </div>
          </div>

          <Column title={t("productHeading")} className="lg:col-span-2">
            {PRODUCT_LINKS.map((l) => (
              <Item key={l.key} href={l.href}>
                {tn(l.key)}
              </Item>
            ))}
          </Column>

          <Column
            title={tn("fitur")}
            className={cn("lg:col-span-3", featureLabels.length === 0 && "hidden")}
          >
            {featureLabels.map((f) => (
              <Item
                key={f.id}
                href={{
                  pathname: "/features/[slug]",
                  params: { slug: f.slug },
                }}
              >
                {f.title}
              </Item>
            ))}
            <li>
              <Link
                href="/features"
                className="inline-flex min-h-7 items-center gap-1.5 text-sm font-semibold text-sky-300 transition-all hover:gap-2.5 hover:text-white"
              >
                {tn("viewAllFeatures")}
                <span aria-hidden>→</span>
              </Link>
            </li>
          </Column>

          <Column title={t("legalHeading")} className="lg:col-span-3">
            {LEGAL_LINKS.map((l) => (
              <Item key={l.key} href={l.href}>
                {t(l.key)}
              </Item>
            ))}
            <Item href="/integrations">{tn("viewAllSolutions")}</Item>
          </Column>
        </Container>

        <div className="relative border-t border-white/8">
          <Container className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
            <p className="font-numeric text-xs tracking-wide text-white/45">
              &copy; {year} CekatAI. {t("rights")}
            </p>
            <p className="font-numeric text-[0.65rem] font-semibold tracking-[0.2em] text-sky-300/60 uppercase">
              /new-2 playground
            </p>
          </Container>
        </div>
      </div>
    </footer>
  );
}
