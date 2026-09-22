import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./footer";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  Link: ({ children, href, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  nav: { crm: "CRM", chat: "Chat", marketing: "Marketing", order: "Order" },
  footer: {
    productHeading: "Product",
    legalHeading: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    refund: "Return, Refund & Delivery Policy",
    rights: "All rights reserved.",
    metaPartner: "Cekat.AI is Official Meta Business Partner",
    officeHeading: "Our Office",
    jakartaOfficeName: "Jakarta Office",
    jakartaOfficeAddress:
      "Prosperity Tower unit 16i, Jl. Jenderal Sudirman No.Kav. 52-53, District 8, SCBD, South Jakarta 12190",
    tangerangOfficeName: "Tangerang Office",
    tangerangOfficeAddress:
      "Ruko Hampton Avenue Blok A no.10, Paramount, Gading Serpong, Tangerang, 15810",
    companyLegalName: "PT. Teknologi Cekat Indonesia",
    downloadApp: "Download Cekat Mobile App",
  },
};

describe("Footer", () => {
  it("renders legal links to the on-site legal pages", () => {
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
    expect(
      screen.getByText("Cekat.AI is Official Meta Business Partner"),
    ).toBeInTheDocument();
    expect(screen.getByText("Jakarta Office")).toBeInTheDocument();
    expect(screen.getByText("Tangerang Office")).toBeInTheDocument();
    expect(screen.getByText("Download Cekat Mobile App")).toBeInTheDocument();
  });
});
