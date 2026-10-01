import { describe, expect, it, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { CONTENT } from "./content";
import { HeroStage } from "./HeroStage";

const stage = CONTENT.id.liveStage;
const dashboard = CONTENT.id.dashboard;

function mockReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("preview-home-2 hero stage", () => {
  beforeEach(() => {
    mockReducedMotion(false);
  });

  it("loops one card at a time and exposes no controls", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );

    // Six cards for the desktop column, six for the mobile stack…
    const cards = container.querySelectorAll(".ph2-stage-card");
    expect(cards).toHaveLength(stage.cards.length * 2);

    // …but only the active one is visible in each stack (2, not 12).
    expect(container.querySelectorAll(".opacity-100")).toHaveLength(2);

    // The arrow navigation and the pause button are gone on purpose.
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("unfolds into a static gallery when motion is reduced", () => {
    mockReducedMotion(true);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );

    // One card each, all visible, and nothing left to animate.
    const cards = container.querySelectorAll(".ph2-stage-card");
    expect(cards).toHaveLength(stage.cards.length);
    expect(container.querySelectorAll(".opacity-0")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container.querySelector(".ph2-gate")).toBeNull();
  });

  it("grows the stage as it scrolls into view", async () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const el = container.querySelector<HTMLElement>(".ph2-stage-scale");
    expect(el).not.toBeNull();
    if (!el) return;

    const viewport = window.innerHeight;

    const placeAt = async (top: number) => {
      el.getBoundingClientRect = () =>
        ({
          top,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
      await act(async () => {
        window.dispatchEvent(new Event("scroll"));
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      });
      return el.style.getPropertyValue("--stage");
    };

    // Sitting on the viewport's bottom edge: fully shrunk.
    expect(await placeAt(viewport)).toBe("0.8800");

    // Half-way up the 60%-of-viewport ramp: half grown.
    expect(await placeAt(viewport * 0.7)).toBe("0.9400");

    // Fully arrived: natural size, and it can never grow past it.
    expect(await placeAt(viewport * 0.4)).toBe("1.0000");
    expect(await placeAt(-2000)).toBe("1.0000");
  });

  it("holds the stage at full size when motion is reduced", async () => {
    mockReducedMotion(true);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const el = container.querySelector<HTMLElement>(".ph2-stage-scale");
    if (!el) throw new Error("stage wrapper missing");

    el.getBoundingClientRect = () => ({ top: window.innerHeight }) as DOMRect;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    });

    expect(el.style.getPropertyValue("--stage")).toBe("1");
  });
});
