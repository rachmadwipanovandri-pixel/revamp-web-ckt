import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { useRef } from "react";
import { useReveal } from "./use-reveal";

/**
 * Regression cover for the reveal that never fires.
 *
 * The bug: IntersectionObserver reports *transitions*. An element that moves
 * from fully below the viewport to fully above it between two delivered frames
 * is "not intersecting" at both samples, so no callback ever runs and the
 * reveal stays at `opacity: 0` forever — the copy is simply gone. Measured on
 * /preview-home-2, 11 of 37 reveals stayed invisible after a scripted scroll
 * down the page while the observer had correctly observed nothing.
 *
 * jsdom cannot produce this naturally — it has no layout engine and no viewport
 * — so each test drives the hook directly: a stub observer that records what it
 * was asked to watch and never calls back, which is exactly the situation a
 * jumped-past element is in.
 */

type Stub = {
  /** Elements passed to `observe`, in order. */
  observed: Element[];
  disconnected: number;
  /** Fire the callback as if `entry` had become intersecting. */
  emit: (isIntersecting: boolean) => void;
  restore: () => void;
};

let stub: Stub;

beforeEach(() => {
  const original = globalThis.IntersectionObserver;
  const callbackRef: { cb: IntersectionObserverCallback | null } = {
    cb: null,
  };

  class StubIO {
    constructor(cb: IntersectionObserverCallback) {
      callbackRef.cb = cb;
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

  stub = {
    observed: [],
    disconnected: 0,
    emit: (isIntersecting) => {
      const cb = callbackRef.cb;
      if (!cb) return;
      cb(
        [{ isIntersecting } as IntersectionObserverEntry],
        null as unknown as IntersectionObserver,
      );
    },
    restore: () => {
      globalThis.IntersectionObserver = original;
    },
  };

  globalThis.IntersectionObserver =
    StubIO as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  stub?.restore();
  cleanup();
  vi.restoreAllMocks();
});

function Probe({ amount = 0.15 }: { amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useReveal(ref, amount);
  return (
    <div ref={ref} data-testid="target" data-revealed={String(revealed)}>
      content
    </div>
  );
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
 * Dispatch a scroll and let the hook's rAF-guarded rect check run.
 *
 * The hook throttles the rect read behind one `requestAnimationFrame`, so the
 * test has to yield a frame for it. The hook's own frame is queued first, so it
 * runs before the one awaited here.
 */
async function scroll() {
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

/** The no-IntersectionObserver fallback is a `setTimeout(…, 0)`. */
async function flushMacrotask() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

const viewportHeight = () => window.innerHeight;

describe("useReveal", () => {
  it("stays hidden while the element is still below the viewport", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");
    stubRect(el, viewportHeight() + 500);

    await scroll();

    expect(el).toHaveAttribute("data-revealed", "false");
  });

  it("reveals on an intersection callback", () => {
    render(<Probe />);
    const el = screen.getByTestId("target");
    stubRect(el, viewportHeight() + 500);

    act(() => stub.emit(true));

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("reveals when the element is jumped past and the observer never fires", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");

    // The whole regression: the observer saw this element but never reported a
    // transition, because it went from below the viewport to above it in one
    // frame. Its rect is now above the top of the screen.
    stubRect(el, -400);
    expect(stub.observed).toContain(el);

    await scroll();

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("reveals when scrolled to while the observer stays silent", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");

    stubRect(el, viewportHeight() - 200);
    await scroll();

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("reveals an element already inside the first viewport at mount", () => {
    render(<Probe />);
    const el = screen.getByTestId("target");
    // Above the fold before any scroll event can happen.
    stubRect(el, 100);

    act(() => {
      stub.emit(true);
    });

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("treats an un-laid-out subtree as revealed rather than leaving it hidden", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");
    // `content-visibility: auto` reports a zero-height box for skipped
    // subtrees. Content that never appears is the failure this hook exists to
    // prevent, so the zero case resolves to visible.
    stubRect(el, 0, 0);

    await scroll();

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("latches: it does not reset when scrolled back up", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");

    stubRect(el, viewportHeight() - 200);
    await scroll();
    expect(el).toHaveAttribute("data-revealed", "true");

    stubRect(el, -400);
    await scroll();

    expect(el).toHaveAttribute("data-revealed", "true");
  });

  it("stops observing and unlistens once revealed", async () => {
    render(<Probe />);
    const el = screen.getByTestId("target");
    stubRect(el, 100);

    act(() => stub.emit(true));
    expect(stub.disconnected).toBeGreaterThan(0);

    // A further scroll must not re-run the check against a torn-down element.
    const before = stub.disconnected;
    await scroll();
    expect(stub.disconnected).toBe(before);
  });

  it("falls back to visible when IntersectionObserver is unavailable", async () => {
    // @ts-expect-error — deliberately removing the global to exercise the path.
    delete globalThis.IntersectionObserver;
    render(<Probe />);
    const el = screen.getByTestId("target");

    // The fallback is a deferred setState, so flush it.
    await flushMacrotask();

    expect(el).toHaveAttribute("data-revealed", "true");
  });
});
