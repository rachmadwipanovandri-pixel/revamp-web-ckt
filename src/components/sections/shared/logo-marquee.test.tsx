import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMarquee } from "./logo-marquee";

const LOGOS = [
  {
    src: "/images/home/logos/hachi-group.png",
    alt: "Hachi Group",
    width: 120,
    height: 34,
  },
  { src: "/images/home/logos/aice.png", alt: "Aice", width: 61, height: 34 },
];

describe("LogoMarquee", () => {
  it("renders the heading and each logo's alt text", () => {
    render(
      <LogoMarquee heading="Trusted by 3,000+ businesses" logos={LOGOS} />,
    );
    expect(
      screen.getByText("Trusted by 3,000+ businesses"),
    ).toBeInTheDocument();
    expect(screen.getAllByAltText("Hachi Group").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText("Aice").length).toBeGreaterThan(0);
  });
});
