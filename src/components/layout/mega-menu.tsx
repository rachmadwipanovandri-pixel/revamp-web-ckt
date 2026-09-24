"use client";

import type { ReactNode, RefObject } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { allNavEntries, megaMenuGroups } from "@/lib/registry";
import type { FeatureCategory, RegistryEntry } from "@/lib/registry/types";
import { cn } from "@/lib/utils";
import { RegistryIcon } from "./registry-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const PRODUCT_COLUMNS: Array<{
  key: FeatureCategory;
  /** Product page the column header links to. The AI column has none: its
      features are platform capabilities without a product hub, and inventing
      an /ai page for a menu header would be backwards. */
  href?: "/chat" | "/crm" | "/marketing" | "/order";
}> = [
  { key: "chat", href: "/chat" },
  { key: "ai" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
];

/** Floating panel shell — clean white card, soft elevation (incident.io). */
const PANEL_SHELL =
  "overflow-hidden rounded-2xl border border-[#0C111D]/[0.08] bg-white text-popover-foreground shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-28px_rgba(12,17,29,0.28)]";

/** Kill the primitive's double chrome so PANEL_SHELL + PanelChrome own the look. */
const PANEL_CONTENT_RESET = "rounded-none bg-transparent p-0 shadow-none ring-0";

function triggerClass(isTransparent: boolean) {
  return cn(
    // `flex`, not the component default `inline-flex`. Inside its <li> an
    // inline-flex trigger sits on a text baseline and picks up the line box's
    // half-leading, landing 1.5px below the plain Harga/Blog links, which are
    // block-level. Same display type puts all four nav items on one line.
    "relative flex h-auto gap-1 bg-transparent px-0 py-0 font-numeric text-xs font-semibold transition-colors hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-popup-open:bg-transparent",
    isTransparent
      ? "text-white hover:bg-transparent! hover:text-white/85 data-popup-open:text-white"
      : "text-foreground hover:text-primary data-popup-open:text-primary",
  );
}

/**
 * Quiet plate shared by both mega panels — no glow orbs or dot grids.
 */
function PanelChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate bg-white">{children}</div>
  );
}

/** Eyebrow-style column / group label — matches homepage `eyebrow-rule`. */
function PanelLabel({
  children,
  href,
}: {
  children: ReactNode;
  href?: "/chat" | "/crm" | "/marketing" | "/order";
}) {
  const body = (
    <span className="flex items-center gap-2 px-2.5 py-1.5 font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
      {children}
    </span>
  );

  if (!href) return <p className="mb-1.5">{body}</p>;

  return (
    <NavigationMenuLink
      render={<Link href={href} />}
      className="mb-1.5 rounded-lg transition-colors hover:bg-primary/[0.07] focus:bg-primary/[0.07]"
    >
      {body}
    </NavigationMenuLink>
  );
}

