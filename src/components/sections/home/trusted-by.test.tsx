import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { TrustedBy } from "./trusted-by";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";

const quote = (name: string, company: string, industry: string) => ({
  quote: `Quote from ${company}.`,
  industry,
  function: "Customer Service",
  name,
  role: "Direktur",
  company,
});

const messages = {
  home: {
    trustedBy: {
      heading: "Trusted by 3,000+ businesses across Asia.",
      stat1Value: "10,000,000,000+",
      stat1Label: "tokens processed daily",
      stat2Value: "2,000,000+",
      stat2Label: "chat bubbles processed daily",
      partnersHeading: "Trusted by our partners & customers",
      moreClients: "and thousands more businesses",
    },
    testimonials: {
      heading: "Real results from our customers",
      body: "Every figure below was reported directly by a customer.",
      natureCraft: quote("Hariyudi", "Nature Craft Indonesia", "Retail"),
      wallStreet: quote("Bayu", "Wall Street English", "Education"),
      putiih: quote("Gamal", "Putiih Skin Clinic", "Healthcare"),
      threeland: quote("Adam Sulaiman", "Threeland Property", "Real Estate"),
      rumahZakat: quote("Wiji Astuti", "Rumah Zakat", "Non-Profit"),
    },
  },
};

function renderSection() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <TrustedBy />
    </NextIntlClientProvider>,
  );
}

describe("TrustedBy", () => {
  it("renders the heading, both stats, and the partner block", () => {
    renderSection();
    expect(
      screen.getByText("Trusted by 3,000+ businesses across Asia."),
    ).toBeInTheDocument();
    expect(screen.getByText("10,000,000,000+")).toBeInTheDocument();
    expect(screen.getByText("2,000,000+")).toBeInTheDocument();
    expect(screen.getByAltText("Meta")).toBeInTheDocument();
    expect(screen.getByAltText("TikTok")).toBeInTheDocument();
  });

  it("renders every client logo in the registry, plus the more-clients note", () => {
    renderSection();
    for (const logo of TRUSTED_LOGOS) {
      expect(screen.getAllByAltText(logo.alt).length).toBeGreaterThan(0);
    }
    expect(
      screen.getByText("and thousands more businesses"),
    ).toBeInTheDocument();
  });

  it("leads with the first testimonial and offers a dot per quote", () => {
    renderSection();
    expect(
      screen.getByText(/Quote from Nature Craft Indonesia/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hariyudi, Direktur, Nature Craft Indonesia"),
    ).toBeInTheDocument();
    // One dot per testimonial, labelled by company so the control is reachable.
    expect(screen.getByRole("button", { name: "Rumah Zakat" })).toBeVisible();
  });

  it("switches quote when a dot is clicked", async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole("button", { name: "Rumah Zakat" }));
    expect(screen.getByText(/Quote from Rumah Zakat/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Quote from Nature Craft Indonesia/),
    ).not.toBeInTheDocument();
  });
});
