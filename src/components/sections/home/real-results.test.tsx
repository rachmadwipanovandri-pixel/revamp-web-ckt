import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { RealResults } from "./real-results";

const messages = {
  home: {
    realResults: {
      heading: "Real Proof From Businesses Using Cekat.AI",
      body: "Cekat.AI serves everyone from small businesses to growing brands.",
      brandTitle: "Trusted by businesses",
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
    expect(
      screen.getByRole("heading", {
        name: "Real Proof From Businesses Using Cekat.AI",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Silcia Brenda")).toBeInTheDocument();
    expect(screen.getByText("Rianti Yahya")).toBeInTheDocument();
    expect(screen.getByText("Tantan Supriantna")).toBeInTheDocument();
    expect(screen.getByText("Hargyo T. N. Ignatis, Ph.D")).toBeInTheDocument();
    expect(screen.getByText("Gery Wilianto")).toBeInTheDocument();
    expect(screen.getByText("Adam Sulaiman")).toBeInTheDocument();
  });

  it("shows the supplied Real Proof portraits for Rianti and Gery", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <RealResults />
      </NextIntlClientProvider>,
    );

    expect(screen.getByAltText("Rianti Yahya")).toHaveAttribute(
      "src",
      expect.stringContaining("%2Fimages%2Fhome%2Frianti-yahya.png"),
    );
    expect(screen.getByAltText("Gery Wilianto")).toHaveAttribute(
      "src",
      expect.stringContaining("%2Fimages%2Fhome%2Fgerry-wilianto.png"),
    );
  });
});
