import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarqueeStrip } from "./marquee-strip";

const LOGOS = [
  {
    src: "/images/home/logos/hachi-group.png",
    alt: "Hachi Group",
    width: 120,
    height: 34,
  },
  { src: "/images/home/logos/aice.png", alt: "Aice", width: 61, height: 34 },
];

describe("MarqueeStrip", () => {
  it("renders each logo's alt text", () => {
    render(<MarqueeStrip logos={LOGOS} />);
    expect(screen.getAllByAltText("Hachi Group").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText("Aice").length).toBeGreaterThan(0);
  });
});
