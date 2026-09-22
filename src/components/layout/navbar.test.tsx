import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "./navbar";
import { LOGIN_URL, REGISTER_URL, whatsAppUrlFor } from "@/lib/links";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  getPathname: ({ href, locale }: { href: string; locale: string }) =>
    locale === "en" ? href : `/${locale}${href === "/" ? "" : href}`,
  Link: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));
vi.mock("next-intl", async (orig) => {
  const actual = await orig<typeof import("next-intl")>();
  return { ...actual, useLocale: () => "en" };
});

const messages = {
  common: { cta: "Try a Demo Now", languageName: "English" },
  nav: {
    fitur: "Features",
    crm: "CRM",
    chat: "Chat",
    marketing: "Marketing",
    order: "Order",
    industries: "Industries",
    blog: "Blog",
    contact: "Contact",
    masuk: "Log in",
    ctaWhatsapp: "WhatsApp Us",
    ctaTrial: "Free Trial",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    viewAllFeatures: "View all features",
    viewAllIndustries: "View all industries",
    industriesByLabel: "By industry",
    megaFeaturedEyebrow: "Featured",
    megaFeaturedTitle: "WhatsApp Call AI",
    megaFeaturedBody: "Every call summarized by AI.",
    megaFeaturedCta: "Explore the feature",
    megaTrust: "Trusted by 3,000+ businesses",
  },
};

describe("Navbar", () => {
  it("renders top-level nav links and the CTA", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Navbar />
      </NextIntlClientProvider>,
    );
    ["Features", "Blog"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("Log in").length).toBeGreaterThan(0);
    // Contact was intentionally removed from the navbar.
    expect(screen.queryByText("Contact")).toBeNull();
  });

  it("points the WhatsApp CTA at wa.me, Free Trial at register, and login at the app", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Navbar />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("WhatsApp Us").closest("a")).toHaveAttribute(
      "href",
      whatsAppUrlFor(null, "en"),
    );
    expect(screen.getByText("Free Trial").closest("a")).toHaveAttribute(
      "href",
      REGISTER_URL,
    );
    expect(screen.getByText("Log in").closest("a")).toHaveAttribute(
      "href",
      LOGIN_URL,
    );
  });
});
