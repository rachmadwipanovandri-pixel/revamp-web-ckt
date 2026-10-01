import { describe, expect, it } from "vitest";
import { resolveActiveStep } from "./HowItWorks";

/**
 * Geometry mirrors the real band: five 144px cards, 20px gaps (164px pitch),
 * 1000px viewport. `topsAt(y)` returns each card's viewport-relative top at a
 * given scroll position, exactly what `getBoundingClientRect().top` reports.
 *
 * Card 0's top crosses the advance line (524) at y = 2476, so sweeps run
 * y = 2000→3600 (down) and back (up).
 */
const PITCH = 164;
const BASE = 3000;
const VH = 1000;

const topsAt = (y: number) =>
  Array.from({ length: 5 }, (_, i) => BASE + i * PITCH - y);

/** Simulates the component loop: state carried across samples, like activeRef. */
function sweep(ys: number[]): number[] {
  let state = 0;
  return ys.map((y) => {
    state = resolveActiveStep(topsAt(y), state, VH);
    return state;
  });
}

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  if (step > 0) for (let y = from; y <= to; y += step) out.push(y);
  else for (let y = from; y >= to; y += step) out.push(y);
  return out;
};

describe("preview-home-2 step scrollspy", () => {
  it("walks 0→4 monotonically on a continuous downward scroll", () => {
    const seq = sweep(range(2000, 3600, 1));
    const changes = seq.filter((v, i) => i === 0 || v !== seq[i - 1]);
    expect(changes).toEqual([0, 1, 2, 3, 4]);
  });

  it("walks 4→0 monotonically on a continuous upward scroll", () => {
    // Pre-roll to the bottom first, the way a real visitor arrives there.
    const down = sweep(range(2000, 3600, 1));
    const state = down[down.length - 1];
    expect(state).toBe(4);
    let s = state;
    const changes: number[] = [s];
    for (const y of range(3600, 2000, -1)) {
      const next = resolveActiveStep(topsAt(y), s, VH);
      if (next !== s) {
        changes.push(next);
        s = next;
      }
    }
    expect(changes).toEqual([4, 3, 2, 1, 0]);
  });

  it("never flaps under jitter while trending down", () => {
    // The reported bug: 1→2→1→3→2 on one downward scroll. ±2px noise with
    // occasional stalls, fed through carried state exactly like the component.
    const ys: number[] = [];
    for (let k = 0; k < 900; k++) {
      ys.push(2000 + k * 2 + ((k * 37) % 5) - 2);
    }
    const seq = sweep(ys);
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).toBeGreaterThanOrEqual(seq[i - 1]);
    }
    expect(seq[0]).toBe(0);
    expect(seq[seq.length - 1]).toBe(4);
    expect(new Set(seq)).toEqual(new Set([0, 1, 2, 3, 4]));
  });

  it("never flaps under jitter while trending up", () => {
    let s = 4;
    const ys: number[] = [];
    for (let k = 0; k < 900; k++) {
      ys.push(3600 - k * 2 - (((k * 37) % 5) - 2));
    }
    const seq = ys.map((y) => {
      s = resolveActiveStep(topsAt(y), s, VH);
      return s;
    });
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).toBeLessThanOrEqual(seq[i - 1]);
    }
    expect(seq[seq.length - 1]).toBe(0);
  });

  it("a fast jump lands directly on the right step", () => {
    expect(resolveActiveStep(topsAt(2000), 0, VH)).toBe(0);
    expect(resolveActiveStep(topsAt(2900), 0, VH)).toBe(2);
    expect(resolveActiveStep(topsAt(3400), 2, VH)).toBe(4);
    expect(resolveActiveStep(topsAt(2100), 4, VH)).toBe(0);
  });

  it("the 48px dead zone holds state on both sides of a boundary", () => {
    // Card 2's top at 550: inside (524, 572], i.e. short of the advance line
    // going down and short of the retreat line going up. Both states hold.
    const tops = topsAt(BASE + 2 * PITCH - 550);
    expect(tops[2]).toBe(550);
    expect(resolveActiveStep(tops, 1, VH)).toBe(1);
    expect(resolveActiveStep(tops, 2, VH)).toBe(2);
    // At 520 the advance line (524) is crossed: step 1 promotes…
    const fwd = topsAt(BASE + 2 * PITCH - 520);
    expect(resolveActiveStep(fwd, 1, VH)).toBe(2);
    // …and at 580 the retreat line (572) is crossed: step 2 releases…
    const back = topsAt(BASE + 2 * PITCH - 580);
    expect(resolveActiveStep(back, 2, VH)).toBe(1);
    // …while that same position from step 1 still holds 1.
    expect(resolveActiveStep(back, 1, VH)).toBe(1);
  });
});
