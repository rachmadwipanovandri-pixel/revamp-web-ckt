"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { lucideMenu, mdiWhatsapp } from "@/lib/icons";
import { LOGIN_URL, REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { Logo, LogoWhite } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function Navbar({ variant }: { variant?: "default" | "transparent" }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const scrolled = useScrolled();
  const navRef = useRef<HTMLDivElement>(null);

  // Internal copy wireframe: no public site chrome (it would cover the editor toolbar).
  // `/new-2` owns its exclusive SiteHeader — shared Navbar must stay off.
  if (pathname === "/wireframe" || pathname === "/new-2") {
    return null;
  }

  // Homepage and product pages get a transparent header over the hero by default; any other
  // route (or an explicit `variant` prop) keeps the solid one.
  // `/new` is a design playground that shares the hero treatment.
  const transparentPaths = [
    "/",
    "/new",
    "/chat",
    "/crm",
    "/marketing",
    "/order",
  ];
  const resolvedVariant =
    variant ??
    (transparentPaths.includes(pathname) ? "transparent" : "default");

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const isTransparent = resolvedVariant === "transparent" && !scrolled;
  const linkClass = cn(
    "text-xs py-2.5 px-3 font-semibold font-numeric transition-colors",
    isTransparent
      ? "text-white hover:text-white/80"
      : "text-foreground hover:text-black",
  );

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        isTransparent
          ? "bg-linear-to-b from-black/45 to-transparent"
          : "border-b border-border bg-background/80 backdrop-blur",
      )}
    >
      <Container
        ref={navRef}
        /* No lg:px-0 here. Every Container on the page carries lg:px-8, so
           zeroing it only in the navbar set the logo 32px left of the h1 and
           of every section heading below it. */
        className="flex h-16 items-center justify-between"
      >
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            {isTransparent ? (
              <LogoWhite className="h-6 w-auto" />
            ) : (
              <Logo className="h-6 w-auto" />
            )}
          </Link>

          <nav className="hidden items-center md:flex">
            <MegaMenu isTransparent={isTransparent} anchor={navRef} />
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher currentLocale={locale} inverted={isTransparent} />
          <AppAnchor href={LOGIN_URL} className={linkClass}>
            {t("masuk")}
          </AppAnchor>

          <Button
            size="lg"
            className="px-4 text-xs font-semibold"
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
            className="px-4 text-xs font-semibold"
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
                  className={cn(
                    isTransparent &&
                      "text-white hover:bg-white/10 hover:text-white",
                  )}
                />
              }
            >
              <Icon icon={lucideMenu} className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
