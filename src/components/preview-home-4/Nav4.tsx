"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/components/preview-home-2/types";

/**
 * The draft's two routes, one per locale. Declared once because both the
 * desktop pill and the mobile panel render them — a language switcher that
 * disappears on a phone is a dead end for half the visitors.
 */
const LOCALE_OPTIONS = [
  { code: "id", href: "/preview-home-4" },
  { code: "en", href: "/en/preview-home-4" },
] as const;

/**
 * Sticky nav for /preview-home-4 — markup, geometry and behaviour ported from
 * /preview-home-2's Nav so the two drafts' headers are the same header:
 *
 *   - a scroll-linked morph. `--p` (0 → 1) is written straight to the DOM
 *     inside a requestAnimationFrame, so the bar eases into its pill on the
 *     same frame the page moves: no threshold to snap across, no React
 *     re-render per frame, and under `prefers-reduced-motion` it snaps instead
 *     of following the scroll.
 *   - real `aria-expanded`/`aria-controls` on the mega triggers, Escape closing
 *     both surfaces, a scroll lock while the mobile panel is open, and a plain
 *     language toggle instead of a hover-only dropdown.
 *
 * What stays ph4's own: the route in every href, and `__ph4Lenis` — the scroll
 * instance this page owns (ph2's freezes `__ph2Lenis`, which does not exist
 * here).
 */
