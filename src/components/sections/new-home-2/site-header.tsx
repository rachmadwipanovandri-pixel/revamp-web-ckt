"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { lucideMenu, lucideX, mdiWhatsapp } from "@/lib/icons";
import { LOGIN_URL, REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LogoWhite } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";

const NAV_LINKS = [
  { key: "fitur", href: "/features" },
  { key: "solutions", href: "/solutions" },
  { key: "harga", href: "/pricing" },
  { key: "blog", href: "/blog" },
] as const;

/**
 * Chrome exclusive to /new-2. Shared Navbar/Footer return null on this route,
 * so this header owns the only site shell the redesign sees — transparent over
 * the electric-blue hero, frosted once the page scrolls into light chapters.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isSolid = scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid
          ? "border-b border-white/10 bg-[#050b18]/88 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          : "border-b border-white/8 bg-linear-to-b from-black/35 to-transparent",
      )}
    >
      <Container
        ref={navRef}
        className="flex h-16 items-center justify-between gap-4"
      >
        <div className="flex min-w-0 items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center" aria-label="CekatAI">
            <LogoWhite className="h-6 w-auto" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-full px-3.5 py-2 font-numeric text-xs font-semibold tracking-wide text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:outline-none"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <LanguageSwitcher currentLocale={locale} inverted />
          <AppAnchor
            href={LOGIN_URL}
            className="rounded-full px-3 py-2 font-numeric text-xs font-semibold text-white/80 transition-colors hover:text-white"
          >
            {t("masuk")}
          </AppAnchor>
          <Button
            size="lg"
            className="h-9 rounded-full bg-white/12 px-4 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-all hover:bg-white/20 hover:ring-white/40"
            nativeButton={false}
            render={<WhatsAppAnchor target="_blank" rel="noopener noreferrer" />}
          >
            <Icon icon={mdiWhatsapp} className="size-3.5" />
            {t("ctaWhatsapp")}
          </Button>
          <Button
            size="lg"
            className="h-9 rounded-full bg-white px-4 text-xs font-semibold text-[#0b1f4a] transition-all hover:-translate-y-0.5 hover:bg-sky-50"
            nativeButton={false}
            render={<AppAnchor href={REGISTER_URL} />}
          >
            {t("ctaTrial")}
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label={t("openMenu")}
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                />
              }
            >
              <Icon
                icon={menuOpen ? lucideX : lucideMenu}
                className="size-5"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-white/10 bg-[#050b18] p-0 text-white">
              <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                <LogoWhite className="h-5 w-auto" />
              </div>
              <nav className="flex flex-col gap-1 p-5" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 font-numeric text-sm font-semibold text-white/85 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2.5 border-t border-white/10 p-5 pt-4">
                <AppAnchor
                  href={LOGIN_URL}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 font-numeric text-sm font-semibold text-white"
                >
                  {t("masuk")}
                </AppAnchor>
                <AppAnchor
                  href={REGISTER_URL}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 font-numeric text-sm font-semibold text-[#0b1f4a]"
                >
                  {t("ctaTrial")}
                </AppAnchor>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
