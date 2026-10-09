"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import type { HomeContent } from "@/components/preview-home-2/types";

const LOCALES = [
  { code: "id", href: "/preview-home-3" },
  { code: "en", href: "/en/preview-home-3" },
] as const;

/**
 * A fixed, hairline-ruled bar — logo left, links, then a locale switch, the
 * login link and one near-black action.
 *
 * Links appear at `lg` rather than `xl`. Hiding navigation behind a hamburger
 * until 1280px is what made the old bar feel like a mobile layout stretched to
 * fill a desktop; at 1024px there is plainly room for five links and the pair
 * of small actions, and showing them there is most of what reads as "desktop
 * product" rather than "responsive marketing page".
 */
export function Nav3({
  content,
  locale,
}: {
  content: HomeContent["nav"];
  locale: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Opening the panel has to freeze the page behind it, and with Lenis driving
  // the scroll position a plain `overflow: hidden` on <body> is not enough —
  // Lenis keeps writing scroll offsets. So both are stopped.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__ph3Lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      window.__ph3Lenis?.start();
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`ph3-nav fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href={locale === "en" ? "/en/preview-home-3" : "/preview-home-3"}
          aria-label="Cekat home"
          className="shrink-0"
        >
          <Logo className="h-[26px] w-auto" />
        </Link>

        <nav
          aria-label={content.menuLabel}
          className="hidden items-center gap-0.5 lg:flex"
        >
          {content.links.map((link) => (
            <Link
              key={link.label}
              href={link.href ?? "#"}
              className="ph3-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <div className="ph3-locale">
            {LOCALES.map((item) => (
              <Link
                key={item.code}
                href={item.href}
                aria-current={locale === item.code ? "page" : undefined}
              >
                {item.code}
              </Link>
            ))}
          </div>
          <a
            href={content.login.href}
            className="text-[0.875rem] font-medium text-[var(--ph3-ink)] transition-colors duration-150 hover:text-[var(--ph3-accent)]"
          >
            {content.login.label}
          </a>
          <a href={content.cta.href} className="ph3-btn ph3-btn-solid h-10 px-4">
            {content.cta.label}
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? content.closeMenu : content.openMenu}
          aria-expanded={menuOpen}
          aria-controls="ph3-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="ph3-btn-outline ml-auto grid h-10 w-10 place-items-center lg:hidden"
        >
          <span
            aria-hidden
            className="relative block h-[10px] w-[16px]"
          >
            <span className="absolute left-0 top-0 h-px w-full bg-current" />
            <span
              className={`absolute left-0 h-px w-full bg-current transition-transform duration-200 ${
                menuOpen ? "translate-y-[4.5px] rotate-45" : "translate-y-[4.5px]"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-current transition-all duration-200 ${
                menuOpen
                  ? "translate-y-[4.5px] opacity-0"
                  : "translate-y-[9px] opacity-100"
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="ph3-menu-panel px-5 pb-5 lg:hidden sm:px-8">
          <nav
            aria-label={content.menuLabel}
            className="border-t border-[var(--ph3-line)]"
          >
            {content.links.map((link) => (
              <Link
                key={link.label}
                href={link.href ?? "#"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-[var(--ph3-line)] py-3.5 text-[0.9375rem] font-medium"
              >
                {link.label}
                <span aria-hidden className="ph3-mono text-[0.625rem]">
                  ↗
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2">
            <a
              href={content.login.href}
              className="ph3-btn ph3-btn-outline h-11 flex-1"
            >
              {content.login.label}
            </a>
            <a
              href={content.cta.href}
              className="ph3-btn ph3-btn-solid h-11 flex-1"
            >
              {content.cta.label}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}