export function Nav4({
  content,
  locale,
}: {
  content: HomeContent["nav"];
  locale: string;
}) {
  const [openMega, setOpenMega] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const navRef = useRef<HTMLElement>(null);

  /**
   * Scroll-linked morph. See the class comment: the value is a plain custom
   * property, so the easing happens in CSS on the same frame as the scroll.
   */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      const p = reduce.matches
        ? y > 24
          ? 1
          : 0
        : Math.min(1, Math.max(0, y / 90));
      el.style.setProperty("--p", p.toFixed(3));
      /*
       * Reading position, in the same frame and the same loop: the document's
       * own progress, written as a plain property so the hairline is a
       * `scaleX` and never a layout read. Measured from the element rather
       * than `document.height` because the page grows while images settle.
       */
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty(
        "--ph4-progress",
        scrollable > 0 ? Math.min(1, y / scrollable).toFixed(4) : "0",
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMega(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Scroll lock — body overflow alone does not stop Lenis' virtual scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__ph4Lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      window.__ph4Lenis?.start();
    };
  }, [mobileOpen]);

  const closeMega = () => setOpenMega(null);

  return (
    <header
      ref={navRef}
      className="ph4-nav sticky top-0 z-50"
      onMouseLeave={() => {
        leaveTimer.current = setTimeout(closeMega, 160);
      }}
      onMouseEnter={() => clearTimeout(leaveTimer.current)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          closeMega();
        }
      }}
    >
      <div className="ph4-nav-shell mx-auto">
        <div className="ph4-nav-bar relative flex items-center gap-3 border">
          <Link
            href={locale === "en" ? "/en/preview-home-4" : "/preview-home-4"}
            className="ml-2 flex shrink-0 items-center rounded-lg px-1 py-1"
          >
            <Logo className="h-7 w-auto" />
            <span className="sr-only">Cekat.AI</span>
          </Link>

          <nav
            aria-label={content.menuLabel}
            className="hidden items-center gap-0.5 lg:flex"
          >
            {content.links.map((link, index) =>
              link.mega ? (
                <button
                  key={link.label}
                  type="button"
                  aria-expanded={openMega === index}
                  aria-controls={`ph4-mega-${index}`}
                  onClick={() => setOpenMega(openMega === index ? null : index)}
                  onMouseEnter={() => {
                    clearTimeout(leaveTimer.current);
                    setOpenMega(index);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-[#4B5563] transition-colors duration-150 hover:bg-[#F1F5F9] hover:text-[#101828]",
                    openMega === index && "bg-[#F1F5F9] text-[#101828]",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rotate-45 border-r-[1.5px] border-b-[1.5px] border-current opacity-60 transition-transform duration-300 motion-reduce:transition-none",
                      openMega === index && "-translate-y-0.5 rotate-[225deg]",
                    )}
                  />
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-[#4B5563] transition-colors duration-150 hover:bg-[#F1F5F9] hover:text-[#101828]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 pr-2">
            <div className="hidden items-center gap-0.5 rounded-full border border-border p-0.5 sm:flex">
              {LOCALE_OPTIONS.map((option) => (
                <Link
                  key={option.code}
                  href={option.href}
                  aria-current={locale === option.code ? "page" : undefined}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors duration-150",
                    locale === option.code
                      ? "bg-[#EFF6FF] text-primary"
                      : "text-[#64748B] hover:text-[#101828]",
                  )}
                >
                  {option.code}
                </Link>
              ))}
            </div>

            <a
              href={content.login.href}
              className="hidden rounded-full px-3 py-2 text-[0.9rem] font-semibold text-[#4B5563] transition-colors duration-150 hover:text-[#101828] sm:inline-flex"
            >
              {content.login.label}
            </a>
            <a
              href={content.cta.href}
              className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(19,82,191,0.85)] transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-[#2563EB] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {content.cta.label}
            </a>

            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="ph4-mobile-panel"
              aria-label={mobileOpen ? content.closeMenu : content.openMenu}
              onClick={() => {
                setMobileOpen((open) => !open);
                closeMega();
              }}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border text-[#101828] lg:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-200 motion-reduce:transition-none",
                    mobileOpen && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-opacity duration-200 motion-reduce:transition-none",
                    mobileOpen && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-3 h-0.5 rounded bg-current transition-transform duration-200 motion-reduce:transition-none",
                    mobileOpen && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>

          {/* Reading position. `--ph4-progress` is written in the same rAF as
              the nav's own morph, so the two never disagree by a frame. One
              ring rather than two bars: it is the pill's own outline, so it
              wraps the rounded ends as well as the straight edges, and the
              clipper's filter casts the bloom off that bent shape. */}
          <div aria-hidden={true} className="ph4-nav-progress-clip">
            <span className="ph4-nav-progress" />
          </div>

          {/* Desktop mega panel */}
          {openMega !== null && content.links[openMega]?.mega ? (
            <div
              id={`ph4-mega-${openMega}`}
              className="ph4-mega-panel absolute inset-x-0 top-[calc(100%+10px)] overflow-hidden rounded-[22px] border border-border bg-white p-6 shadow-[0_36px_70px_-38px_rgba(11,18,32,0.45)]"
            >
              {content.links[openMega].megaIntro ? (
                <p className="mb-5 max-w-[42rem] text-sm leading-[1.6] text-[#64748B]">
                  {content.links[openMega].megaIntro}
                </p>
              ) : null}
              <div className="grid gap-6 sm:grid-cols-2">
                {content.links[openMega].mega?.map((column) => (
                  <div key={column.title}>
                    <p className="mb-2 text-xs font-bold tracking-[0.09em] text-[#64748B] uppercase">
                      {column.title}
                    </p>
                    <ul className="grid gap-0.5">
                      {column.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMega}
                            className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] transition-colors duration-150 hover:bg-[#F8FAFF]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Mobile panel — native <details> groups, so it works without JS state */}
        {mobileOpen ? (
          <div
            id="ph4-mobile-panel"
            className="ph4-menu-panel mt-2 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[22px] border border-border bg-white p-4 shadow-[0_36px_70px_-38px_rgba(11,18,32,0.45)] lg:hidden"
          >
            {content.links.map((link) =>
              link.mega ? (
                <details
                  key={link.label}
                  className="border-b border-[#F1F5F9] last:border-0"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-1 py-3.5 text-base font-bold text-[#101828] [&::-webkit-details-marker]:hidden">
                    {link.label}
                    <span
                      aria-hidden
                      className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-[#94A3B8]"
                    />
                  </summary>
                  <div className="pb-2">
                    {link.mega.map((column) => (
                      <div key={column.title} className="mb-2">
                        <p className="px-3 pb-1 text-xs font-bold tracking-[0.09em] text-[#64748B] uppercase">
                          {column.title}
                        </p>
                        {column.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2 text-[0.95rem] text-[#4B5563] transition-colors duration-150 hover:bg-[#F8FAFF] hover:text-[#101828]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-[#F1F5F9] px-1 py-3.5 text-base font-bold text-[#101828] last:border-0"
                >
                  {link.label}
                </Link>
              ),
            )}

            <div className="mt-4 flex gap-2">
              <a
                href={content.login.href}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border text-sm font-semibold text-[#101828]"
              >
                {content.login.label}
              </a>
              <a
                href={content.cta.href}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
              >
                {content.cta.label}
              </a>
            </div>

            {/*
              The desktop switcher is `hidden sm:flex`, so without this the
              phone has no way to reach the other locale at all.
            */}
            <div className="mt-3 flex gap-2 sm:hidden">
              {LOCALE_OPTIONS.map((option) => {
                const current = locale === option.code;
                return (
                  <Link
                    key={option.code}
                    href={option.href}
                    lang={option.code}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "inline-flex h-10 flex-1 items-center justify-center rounded-full border text-xs font-bold uppercase transition-colors duration-150",
                      current
                        ? "border-[#BFDBFE] bg-[#EFF6FF] text-primary"
                        : "border-border bg-white text-[#64748B]",
                    )}
                  >
                    {option.code}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
