import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { TextMotion } from "./TextMotion";

/**
 * Cover for the heading that never comes back.
 *
 * The failure this component exists to avoid is a heading stranded at
 * `opacity: 0` — copy that is in the DOM, in the accessibility tree, and
 * invisible. `useReveal` measured 11 of 37 such strands on this page before it
 * added the rect test; the same reasoning applies here, so the same cases get
 * driven directly.
 *
 * jsdom has no layout, so every rect is supplied by the test: that is also how
 * the interesting cases are *produced*. "The observer never fires" is not a
 * simulation of a bug, it is the stub simply not calling back — which is
 * exactly what happens to an element scrolled past between two samples.
 */

type Stub = {
  /** Elements passed to `observe`, in order. */
  observed: Element[];
  disconnected: number;
  /** Fire the callback as if `target` had become intersecting. */
  emit: (target: Element) => void;
};

let stub: Stub;
let ioCallback: IntersectionObserverCallback | null = null;

beforeEach(() => {
  ioCallback = null;
  stub = { observed: [], disconnected: 0, emit: () => {} };

  class StubIO {
    constructor(cb: IntersectionObserverCallback) {
      ioCallback = cb;
    }
    observe(el: Element) {
      stub.observed.push(el);
    }
    unobserve() {}
    disconnect() {
      stub.disconnected += 1;
    }
    takeRecords() {
      return [];
    }
  }

  stub.emit = (target) => {
    if (!ioCallback) return;
    ioCallback(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      null as unknown as IntersectionObserver,
    );
  };

  vi.stubGlobal(
    "IntersectionObserver",
    StubIO as unknown as typeof IntersectionObserver,
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  cleanup();
});

/**
 * A hidden document does not run the rendering steps that scroll events and
 * IntersectionObserver callbacks are queued off, and it does not advance CSS
 * animations either. Both facts are load-bearing here, and both were measured
 * on this page rather than assumed: a programmatic scroll released none of the
 * 40 armed blocks, and `currentTime` sat at 0 across 700ms of wall clock.
 */
function setVisibility(state: "visible" | "hidden") {
  vi.spyOn(document, "visibilityState", "get").mockReturnValue(state);
  vi.spyOn(document, "hidden", "get").mockReturnValue(state === "hidden");
}

/** jsdom has no layout, so the rect has to be supplied by the test. */
function stubRect(el: Element, top: number, height = 100) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + height,
    height,
    width: 300,
    left: 0,
    right: 300,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

/**
 * Dispatch a scroll and let the rAF-throttled rect sweep run. The sweep queued
 * first, so it runs before the frame awaited here.
 */
async function scroll() {
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

const vh = () => window.innerHeight;

/**
 * Mount only the page root, so rects can be stubbed *before* `TextMotion` is
 * rendered — its effect runs during render, and measuring an unstubbed jsdom
 * box would report every heading as already on screen. Each test therefore
 * ends with `render(<TextMotion />)`.
 */
function mount({ blocks = 2 }: { blocks?: number } = {}) {
  render(
    <div className="ph2-root">
      {Array.from({ length: blocks }, (_, i) => (
        <div key={i} data-testid={`b${i}`} data-ph2-split="" />
      ))}
    </div>,
  );
}

describe("preview-home-2 TextMotion", () => {
  it("arms only the headings still ahead of the visitor", () => {
    mount();
    const visible = screen.getByTestId("b0");
    const ahead = screen.getByTestId("b1");

    stubRect(visible, 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);

    // Already readable: left exactly as rendered, so it can neither hide nor
    // flash the copy the visitor is looking at.
    expect(visible).not.toHaveAttribute("data-ph2-armed");
    expect(ahead).toHaveAttribute("data-ph2-armed", "true");
    expect(ahead).not.toHaveAttribute("data-ph2-in");
  });

  it("observes the armed headings and reveals them on intersection", () => {
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);

    expect(stub.observed).toEqual([ahead]);

    act(() => stub.emit(ahead));

    expect(ahead).toHaveAttribute("data-ph2-in", "true");
    // Everything has arrived, so the listeners are torn down rather than left
    // sweeping the document for the rest of the session.
    expect(stub.disconnected).toBeGreaterThan(0);
  });

  it("reveals a jumped-past heading when the observer never fires", async () => {
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);
    expect(ahead).toHaveAttribute("data-ph2-armed", "true");

    // The whole regression: one frame takes it from below the viewport to
    // above it, so the observer sees "not intersecting" at both samples and
    // never reports a transition. Its rect now sits above the top of the
    // screen — the sweep must still release it.
    stubRect(ahead, -400);
    await scroll();

    expect(ahead).toHaveAttribute("data-ph2-in", "true");
  });

  it("reveals a heading scrolled into view while the observer stays silent", async () => {
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);

    stubRect(ahead, vh() - 200);
    await scroll();

    expect(ahead).toHaveAttribute("data-ph2-in", "true");
  });

  it("hands the armed state back the moment it reveals a block", async () => {
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);
    expect(ahead).toHaveAttribute("data-ph2-armed", "true");

    stubRect(ahead, vh() - 200);
    await scroll();

    // The hiding rule is over, not merely outranked. `opacity: 0` there is an
    // ordinary declaration, so an entrance that has to keep beating it for the
    // rest of the session is one missed detail away from stranding the copy
    // again — which is exactly how the page shipped: the keyframe's implicit
    // `to` was read back off this very rule and every entrance ran 0 → 0.
    expect(ahead).not.toHaveAttribute("data-ph2-armed");
    expect(ahead).toHaveAttribute("data-ph2-in", "true");
  });

  it("keeps a heading hidden while it is still below the viewport", async () => {
    mount();
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(screen.getByTestId("b1"), vh() + 500);
    render(<TextMotion />);

    await scroll();

    expect(screen.getByTestId("b1")).toHaveAttribute("data-ph2-armed", "true");
    expect(screen.getByTestId("b1")).not.toHaveAttribute("data-ph2-in");
  });

  it("measures a heading inside a content-visibility band by the band", () => {
    render(
      <div className="ph2-root">
        <div data-testid="band" data-defer="true">
          <div data-testid="inside" data-ph2-split="" />
        </div>
      </div>,
    );
    const inside = screen.getByTestId("inside");

    // The band has not laid out its contents, so the heading reports an empty
    // box at the band's origin — which would read as "at the top of the
    // viewport" and silently skip the animation for half the page.
    stubRect(inside, 0, 0);
    stubRect(screen.getByTestId("band"), vh() + 500, 620);
    render(<TextMotion />);

    expect(inside).toHaveAttribute("data-ph2-armed", "true");
  });

  it("does not arm a band that is already on screen", () => {
    render(
      <div className="ph2-root">
        <div data-testid="band" data-defer="true">
          <div data-testid="inside" data-ph2-split="" />
        </div>
      </div>,
    );
    const inside = screen.getByTestId("inside");

    stubRect(inside, 0, 0);
    stubRect(screen.getByTestId("band"), 100, 620);
    render(<TextMotion />);

    expect(inside).not.toHaveAttribute("data-ph2-armed");
  });

  it("touches nothing at all under reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    } as MediaQueryList);

    mount();
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(screen.getByTestId("b1"), vh() + 500);
    render(<TextMotion />);

    expect(screen.getByTestId("b1")).not.toHaveAttribute("data-ph2-armed");
    expect(stub.observed).toEqual([]);
  });

  it("hands the DOM back in its resting state on unmount", () => {
    mount();
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(screen.getByTestId("b1"), vh() + 500);
    const view = render(<TextMotion />);

    const ahead = screen.getByTestId("b1");
    expect(ahead).toHaveAttribute("data-ph2-armed", "true");

    view.unmount();

    expect(ahead).not.toHaveAttribute("data-ph2-armed");
    expect(ahead).not.toHaveAttribute("data-ph2-in");
  });
});

