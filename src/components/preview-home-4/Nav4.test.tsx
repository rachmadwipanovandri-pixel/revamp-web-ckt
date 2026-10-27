import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { CONTENT } from "@/components/preview-home-2/content";
import { Nav4 } from "./Nav4";

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

describe("preview-home-4 sticky nav morph", () => {
  beforeEach(() => {
    mockReducedMotion(false);
    setScrollY(0);
  });

  it("follows the scroll instead of snapping at a threshold", async () => {
    const { container } = render(<Nav4 content={CONTENT.id.nav} locale="id" />);

    expect(readProgress(container)).toBe("0.000");

    await scrollTo(45);
    expect(readProgress(container)).toBe("0.500");

    await scrollTo(600);
    expect(readProgress(container)).toBe("1.000");

    await scrollTo(9);
    expect(readProgress(container)).toBe("0.100");
  });

  it("snaps instead of following the scroll when motion is reduced", async () => {
    mockReducedMotion(true);
    const { container } = render(<Nav4 content={CONTENT.id.nav} locale="id" />);

    await scrollTo(10);
    expect(readProgress(container)).toBe("0.000");

    await scrollTo(45);
    expect(readProgress(container)).toBe("1.000");
  });

  it("keeps the locale switcher on this draft's routes", () => {
    const { container } = render(<Nav4 content={CONTENT.id.nav} locale="id" />);

    const hrefs = Array.from(container.querySelectorAll("a")).map(
      (a) => a.getAttribute("href") ?? "",
    );
    expect(hrefs).toContain("/preview-home-4");
    expect(hrefs).toContain("/en/preview-home-4");
    expect(hrefs).not.toContain("/preview-home-2");
  });

  it("opens the mega panel with real aria wiring, and Escape closes it", async () => {
    const { container } = render(<Nav4 content={CONTENT.id.nav} locale="id" />);

    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-controls^="ph4-mega-"]',
    );
    expect(trigger).not.toBeNull();

    await act(async () => {
      trigger!.click();
    });
    expect(trigger!.getAttribute("aria-expanded")).toBe("true");
    expect(
      container.querySelector(`#${trigger!.getAttribute("aria-controls")}`),
    ).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });
    expect(trigger!.getAttribute("aria-expanded")).toBe("false");
    expect(
      container.querySelector(`#${trigger!.getAttribute("aria-controls")}`),
    ).toBeNull();
  });
});
