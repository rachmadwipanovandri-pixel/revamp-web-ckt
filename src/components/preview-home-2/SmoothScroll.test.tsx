import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { SmoothScroll } from "./SmoothScroll";

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

describe("preview-home-2 smooth scroll", () => {
  it("renders nothing and loads nothing under reduced motion", () => {
    mockMedia({ "(prefers-reduced-motion: reduce)": true });
    const { container } = render(<SmoothScroll />);
    expect(container).toBeEmptyDOMElement();
    expect(window.__ph2Lenis).toBeUndefined();
    vi.restoreAllMocks();
  });

  it("renders nothing and loads nothing on coarse pointers", () => {
    mockMedia({
      "(prefers-reduced-motion: reduce)": false,
      "(pointer: fine)": false,
    });
    const { container } = render(<SmoothScroll />);
    expect(container).toBeEmptyDOMElement();
    expect(window.__ph2Lenis).toBeUndefined();
    vi.restoreAllMocks();
  });
});
