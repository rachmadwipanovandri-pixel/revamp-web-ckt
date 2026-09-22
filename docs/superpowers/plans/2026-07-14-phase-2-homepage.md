# Phase 2 — Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real cekat.ai homepage — all content sections with real extracted copy and real extracted images — on top of the Phase 1 bilingual shell, plus fix two shared-layout fidelity gaps (Navbar, Footer) discovered during content research.

**Architecture:** Each homepage section is an independent Server Component in `src/components/sections/home/`, reading copy from the `home.*` namespace in `messages/{en,id}.json`. Shared, logic-bearing pieces (animated stat counter, YouTube facade video card) are Client Components under `src/components/sections/shared/`, built with TDD. `src/app/[locale]/page.tsx` composes the sections in order, replacing the Phase 1 placeholder.

**Tech Stack:** Next.js 16 (App Router), next-intl, Tailwind v4, shadcn/ui (Base UI), `@iconify/react`, Vitest + React Testing Library, pnpm.

---

## Note on test/lint discovery and sibling worktrees

If other Claude Code sessions are working in parallel git worktrees under `.claude/worktrees/` in this same repo, both Vitest and ESLint will glob into them by default and can pick up their build output, `node_modules`, and test files, causing thousands of spurious failures unrelated to this plan:
- `vitest.config.ts`'s `test.exclude` must include `.claude/worktrees/**` (in addition to the default `**/node_modules/**`).
- `eslint.config.mjs`'s `globalIgnores` patterns for `.next/**`/`out/**`/`build/**` must be prefixed `**/` (bare `.next/**` only matches the ignore at the config root, not nested inside another worktree's directory) — add an explicit `.claude/worktrees/**` ignore too.

Both were caught and fixed during this plan's execution (a sibling worktree's `.next/` build output was otherwise being linted, and its `node_modules` were being run as tests). If starting fresh and these aren't already present, add them before trusting `pnpm test`/`pnpm lint` output.

## Note on dictionary edits across tasks

Tasks 8–16 each add one new section namespace (e.g. `"trustedBy"`, `"platformOverview"`) as a **sibling key inside the existing `"home"` object** in `messages/en.json` and `messages/id.json` — never replacing the whole `"home"` object, only adding a comma-separated sibling next to whatever previous tasks already added (`"hero"`, then `"trustedBy"`, etc.). Read the current file before editing to place the comma correctly. Task 8's Step 5/6 is the one exception: it replaces the initial single-key `home.hero.title` placeholder from Phase 1 with the full hero object.

## Content Research Summary

All copy below was extracted directly from the live site (`https://cekat.ai/`) on 2026-07-14 using a real browser (not static HTML fetch — the site does client-side rendering and only truly has **Indonesian** content; the "English" option in its language switcher does not change any text on the live site, and `/en/` 404s). Indonesian is therefore the authoritative source; English copy in this plan is a professional translation, consistent with the approach already used for `home.hero.title` in Phase 1.

**Navbar reality check (fixes needed, see Task 2):** the live navbar is `Logo | Fitur ▾ (dropdown: Chat, CRM, Marketing, Order) | Blog | Contact  ⋯  Language | Masuk (login, external) | Coba Demo Sekarang (CTA)`. Phase 1 built flat product links with no dropdown, no login link, and a generic CTA — this plan corrects that.

**Footer reality check (fixes needed, see Task 3):** the live footer additionally has a "Cekat.AI is Official Meta Business Partner" strip, an "Our Office" block (Indonesia/Singapore/Malaysia + two real addresses), and a "Download Cekat Mobile App" line, none of which Phase 1 built.

**Images:** every image this plan uses was already downloaded in Phase 1 to `assets/framer/images/` (verified against `assets/framer/manifest.json` — no new downloads needed). Task 1 copies the specific files this plan needs into `public/images/home/` with descriptive names.

**Scoping decision — hero/chat mockups:** the live hero and "Jualan Otomatis" sections contain an animated fake chat/CRM dashboard built from many individual DOM text nodes (confirmed via live extraction — it is not a flat screenshot). Rebuilding that animation pixel-for-pixel is disproportionate for a decorative element. This plan instead builds a **simplified static representative mockup** using Tailwind cards/chat bubbles styled with our existing design tokens, using the real sample conversation text extracted from the live site. This is a deliberate, documented scope reduction, not an oversight.

---

## Plan Scope

This is **Plan 2 of 6** (PRD §16 Phase 2). It depends on Phase 1 (merged to `main`). Out of scope: product pages (Plan 3), contact/legal (Plan 4), blog (Plan 5), SEO/analytics/launch (Plan 6).

**Definition of done:**
- `pnpm build` succeeds; `pnpm test` all green; `pnpm lint` clean.
- Homepage (`/` and `/id`) renders all 9 content sections in order with real copy in both locales.
- Navbar shows the Fitur dropdown (Chat/CRM/Marketing/Order), Masuk link, correct CTA hrefs. Footer shows Meta partner strip, office info, mobile app line.
- All images load from `public/images/home/` (no hotlinking to `framerusercontent.com`), verified via a running server.
- Side-by-side visual review against `https://cekat.ai/` (via the browser tool) is close enough that a reviewer would recognize it as the same page.
- Work committed incrementally on branch `phase-2-homepage`, pushed at the end.

## File Structure

| File | Responsibility |
|---|---|
| `public/images/home/*` | Copied, descriptively-named image assets for the homepage |
| `next.config.ts` | Add `i.ytimg.com` to `images.remotePatterns` (YouTube thumbnails) |
| `src/components/layout/navbar.tsx` | Modify: Fitur dropdown, Masuk link, correct CTA hrefs |
| `src/components/layout/footer.tsx` | Modify: Meta partner strip, office block, mobile app line |
| `src/components/sections/shared/feature-card.tsx` | Icon/image + title + description primitive |
| `src/components/sections/shared/stat-counter.tsx` | Animated count-up badge (client, tested) |
| `src/components/sections/shared/testimonial-video-card.tsx` | YouTube facade card (client, tested) |
| `src/components/sections/shared/logo-marquee.tsx` | Scrolling client-logo row |
| `src/components/sections/home/hero.tsx` | Hero section |
| `src/components/sections/home/trusted-by.tsx` | Trust bar + rotating quote |
| `src/components/sections/home/platform-overview.tsx` | Platform intro + 3-feature grid |
| `src/components/sections/home/automated-sales.tsx` | "Jualan Otomatis" chat-automation section |
| `src/components/sections/home/turn-chat-into-sales.tsx` | Product grid (Chat/CRM/Marketing/Order) |
| `src/components/sections/home/build-ai-agent.tsx` | AI builder feature section |
| `src/components/sections/home/ai-agent-flow.tsx` | Chat flow feature section |
| `src/components/sections/home/real-results.tsx` | 6 video testimonials |
| `src/components/sections/home/final-cta.tsx` | Closing CTA |
| `src/app/[locale]/page.tsx` | Modify: assemble all sections |
| `messages/en.json`, `messages/id.json` | Modify: add `home.*`, `nav.fitur`/`nav.masuk` keys |

---

### Task 1: Copy image assets and configure remote image patterns

**Files:**
- Create: `public/images/home/hero-background.png`, `public/images/home/logos/*.{png,webp}`, `public/images/home/testimonial-silica-brenda.jpg`, `public/images/home/feature-marketing.png`, `public/images/home/feature-ai-builder.png`, `public/images/home/feature-ai-flow.png`
- Modify: `next.config.ts`

- [ ] **Step 1: Create the destination directories and copy files verbatim from the Phase 1 extraction**

Run:
```bash
mkdir -p public/images/home/logos
cp assets/framer/images/9NP5F7YioOEoXj2e9k9bbUWK4A0.png public/images/home/hero-background.png
cp assets/framer/images/uDqQdyO7atcNTuVxhHKiRUgGhK4.jpg public/images/home/testimonial-silica-brenda.jpg
cp assets/framer/images/lo508BPiyRgnvdYc4yGfbulwsg.png public/images/home/feature-marketing.png
cp assets/framer/images/JbHRXHKHmw3iFtvpBvsM5AkxLIk.png public/images/home/feature-ai-builder.png
cp assets/framer/images/XBOrBVJBhKPWFWYFR9eYmbIz8M.png public/images/home/feature-ai-flow.png
cp assets/framer/images/MbiY0j2OlFXljAOft6U3uJZXlo.png public/images/home/logos/hachi-group.png
cp assets/framer/images/FcnmdvwXQc6UHhm1rlaZCfCRp14.webp public/images/home/logos/klik-indogrosir.webp
cp assets/framer/images/twuwxIt6ioaEBbGJE4y1uqRaqw.png public/images/home/logos/aice.png
cp assets/framer/images/NMxZ0cE5ajsvREuZRr3wrIteWo.png public/images/home/logos/realfood.png
cp assets/framer/images/I6Vgz4u8qgyVqm34vXasOGPAI2A.png public/images/home/logos/kb-insurance.png
cp assets/framer/images/WihQlaXPh6heaEK9c635GuAToM.png public/images/home/logos/mnc.png
cp assets/framer/images/DBd7QtoKyHa2W2FnwQdY3op1OE.png public/images/home/logos/pln.png
cp assets/framer/images/nehdrZkQwM6cRLlNkkcKZoaGI.png public/images/home/logos/jago.png
cp assets/framer/images/kdRodh5WvbdW9fSV3i8woCupiI.png public/images/home/logos/yupi.png
```

