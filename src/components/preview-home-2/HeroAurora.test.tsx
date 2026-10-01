import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { HeroAurora } from "./HeroAurora";

describe("preview-home-2 hero aurora", () => {
  it("renders four decorative blobs behind the hero", () => {
    const { container } = render(<HeroAurora />);

    const aurora = container.querySelector(".ph2-aurora");
    expect(aurora).not.toBeNull();
    expect(aurora).toHaveAttribute("aria-hidden", "true");
    // The pause gate keys off `.ph2-anim`, so it must stay on the wrapper.
    expect(aurora?.classList.contains("ph2-anim")).toBe(true);

    expect(container.querySelectorAll(".ph2-aurora-blob")).toHaveLength(4);
  });
});
