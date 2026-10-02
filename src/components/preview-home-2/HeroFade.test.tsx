import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { HeroFade } from "./HeroFade";

describe("preview-home-2 hero fade", () => {
  it("renders children fully opaque with no measuring yet", () => {
    const { container } = render(
      <HeroFade className="test-copy">
        <h1>Headline</h1>
      </HeroFade>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("ph2-fade");
    expect(el.className).toContain("test-copy");
    // At rest (top of page) the copy is untouched: fully opaque, interactive.
    expect(el.style.getPropertyValue("--fade")).toBe("0.000");
    expect(el.inert).toBe(false);
    expect(el.textContent).toBe("Headline");
  });
});