- [ ] **Step 2: Verify all files copied and are non-empty**

Run:
```bash
find public/images/home -type f -exec ls -la {} \;
```
Expected: 14 files listed, none 0 bytes.

- [ ] **Step 3: Add YouTube thumbnail host to `next.config.ts`**

Replace `next.config.ts` with:
```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Verify the build still compiles**

Run:
```bash
pnpm build
```
Expected: succeeds (no consumers of the new images/config yet — this just confirms no syntax errors).

- [ ] **Step 5: Commit**

```bash
git add public/images/home next.config.ts
git commit -m "chore: copy homepage image assets, configure YouTube thumbnail host"
```

---

### Task 2: Fix Navbar fidelity — Fitur dropdown, Masuk link, correct CTA hrefs

**Files:**
- Modify: `src/components/layout/navbar.tsx`, `src/components/layout/navbar.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

The live navbar groups the 4 product links under a "Fitur" dropdown (desktop) and shows them flat in the mobile drawer; it also has a "Masuk" (login) link to the external app, and the primary CTA reads "Coba Demo Sekarang" linking to `/demo` (which 404s today — this matches live site behavior; PRD §18 item 3 tracks fixing this later). "Mulai Gratis" and "Masuk" link to the external product app (`chat.cekat.ai`), which is correct and intentional — that's where the actual SaaS product lives, outside this marketing site's scope.

- [ ] **Step 1: Add the shadcn dropdown-menu primitive**

Run:
```bash
pnpm dlx shadcn@latest add dropdown-menu
```
Expected: creates `src/components/ui/dropdown-menu.tsx` (Base UI-backed, consistent with the existing `button`/`sheet` primitives from Phase 1).

- [ ] **Step 2: Update the failing navbar test to cover the new structure**

Replace `src/components/layout/navbar.test.tsx` with:
```tsx
import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "./navbar";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  Link: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next-intl", async (orig) => {
  const actual = await orig<typeof import("next-intl")>();
  return { ...actual, useLocale: () => "en" };
});

const messages = {
  common: { cta: "Try a Demo Now", languageName: "English" },
  nav: {
    fitur: "Features",
    crm: "CRM", chat: "Chat", marketing: "Marketing", order: "Order",
    blog: "Blog", contact: "Contact", masuk: "Log in",
    openMenu: "Open menu", closeMenu: "Close menu",
  },
};

describe("Navbar", () => {
  it("renders top-level nav links and the CTA", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Navbar />
      </NextIntlClientProvider>,
    );
    ["Features", "Blog", "Contact"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("Log in").length).toBeGreaterThan(0);
  });

  it("points the primary CTA at /demo and the login link at the external app", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Navbar />
      </NextIntlClientProvider>,
    );
    const ctaLinks = screen.getAllByText("Try a Demo Now").map((el) => el.closest("a"));
    ctaLinks.forEach((a) => expect(a).toHaveAttribute("href", "/demo"));
    const loginLinks = screen.getAllByText("Log in").map((el) => el.closest("a"));
    loginLinks.forEach((a) => expect(a).toHaveAttribute("href", "https://chat.cekat.ai/login"));
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/layout/navbar.test.tsx
```
Expected: FAIL — current navbar has no "Fitur"/"Log in", CTA is generic.

- [ ] **Step 4: Rewrite `src/components/layout/navbar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@iconify/react";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const PRODUCT_ITEMS = [
  { key: "chat", href: "/chat" },
  { key: "crm", href: "/crm" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
] as const;

const DEMO_HREF = "/demo";
const LOGIN_HREF = "https://chat.cekat.ai/login";
const REGISTER_HREF = "https://chat.cekat.ai/register";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-primary">
          Cekat.AI
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {t("fitur")}
              <Icon icon="lucide:chevron-down" className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {PRODUCT_ITEMS.map((item) => (
                <DropdownMenuItem key={item.key} render={<Link href={item.href} />}>
                  {t(item.key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("blog")}
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher currentLocale={locale} />
          <a
            href={LOGIN_HREF}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("masuk")}
          </a>
          <Link href={DEMO_HREF} className={cn(buttonVariants({ size: "sm" }))}>
            {tc("cta")}
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger aria-label={t("openMenu")} className="p-2">
              <Icon icon="lucide:menu" className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                <span className="text-xs font-semibold uppercase text-subtle-foreground">
                  {t("fitur")}
                </span>
                {PRODUCT_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-base font-medium text-foreground"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <Link href="/blog" className="text-base font-medium text-foreground">
                  {t("blog")}
                </Link>
                <Link href="/contact" className="text-base font-medium text-foreground">
                  {t("contact")}
                </Link>
                <a href={LOGIN_HREF} className="text-base font-medium text-foreground">
                  {t("masuk")}
                </a>
              </nav>
              <div className="mt-8 flex items-center justify-between">
                <LanguageSwitcher currentLocale={locale} />
                <Link href={DEMO_HREF} className={cn(buttonVariants({ size: "sm" }))}>
                  {tc("cta")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}

export { REGISTER_HREF, LOGIN_HREF, DEMO_HREF };
```

- [ ] **Step 5: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/layout/navbar.test.tsx
```
Expected: PASS.

- [ ] **Step 6: Add `nav.fitur` / `nav.masuk` keys to the dictionaries**

In `messages/en.json`, inside `"nav"`, add:
```json
    "fitur": "Features",
    "masuk": "Log in",
```
In `messages/id.json`, inside `"nav"`, add:
```json
    "fitur": "Fitur",
    "masuk": "Masuk",
```

- [ ] **Step 7: Update `common.cta` to match the real CTA label**

In `messages/en.json`, change `"cta": "Get Started"` to `"cta": "Try a Demo Now"`.
In `messages/id.json`, change `"cta": "Mulai Sekarang"` to `"cta": "Coba Demo Sekarang"`.

- [ ] **Step 8: Verify the build compiles and the full test suite passes**

Run:
```bash
pnpm build
pnpm test
```
Expected: both succeed.

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/dropdown-menu.tsx src/components/layout/navbar.tsx src/components/layout/navbar.test.tsx messages/en.json messages/id.json package.json pnpm-lock.yaml
git commit -m "fix: navbar Fitur dropdown, Masuk link, real CTA copy (matches live site)"
```

---

### Task 3: Fix Footer fidelity — Meta partner strip, office info, mobile app line

**Files:**
- Modify: `src/components/layout/footer.tsx`, `src/components/layout/footer.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

- [ ] **Step 1: Update the failing footer test**

Add to `src/components/layout/footer.test.tsx`, inside the existing `messages` object, add a `footer` extension and a new `it` block. Replace the whole file with:
```tsx
import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./footer";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  nav: { crm: "CRM", chat: "Chat", marketing: "Marketing", order: "Order" },
  footer: {
    productHeading: "Product", legalHeading: "Legal",
    terms: "Terms & Conditions", privacy: "Privacy Policy",
    refund: "Return, Refund & Delivery Policy", rights: "All rights reserved.",
    metaPartner: "Cekat.AI is Official Meta Business Partner",
    officeHeading: "Our Office",
    jakartaOfficeName: "Jakarta Office",
    jakartaOfficeAddress: "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, South Jakarta 12190",
    tangerangOfficeName: "Tangerang Office",
    tangerangOfficeAddress: "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
    companyLegalName: "PT. Teknologi Cekat Indonesia",
    downloadApp: "Download Cekat Mobile App",
  },
};

