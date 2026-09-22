"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { megaMenuGroups, allNavEntries } from "@/lib/registry";
import type { FeatureCategory } from "@/lib/registry/types";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown, mdiWhatsapp } from "@/lib/icons";
import { LOGIN_URL, REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { cn } from "@/lib/utils";
import { RegistryIcon } from "./registry-icon";
import { LogoBlack } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";

const PRODUCTS: Array<{
  key: FeatureCategory;
  /** The AI group has no product page; its header renders as a plain label. */
  href?: "/chat" | "/crm" | "/marketing" | "/order";
}> = [
  { key: "chat", href: "/chat" },
  { key: "ai" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
];

function Section({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between py-4 font-numeric text-base font-semibold text-foreground"
      >
        {label}
        <Icon
          icon={lucideChevronDown}
          className={cn(
            "size-5 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ItemRow({
  href,
  icon,
  title,
  description,
}: {
  href: {
    pathname: "/features/[slug]" | "/industries/[slug]" | "/solutions/[slug]";
    params: { slug: string };
  };
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-2 py-2 active:bg-surface-subtle"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-muted-foreground">
        <RegistryIcon name={icon} className="size-4.5" />
      </span>
      <span className="flex flex-col">
        <span className="font-numeric text-sm font-medium text-foreground">
          {title}
        </span>
        {description && (
          <span className="font-numeric text-xs leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
}

/**
 * Industries shown in the nav: four columns of five at the widest breakpoint.
 * All 29 exist as pages, but listing them made the panel taller than the
 * viewport; the rest are one click away behind the view-all link.
 */
const MENU_INDUSTRIES = 20;

export function MobileNav() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const featureGroups = megaMenuGroups("features", locale);
  const industries = allNavEntries("industries", locale).slice(
    0,
    MENU_INDUSTRIES,
  );
  const solutions = allNavEntries("solutions", locale);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Brand header */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <LogoBlack className="h-6 w-auto" />
      </div>

      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto px-5">
        <Section label={t("fitur")} defaultOpen>
          {PRODUCTS.map((product) => (
            <div key={product.key} className="mb-3 last:mb-0">
              {product.href ? (
                <Link
                  href={product.href}
                  className="block px-2 pt-1 pb-1.5 font-numeric text-[11px] font-semibold tracking-[0.08em] text-subtle-foreground uppercase"
                >
                  {t(product.key)}
                </Link>
              ) : (
                <p className="px-2 pt-1 pb-1.5 font-numeric text-[11px] font-semibold tracking-[0.08em] text-subtle-foreground uppercase">
                  {t(product.key)}
                </p>
              )}
              {(featureGroups.get(product.key) ?? []).map((entry) => (
                <ItemRow
                  key={entry.id}
                  href={{
                    pathname: "/features/[slug]",
                    params: { slug: entry.slugs[locale]! },
                  }}
                  icon={entry.icon}
                  title={entry.title[locale]!}
                />
              ))}
            </div>
          ))}
          <Link
            href="/features"
            className="mt-1 inline-flex items-center gap-1 px-2 py-2 font-numeric text-sm font-semibold text-primary"
          >
            {t("viewAllFeatures")} →
          </Link>
        </Section>

        <Section label={t("industries")}>
          {industries.map((entry) => (
            <ItemRow
              key={entry.id}
              href={{
                pathname: "/industries/[slug]",
                params: { slug: entry.slugs[locale]! },
              }}
              icon={entry.icon}
              title={entry.title[locale]!}
              description={entry.tagline?.[locale]}
            />
          ))}
          <Link
            href="/industries"
            className="mt-1 inline-flex items-center gap-1 px-2 py-2 font-numeric text-sm font-semibold text-primary"
          >
            {t("viewAllIndustries")} →
          </Link>
        </Section>

        <Section label={t("solutions")}>
          {solutions.map((entry) => (
            <ItemRow
              key={entry.id}
              href={{
                pathname: "/solutions/[slug]",
                params: { slug: entry.slugs[locale]! },
              }}
              icon={entry.icon}
              title={entry.title[locale]!}
              description={entry.tagline?.[locale]}
            />
          ))}
          <Link
            href="/solutions"
            className="mt-1 inline-flex items-center gap-1 px-2 py-2 font-numeric text-sm font-semibold text-primary"
          >
            {t("viewAllSolutions")} →
          </Link>
        </Section>

        <Link
          href="/pricing"
          className="flex items-center border-b border-border py-4 font-numeric text-base font-semibold text-foreground"
        >
          {t("harga")}
        </Link>

        <Link
          href="/blog"
          className="flex items-center border-b border-border py-4 font-numeric text-base font-semibold text-foreground"
        >
          {t("blog")}
        </Link>
      </nav>

      {/* Pinned footer */}
      <div className="shrink-0 border-t border-border p-5">
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="h-11 w-full text-xs font-semibold"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <Icon icon={mdiWhatsapp} className="size-4" />
            {t("ctaWhatsapp")}
          </Button>
          <Button
            variant="outline-primary"
            size="lg"
            className="h-11 w-full text-xs font-semibold"
            nativeButton={false}
            render={<AppAnchor href={REGISTER_URL} />}
          >
            {t("ctaTrial")}
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <LanguageSwitcher currentLocale={locale} />
          <AppAnchor
            href={LOGIN_URL}
            className="font-numeric text-sm font-semibold text-foreground"
          >
            {t("masuk")}
          </AppAnchor>
        </div>
      </div>
    </div>
  );
}
