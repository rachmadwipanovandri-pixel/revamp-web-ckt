import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initPreviewHome } from "./behaviors";
import { AD_COOKIE } from "@/lib/ad-params";

function mountRoot() {
  const root = document.createElement("div");
  root.innerHTML = `
    <div id="navRoot"><div id="navInner"></div></div>
    <form class="capture hero-anim d4"><input type="text"><button type="submit">Coba Gratis 14 Hari</button></form>
    <form class="capture reveal"><input type="text"><button type="submit">Try Free for 14 Days</button></form>
  `;
  document.body.appendChild(root);
  return root;
}

describe("preview-home capture forms", () => {
  let root: HTMLElement;
  let cleanup: () => void;
  let navigated: string[];

  beforeEach(() => {
    // jsdom has no layout engine, so the scroll probe must be stubbed.
    document.elementFromPoint = () => null;
    navigated = [];
    vi.spyOn(
      HTMLAnchorElement.prototype,
      "click",
    ).mockImplementation(function (this: HTMLAnchorElement) {
      navigated.push(this.href);
    });
    root = mountRoot();
    cleanup = initPreviewHome(root);
  });

  afterEach(() => {
    cleanup();
    root.remove();
    vi.restoreAllMocks();
    document.cookie = `${AD_COOKIE}=; Max-Age=0`;
  });

  it("sends the hero form button to the register page", () => {
    root.querySelector<HTMLButtonElement>("form.capture.hero-anim button")!.click();
    expect(navigated).toEqual(["https://chat.cekat.ai/register"]);
  });

  it("sends the mid-page form button to the register page", () => {
    root.querySelector<HTMLButtonElement>("form.capture.reveal button")!.click();
    expect(navigated).toEqual(["https://chat.cekat.ai/register"]);
  });

  it("keeps the captured ad-attribution params, like the main homepage CTA", () => {
    document.cookie = `${AD_COOKIE}=${encodeURIComponent("gclid=abc&utm_source=google")}`;
    root.querySelector<HTMLButtonElement>("form.capture.hero-anim button")!.click();
    expect(navigated).toEqual([
      "https://chat.cekat.ai/register?gclid=abc&utm_source=google",
    ]);
  });

  it("does not reload the page on submit", () => {
    const form = root.querySelector<HTMLFormElement>("form.capture.hero-anim")!;
    const event = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe("preview-home mega categories", () => {
  let root: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    document.elementFromPoint = () => null;
    root = document.createElement("div");
    root.innerHTML = `
      <div id="navRoot"><div id="navInner">
        <button class="nav-link" data-mega="fitur" type="button" aria-expanded="false">Features</button>
      </div></div>
      <div class="mega" id="mega-fitur" data-kind="cats">
        <div class="mega-side">
          <button class="mega-cat on" data-cat="chat" type="button">Chat</button>
          <button class="mega-cat" data-cat="ai" type="button">AI</button>
        </div>
        <div class="mega-main">
          <div class="mega-panel" data-cat-panel="chat">chat items</div>
          <div class="mega-panel" data-cat-panel="ai" style="display:none">ai items</div>
        </div>
      </div>`;
    document.body.appendChild(root);
    cleanup = initPreviewHome(root);
  });

  afterEach(() => {
    cleanup();
    root.remove();
  });

  it("switches category panels by toggling display — no DATA import needed", () => {
    root.querySelector<HTMLButtonElement>('[data-cat="ai"]')!.click();
    expect(root.querySelector('[data-cat-panel="chat"]')!.style.display).toBe("none");
    expect(root.querySelector('[data-cat-panel="ai"]')!.style.display).toBe("");
    expect(root.querySelector('[data-cat="ai"]')).toHaveClass("on");
    expect(root.querySelector('[data-cat="chat"]')).not.toHaveClass("on");
  });

  it("still opens the mega menu from the nav trigger on desktop", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("min-width: 961px"),
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    try {
      root.querySelector<HTMLButtonElement>(".nav-link")!.click();
      expect(root.querySelector("#mega-fitur")).toHaveClass("open");
      expect(root.querySelector(".nav-link")).toHaveAttribute("aria-expanded", "true");
    } finally {
      window.matchMedia = original;
    }
  });
});
