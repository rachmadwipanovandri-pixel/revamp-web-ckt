import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { CONTENT } from "./content";
import { Nav } from "./Nav";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

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

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    configurable: true,
    writable: true,
  });
}

/** The morph runs inside a rAF, so let one frame pass before reading it back. */
async function scrollTo(value: number) {
  setScrollY(value);
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  });
}

function readProgress(container: HTMLElement) {
  const header = container.querySelector("header");
  return header instanceof HTMLElement
    ? header.style.getPropertyValue("--p")
    : "";
}

describe("preview-home-2 sticky nav morph", () => {
  beforeEach(() => {
    mockReducedMotion(false);
    setScrollY(0);
  });

  it("follows the scroll instead of snapping at a threshold", async () => {
    const { container } = render(<Nav content={CONTENT.id.nav} locale="id" />);

    expect(readProgress(container)).toBe("0.000");

    // Half-way through the 90px ramp the bar is genuinely half-morphed.
    await scrollTo(45);
    expect(readProgress(container)).toBe("0.500");

    await scrollTo(90);
    expect(readProgress(container)).toBe("1.000");

    // Past the ramp it stays pinned, and scrolling back reverses it.
    await scrollTo(600);
    expect(readProgress(container)).toBe("1.000");

    await scrollTo(9);
    expect(readProgress(container)).toBe("0.100");
  });

  it("snaps instead of following the scroll when motion is reduced", async () => {
    mockReducedMotion(true);
    const { container } = render(<Nav content={CONTENT.id.nav} locale="id" />);

    // Below the 24px threshold it stays put; the ramp would have given 0.111.
    await scrollTo(10);
    expect(readProgress(container)).toBe("0.000");

    // Above it, it jumps straight to the end; the ramp would have given 0.500.
    await scrollTo(45);
    expect(readProgress(container)).toBe("1.000");
  });
});
