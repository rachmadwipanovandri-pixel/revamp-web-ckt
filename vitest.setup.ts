import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver; react-fast-marquee (and other
// layout-measuring libs) need at least a no-op stub to mount in tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;
}

// jsdom doesn't implement IntersectionObserver either; framer-motion's
// `whileInView` (used for scroll-triggered animations) needs a stub too.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

// jsdom doesn't implement matchMedia; components that check
// prefers-reduced-motion before starting an animation call it on mount.
// Reporting `false` means tests exercise the animated path, which is the one
// worth covering.
if (typeof window !== "undefined" && typeof window.matchMedia === "undefined") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
