import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { FinalCTA } from "./final-cta";
import { REGISTER_URL, whatsAppUrlFor } from "@/lib/links";

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
      item1: "10-minute setup",
      item2: "14-day free trial",
      item3: "1-on-1 consultation",
    },
  },
  chat: {
    cta: {
      heading: "Chat CTA",
      body: "Chat body.",
    },
  },
};

describe("FinalCTA", () => {
  it("renders the heading, body, checklist, and both CTAs", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <FinalCTA />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", {
        name: "Turn Every Conversation Into a Sale",
      }),
    ).toBeInTheDocument();
    ["10-minute setup", "14-day free trial", "1-on-1 consultation"].forEach(
      (item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      },
    );
    expect(screen.getByText("Try a Demo Now").closest("a")).toHaveAttribute(
      "href",
      REGISTER_URL,
    );
    expect(screen.getByText("Start Free").closest("a")).toHaveAttribute(
      "href",
      whatsAppUrlFor(null, "en"),
    );
  });

  it("omits the checklist for namespaces without item keys (product pages)", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <FinalCTA namespace="chat.cta" />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "Chat CTA" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("10-minute setup")).toBeNull();
  });
});
