import { describe, expect, it } from "vitest";
import { resolveActiveStep } from "./HowItWorks";

/**
 * Geometry mirrors the real band: five 144px cards, 20px gaps (164px pitch),
 * 1000px viewport. `topsAt(y)` returns each card's viewport-relative top at a
 * given scroll position, exactly what `getBoundingClientRect().top` reports.
 */
const PITCH = 164;
const BASE = 3000;
const VH = 1000;

const topsAt = (y: number) =>
  Array.from({ length: 5 }, (_, i) => BASE + i * PITCH - y);

describe("preview-home-2 step scrollspy", () => {
  it("walks 0→4 monotonically on a continuous downward scroll", () => {
    const seen: number[] = [];
    let last = -1;
    // 1px steps: finer than any real scroll, so any flap would show.
    for (let y = 0; y <= 2000; y += 1) {
      const next = resolveActiveStep(topsAt(y), true, VH);
      if (next !== last) {
        seen.push(next);
        last = next;
      }
    }
    expect(seen).toEqual([0, 1, 2, 3, 4]);
  });

  it("walks 4→0 monotonically on a continuous upward scroll", () => {
    const seen: number[] = [];
    let last = -1;
    for (let y = 2000; y >= 0; y -= 1) {
      const next = resolveActiveStep(topsAt(y), false, VH);
      if (next !== last) {
        seen.push(next);
        last = next;
      }
    }
    expect(seen).toEqual([4, 3, 2, 1, 0]);
  });

  it("never flaps under ±3px jitter around a boundary", () => {
    // Card 2's top crosses the downward line (524) at y = BASE + PITCH - 524.
    const boundary = BASE + PITCH - (VH / 2 + 24);
    const results = new Set<number>();
    for (let i = 0; i < 40; i++) {
      const y = boundary + (i % 2 === 0 ? 3 : -3);
      results.add(resolveActiveStep(topsAt(y), true, VH));
    }
    // Settles on one side or the other — never alternates step per call.
    // (With direction held constant the answer is a pure function of y, so a
    // 6px oscillation can straddle at most one boundary, deterministically.)
    expect(results.size).toBeLessThanOrEqual(2);
    const seq = Array.from({ length: 40 }, (_, i) =>
      resolveActiveStep(topsAt(boundary + (i % 2 === 0 ? 3 : -3)), true, VH),
    );
    const flips = seq.slice(1).filter((v, i) => v !== seq[i]).length;
    // Even straddling the boundary, jitter must not flap every frame the way
    // the ratio-sort did (1→2→1→3→2). At most it rests on either side.
    expect(flips).toBeLessThanOrEqual(1);
  });

  it("a fast jump lands directly on the right step", () => {
    expect(resolveActiveStep(topsAt(0), true, VH)).toBe(0);
    expect(resolveActiveStep(topsAt(1200), true, VH)).toBe(4);
    expect(resolveActiveStep(topsAt(600), true, VH)).toBe(2);
  });

  it("upward hysteresis waits for the lower line", () => {
    // Card 1's top at the upward line (476) → y boundary.
    const yAtUpLine = BASE - (VH / 2 - 24);
    // Scrolling up with the card just above the *downward* line still holds 1.
    expect(resolveActiveStep(topsAt(yAtUpLine - 10), false, VH)).toBe(1);
    // Past the upward line going up, it releases to 0.
    expect(resolveActiveStep(topsAt(yAtUpLine + 60), false, VH)).toBe(0);
  });
});