/**
 * The other two entrances ported from /preview-home-3's `Motion3`.
 *
 * A heading is one kind of block; cards, rows and hairlines are the rest of the
 * page, and they are where the stranding bug would do the most damage — a grid
 * of four armed cards is four invisible things, not one. The stagger index is
 * covered separately because it is the one piece of state written by JS rather
 * than read from the DOM, so it is the one that can be wrong without anything
 * looking broken until the reveal starts.
 */
describe("preview-home-2 TextMotion — enter and rule", () => {
  /** Three cards in one grid, plus a hairline further down the page. */
  function mountFurniture() {
    render(
      <div className="ph2-root">
        <div data-testid="grid">
          <div data-testid="c0" data-ph2-enter="" />
          <div data-testid="c1" data-ph2-enter="" />
          <div data-testid="c2" data-ph2-enter="" />
        </div>
        <div data-testid="rule" data-ph2-rule="" />
      </div>,
    );
  }

  const staggerOf = (id: string) =>
    screen.getByTestId(id).style.getPropertyValue("--ph2-i");

  it("arms blocks and rules that are still ahead of the visitor", () => {
    mountFurniture();
    for (const id of ["c0", "c1", "c2", "rule"]) {
      stubRect(screen.getByTestId(id), vh() + 500);
    }
    render(<TextMotion />);

    for (const id of ["c0", "c1", "c2", "rule"]) {
      expect(screen.getByTestId(id)).toHaveAttribute("data-ph2-armed", "true");
      expect(screen.getByTestId(id)).not.toHaveAttribute("data-ph2-in");
    }
  });

  it("staggers armed siblings and gives an already-visible one no slot", () => {
    mountFurniture();
    // c0 is already readable, so it neither hides nor takes index 0: counting
    // it would park c1 at index 1 and make the first card that actually moves
    // wait 80ms for a card nothing is happening to.
    stubRect(screen.getByTestId("c0"), 100);
    stubRect(screen.getByTestId("c1"), vh() + 500);
    stubRect(screen.getByTestId("c2"), vh() + 500);
    stubRect(screen.getByTestId("rule"), vh() + 500);
    render(<TextMotion />);

    expect(screen.getByTestId("c0")).not.toHaveAttribute("data-ph2-armed");
    expect(staggerOf("c0")).toBe("");
    expect(staggerOf("c1")).toBe("0");
    expect(staggerOf("c2")).toBe("1");
    // A rule is not part of a stagger group — it is its own gesture.
    expect(staggerOf("rule")).toBe("");
  });

  it("reveals both kinds and leaves the stagger index in place", async () => {
    mountFurniture();
    for (const id of ["c0", "c1", "c2", "rule"]) {
      stubRect(screen.getByTestId(id), vh() + 500);
    }
    render(<TextMotion />);

    // One jump takes every block past the viewport, so the observer never fires
    // for any of them — the rect sweep has to release the whole set.
    for (const id of ["c0", "c1", "c2", "rule"]) {
      stubRect(screen.getByTestId(id), -400);
    }
    await scroll();

    for (const id of ["c0", "c1", "c2", "rule"]) {
      expect(screen.getByTestId(id)).toHaveAttribute("data-ph2-in", "true");
    }
    // The CSS delay reads it during the animation, so the reveal must not clear
    // it — teardown is where it goes. All three were armed here, so the
    // indices are 0/1/2 in DOM order.
    expect(staggerOf("c1")).toBe("1");
    expect(staggerOf("c2")).toBe("2");
  });

  it("hands blocks and rules back to their resting state on unmount", () => {
    mountFurniture();
    for (const id of ["c0", "c1", "c2", "rule"]) {
      stubRect(screen.getByTestId(id), vh() + 500);
    }
    const view = render(<TextMotion />);

    expect(staggerOf("c2")).toBe("2");

    view.unmount();

    for (const id of ["c0", "c1", "c2", "rule"]) {
      const el = screen.getByTestId(id);
      expect(el).not.toHaveAttribute("data-ph2-armed");
      expect(el).not.toHaveAttribute("data-ph2-in");
    }
    expect(staggerOf("c2")).toBe("");
  });
});

