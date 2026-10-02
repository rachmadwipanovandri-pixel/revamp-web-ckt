import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { CONTENT } from "./content";
import { clampOffset, loopTickMs } from "./HeroStage";
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

  it("floats the three starting popups beside a single mobile window", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );

    // Three desktop slots, plus the one below-`lg` window that walks the
    // products on its own. All four are in the DOM; the breakpoint decides
    // which set is on screen.
    const windows = container.querySelectorAll(".ph2-stage-card");
    expect(windows).toHaveLength(4);

    // Each desktop window is a macOS-style window with a working close dot. The
    // mobile one has none — it replaces itself, so an X would promise something
    // the carousel does not do.
    const closes = container.querySelectorAll(
      `.ph2-stage-card button[aria-label="${stage.popups.close}"]`,
    );
    expect(closes).toHaveLength(3);

    // The three starting products are all different — every slot owns one
    // product, so no two windows ever show the same thing.
    const titles = [
      ...container.querySelectorAll(
        ".ph2-anim.absolute .ph2-stage-card > div:first-child > p",
      ),
    ].map((p) => p.textContent);
    expect(new Set(titles).size).toBe(3);
    expect(container.querySelector("video")).toBeNull();
  });

  it("walks a card's conversation to the end, then holds it", async () => {
    vi.useFakeTimers();
    try {
      mockReducedMotion(false);
      const { container } = render(
        <HeroStage dashboard={dashboard} stage={stage} />,
      );
      const script = stage.cards[0].thread;
      if (!script) throw new Error("chat card has no script");
      // A real exchange, not one question and one answer.
      expect(script.length).toBeGreaterThan(6);
      expect(
        script.filter((turn) => turn.from === "agent").length,
      ).toBeGreaterThan(4);

      const bubbles = () =>
        container.querySelectorAll(".ph2-anim.absolute .ph2-thread > div");
      // It opens empty and fills in, one message at a time.
      expect(bubbles()).toHaveLength(0);

      let previous = 0;
      let guard = 0;
      while (bubbles().length < script.length && guard < 60) {
        guard += 1;
        await act(async () => {
          vi.advanceTimersByTime(1500);
        });
        // Monotonic: the shared loop must never cut a script in half.
        expect(bubbles().length).toBeGreaterThanOrEqual(previous);
        previous = bubbles().length;
      }
      expect(bubbles()).toHaveLength(script.length);
      expect(bubbles()[0].textContent).toContain(script[0].text.slice(0, 18));

      // The finished conversation is the payoff, so it is held rather than
      // rewound — and the typing dots stop once the last line has landed.
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      expect(bubbles()).toHaveLength(script.length);
      expect(
        container.querySelectorAll(".ph2-anim.absolute .ph2-dot"),
      ).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives every slot its own bob, so no two windows breathe together", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    // A slot is two elements: the shell carries the bob (a CSS animation, so it
    // lives on the shell's own style) and the box inside it carries the drop
    // position. Keeping them apart is what stops an animation from overwriting
    // a dragged transform.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const rhythm = shells.map((shell) => {
      const style = (shell as HTMLElement).style;
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
    expect(windows()).toHaveLength(4);
    [...pills()].forEach((pill, index) => {
      expect(pill.getAttribute("aria-pressed")).toBe(
        index < 3 ? "true" : "false",
      );
    });

    // Opening the fourth adds exactly one window, and moves nothing else.
    const fourth = pills()[3] as HTMLElement;
    expect(fourth.getAttribute("aria-label")).toBe(
      `${stage.popups.show}: ${stage.cards[3].label}`,
    );
    fireEvent.click(fourth);
    expect(windows()).toHaveLength(5);
    expect(fourth.getAttribute("aria-pressed")).toBe("true");
    expect(fourth.getAttribute("aria-label")).toBe(
      `${stage.popups.hide}: ${stage.cards[3].label}`,
    );

    // Pressing it again puts that one popup away and leaves the rest alone.
    fireEvent.click(fourth);
    expect(windows()).toHaveLength(4);
  });

  it("a popup's own close dot takes down that popup and only that one", () => {
    mockReducedMotion(false);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const windows = () => container.querySelectorAll(".ph2-stage-card");
    const pills = () => container.querySelectorAll("button[aria-pressed]");
    expect(windows()).toHaveLength(4);

    fireEvent.click(
      container.querySelector(
        `.ph2-stage-card button[aria-label="${stage.popups.close}"]`,
      ) as HTMLElement,
    );

    // That product's window is gone; the other two are untouched, and so is the
    // mobile carousel, which is on its own schedule.
    expect(windows()).toHaveLength(3);
    expect(pills()[0].getAttribute("aria-pressed")).toBe("false");
    expect(pills()[1].getAttribute("aria-pressed")).toBe("true");
    expect(pills()[2].getAttribute("aria-pressed")).toBe("true");

    // The pill brings the same popup straight back: one control, one popup,
    // reachable from either end.
    fireEvent.click(pills()[0] as HTMLElement);
    expect(windows()).toHaveLength(4);
    expect(pills()[0].getAttribute("aria-pressed")).toBe("true");
  });

  it("brings a summoned window on screen promptly", () => {
    mockReducedMotion(false);
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const pill = [...container.querySelectorAll("button[aria-pressed]")][4];
    fireEvent.click(pill as HTMLElement);

    // The entrance delay is expressed in beats, so a slot value left in
    // milliseconds would turn into minutes of `opacity: 0` and read as a dead
    // button. Anything past a second means that happened again.
    const entrance = [
      ...container.querySelectorAll(
        ".ph2-stage-scale .ph2-anim.absolute .ph2-pop-in",
      ),
    ].map((el) => {
      const raw = (el as HTMLElement).style.animationDelay;
      const value = raw.includes("calc(")
        ? raw.slice(raw.indexOf("+") + 1, raw.indexOf("ms)")).trim()
        : raw.replace("ms", "");
      return Number(value);
    });
    expect(entrance.length).toBeGreaterThan(0);
    entrance.forEach((ms) => {
      expect(ms).toBeGreaterThanOrEqual(0);
      expect(ms).toBeLessThan(1000);
    });
  });

  it("pins a dragged window inside the viewport and the stage", () => {
    // Screen space throughout: where the window may be painted.
    const size = { width: 340, height: 400 };
    const bounds = { left: 12, top: 100, right: 1428, bottom: 900 };

    // Inside: untouched.
    expect(clampOffset({ x: 400, y: 400 }, size, bounds)).toEqual({
      x: 400,
      y: 400,
    });

    // Past the right edge: the window's right side stops at the bound, so the
    // visible result is a card flush against the screen with a 12px margin —
    // never half off it.
    const right = clampOffset({ x: 5000, y: 400 }, size, bounds);
    expect(right).toEqual({ x: 1428 - 340, y: 400 });
    expect(right.x + size.width).toBe(bounds.right);

    // Past the left edge, and past the top and bottom of the stage.
    expect(clampOffset({ x: -4000, y: 400 }, size, bounds)).toEqual({
      x: 12,
      y: 400,
    });
    expect(clampOffset({ x: 400, y: -4000 }, size, bounds)).toEqual({
      x: 400,
      y: 100,
    });
    const bottom = clampOffset({ x: 400, y: 5000 }, size, bounds);
    expect(bottom.y + size.height).toBe(bounds.bottom);
  });

  it("a window wider than its bounds pins instead of flipping", () => {
    // Degenerate viewport: the window cannot fit at all. It must sit at the
    // left bound, not be pushed to a negative offset that throws it off-screen.
    const at = clampOffset(
      { x: 500, y: 100 },
      { width: 800, height: 400 },
      { left: 12, top: 0, right: 400, bottom: 700 },
    );
    expect(at).toEqual({ x: 12, y: 100 });
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
    // A slot is two elements: the shell carries the bob and owns the pointer
    // handlers, the box inside it carries the drop position. Events go to the
    // shell; the transform is asserted on the box.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const slots = shells.map((shell) =>
      shell.querySelector<HTMLElement>(".ph2-pop-in > div")!,
    );
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
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(shells[0], { clientX: 450, clientY: 50 });
    fireEvent.pointerUp(shells[0]);
    expect((slots[0] as HTMLElement).style.transform).toContain(
      "translate(440px, 40px)",
    );
    expect((slots[1] as HTMLElement).style.transform).toBe("");
    expect((slots[2] as HTMLElement).style.transform).toBe("");
  });

  it("re-picking-up a placed window does not leap across the stage", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    // A slot is two elements: the shell carries the bob and owns the pointer
    // handlers, the box inside it carries the drop position. Events go to the
    // shell; the transform is asserted on the box.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const slots = shells.map((shell) =>
      shell.querySelector<HTMLElement>(".ph2-pop-in > div")!,
    );
    const scale = container.querySelector(".ph2-stage-scale");
    if (!scale) throw new Error("stage wrapper missing");
    scale.getBoundingClientRect = () =>
      ({
        left: 0,
        right: 1024,
        top: 0,
        bottom: 800,
        width: 1024,
        height: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    // A rect that tracks the placement, the way a real one does: `left` moves
    // with the transform. Getting this wrong is the bug being guarded — the
    // bounds must be read from where the window is painted, not from the
    // translate it is about to be given.
    const LAYOUT_LEFT = 100;
    let placedX = 0;
    slots.forEach((el, i) => {
      if (i !== 0) {
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
        return;
      }
      el.getBoundingClientRect = () => {
        const left = LAYOUT_LEFT + placedX;
        return {
          left,
          right: left + 300,
          top: 0,
          bottom: 400,
          width: 300,
          height: 400,
          x: left,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      };
    });

    // Drag hard right: it pins with its right edge at the bound.
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 150, clientY: 100 });
    fireEvent.pointerMove(shells[0], { clientX: 3000, clientY: 120 });
    const pinned = (slots[0] as HTMLElement).style.transform;
    // Painted left = 1012 - 300 = 712, so the translate is 712 - 100.
    expect(pinned).toBe("translate(612px, 20px)");
    fireEvent.pointerUp(shells[0]);
    placedX = 612;

    // Now pick the same window up again and shove it further right. Its rect
    // already carries the 612px placement, so a clamp that mixed translate and
    // painted space would hand back a large negative offset and the window
    // would jump the width of the stage on the first move.
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 800, clientY: 120 });
    fireEvent.pointerMove(shells[0], { clientX: 3400, clientY: 140 });
    expect((slots[0] as HTMLElement).style.transform).toBe(
      "translate(612px, 40px)",
    );
    fireEvent.pointerUp(shells[0]);

    // And dragging back inboard works normally rather than sticking: the window
    // tracks the pointer by the same 500px, from painted 712 to painted 212.
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 800, clientY: 140 });
    fireEvent.pointerMove(shells[0], { clientX: 300, clientY: 160 });
    expect((slots[0] as HTMLElement).style.transform).toBe(
      "translate(112px, 60px)",
    );
    fireEvent.pointerUp(shells[0]);
  });

  it("brings the most recently grabbed slot to the front", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": true,
    });
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    // Stacking is the shell's concern, and so is the pointer handling.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const z = () =>
      shells.map((shell) => Number((shell as HTMLElement).style.zIndex));

    // Grab the middle slot: it jumps above the rest…
    fireEvent.pointerDown(shells[1], { button: 0, clientX: 410, clientY: 10 });
    fireEvent.pointerUp(shells[1]);
    expect(z()[1]).toBeGreaterThan(z()[0]);
    expect(z()[1]).toBeGreaterThan(z()[2]);

    // …then grabbing the first slot puts that one on top instead.
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerUp(shells[0]);
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
    // A slot is two elements: the shell carries the bob and owns the pointer
    // handlers, the box inside it carries the drop position. Events go to the
    // shell; the transform is asserted on the box.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const slots = shells.map((shell) =>
      shell.querySelector<HTMLElement>(".ph2-pop-in > div")!,
    );
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerUp(shells[0]);
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
    // A slot is two elements: the shell carries the bob and owns the pointer
    // handlers, the box inside it carries the drop position. Events go to the
    // shell; the transform is asserted on the box.
    const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
    const slots = shells.map((shell) =>
      shell.querySelector<HTMLElement>(".ph2-pop-in > div")!,
    );
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
    fireEvent.pointerDown(shells[0], { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(shells[0], { clientX: 2000, clientY: 10 });
    fireEvent.pointerUp(shells[0]);
    expect((slots[0] as HTMLElement).style.transform).toContain(
      "translate(712px, 0px)",
    );
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
          ...container.querySelectorAll(
            ".ph2-stage-scale .ph2-anim.absolute .ph2-stage-card",
          ),
        ].map((el) => Number((el as HTMLElement).dataset.loop));
      // The cadence is derived, so this survives a change to how many cards
      // share the beat.
      const step = loopTickMs(4);
      const tick = async () => {
        await act(async () => {
          vi.advanceTimersByTime(step);
        });
      };

      // Three desktop slots, in slot order: 0 is the conversation, which drives
      // itself and is skipped, so the tick lands on slot 1 first, then 2.
      expect(passes()).toEqual([0, 0, 0]);

      // The assertion is about the *shape* of the beat, not one particular
      // tick: the rotation covers every card that is not running a script,
      // including ones currently closed, so some ticks land where nobody can
      // see them. What must hold is that no tick ever moves two windows at
      // once, and that every visible card does come round again.
      let previous = passes();
      let maxMovedPerTick = 0;
      for (let i = 0; i < 8; i += 1) {
        await tick();
        const now = passes();
        const moved = now.filter(
          (value, index) => value !== previous[index],
        ).length;
        maxMovedPerTick = Math.max(maxMovedPerTick, moved);
        previous = now;
      }
      // One at a time — the whole point of a stagger.
      expect(maxMovedPerTick).toBe(1);
      // Both static windows have restarted at least twice in eight ticks, so
      // nothing is stranded while the scripted one runs its own clock.
      expect(previous[1]).toBeGreaterThanOrEqual(2);
      expect(previous[2]).toBeGreaterThanOrEqual(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives every card its own phase, so no two share a beat", () => {
    const { container } = render(
      <HeroStage dashboard={dashboard} stage={stage} />,
    );
    const phases = [
      ...container.querySelectorAll(
        ".ph2-stage-scale .ph2-anim.absolute .ph2-stage-card",
      ),
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
          ...container.querySelectorAll(
            ".ph2-stage-scale .ph2-anim.absolute .ph2-stage-card",
          ),
        ].map((el) => Number((el as HTMLElement).dataset.loop));
      await act(async () => {
        vi.advanceTimersByTime(loopTickMs(4));
      });
      expect(passes()).toEqual([0, 1, 0]);

      // Focus lands inside the stage: a card being read must not be rewound out
      // from under whoever is tabbing through the hero.
      const pill = container.querySelector("button[aria-pressed]");
      if (!pill) throw new Error("switchboard missing");
      act(() => {
        pill.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
      });
      await act(async () => {
        vi.advanceTimersByTime(loopTickMs(4) * 10);
      });
      expect(passes()).toEqual([0, 1, 0]);

      act(() => {
        pill.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      });
      await act(async () => {
        vi.advanceTimersByTime(loopTickMs(4));
      });
      expect(passes()).toEqual([0, 1, 1]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("holds the loop while a window is being dragged", async () => {
    vi.useFakeTimers();
    try {
      mockMedia({
        "(prefers-reduced-motion: reduce)": false,
        "(pointer: fine)": true,
      });
      const { container } = render(
        <HeroStage dashboard={dashboard} stage={stage} />,
      );
      const passes = () =>
        [
          ...container.querySelectorAll(
            ".ph2-stage-scale .ph2-anim.absolute .ph2-stage-card",
          ),
        ].map((el) => Number((el as HTMLElement).dataset.loop));
      // A slot is two elements: the shell carries the bob and owns the pointer
      // handlers, the box inside it carries the drop position. Events go to the
      // shell; the transform is asserted on the box.
      const shells = [...container.querySelectorAll(".ph2-anim.absolute")];
      const slots = shells.map((shell) =>
        shell.querySelector<HTMLElement>(".ph2-pop-in > div")!,
      );
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

      const before = passes();
      // Pick a card up and keep moving: the loop must not rebuild the body of
      // the thing being moved, which is what juddered the tallest windows.
      fireEvent.pointerDown(shells[1], { button: 0, clientX: 10, clientY: 10 });
      fireEvent.pointerMove(shells[1], { clientX: 200, clientY: 120 });
      await act(async () => {
        vi.advanceTimersByTime(loopTickMs(4) * 10);
      });
      expect(passes()).toEqual(before);

      fireEvent.pointerUp(shells[1]);
      await act(async () => {
        vi.advanceTimersByTime(loopTickMs(4));
      });
      expect(passes()).not.toEqual(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the gallery static under reduced motion", () => {
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
