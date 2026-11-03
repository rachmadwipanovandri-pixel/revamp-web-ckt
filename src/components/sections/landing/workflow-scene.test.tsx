import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { WorkflowScene } from "./workflow-scene";

const motion = vi.hoisted(() => ({
  enter: { play: vi.fn(), pause: vi.fn() },
  float: { play: vi.fn(), pause: vi.fn() },
  revert: vi.fn(),
  from: vi.fn(),
  to: vi.fn(),
}));
vi.mock("gsap", () => ({ gsap: {
  context: (callback: () => void) => { callback(); return { revert: motion.revert }; },
  from: motion.from,
  to: motion.to,
} }));

let intersection: IntersectionObserverCallback;
let reduced: boolean;
let hidden: boolean;
let disconnect: ReturnType<typeof vi.fn>;
let preferenceListeners: Set<() => void>;

beforeEach(() => {
  vi.clearAllMocks();
  motion.from.mockReturnValue(motion.enter);
  motion.to.mockReturnValue(motion.float);
  reduced = false;
  hidden = false;
  disconnect = vi.fn();
  preferenceListeners = new Set();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect = disconnect;
  });
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    get matches() { return reduced; }, media: query,
    addEventListener: (_event: string, callback: () => void) => preferenceListeners.add(callback),
    removeEventListener: (_event: string, callback: () => void) => preferenceListeners.delete(callback),
  } as unknown as MediaQueryList));
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
});

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function scene(image: string) {
  return render(<NextIntlClientProvider locale="en" messages={{}}>
    <WorkflowScene image={image} imageAlt="Product illustration" />
  </NextIntlClientProvider>);
}
function visible(value: boolean) {
  act(() => intersection([{ isIntersecting: value } as IntersectionObserverEntry], {} as IntersectionObserver));
}
function preference(value: boolean) {
  act(() => { reduced = value; preferenceListeners.forEach((listener) => listener()); });
}

describe.each([
  ["inbox artwork", "/images/home/hero-dashboard.png"],
  ["native coverage", "/images/home/ai-working-hours.png"],
])("%s motion lifecycle", (_name, image) => {
  it("starts only in view and pauses both entrance and floating motion offscreen", async () => {
    scene(image);
    expect(motion.from).not.toHaveBeenCalled();
    visible(true);
    await waitFor(() => expect(motion.to).toHaveBeenCalledOnce());
    visible(false);
    expect(motion.enter.pause).toHaveBeenCalledOnce();
    expect(motion.float.pause).toHaveBeenCalledOnce();
    visible(true);
    expect(motion.enter.play).toHaveBeenCalledOnce();
    expect(motion.float.play).toHaveBeenCalledOnce();
  });

  it("bypasses reduced motion and reverts to the static state when it changes at runtime", async () => {
    reduced = true;
    const { container } = scene(image);
    visible(true);
    expect(motion.to).not.toHaveBeenCalled();
    preference(false);
    await waitFor(() => expect(motion.to).toHaveBeenCalledOnce());
    const root = container.querySelector<HTMLElement>(".workflow-scene")!;
    root.style.setProperty("--pointer-x", "4px");
    preference(true);
    expect(motion.revert).toHaveBeenCalledOnce();
    expect(root.style.getPropertyValue("--pointer-x")).toBe("0px");
  });

  it("pauses on document visibility changes", async () => {
    scene(image);
    visible(true);
    await waitFor(() => expect(motion.to).toHaveBeenCalledOnce());
    act(() => { hidden = true; document.dispatchEvent(new Event("visibilitychange")); });
    expect(motion.enter.pause).toHaveBeenCalledOnce();
    expect(motion.float.pause).toHaveBeenCalledOnce();
    act(() => { hidden = false; document.dispatchEvent(new Event("visibilitychange")); });
    expect(motion.float.play).toHaveBeenCalledOnce();
  });

  it("reverts motion on pause and removes observers/listeners on unmount", async () => {
    const { unmount } = scene(image);
    visible(true);
    await waitFor(() => expect(motion.to).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
    expect(motion.revert).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(preferenceListeners.size).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
    visible(true);
    await waitFor(() => expect(motion.to).toHaveBeenCalledTimes(2));
    unmount();
    expect(motion.revert).toHaveBeenCalledTimes(2);
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(preferenceListeners.size).toBe(0);
  });
});
