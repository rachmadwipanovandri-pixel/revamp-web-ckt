import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { StatCounter } from "./stat-counter";

describe("StatCounter", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0%", () => {
    render(
      <StatCounter
        target={30}
        label="Peningkatan closing rate"
        durationMs={1000}
      />,
    );
    expect(screen.getByText("Peningkatan closing rate")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("counts up to the target value once the duration has elapsed", () => {
    render(
      <StatCounter
        target={30}
        label="Peningkatan closing rate"
        durationMs={1000}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByText("30%")).toBeInTheDocument();
  });
});
