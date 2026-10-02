import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { CONTENT } from "./content";
import { clampOffset } from "./HeroStage";
import { HeroStage } from "./HeroStage";

const stage = CONTENT.id.liveStage;
const dashboard = CONTENT.id.dashboard;

function mockReducedMotion(matches: boolean) {
  mockMedia({ "(prefers-reduced-motion: reduce)": matches });
}

function mockMedia(queries: Record<string, boolean>) {
  window.matchMedia = ((query: string) => ({
    matches: queries[query] ?? false,
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

  it("floats the three starting popups and stacks their mobile twins", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );

    // Three desktop slots, plus the below-`lg` twin of each: all six are in the
    // DOM, and the breakpoint decides which set is on screen.
    const windows = container.querySelectorAll(".ph2-stage-card");
    expect(windows).toHaveLength(6);

    // Each window is a macOS-style window with a working close dot, and each
    // carries its product's looping mini UI rather than a still.
    const closes = container.querySelectorAll(
      `.ph2-stage-card button[aria-label="${stage.popups.close}"]`,
    );
    expect(closes).toHaveLength(6);

    // The three starting products are all different — every slot owns one
    // product, so no two windows ever show the same thing. `chat` is on stage,
    // so its typing-then-reply loop is in the DOM.
    const titles = [
      ...container.querySelectorAll(
        ".ph2-anim.absolute .ph2-stage-card > div:first-child > p",
      ),
    ].map((p) => p.textContent);
    expect(new Set(titles).size).toBe(3);
    // `chat` is on stage, so its typing-then-reply loop is in the DOM — once for
    // its desktop slot and once for the below-`lg` twin.
    expect(container.querySelectorAll(".ph2-reply-slot")).toHaveLength(2);
    expect(container.querySelector("video")).toBeNull();
  });

  it("gives every slot its own bob, so no two windows breathe together", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const slots = [...container.querySelectorAll(".ph2-anim.absolute")];
    const rhythm = slots.map((slot) => {
      const style = (slot as HTMLElement).style;
      return `${style.animationDuration}|${style.animationDelay}`;
    });
    expect(rhythm).toHaveLength(3);
    expect(new Set(rhythm).size).toBe(3);
  });

  it("gives the dashboard one pill per product, each owning one popup", () => {
    mockReducedMotion(false);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const windows = () => container.querySelectorAll(".ph2-stage-card");
    const pills = () => container.querySelectorAll("button[aria-pressed]");
    expect(pills()).toHaveLength(stage.cards.length);

    // The first three products start on stage, the last three start closed.
    expect(windows()).toHaveLength(6);
    [...pills()].forEach((pill, index) => {
      expect(pill.getAttribute("aria-pressed")).toBe(
        index < 3 ? "true" : "false",
      );
    });

    // Opening the fourth adds exactly one popup — its desktop slot plus the
    // below-`lg` twin — and moves nothing else.
    const fourth = pills()[3] as HTMLElement;
    expect(fourth.getAttribute("aria-label")).toBe(
      `${stage.popups.show}: ${stage.cards[3].label}`,
    );
    fireEvent.click(fourth);
    expect(windows()).toHaveLength(8);
    expect(fourth.getAttribute("aria-pressed")).toBe("true");
    expect(fourth.getAttribute("aria-label")).toBe(
      `${stage.popups.hide}: ${stage.cards[3].label}`,
    );

    // Pressing it again puts that one popup away and leaves the rest alone.
    fireEvent.click(fourth);
    expect(windows()).toHaveLength(6);
  });

  it("a popup's own close dot takes down that popup and only that one", () => {
    mockReducedMotion(false);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const windows = () => container.querySelectorAll(".ph2-stage-card");
    const pills = () => container.querySelectorAll("button[aria-pressed]");
    expect(windows()).toHaveLength(6);

    fireEvent.click(
      container.querySelector(
        `.ph2-stage-card button[aria-label="${stage.popups.close}"]`,
      ) as HTMLElement,
    );

    // Both of that product's windows are gone; the other two are untouched.
    expect(windows()).toHaveLength(4);
    expect(pills()[0].getAttribute("aria-pressed")).toBe("false");
    expect(pills()[1].getAttribute("aria-pressed")).toBe("true");
    expect(pills()[2].getAttribute("aria-pressed")).toBe("true");

    // The pill brings the same popup straight back: one control, one popup,
    // reachable from either end.
    fireEvent.click(pills()[0] as HTMLElement);
    expect(windows()).toHaveLength(6);
    expect(pills()[0].getAttribute("aria-pressed")).toBe("true");
  });

  it("restarts each card's story on its own beat, never all at once", async () => {
    vi.useFakeTimers();
    try {
      mockReducedMotion(false);
      const { container } = render(
        <HeroStage dashboard={dashboard} stage={stage} />,
      );
      // `data-loop` is the pass each window is on. The loop rewinds a card by
      // remounting its body, so this counter is the observable proof.
      const passes = () =>
        [
          ...container.querySelectorAll(".ph2-anim.absolute .ph2-stage-card"),
        ].map((el) => Number((el as HTMLElement).dataset.loop));
      const tick = async () => {
        await act(async () => {
          vi.advanceTimersByTime(1400);
        });
      };

      expect(passes()).toEqual([0, 0, 0]);

      // One window per tick, round-robin. Nothing else moves, and no two ever
      // land on the same tick.
      await tick();
      expect(passes()).toEqual([1, 0, 0]);
      await tick();
      expect(passes()).toEqual([1, 1, 0]);
      await tick();
      expect(passes()).toEqual([1, 1, 1]);

      // The tick walks all six slots, so the closed ones take the next three and
      // the first window only starts its second pass on the fourth.
      await tick();
      await tick();
      await tick();
      expect(passes()).toEqual([1, 1, 1]);
      await tick();
      expect(passes()).toEqual([2, 1, 1]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives every card its own phase, so no two share a beat", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const phases = [
      ...container.querySelectorAll(".ph2-anim.absolute .ph2-stage-card"),
    ].map((el) => (el as HTMLElement).style.getPropertyValue("--ph2-phase"));
    expect(phases).toHaveLength(3);
    expect(new Set(phases).size).toBe(3);
  });

  it("holds the loop while the hero has keyboard focus", async () => {
    vi.useFakeTimers();
    try {
      mockReducedMotion(false);
      const { container } = render(
        <HeroStage dashboard={dashboard} stage={stage} />,
      );
      const passes = () =>
        [
          ...container.querySelectorAll(".ph2-anim.absolute .ph2-stage-card"),
        ].map((el) => Number((el as HTMLElement).dataset.loop));
      await act(async () => {
        vi.advanceTimersByTime(1400);
      });
      expect(passes()).toEqual([1, 0, 0]);

      // Focus lands inside the stage: a card being read must not be rewound
      // out from under whoever is tabbing through the hero.
      const pill = container.querySelector("button[aria-pressed]");
      if (!pill) throw new Error("switchboard missing");
      act(() => {
        pill.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      });
      await act(async () => {
        vi.advanceTimersByTime(14000);
      });
      expect(passes()).toEqual([1, 0, 0]);

      act(() => {
        pill.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      });
      await act(async () => {
        vi.advanceTimersByTime(1400);
      });
      expect(passes()).toEqual([1, 1, 0]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("clamps a drop inside the stage", () => {
    const anchor = { left: 100, top: 200, width: 300, height: 400 };
    const stage = { left: 0, top: 0, width: 1200, height: 800 };
    // Inside: untouched.
    expect(clampOffset(50, 60, anchor, stage)).toEqual({ x: 50, y: 60 });
    // Past the right/bottom edge: pinned to the largest fitting offset.
    expect(clampOffset(900, 700, anchor, stage)).toEqual({ x: 800, y: 200 });
    // Past the left/top edge: pinned to zero-relative.
    expect(clampOffset(-500, -500, anchor, stage)).toEqual({
      x: -100,
      y: -200,
    });
  });

  it("a dropped card keeps its release point instead of snapping back", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    // The three absolutely-positioned desktop slots (the fourth card is the
    // below-`lg` single, which never drags).
    const slots = [...container.querySelectorAll(".ph2-anim.absolute")];
    expect(slots).toHaveLength(3);
    const scale = container.querySelector(".ph2-stage-scale");
    if (!scale) throw new Error("stage wrapper missing");
    scale.getBoundingClientRect = () =>
      ({
        left: 0,
        right: 1200,
        top: 0,
        bottom: 800,
        width: 1200,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    slots.forEach((el, i) => {
      el.getBoundingClientRect = () =>
        ({
          left: i * 400,
          right: i * 400 + 300,
          top: 0,
          bottom: 400,
          width: 300,
          height: 400,
          x: i * 400,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
    });

    // Press on the left slot, drag past the threshold, release: the slot
    // keeps the release offset as its new home while the others stay put.
    fireEvent.pointerDown(slots[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(slots[0], { clientX: 450, clientY: 50 });
    fireEvent.pointerUp(slots[0]);
    expect((slots[0] as HTMLElement).style.transform).toContain(
      "translate(440px, 40px)",
    );
    expect((slots[1] as HTMLElement).style.transform).toBe("");
    expect((slots[2] as HTMLElement).style.transform).toBe("");
  });

  it("brings the most recently grabbed slot to the front", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const slots = [...container.querySelectorAll(".ph2-anim.absolute")];
    const z = () =>
      slots.map((slot) => Number((slot as HTMLElement).style.zIndex));

    // Grab the middle slot: it jumps above the rest…
    fireEvent.pointerDown(slots[1], { button: 0, clientX: 410, clientY: 10 });
    fireEvent.pointerUp(slots[1]);
    expect(z()[1]).toBeGreaterThan(z()[0]);
    expect(z()[1]).toBeGreaterThan(z()[2]);

    // …then grabbing the first slot puts that one on top instead.
    fireEvent.pointerDown(slots[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerUp(slots[0]);
    expect(z()[0]).toBeGreaterThan(z()[1]);
    expect(z()[0]).toBeGreaterThan(z()[2]);
  });

  it("a press without movement changes nothing", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const slots = [...container.querySelectorAll(".ph2-anim.absolute")];
    fireEvent.pointerDown(slots[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerUp(slots[0]);
    slots.forEach((slot) => {
      expect((slot as HTMLElement).style.transform).toBe("");
    });
  });

  it("a drag past the stage edge pins to the edge", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const slots = [...container.querySelectorAll(".ph2-anim.absolute")];
    const scale = container.querySelector(".ph2-stage-scale");
    if (!scale) throw new Error("stage wrapper missing");
    scale.getBoundingClientRect = () =>
      ({
        left: 0,
        right: 1200,
        top: 0,
        bottom: 800,
        width: 1200,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    slots.forEach((el, i) => {
      el.getBoundingClientRect = () =>
        ({
          left: i * 400,
          right: i * 400 + 300,
          top: 0,
          bottom: 400,
          width: 300,
          height: 400,
          x: i * 400,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect;
    });

    // Horizontal bounds are the viewport (jsdom: 1024 wide), not the mocked
    // 1200-wide stage: slot 0 spans x 0–300, so shoving far right pins it at
    // the largest fitting offset (1024 − 12 − 300 = 712), never outside.
    fireEvent.pointerDown(slots[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(slots[0], { clientX: 2000, clientY: 10 });
    fireEvent.pointerUp(slots[0]);
    expect((slots[0] as HTMLElement).style.transform).toContain(
      "translate(712px, 0px)",
    );
  });

  it("keeps the gallery static and video-free under reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );

    // All six products readable at once, and nothing left to animate.
    const windows = container.querySelectorAll(".ph2-stage-card");
    expect(windows).toHaveLength(stage.cards.length);
    expect(container.querySelector(".ph2-gate")).toBeNull();

    // No canvas to toggle, so the dashboard drops its switchboard.
    expect(container.querySelector("button[aria-pressed]")).toBeNull();
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
        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(null)),
        );
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
      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(null)),
      );
    });

    expect(el.style.getPropertyValue("--stage")).toBe("1");
  });
});