describe("preview-home-2 TextMotion — hidden document", () => {
  it("reveals the copy without the entrance when the animation cannot run", async () => {
    setVisibility("hidden");
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);

    stubRect(ahead, vh() - 200);
    await scroll();

    // Writing `data-ph2-in` here would pin the block at its keyframe `from`
    // state, because a hidden document never advances the animation. Revealing
    // it that way would hide the very copy the reveal exists to show, so the
    // gesture is dropped and the resting — visible — style stands instead.
    expect(ahead).not.toHaveAttribute("data-ph2-armed");
    expect(ahead).not.toHaveAttribute("data-ph2-in");
  });

  it("keeps sweeping on a timer when no event will ever fire", () => {
    vi.useFakeTimers();
    setVisibility("hidden");
    mount();
    const ahead = screen.getByTestId("b1");
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(ahead, vh() + 500);
    render(<TextMotion />);

    // No scroll event and no observer callback — a hidden document dispatches
    // neither, so the timer is the only path left between "armed" and "shown".
    stubRect(ahead, vh() - 200);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(ahead).not.toHaveAttribute("data-ph2-armed");
  });

  it("never starts a poll when there is nothing pending", () => {
    vi.useFakeTimers();
    setVisibility("hidden");
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    mount();
    // Already on screen, so it is never armed and never pending: a background
    // tab must not be left holding a timer for a page with nothing to reveal.
    stubRect(screen.getByTestId("b0"), 100);
    stubRect(screen.getByTestId("b1"), 100);
    render(<TextMotion />);

    expect(setIntervalSpy).not.toHaveBeenCalled();
  });
});