describe("Footer", () => {
  it("renders legal links to the correct paths", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Privacy Policy").closest("a")).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
    expect(screen.getByText("Terms & Conditions").closest("a")).toHaveAttribute(
      "href",
      "/terms-and-conditions",
    );
  });

  it("renders the Meta partner strip and office information", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Cekat.AI is Official Meta Business Partner")).toBeInTheDocument();
    expect(screen.getByText("Jakarta Office")).toBeInTheDocument();
    expect(screen.getByText("Tangerang Office")).toBeInTheDocument();
    expect(screen.getByText("Download Cekat Mobile App")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/layout/footer.test.tsx
```
Expected: FAIL — new content not present yet.

- [ ] **Step 3: Rewrite `src/components/layout/footer.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react";
import { Container } from "./container";

const PRODUCT_LINKS = [
  { key: "crm", href: "/crm" },
  { key: "chat", href: "/chat" },
  { key: "marketing", href: "/marketing" },
  { key: "order", href: "/order" },
] as const;

const LEGAL_LINKS = [
  { key: "terms", href: "/terms-and-conditions" },
  { key: "privacy", href: "/privacy-policy" },
  { key: "refund", href: "/return-refund-delivery-policy" },
] as const;

const SOCIALS = [
  { icon: "mdi:instagram", href: "https://www.instagram.com/cekat.ai/", label: "Instagram" },
  { icon: "mdi:linkedin", href: "https://www.linkedin.com/company/cekatai/", label: "LinkedIn" },
] as const;

const OFFICE_COUNTRIES = [
  { flag: "🇮🇩", key: "indonesia" },
  { flag: "🇸🇬", key: "singapore" },
  { flag: "🇲🇾", key: "malaysia" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="border-b border-border py-3">
        <Container className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
          <Icon icon="mdi:facebook" className="size-5 text-accent-sky" />
          {t("metaPartner")}
        </Container>
      </div>

      <Container className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <span className="text-lg font-semibold text-primary">Cekat.AI</span>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon icon={s.icon} className="size-5" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-foreground">{t("downloadApp")}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("productHeading")}</h2>
          <ul className="mt-4 space-y-2">
            {PRODUCT_LINKS.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {tn(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("legalHeading")}</h2>
          <ul className="mt-4 space-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.key}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("officeHeading")}</h2>
          <div className="mt-4 flex gap-2 text-xl" aria-hidden="true">
            {OFFICE_COUNTRIES.map((c) => (
              <span key={c.key}>{c.flag}</span>
            ))}
          </div>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">{t("jakartaOfficeName")}</p>
              <p>{t("companyLegalName")}</p>
              <p>{t("jakartaOfficeAddress")}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">{t("tangerangOfficeName")}</p>
              <p>{t("companyLegalName")}</p>
              <p>{t("tangerangOfficeAddress")}</p>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cekat.AI. {t("rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Add the new footer keys to `messages/en.json`** (inside `"footer"`)

```json
    "metaPartner": "Cekat.AI is Official Meta Business Partner",
    "officeHeading": "Our Office",
    "jakartaOfficeName": "Jakarta Office",
    "jakartaOfficeAddress": "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, South Jakarta 12190",
    "tangerangOfficeName": "Tangerang Office",
    "tangerangOfficeAddress": "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
    "companyLegalName": "PT. Teknologi Cekat Indonesia",
    "downloadApp": "Download Cekat Mobile App"
```

- [ ] **Step 5: Add the same keys to `messages/id.json`** (inside `"footer"`)

```json
    "metaPartner": "Cekat.AI adalah Meta Business Partner Resmi",
    "officeHeading": "Kantor Kami",
    "jakartaOfficeName": "Kantor Jakarta",
    "jakartaOfficeAddress": "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, Jakarta Selatan 12190",
    "tangerangOfficeName": "Kantor Tangerang",
    "tangerangOfficeAddress": "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
    "companyLegalName": "PT. Teknologi Cekat Indonesia",
    "downloadApp": "Unduh Aplikasi Mobile Cekat"
```

- [ ] **Step 6: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/layout/footer.test.tsx
```
Expected: PASS — both tests green.

- [ ] **Step 7: Verify build**

Run:
```bash
pnpm build
```
Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/layout/footer.tsx src/components/layout/footer.test.tsx messages/en.json messages/id.json
git commit -m "fix: footer Meta partner strip, office info, mobile app line (matches live site)"
```

---

### Task 4: Shared primitive — FeatureCard (TDD)

**Files:**
- Create: `src/components/sections/shared/feature-card.tsx`
- Test: `src/components/sections/shared/feature-card.test.tsx`

Used by PlatformOverview, BuildAIAgent, and AIAgentFlow for their 3-column icon/title/description grids.

- [ ] **Step 1: Write the failing test**

`src/components/sections/shared/feature-card.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard } from "./feature-card";

describe("FeatureCard", () => {
  it("renders the icon, title, and description", () => {
    render(
      <FeatureCard icon="lucide:zap" title="Fast Setup" description="Get started in minutes." />,
    );
    expect(screen.getByText("Fast Setup")).toBeInTheDocument();
    expect(screen.getByText("Get started in minutes.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/feature-card.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/shared/feature-card.tsx`**

```tsx
import { Icon } from "@iconify/react";

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-6 shadow-card">
      <div className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
        <Icon icon={icon} className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/feature-card.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/shared/feature-card.tsx src/components/sections/shared/feature-card.test.tsx
git commit -m "feat: add FeatureCard shared primitive"
```

---

### Task 5: Shared primitive — StatCounter (TDD)

**Files:**
- Create: `src/components/sections/shared/stat-counter.tsx`
- Test: `src/components/sections/shared/stat-counter.test.tsx`

Reproduces the hero's floating "30% Peningkatan closing rate" badge, which animates from 0 to a target percentage once on mount.

Use fake timers (not real `waitFor` polling) so the test is deterministic regardless of system load or how many other test files run in the same process — racing real wall-clock time against `requestAnimationFrame` was tried during this plan's execution and produced a genuine flaky failure (the counter overshot to a nonsensical negative percentage under full-suite load).

- [ ] **Step 1: Write the failing test**

`src/components/sections/shared/stat-counter.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { StatCounter } from "./stat-counter";

describe("StatCounter", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0%", () => {
    render(<StatCounter target={30} label="Peningkatan closing rate" durationMs={1000} />);
    expect(screen.getByText("Peningkatan closing rate")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("counts up to the target value once the duration has elapsed", () => {
    render(<StatCounter target={30} label="Peningkatan closing rate" durationMs={1000} />);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/stat-counter.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/shared/stat-counter.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

export function StatCounter({
  target,
  label,
  durationMs = 1200,
}: {
  target: number;
  label: string;
  durationMs?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-card">
      <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      <span className="font-numeric text-sm font-semibold text-primary">{value}%</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/stat-counter.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/shared/stat-counter.tsx src/components/sections/shared/stat-counter.test.tsx
git commit -m "feat: add StatCounter shared primitive"
```

---

### Task 6: Shared primitive — TestimonialVideoCard (TDD, YouTube facade)

**Files:**
- Create: `src/components/sections/shared/testimonial-video-card.tsx`
- Test: `src/components/sections/shared/testimonial-video-card.test.tsx`

Shows a YouTube thumbnail with a play button; clicking replaces it with a real iframe (lazy — no YouTube JS/network cost until the user interacts).

- [ ] **Step 1: Write the failing test**

`src/components/sections/shared/testimonial-video-card.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialVideoCard } from "./testimonial-video-card";

describe("TestimonialVideoCard", () => {
  it("renders name, role, and a thumbnail image before playing", () => {
    render(
      <TestimonialVideoCard
        videoId="ePdVgW7X01s"
        name="Rianti Yahya"
        role="CEO & Founder - Vio Optical Clinic"
      />,
    );
    expect(screen.getByText("Rianti Yahya")).toBeInTheDocument();
    expect(screen.getByText("CEO & Founder - Vio Optical Clinic")).toBeInTheDocument();
    expect(screen.queryByTitle("Rianti Yahya video testimonial")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });

  it("replaces the thumbnail with an iframe after clicking play", async () => {
    const user = userEvent.setup();
    render(
      <TestimonialVideoCard
        videoId="ePdVgW7X01s"
        name="Rianti Yahya"
        role="CEO & Founder - Vio Optical Clinic"
      />,
    );
    await user.click(screen.getByRole("button", { name: /play/i }));
    const iframe = screen.getByTitle("Rianti Yahya video testimonial");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/ePdVgW7X01s?autoplay=1",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/testimonial-video-card.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/shared/testimonial-video-card.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

export function TestimonialVideoCard({
  videoId,
  name,
  role,
}: {
  videoId: string;
  name: string;
  role: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-card">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            title={`${name} video testimonial`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            className="size-full"
            allow="accelerate-compute; autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${name} video testimonial`}
            onClick={() => setPlaying(true)}
            className="group relative size-full"
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
              <span className="flex size-14 items-center justify-center rounded-full bg-white/90">
                <Icon icon="lucide:play" className="size-6 text-primary" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/testimonial-video-card.test.tsx
```
Expected: PASS — both tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/shared/testimonial-video-card.tsx src/components/sections/shared/testimonial-video-card.test.tsx
git commit -m "feat: add TestimonialVideoCard with YouTube facade pattern"
```

---

### Task 7: Shared primitive — LogoMarquee

**Files:**
- Create: `src/components/sections/shared/logo-marquee.tsx`
- Test: `src/components/sections/shared/logo-marquee.test.tsx`

- [ ] **Step 1: Write the failing test**

`src/components/sections/shared/logo-marquee.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMarquee } from "./logo-marquee";

const LOGOS = [
  { src: "/images/home/logos/hachi-group.png", alt: "Hachi Group", width: 120, height: 34 },
  { src: "/images/home/logos/aice.png", alt: "Aice", width: 61, height: 34 },
];

describe("LogoMarquee", () => {
  it("renders each logo's alt text", () => {
    render(<LogoMarquee logos={LOGOS} />);
    expect(screen.getAllByAltText("Hachi Group").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText("Aice").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/logo-marquee.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/shared/logo-marquee.tsx`**

Renders the logo list twice back-to-back so a CSS animation can scroll seamlessly (standard marquee technique); duplicated copy is `aria-hidden` to avoid confusing screen readers.

```tsx
import Image from "next/image";

interface Logo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function LogoMarquee({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex gap-12 overflow-hidden">
      <ul className="flex shrink-0 animate-marquee items-center gap-12">
        {logos.map((logo) => (
          <li key={logo.src}>
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-8 w-auto object-contain opacity-70" />
          </li>
        ))}
      </ul>
      <ul className="flex shrink-0 animate-marquee items-center gap-12" aria-hidden="true">
        {logos.map((logo) => (
          <li key={`${logo.src}-dup`}>
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-8 w-auto object-contain opacity-70" />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Add the marquee keyframe animation to `src/app/globals.css`**

Append to the end of the file:
```css
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/shared/logo-marquee.test.tsx
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/shared/logo-marquee.tsx src/components/sections/shared/logo-marquee.test.tsx src/app/globals.css
git commit -m "feat: add LogoMarquee shared primitive with reduced-motion support"
```

---

### Task 8: Hero section

**Files:**
- Create: `src/components/sections/home/hero.tsx`
- Test: `src/components/sections/home/hero.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy (extracted 2026-07-14):

| Key | Indonesian (authoritative) | English (translation) |
|---|---|---|
| badge | CekatAI — AI Agent untuk Customer Service & Sales 24/7 \| #1 di Indonesia | CekatAI — AI Agent for Customer Service & Sales 24/7 \| #1 in Indonesia |
| title | Satu AI untuk Mengelola Chat, CRM, dan Otomatisasi Bisnis | One AI to Manage Chat, CRM, and Business Automation |
| subtitle | Cekat.AI adalah platform AI agent terdepan di Indonesia yang menggabungkan AI agent cerdas, omnichannel CRM, dan sistem order otomatis dalam satu platform | Cekat.AI is Indonesia's leading AI agent platform, combining smart AI agents, omnichannel CRM, and automated order systems in a single platform |
| ctaPrimary | Mulai Gratis | Start Free |
| ctaSecondary | Coba Demo Sekarang | Try a Demo Now |
| statLabel | Peningkatan closing rate | Increase in closing rate |
| mockCustomerName | Gwen | Gwen |
| mockMessage1 | Hi, I'm interested in the oversized t-shirt. Do you have size M? | *(already English on the live site — sample chat demo, kept verbatim both locales)* |
| mockMessage2 | Yes, size M is available. Would you like the black or white color? | *(same, both locales)* |

Note: the sample chat conversation on the live site is itself written in English in both the ID and EN renders (it's product-demo content, not marketing copy) — kept verbatim.

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/hero.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Hero } from "./hero";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  home: {
    hero: {
      badge: "CekatAI — AI Agent for Customer Service & Sales 24/7 | #1 in Indonesia",
      title: "One AI to Manage Chat, CRM, and Business Automation",
      subtitle: "Cekat.AI is Indonesia's leading AI agent platform.",
      ctaPrimary: "Start Free",
      ctaSecondary: "Try a Demo Now",
      statLabel: "Increase in closing rate",
    },
  },
};

describe("Hero", () => {
  it("renders the H1, subtitle, and both CTAs with correct hrefs", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Hero />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /One AI to Manage Chat/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Indonesia's leading AI agent platform/)).toBeInTheDocument();
    expect(screen.getByText("Start Free").closest("a")).toHaveAttribute(
      "href",
      "https://chat.cekat.ai/register",
    );
    expect(screen.getByText("Try a Demo Now").closest("a")).toHaveAttribute("href", "/demo");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/hero.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/hero.tsx`**

```tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { StatCounter } from "@/components/sections/shared/stat-counter";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/home/hero-background.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <Container className="relative py-24 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="https://chat.cekat.ai/register"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {t("ctaPrimary")}
          </a>
          <Link href="/demo" className={cn(buttonVariants())}>
            {t("ctaSecondary")}
          </Link>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-accent-green" aria-hidden="true" />
          {t("badge")}
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl rounded-xl border border-border bg-background p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm font-semibold text-foreground">Gwen</span>
            <span className="text-xs text-muted-foreground">Active now</span>
          </div>
          <div className="mt-4 space-y-3 text-left text-sm">
            <p className="w-fit max-w-[80%] rounded-lg bg-surface-subtle px-3 py-2 text-foreground">
              Hi, I&apos;m interested in the oversized t-shirt. Do you have size M?
            </p>
            <p className="ml-auto w-fit max-w-[80%] rounded-lg bg-blue-50 px-3 py-2 text-foreground">
              Yes, size M is available. Would you like the black or white color?
            </p>
          </div>
          <div className="absolute -bottom-4 left-4">
            <StatCounter target={30} label={t("statLabel")} />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/hero.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add hero keys to `messages/en.json`** (replace the existing `"home": { "hero": { "title": "..." } }` block with the full section)

```json
  "home": {
    "hero": {
      "badge": "CekatAI — AI Agent for Customer Service & Sales 24/7 | #1 in Indonesia",
      "title": "One AI to Manage Chat, CRM, and Business Automation",
      "subtitle": "Cekat.AI is Indonesia's leading AI agent platform, combining smart AI agents, omnichannel CRM, and automated order systems in a single platform",
      "ctaPrimary": "Start Free",
      "ctaSecondary": "Try a Demo Now",
      "statLabel": "Increase in closing rate"
    }
  }
```

- [ ] **Step 6: Add the same keys to `messages/id.json`**

```json
  "home": {
    "hero": {
      "badge": "CekatAI — AI Agent untuk Customer Service & Sales 24/7 | #1 di Indonesia",
      "title": "Satu AI untuk Mengelola Chat, CRM, dan Otomatisasi Bisnis",
      "subtitle": "Cekat.AI adalah platform AI agent terdepan di Indonesia yang menggabungkan AI agent cerdas, omnichannel CRM, dan sistem order otomatis dalam satu platform",
      "ctaPrimary": "Mulai Gratis",
      "ctaSecondary": "Coba Demo Sekarang",
      "statLabel": "Peningkatan closing rate"
    }
  }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/hero.tsx src/components/sections/home/hero.test.tsx messages/en.json messages/id.json
git commit -m "feat: add Hero section with real extracted copy"
```

---

### Task 9: TrustedBy section (logo marquee + rotating quote)

**Files:**
- Create: `src/components/sections/home/trusted-by.tsx`
- Test: `src/components/sections/home/trusted-by.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Dipercaya oleh 3.000+ bisnis dan brand terkemuka di Indonesia | Trusted by 3,000+ businesses and leading brands in Indonesia |
| quote | "Respon pelanggan menjadi lebih cepat" | "Customer response has become much faster" |
| quoteAuthorName | Silica Brenda | Silica Brenda |
| quoteAuthorRole | Founder | Founder |
| quoteAuthorCompany | Moir Salon | Moir Salon |

9 real client logos (already copied in Task 1): Hachi Group, Klik Indogrosir, Aice, Realfood, KB Insurance Indonesia, MNC, PLN, JAGO, Yupi.

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/trusted-by.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TrustedBy } from "./trusted-by";

const messages = {
  home: {
    trustedBy: {
      heading: "Trusted by 3,000+ businesses and leading brands in Indonesia",
      quote: "Customer response has become much faster",
      quoteAuthorName: "Silica Brenda",
      quoteAuthorRole: "Founder",
      quoteAuthorCompany: "Moir Salon",
    },
  },
};

describe("TrustedBy", () => {
  it("renders the heading, quote, and attribution", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TrustedBy />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByText("Trusted by 3,000+ businesses and leading brands in Indonesia"),
    ).toBeInTheDocument();
    expect(screen.getByText("Customer response has become much faster")).toBeInTheDocument();
    expect(screen.getByText("Silica Brenda")).toBeInTheDocument();
    expect(screen.getByText(/Founder.*Moir Salon/)).toBeInTheDocument();
  });

  it("renders the client logos", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TrustedBy />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByAltText("Hachi Group").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText("Aice").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/trusted-by.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/trusted-by.tsx`**

```tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { LogoMarquee } from "@/components/sections/shared/logo-marquee";

const LOGOS = [
  { src: "/images/home/logos/hachi-group.png", alt: "Hachi Group", width: 120, height: 34 },
  { src: "/images/home/logos/klik-indogrosir.webp", alt: "Klik Indogrosir", width: 130, height: 25 },
  { src: "/images/home/logos/aice.png", alt: "Aice", width: 61, height: 34 },
  { src: "/images/home/logos/realfood.png", alt: "Realfood", width: 118, height: 30 },
  { src: "/images/home/logos/kb-insurance.png", alt: "KB Insurance Indonesia", width: 140, height: 35 },
  { src: "/images/home/logos/mnc.png", alt: "MNC Media Nusantara Citra", width: 110, height: 52 },
  { src: "/images/home/logos/pln.png", alt: "PLN", width: 55, height: 75 },
  { src: "/images/home/logos/jago.png", alt: "Bank Jago", width: 110, height: 31 },
  { src: "/images/home/logos/yupi.png", alt: "Yupi", width: 90, height: 45 },
];

export function TrustedBy() {
  const t = useTranslations("home.trustedBy");

  return (
    <section className="border-y border-border py-16">
      <Container>
        <p className="text-center text-sm font-medium text-muted-foreground">{t("heading")}</p>
        <div className="mt-8">
          <LogoMarquee logos={LOGOS} />
        </div>

        <blockquote className="mx-auto mt-16 max-w-2xl text-center">
          {/* Quote text is wrapped in its own <span> — RTL's getByText matches direct
              child text nodes joined together, so without this the curly quote
              entities would be concatenated into the match string and the test's
              exact-text query would fail. */}
          <p className="text-2xl font-semibold text-foreground">
            &ldquo;<span>{t("quote")}</span>&rdquo;
          </p>
          <footer className="mt-4 flex items-center justify-center gap-3">
            <Image
              src="/images/home/testimonial-silica-brenda.jpg"
              alt={t("quoteAuthorName")}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="text-left text-sm">
              <p className="font-semibold text-foreground">{t("quoteAuthorName")}</p>
              <p className="text-muted-foreground">
                {t("quoteAuthorRole")}, {t("quoteAuthorCompany")}
              </p>
            </div>
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/trusted-by.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`, alongside `"hero"`)

```json
    "trustedBy": {
      "heading": "Trusted by 3,000+ businesses and leading brands in Indonesia",
      "quote": "Customer response has become much faster",
      "quoteAuthorName": "Silica Brenda",
      "quoteAuthorRole": "Founder",
      "quoteAuthorCompany": "Moir Salon"
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "trustedBy": {
      "heading": "Dipercaya oleh 3.000+ bisnis dan brand terkemuka di Indonesia",
      "quote": "Respon pelanggan menjadi lebih cepat",
      "quoteAuthorName": "Silica Brenda",
      "quoteAuthorRole": "Founder",
      "quoteAuthorCompany": "Moir Salon"
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/trusted-by.tsx src/components/sections/home/trusted-by.test.tsx messages/en.json messages/id.json
git commit -m "feat: add TrustedBy section with real logos and testimonial quote"
```

---

### Task 10: PlatformOverview section

**Files:**
- Create: `src/components/sections/home/platform-overview.tsx`
- Test: `src/components/sections/home/platform-overview.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Satu Platform untuk Mengelola Semua Percakapan Customer | One Platform to Manage All Customer Conversations |
| body | Cekat.AI adalah platform AI agent terdepan di Indonesia yang dirancang untuk bisnis yang ingin mengotomatisasi customer service & meningkatkan penjualan tanpa perlu menambah tim. Cekat.AI menggabungkan AI agent cerdas, omnichannel CRM, sistem order otomatis, & broadcast marketing dalam satu platform. | Cekat.AI is Indonesia's leading AI agent platform, built for businesses that want to automate customer service and grow sales without adding headcount. Cekat.AI combines smart AI agents, omnichannel CRM, automated order systems, and broadcast marketing in one platform. |
| feature1.title | Monitor dan Optimalkan Marketing dalam Satu Platform | Monitor and Optimize Marketing in One Platform |
| feature1.description | Kelola performa campaign dan konversi secara real-time, lalu aktifkan otomatisasi untuk maksimalkan hasil marketing. | Track campaign performance and conversions in real time, then activate automation to maximize your marketing results. |
| feature2.title | Otomatisasi Alur Bisnis Tanpa Perlu Coding | Automate Business Workflows Without Coding |
| feature2.description | Biarkan AI bales chat, mengelola leads, dan menindaklanjuti customer secara otomatis, 24/7. | Let AI reply to chats, manage leads, and follow up with customers automatically, 24/7. |
| feature3.title | CRM untuk bantu bisnismu berkembang & komunikasi lebih efektif | CRM to Help Your Business Grow With More Effective Communication |
| feature3.description | Semua data lead tersimpan rapi, follow-up otomatis, dan progres penjualan bisa dipantau real-time. | All lead data stays organized, follow-ups run automatically, and sales progress is tracked in real time. |

Feature 1 has a confirmed real screenshot (`feature-marketing.png`, alt-verified on the live site); features 2–3 use icons (no dedicated screenshot exists on the live site for these two).

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/platform-overview.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PlatformOverview } from "./platform-overview";

const messages = {
  home: {
    platformOverview: {
      heading: "One Platform to Manage All Customer Conversations",
      body: "Cekat.AI is Indonesia's leading AI agent platform.",
      feature1: { title: "Monitor and Optimize Marketing in One Platform", description: "Track campaign performance." },
      feature2: { title: "Automate Business Workflows Without Coding", description: "Let AI reply to chats." },
      feature3: { title: "CRM to Help Your Business Grow", description: "All lead data stays organized." },
    },
  },
};

describe("PlatformOverview", () => {
  it("renders the heading, body, and all three feature titles", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PlatformOverview />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "One Platform to Manage All Customer Conversations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Automate Business Workflows Without Coding")).toBeInTheDocument();
    expect(screen.getByText("CRM to Help Your Business Grow")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/platform-overview.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/platform-overview.tsx`**

```tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { FeatureCard } from "@/components/sections/shared/feature-card";

export function PlatformOverview() {
  const t = useTranslations("home.platformOverview");

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <p className="mt-4 text-base text-muted-foreground">{t("body")}</p>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-border shadow-card">
          <Image
            src="/images/home/feature-marketing.png"
            alt={t("feature1.title")}
            width={1280}
            height={720}
            className="w-full object-cover"
          />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <FeatureCard icon="lucide:megaphone" title={t("feature1.title")} description={t("feature1.description")} />
          <FeatureCard icon="lucide:workflow" title={t("feature2.title")} description={t("feature2.description")} />
          <FeatureCard icon="lucide:users" title={t("feature3.title")} description={t("feature3.description")} />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/platform-overview.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "platformOverview": {
      "heading": "One Platform to Manage All Customer Conversations",
      "body": "Cekat.AI is Indonesia's leading AI agent platform, built for businesses that want to automate customer service and grow sales without adding headcount. Cekat.AI combines smart AI agents, omnichannel CRM, automated order systems, and broadcast marketing in one platform.",
      "feature1": { "title": "Monitor and Optimize Marketing in One Platform", "description": "Track campaign performance and conversions in real time, then activate automation to maximize your marketing results." },
      "feature2": { "title": "Automate Business Workflows Without Coding", "description": "Let AI reply to chats, manage leads, and follow up with customers automatically, 24/7." },
      "feature3": { "title": "CRM to Help Your Business Grow With More Effective Communication", "description": "All lead data stays organized, follow-ups run automatically, and sales progress is tracked in real time." }
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "platformOverview": {
      "heading": "Satu Platform untuk Mengelola Semua Percakapan Customer",
      "body": "Cekat.AI adalah platform AI agent terdepan di Indonesia yang dirancang untuk bisnis yang ingin mengotomatisasi customer service & meningkatkan penjualan tanpa perlu menambah tim. Cekat.AI menggabungkan AI agent cerdas, omnichannel CRM, sistem order otomatis, & broadcast marketing dalam satu platform.",
      "feature1": { "title": "Monitor dan Optimalkan Marketing dalam Satu Platform", "description": "Kelola performa campaign dan konversi secara real-time, lalu aktifkan otomatisasi untuk maksimalkan hasil marketing." },
      "feature2": { "title": "Otomatisasi Alur Bisnis Tanpa Perlu Coding", "description": "Biarkan AI bales chat, mengelola leads, dan menindaklanjuti customer secara otomatis, 24/7." },
      "feature3": { "title": "CRM untuk bantu bisnismu berkembang & komunikasi lebih efektif", "description": "Semua data lead tersimpan rapi, follow-up otomatis, dan progres penjualan bisa dipantau real-time." }
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/platform-overview.tsx src/components/sections/home/platform-overview.test.tsx messages/en.json messages/id.json
git commit -m "feat: add PlatformOverview section with real copy and image"
```

---

### Task 11: AutomatedSales section

**Files:**
- Create: `src/components/sections/home/automated-sales.tsx`
- Test: `src/components/sections/home/automated-sales.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Jualan Otomatis, Langsung dari Chat | Automatic Selling, Straight From Chat |
| badge1 | Otomatisasi Order | Order Automation |
| badge2 | Ongkos kirim | Shipping Cost |
| badge3 | Pembayaran | Payment |
| caption | Tanpa proses manual, semua leads terjaga | No manual process — every lead is kept safe |

Per the plan's scoping decision, this section's chat mockup is a simplified static representation using the real sample text from the live site (order confirmation flow), not a pixel-perfect animated clone.

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/automated-sales.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AutomatedSales } from "./automated-sales";

const messages = {
  home: {
    automatedSales: {
      heading: "Automatic Selling, Straight From Chat",
      badge1: "Order Automation",
      badge2: "Shipping Cost",
      badge3: "Payment",
      caption: "No manual process — every lead is kept safe",
    },
  },
};

describe("AutomatedSales", () => {
  it("renders the heading and all three badges", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AutomatedSales />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "Automatic Selling, Straight From Chat" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Order Automation")).toBeInTheDocument();
    expect(screen.getByText("Shipping Cost")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/automated-sales.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/automated-sales.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";

export function AutomatedSales() {
  const t = useTranslations("home.automatedSales");

  return (
    <section className="bg-surface-muted py-20">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[t("badge1"), t("badge2"), t("badge3")].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("caption")}</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 shadow-card">
          <div className="space-y-3 text-sm">
            <p className="w-fit max-w-[85%] rounded-lg bg-surface-subtle px-3 py-2 text-foreground">
              Hi, I&apos;d like to order 1 black oversized t-shirt in size M. Is it available?
            </p>
            <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-blue-50 px-3 py-2 text-foreground">
              Yes, size M in black is available.
              <br />
              Price: Rp185,000 · Shipping to Bandung: Rp18,000 · Total: Rp203,000
            </p>
            <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-blue-50 px-3 py-2 text-foreground">
              Complete your payment here: cekat.ai/pay/10293
            </p>
            <p className="w-fit max-w-[85%] rounded-lg bg-surface-subtle px-3 py-2 text-foreground">
              Okay, I&apos;ll pay now.
            </p>
            <p className="w-fit max-w-[85%] rounded-lg bg-surface-subtle px-3 py-2 text-foreground">
              Done ✓
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/automated-sales.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "automatedSales": {
      "heading": "Automatic Selling, Straight From Chat",
      "badge1": "Order Automation",
      "badge2": "Shipping Cost",
      "badge3": "Payment",
      "caption": "No manual process — every lead is kept safe"
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "automatedSales": {
      "heading": "Jualan Otomatis, Langsung dari Chat",
      "badge1": "Otomatisasi Order",
      "badge2": "Ongkos kirim",
      "badge3": "Pembayaran",
      "caption": "Tanpa proses manual, semua leads terjaga"
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/automated-sales.tsx src/components/sections/home/automated-sales.test.tsx messages/en.json messages/id.json
git commit -m "feat: add AutomatedSales section with real copy"
```

---

### Task 12: TurnChatIntoSales section (+ ProductCard)

**Files:**
- Create: `src/components/sections/home/turn-chat-into-sales.tsx`
- Test: `src/components/sections/home/turn-chat-into-sales.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Ubah Chat Jadi Penjualan | Turn Chat Into Sales |
| body | Cara lebih cerdas mengelola customer service di Indonesia. Berbeda dengan chatbot konvensional, AI agent Cekat.AI memahami konteks percakapan, menangani WhatsApp, Instagram, dan semua channel sekaligus, serta menutup transaksi otomatis, 24/7. | A smarter way to manage customer service in Indonesia. Unlike conventional chatbots, Cekat.AI's AI agent understands conversation context, handles WhatsApp, Instagram, and every channel at once, and closes transactions automatically, 24/7. |
| viewDetails | Lihat detail produk | See product details |

Four product cards link to the four product pages (built in Plan 3): Chat (`/chat`), CRM (`/crm`), Marketing (`/marketing`), Order (`/order`) — reusing the existing `nav.chat`/`nav.crm`/`nav.marketing`/`nav.order` labels already in the dictionary.

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/turn-chat-into-sales.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { TurnChatIntoSales } from "./turn-chat-into-sales";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  nav: { chat: "Chat", crm: "CRM", marketing: "Marketing", order: "Order" },
  home: {
    turnChatIntoSales: {
      heading: "Turn Chat Into Sales",
      body: "A smarter way to manage customer service in Indonesia.",
      viewDetails: "See product details",
    },
  },
};

describe("TurnChatIntoSales", () => {
  it("renders a card linking to each product page", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TurnChatIntoSales />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Chat").closest("a")).toHaveAttribute("href", "/chat");
    expect(screen.getByText("CRM").closest("a")).toHaveAttribute("href", "/crm");
    expect(screen.getByText("Marketing").closest("a")).toHaveAttribute("href", "/marketing");
    expect(screen.getByText("Order").closest("a")).toHaveAttribute("href", "/order");
    expect(screen.getAllByText("See product details")).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/turn-chat-into-sales.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/turn-chat-into-sales.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";

const PRODUCTS = [
  { key: "chat", href: "/chat", icon: "lucide:message-circle" },
  { key: "crm", href: "/crm", icon: "lucide:contact" },
  { key: "marketing", href: "/marketing", icon: "lucide:megaphone" },
  { key: "order", href: "/order", icon: "lucide:shopping-cart" },
] as const;

export function TurnChatIntoSales() {
  const t = useTranslations("home.turnChatIntoSales");
  const tn = useTranslations("nav");

  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <p className="mt-4 text-base text-muted-foreground">{t("body")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <Link
              key={product.key}
              href={product.href}
              className="group rounded-lg border border-border bg-background p-6 shadow-card transition-shadow hover:shadow-lg"
            >
              <div className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-primary">
                <Icon icon={product.icon} className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{tn(product.key)}</h3>
              <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">
                {t("viewDetails")}
                <Icon icon="lucide:arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/turn-chat-into-sales.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "turnChatIntoSales": {
      "heading": "Turn Chat Into Sales",
      "body": "A smarter way to manage customer service in Indonesia. Unlike conventional chatbots, Cekat.AI's AI agent understands conversation context, handles WhatsApp, Instagram, and every channel at once, and closes transactions automatically, 24/7.",
      "viewDetails": "See product details"
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "turnChatIntoSales": {
      "heading": "Ubah Chat Jadi Penjualan",
      "body": "Cara lebih cerdas mengelola customer service di Indonesia. Berbeda dengan chatbot konvensional, AI agent Cekat.AI memahami konteks percakapan, menangani WhatsApp, Instagram, dan semua channel sekaligus, serta menutup transaksi otomatis, 24/7.",
      "viewDetails": "Lihat detail produk"
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/turn-chat-into-sales.tsx src/components/sections/home/turn-chat-into-sales.test.tsx messages/en.json messages/id.json
git commit -m "feat: add TurnChatIntoSales section linking to product pages"
```

---

### Task 13: BuildAIAgent section

**Files:**
- Create: `src/components/sections/home/build-ai-agent.tsx`
- Test: `src/components/sections/home/build-ai-agent.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Buat AI Agent dalam 5 Menit | Build an AI Agent in 5 Minutes |
| body | Kelola semua chat dengan AI yang mudah dibuat. Latih pakai data bisnismu dan hubungkan ke sistem lain tanpa ribet. | Manage every chat with an AI agent that's easy to build. Train it with your business data and connect it to other systems, hassle-free. |
| feature1.title | Builder AI Sederhana | Simple AI Builder |
| feature1.description | Buat AI Agent yang powerful tanpa coding, cukup 5 menit, semudah briefing admin CS. | Build a powerful AI agent without coding in just 5 minutes — as easy as briefing a CS admin. |
| feature2.title | AI Knowledge Base | AI Knowledge Base |
| feature2.description | Cukup salin SOP dan info bisnismu, AI langsung bisa jawab dengan tepat. | Just paste your SOPs and business info, and the AI can answer accurately right away. |
| feature3.title | API Integration | API Integration |
| feature3.description | Hubungkan AI dengan berbagai API untuk cek ongkir, booking jadwal, dan kebutuhan bisnis lainnya. | Connect the AI to various APIs for shipping cost checks, scheduling, and other business needs. |

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/build-ai-agent.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { BuildAIAgent } from "./build-ai-agent";

const messages = {
  home: {
    buildAiAgent: {
      heading: "Build an AI Agent in 5 Minutes",
      body: "Manage every chat with an AI agent that's easy to build.",
      feature1: { title: "Simple AI Builder", description: "Build a powerful AI agent without coding." },
      feature2: { title: "AI Knowledge Base", description: "Just paste your SOPs and business info." },
      feature3: { title: "API Integration", description: "Connect the AI to various APIs." },
    },
  },
};

describe("BuildAIAgent", () => {
  it("renders the heading and all three feature cards", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <BuildAIAgent />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: "Build an AI Agent in 5 Minutes" })).toBeInTheDocument();
    expect(screen.getByText("Simple AI Builder")).toBeInTheDocument();
    expect(screen.getByText("AI Knowledge Base")).toBeInTheDocument();
    expect(screen.getByText("API Integration")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/build-ai-agent.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/build-ai-agent.tsx`**

```tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { FeatureCard } from "@/components/sections/shared/feature-card";

export function BuildAIAgent() {
  const t = useTranslations("home.buildAiAgent");

  return (
    <section className="bg-surface-muted py-20">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <p className="mt-4 text-base text-muted-foreground">{t("body")}</p>
          <div className="mt-8 space-y-6">
            <FeatureCard icon="lucide:bot" title={t("feature1.title")} description={t("feature1.description")} />
            <FeatureCard icon="lucide:book-open" title={t("feature2.title")} description={t("feature2.description")} />
            <FeatureCard icon="lucide:plug" title={t("feature3.title")} description={t("feature3.description")} />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          <Image
            src="/images/home/feature-ai-builder.png"
            alt={t("feature1.title")}
            width={1280}
            height={720}
            className="w-full object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/build-ai-agent.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "buildAiAgent": {
      "heading": "Build an AI Agent in 5 Minutes",
      "body": "Manage every chat with an AI agent that's easy to build. Train it with your business data and connect it to other systems, hassle-free.",
      "feature1": { "title": "Simple AI Builder", "description": "Build a powerful AI agent without coding in just 5 minutes — as easy as briefing a CS admin." },
      "feature2": { "title": "AI Knowledge Base", "description": "Just paste your SOPs and business info, and the AI can answer accurately right away." },
      "feature3": { "title": "API Integration", "description": "Connect the AI to various APIs for shipping cost checks, scheduling, and other business needs." }
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "buildAiAgent": {
      "heading": "Buat AI Agent dalam 5 Menit",
      "body": "Kelola semua chat dengan AI yang mudah dibuat. Latih pakai data bisnismu dan hubungkan ke sistem lain tanpa ribet.",
      "feature1": { "title": "Builder AI Sederhana", "description": "Buat AI Agent yang powerful tanpa coding, cukup 5 menit, semudah briefing admin CS." },
      "feature2": { "title": "AI Knowledge Base", "description": "Cukup salin SOP dan info bisnismu, AI langsung bisa jawab dengan tepat." },
      "feature3": { "title": "API Integration", "description": "Hubungkan AI dengan berbagai API untuk cek ongkir, booking jadwal, dan kebutuhan bisnis lainnya." }
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/build-ai-agent.tsx src/components/sections/home/build-ai-agent.test.tsx messages/en.json messages/id.json
git commit -m "feat: add BuildAIAgent section with real copy and image"
```

---

### Task 14: AIAgentFlow section

**Files:**
- Create: `src/components/sections/home/ai-agent-flow.tsx`
- Test: `src/components/sections/home/ai-agent-flow.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | AI Agent & Alur Chat | AI Agents & Chat Flow |
| body | Atur alur chat dengan mudah, arahkan customer ke AI atau human agent yang tepat. | Easily set up chat flows and route customers to the right AI or human agent. |
| feature1.title | AI Agent Spesialis | Specialist AI Agents |
| feature1.description | Buat AI khusus untuk sales, support, billing, dan lainnya, masing-masing dengan data sendiri. | Create dedicated AI agents for sales, support, billing, and more — each with its own data. |
| feature2.title | Designer Alur Visual | Visual Flow Designer |
| feature2.description | Atur alur chat dengan drag & drop, tanpa coding. | Design chat flows with drag and drop, no coding required. |
| feature3.title | Jam Kerja AI | AI Working Hours |
| feature3.description | Atur jam kerja AI agar chat dijawab tim saat online dan otomatis dialihkan ke AI di luar jam kerja. | Set the AI's working hours so your team handles chats while online, with automatic handoff to AI after hours. |

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/ai-agent-flow.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AIAgentFlow } from "./ai-agent-flow";

const messages = {
  home: {
    aiAgentFlow: {
      heading: "AI Agents & Chat Flow",
      body: "Easily set up chat flows and route customers to the right AI or human agent.",
      feature1: { title: "Specialist AI Agents", description: "Create dedicated AI agents for sales, support, billing." },
      feature2: { title: "Visual Flow Designer", description: "Design chat flows with drag and drop." },
      feature3: { title: "AI Working Hours", description: "Set the AI's working hours." },
    },
  },
};

describe("AIAgentFlow", () => {
  it("renders the heading and all three feature cards", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AIAgentFlow />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: "AI Agents & Chat Flow" })).toBeInTheDocument();
    expect(screen.getByText("Specialist AI Agents")).toBeInTheDocument();
    expect(screen.getByText("Visual Flow Designer")).toBeInTheDocument();
    expect(screen.getByText("AI Working Hours")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/ai-agent-flow.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/ai-agent-flow.tsx`**

```tsx
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { FeatureCard } from "@/components/sections/shared/feature-card";

export function AIAgentFlow() {
  const t = useTranslations("home.aiAgentFlow");

  return (
    <section className="py-20">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 overflow-hidden rounded-xl border border-border shadow-card md:order-1">
          <Image
            src="/images/home/feature-ai-flow.png"
            alt={t("feature1.title")}
            width={1080}
            height={1350}
            className="w-full object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <p className="mt-4 text-base text-muted-foreground">{t("body")}</p>
          <div className="mt-8 space-y-6">
            <FeatureCard icon="lucide:user-cog" title={t("feature1.title")} description={t("feature1.description")} />
            <FeatureCard icon="lucide:git-branch" title={t("feature2.title")} description={t("feature2.description")} />
            <FeatureCard icon="lucide:clock" title={t("feature3.title")} description={t("feature3.description")} />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/ai-agent-flow.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "aiAgentFlow": {
      "heading": "AI Agents & Chat Flow",
      "body": "Easily set up chat flows and route customers to the right AI or human agent.",
      "feature1": { "title": "Specialist AI Agents", "description": "Create dedicated AI agents for sales, support, billing, and more — each with its own data." },
      "feature2": { "title": "Visual Flow Designer", "description": "Design chat flows with drag and drop, no coding required." },
      "feature3": { "title": "AI Working Hours", "description": "Set the AI's working hours so your team handles chats while online, with automatic handoff to AI after hours." }
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "aiAgentFlow": {
      "heading": "AI Agent & Alur Chat",
      "body": "Atur alur chat dengan mudah, arahkan customer ke AI atau human agent yang tepat.",
      "feature1": { "title": "AI Agent Spesialis", "description": "Buat AI khusus untuk sales, support, billing, dan lainnya, masing-masing dengan data sendiri." },
      "feature2": { "title": "Designer Alur Visual", "description": "Atur alur chat dengan drag & drop, tanpa coding." },
      "feature3": { "title": "Jam Kerja AI", "description": "Atur jam kerja AI agar chat dijawab tim saat online dan otomatis dialihkan ke AI di luar jam kerja." }
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/ai-agent-flow.tsx src/components/sections/home/ai-agent-flow.test.tsx messages/en.json messages/id.json
git commit -m "feat: add AIAgentFlow section with real copy and image"
```

---

### Task 15: RealResults section (6 video testimonials)

**Files:**
- Create: `src/components/sections/home/real-results.tsx`
- Test: `src/components/sections/home/real-results.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Bukti Nyata dari Bisnis yang Menggunakan Cekat.AI | Real Proof From Businesses Using Cekat.AI |
| body | Cekat.AI hadir untuk UMKM yang butuh AI customer service terjangkau hingga brand berkembang yang butuh omnichannel CRM lengkap, semua dalam satu platform untuk bisnis Indonesia. | Cekat.AI serves everyone from small businesses that need affordable AI customer service to growing brands that need a full omnichannel CRM — all in one platform built for Indonesian businesses. |

Real testimonials (name/role/company identical in both locales — proper nouns; video IDs confirmed live 2026-07-14):

| Name | Role/Company | YouTube ID |
|---|---|---|
| Rianti Yahya | CEO & Founder - Vio Optical Clinic | ePdVgW7X01s |
| Tantan Supriantna | Head Customer Relation - Rumah Zakat | wvOip0Gkx30 |
| Hargyo T. N. Ignatis, Ph.D | Direktur - Multimedia Nusantara Polytechnic (MNP) | O_xSafLehMQ |
| Rianti Yahya | CEO - VIO Optical Clinic | 681luT0Aa68 |
| Gery Wilianto | CEO & Founder - DokterHub | vmXUCHVo6k8 |
| Adam Sulaiman | President Director - Threeland Property | IezNIgsGH5I |

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/real-results.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { RealResults } from "./real-results";

const messages = {
  home: {
    realResults: {
      heading: "Real Proof From Businesses Using Cekat.AI",
      body: "Cekat.AI serves everyone from small businesses to growing brands.",
    },
  },
};

describe("RealResults", () => {
  it("renders the heading and all six testimonial names", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RealResults />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: "Real Proof From Businesses Using Cekat.AI" })).toBeInTheDocument();
    expect(screen.getAllByText("Rianti Yahya")).toHaveLength(2);
    expect(screen.getByText("Tantan Supriantna")).toBeInTheDocument();
    expect(screen.getByText("Hargyo T. N. Ignatis, Ph.D")).toBeInTheDocument();
    expect(screen.getByText("Gery Wilianto")).toBeInTheDocument();
    expect(screen.getByText("Adam Sulaiman")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/real-results.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/real-results.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";

const TESTIMONIALS = [
  { name: "Rianti Yahya", role: "CEO & Founder - Vio Optical Clinic", videoId: "ePdVgW7X01s" },
  { name: "Tantan Supriantna", role: "Head Customer Relation - Rumah Zakat", videoId: "wvOip0Gkx30" },
  { name: "Hargyo T. N. Ignatis, Ph.D", role: "Direktur - Multimedia Nusantara Polytechnic (MNP)", videoId: "O_xSafLehMQ" },
  { name: "Rianti Yahya", role: "CEO - VIO Optical Clinic", videoId: "681luT0Aa68" },
  { name: "Gery Wilianto", role: "CEO & Founder - DokterHub", videoId: "vmXUCHVo6k8" },
  { name: "Adam Sulaiman", role: "President Director - Threeland Property", videoId: "IezNIgsGH5I" },
] as const;

export function RealResults() {
  const t = useTranslations("home.realResults");

  return (
    <section className="bg-surface-muted py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t("heading")}</h2>
          <p className="mt-4 text-base text-muted-foreground">{t("body")}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialVideoCard
              key={`${testimonial.videoId}-${index}`}
              videoId={testimonial.videoId}
              name={testimonial.name}
              role={testimonial.role}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/real-results.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "realResults": {
      "heading": "Real Proof From Businesses Using Cekat.AI",
      "body": "Cekat.AI serves everyone from small businesses that need affordable AI customer service to growing brands that need a full omnichannel CRM — all in one platform built for Indonesian businesses."
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "realResults": {
      "heading": "Bukti Nyata dari Bisnis yang Menggunakan Cekat.AI",
      "body": "Cekat.AI hadir untuk UMKM yang butuh AI customer service terjangkau hingga brand berkembang yang butuh omnichannel CRM lengkap, semua dalam satu platform untuk bisnis Indonesia."
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/real-results.tsx src/components/sections/home/real-results.test.tsx messages/en.json messages/id.json
git commit -m "feat: add RealResults section with 6 real video testimonials"
```

---

### Task 16: FinalCTA section

**Files:**
- Create: `src/components/sections/home/final-cta.tsx`
- Test: `src/components/sections/home/final-cta.test.tsx`
- Modify: `messages/en.json`, `messages/id.json`

Real copy:

| Key | Indonesian | English |
|---|---|---|
| heading | Ubah Setiap Percakapan Jadi Penjualan | Turn Every Conversation Into a Sale |
| body | Lihat bagaimana AI membantu tim balas lebih cepat, follow-up otomatis, dan closing lebih banyak tanpa nambah tim. | See how AI helps your team reply faster, follow up automatically, and close more deals without growing headcount. |

Reuses `home.hero.ctaPrimary`/`ctaSecondary` labels (same CTA pair, same hrefs) — no new CTA copy keys needed.

- [ ] **Step 1: Write the failing test**

`src/components/sections/home/final-cta.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { FinalCTA } from "./final-cta";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  home: {
    hero: { ctaPrimary: "Start Free", ctaSecondary: "Try a Demo Now" },
    finalCta: {
      heading: "Turn Every Conversation Into a Sale",
      body: "See how AI helps your team reply faster.",
    },
  },
};

describe("FinalCTA", () => {
  it("renders the heading, body, and both CTAs", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <FinalCTA />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: "Turn Every Conversation Into a Sale" })).toBeInTheDocument();
    expect(screen.getByText("Try a Demo Now").closest("a")).toHaveAttribute("href", "/demo");
    expect(screen.getByText("Start Free").closest("a")).toHaveAttribute(
      "href",
      "https://chat.cekat.ai/register",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm exec vitest run src/components/sections/home/final-cta.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/sections/home/final-cta.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

export function FinalCTA() {
  const t = useTranslations("home.finalCta");
  const th = useTranslations("home.hero");

  return (
    <section className="py-20">
      <Container className="rounded-2xl bg-primary px-8 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-primary-foreground">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">{t("body")}</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/demo"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            {th("ctaSecondary")}
          </Link>
          <a
            href="https://chat.cekat.ai/register"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-primary-foreground/40 px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            {th("ctaPrimary")}
          </a>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm exec vitest run src/components/sections/home/final-cta.test.tsx
```
Expected: PASS.

- [ ] **Step 5: Add keys to `messages/en.json`** (inside `"home"`)

```json
    "finalCta": {
      "heading": "Turn Every Conversation Into a Sale",
      "body": "See how AI helps your team reply faster, follow up automatically, and close more deals without growing headcount."
    }
```

- [ ] **Step 6: Add keys to `messages/id.json`**

```json
    "finalCta": {
      "heading": "Ubah Setiap Percakapan Jadi Penjualan",
      "body": "Lihat bagaimana AI membantu tim balas lebih cepat, follow-up otomatis, dan closing lebih banyak tanpa nambah tim."
    }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/home/final-cta.tsx src/components/sections/home/final-cta.test.tsx messages/en.json messages/id.json
git commit -m "feat: add FinalCTA section"
```

---

### Task 17: Assemble the homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Replace the Phase 1 placeholder with the full section assembly**

```tsx
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/home/hero";
import { TrustedBy } from "@/components/sections/home/trusted-by";
import { PlatformOverview } from "@/components/sections/home/platform-overview";
import { AutomatedSales } from "@/components/sections/home/automated-sales";
import { TurnChatIntoSales } from "@/components/sections/home/turn-chat-into-sales";
import { BuildAIAgent } from "@/components/sections/home/build-ai-agent";
import { AIAgentFlow } from "@/components/sections/home/ai-agent-flow";
import { RealResults } from "@/components/sections/home/real-results";
import { FinalCTA } from "@/components/sections/home/final-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustedBy />
      <PlatformOverview />
      <AutomatedSales />
      <TurnChatIntoSales />
      <BuildAIAgent />
      <AIAgentFlow />
      <RealResults />
      <FinalCTA />
    </>
  );
}
```

- [ ] **Step 2: Verify the build succeeds**

Run:
```bash
pnpm build
```
Expected: succeeds; route table shows `/en` and `/id` prerendered.

- [ ] **Step 3: Confirm exactly one H1 renders per locale**

Run:
```bash
pnpm start > /tmp/next-start.log 2>&1 &
SERVER_PID=$!
sleep 4
echo "en H1 count: $(curl -s http://localhost:3000/ | grep -o '<h1' | wc -l)"
echo "id H1 count: $(curl -s http://localhost:3000/id | grep -o '<h1' | wc -l)"
curl -s http://localhost:3000/ | grep -o '<h1[^>]*>[^<]*</h1>'
curl -s http://localhost:3000/id | grep -o '<h1[^>]*>[^<]*</h1>'
kill $SERVER_PID
```
Expected: both H1 counts are `1`; EN shows "One AI to Manage Chat, CRM, and Business Automation"; ID shows "Satu AI untuk Mengelola Chat, CRM, dan Otomatisasi Bisnis".

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: assemble full homepage from all sections"
```

---

### Task 18: End-to-end verification and push

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run:
```bash
pnpm test
```
Expected: all test files pass.

- [ ] **Step 2: Lint and typecheck**

Run:
```bash
pnpm lint
pnpm exec tsc --noEmit
```
Expected: both clean.

- [ ] **Step 3: Production build**

Run:
```bash
pnpm build
```
Expected: succeeds.

- [ ] **Step 4: Verify no hotlinked Framer images**

Run:
```bash
pnpm start > /tmp/next-start.log 2>&1 &
SERVER_PID=$!
sleep 4
echo "framerusercontent references (expect 0):"
curl -s http://localhost:3000/ | grep -c "framerusercontent.com" || true
kill $SERVER_PID
```
Expected: `0`.

- [ ] **Step 5: Visual side-by-side review**

Using the browser tool, navigate to `https://cekat.ai/` and to `http://localhost:3000/` (with `pnpm start` running) and compare section-by-section: hero, trusted-by, platform overview, automated sales, turn-chat-into-sales, build-ai-agent, ai-agent-flow, real-results, final CTA, footer. Confirm all real copy from this plan's Content Research Summary appears correctly in both the local build and matches the live site's meaning. Note any visual issues for a follow-up pass — this plan does not require pixel-perfect matching (see the hero/chat-mockup scoping decision above), only that all real content is present and section order/structure matches.

- [ ] **Step 6: Push the branch**

```bash
git push -u origin phase-2-homepage
```
Expected: pushes to `GTMLab-AI/cekat`.

---

## Self-Review Notes

- **Spec coverage (PRD §16 Phase 2):** all 9 homepage content sections from PRD §6.1 are built (Task 8–16), using real extracted copy (not placeholders) and real extracted images (Task 1). Two shared-layout gaps discovered during live-site research (Navbar Fitur dropdown/Masuk, Footer Meta-partner/office block) are fixed in Tasks 2–3 since they're visible on every homepage screenshot and directly affect the "review side-by-side" exit criterion.
- **Type/prop consistency:** `FeatureCard(icon, title, description)` used identically across Tasks 10, 13, 14. `TestimonialVideoCard(videoId, name, role)` used identically in Task 15. `LogoMarquee(logos: {src,alt,width,height}[])` used once in Task 9. All section components read from `home.<sectionName>` namespaces that match between the `messages/*.json` edits and the `useTranslations` calls in each task.
- **Known, documented scope reduction:** the hero and automated-sales chat mockups are simplified static representations (real sample text, not the live site's animated multi-state DOM), explicitly called out in the Content Research Summary and Task 11 — not an oversight.
- **Deferred to later plans (not gaps):** the four product pages linked from TurnChatIntoSales (Plan 3), the `/demo` 404 (PRD §18 item 3, unresolved by the user), per-page SEO metadata/JSON-LD (Plan 6), analytics events on CTA clicks (Plan 6).
