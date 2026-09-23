import { describe, it, expect } from "vitest";
import {
  onTrackerReady,
  onTrackerReadyIdle,
  onUserInteraction,
  TRACKER_FALLBACK_MS,
} from "./defer-third-party";

const BOOT = `w.__ok=1;`;

describe("onTrackerReady", () => {
  it("uses a long enough fallback to stay out of Lighthouse early TBT", () => {
    expect(TRACKER_FALLBACK_MS).toBeGreaterThanOrEqual(8000);
    expect(TRACKER_FALLBACK_MS).toBeLessThanOrEqual(10000);
  });

  it("inlines the start body", () => {
    const src = onTrackerReady(BOOT);
    expect(src).toContain("w.__ok=1;");
  });

  it("listens for real user interactions", () => {
    const src = onTrackerReady(BOOT);
    expect(src).toContain('"pointerdown"');
    expect(src).toContain('"keydown"');
    expect(src).toContain('"scroll"');
  });

  it("falls back after the timeout when there is no interaction", () => {
    const src = onTrackerReady(BOOT);
    expect(src).toContain(`w.setTimeout(run,${TRACKER_FALLBACK_MS})`);
  });

  it("uses a custom fallback when provided", () => {
    const src = onTrackerReady(BOOT, 1500);
    expect(src).toContain("w.setTimeout(run,1500)");
  });

  it("clamps invalid fallback values to the default", () => {
    expect(onTrackerReady(BOOT, -1)).toContain(
      `w.setTimeout(run,${TRACKER_FALLBACK_MS})`,
    );
    expect(onTrackerReady(BOOT, Number.NaN)).toContain(
      `w.setTimeout(run,${TRACKER_FALLBACK_MS})`,
    );
  });

  it("also loads on pagehide and when the tab becomes hidden", () => {
    const src = onTrackerReady(BOOT);
    expect(src).toContain('w.addEventListener("pagehide",run)');
    expect(src).toContain('d.addEventListener("visibilitychange",onVis)');
    expect(src).toContain('d.visibilityState==="hidden"');
  });

  it("runs start at most once and tears down listeners", () => {
    const src = onTrackerReady(BOOT);
    expect(src).toContain("if(done)return;");
    expect(src).toContain("w.clearTimeout(timer)");
    expect(src).toContain("removeEventListener");
  });
});

describe("onTrackerReadyIdle", () => {
  it("defers normal loads to requestIdleCallback but boots immediately on hide", () => {
    const src = onTrackerReadyIdle(BOOT);
    expect(src).toContain("requestIdleCallback");
    expect(src).toContain("w.__ok=1;");
    expect(src).toContain("function onHide(){boot(true);}");
    expect(src).toContain(`w.setTimeout(run,${TRACKER_FALLBACK_MS})`);
  });

  it("falls back to setTimeout when requestIdleCallback is missing", () => {
    const src = onTrackerReadyIdle(BOOT);
    expect(src).toContain("if(immediate||!w.requestIdleCallback){go();return;}");
  });
});

describe("onUserInteraction", () => {
  it("is an alias of onTrackerReady", () => {
    expect(onUserInteraction).toBe(onTrackerReady);
  });
});