/** One feature/industry row: icon plate that lifts on hover + title (+ optional description). */
function MenuLink({
  entry,
  pathname,
  locale,
  withDescription = false,
}: {
  entry: RegistryEntry;
  pathname: "/features/[slug]" | "/industries/[slug]" | "/solutions/[slug]";
  locale: Locale;
  withDescription?: boolean;
}) {
  return (
    <NavigationMenuLink
      render={
        <Link href={{ pathname, params: { slug: entry.slugs[locale]! } }} />
      }
      className={cn(
        "group/mi gap-3 rounded-xl px-2.5 transition-colors duration-200 hover:bg-[#F6F7F9] focus:bg-[#F6F7F9]",
        withDescription ? "items-start py-2.5" : "items-center py-2",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#0C111D]/[0.06] bg-[#F6F7F9] text-[#525C6B] transition-colors duration-200 group-hover/mi:border-primary/20 group-hover/mi:bg-[#EEF4FF] group-hover/mi:text-primary">
        <RegistryIcon name={entry.icon} className="size-4" />
      </span>
      <span className={cn(withDescription && "flex flex-col gap-0.5")}>
        <span className="font-numeric text-sm leading-snug font-medium text-foreground transition-colors group-hover/mi:text-primary">
          {entry.title[locale]}
        </span>
        {withDescription && entry.tagline?.[locale] && (
          <span className="font-numeric text-xs leading-snug text-muted-foreground">
            {entry.tagline[locale]}
          </span>
        )}
      </span>
    </NavigationMenuLink>
  );
}

function ViewAllLink({
  href,
  label,
}: {
  href: "/features" | "/industries" | "/solutions";
  label: string;
}) {
  return (
    <NavigationMenuLink
      render={<Link href={href} />}
      className="group/va inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-[#EEF4FF] px-3.5 py-1.5 font-numeric text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10"
    >
      {label}
      <span className="transition-transform duration-300 group-hover/va:translate-x-0.5">
        →
      </span>
    </NavigationMenuLink>
  );
}

/**
 * Industries shown in the nav: four columns of five at the widest breakpoint.
 * All 29 exist as pages, but listing them made the panel taller than the
 * viewport; the rest are one click away behind the view-all link.
 */
const MENU_INDUSTRIES = 20;

export function MegaMenu({
  isTransparent,
  anchor,
}: {
  isTransparent: boolean;
  anchor?: RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const featureGroups = megaMenuGroups("features", locale);
  const industries = allNavEntries("industries", locale).slice(
    0,
    MENU_INDUSTRIES,
  );
  const solutions = allNavEntries("solutions", locale);

  return (
    <NavigationMenu align="center" anchor={anchor} panelClassName={PANEL_SHELL}>
      <NavigationMenuList className="gap-6">
        {/* ── Features ─────────────────────────────────────────────── */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              triggerClass(isTransparent),
              // The chevron is ml-1 + size-3 = 16px of trailing content that
              // the plain Harga/Blog links do not have. Pulling the following
              // gap in by the same 16px keeps every word-to-word space equal.
              "-mr-4",
            )}
          >
            {t("fitur")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className={PANEL_CONTENT_RESET}>
            <PanelChrome>
              <div className="flex w-[var(--anchor-width)] max-w-[92vw] gap-5 p-5">
                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-5">
                  {PRODUCT_COLUMNS.map((column) => (
                    <div key={column.key}>
                      <PanelLabel href={column.href}>
                        {t(column.key)}
                      </PanelLabel>
                      <div className="flex flex-col">
                        {(featureGroups.get(column.key) ?? []).map((entry) => (
                          <MenuLink
                            key={entry.id}
                            entry={entry}
                            pathname="/features/[slug]"
                            locale={locale}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured rail — keynote gradient instead of a flat plate */}
                <NavigationMenuLink
                  render={
                    <Link
                      href={{
                        pathname: "/features/[slug]",
                        params: {
                          slug:
                            locale === "id"
                              ? "whatsapp-call-ai"
                              : "whatsapp-call-ai-summary",
                        },
                      }}
                    />
                  }
                  /* hover:/focus:bg-primary are not redundant. NavigationMenuLink
                     ships hover:bg-muted focus:bg-muted in its base classes, and
                     tailwind-merge keeps them because bg-primary is a different
                     variant, so hovering this card repainted it near-white. These
                     pin the blue and leave brightness to signal the hover. */
                  className="group/rail relative hidden w-64 shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#0B1220] p-5 text-white transition-colors duration-300 hover:bg-[#111827] focus:bg-[#111827] lg:flex"
                >
                  <div className="relative">
                    <p className="inline-flex items-center gap-2 font-numeric text-[11px] font-semibold tracking-[0.14em] text-white/55 uppercase">
                      {t("megaFeaturedEyebrow")}
                    </p>
                    <p className="mt-3 font-numeric text-lg leading-tight font-semibold tracking-[-0.02em]">
                      {t("megaFeaturedTitle")}
                    </p>
                    <p className="mt-2 font-numeric text-sm leading-relaxed text-primary-foreground-muted">
                      {t("megaFeaturedBody")}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 font-numeric text-sm font-semibold text-white">
                      {t("megaFeaturedCta")}
                      <span className="transition-transform duration-300 group-hover/rail:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                  <p className="relative mt-6 border-t border-white/15 pt-4 font-numeric text-xs text-primary-foreground-muted">
                    {t("megaTrust")}
                  </p>
                </NavigationMenuLink>
              </div>

              {/* Footer — soft brand wash bar */}
              <div className="border-t border-primary/10 bg-linear-to-r from-primary/[0.07] via-primary/[0.03] to-transparent px-5 py-3">
                <ViewAllLink href="/features" label={t("viewAllFeatures")} />
              </div>
            </PanelChrome>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ── Solutions: roles and industries in one panel ─────────── */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              triggerClass(isTransparent),
              // The chevron is ml-1 + size-3 = 16px of trailing content that
              // the plain Harga/Blog links do not have. Pulling the following
              // gap in by the same 16px keeps every word-to-word space equal.
              "-mr-4",
            )}
          >
            {t("solutions")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className={PANEL_CONTENT_RESET}>
            <PanelChrome>
              <div className="flex w-[var(--anchor-width)] max-w-[92vw] gap-5 p-5">
                {/* Roles rail: short list on a soft brand tile */}
                <div className="w-64 shrink-0 rounded-xl border border-primary/10 bg-linear-to-b from-primary/[0.07] to-white p-2.5">
                  <p className="mb-1.5 px-2.5 py-1 font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                    {t("solutionsByLabel")}
                  </p>
                  <div className="flex flex-col gap-y-0.5">
                    {solutions.map((entry) => (
                      <MenuLink
                        key={entry.id}
                        entry={entry}
                        pathname="/solutions/[slug]"
                        locale={locale}
                        withDescription
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="mb-1.5 px-2.5 py-1 font-numeric text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                    {t("industriesByLabel")}
                  </p>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {industries.map((entry) => (
                      <MenuLink
                        key={entry.id}
                        entry={entry}
                        pathname="/industries/[slug]"
                        locale={locale}
                        withDescription
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-primary/10 bg-linear-to-r from-primary/[0.07] via-primary/[0.03] to-transparent px-5 py-3">
                <ViewAllLink href="/solutions" label={t("viewAllSolutions")} />
                <ViewAllLink
                  href="/industries"
                  label={t("viewAllIndustries")}
                />
              </div>
            </PanelChrome>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ── Pricing + Blog (plain links, no dropdown) ─────────────── */}
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/pricing" />}
            className={triggerClass(isTransparent)}
          >
            {t("harga")}
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href="/blog" />}
            className={triggerClass(isTransparent)}
          >
            {t("blog")}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
