import { describe, expect, it, beforeEach } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { CONTENT } from "./content";
import { Founders } from "./Founders";

const content = CONTENT.id.founders;

function mockReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduced-motion") ? matches : false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/** The whole surface of a slide, which is the promote-or-play button. */
function surfaces(container: HTMLElement) {
  return [
    ...container.querySelectorAll<HTMLElement>("[data-founder-card] > button"),
  ];
}

function activeIndex(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>("[data-founder-card]")].findIndex(
    (card) => card.dataset.active === "true",
  );
}

describe("preview-home-2 founder stories", () => {
  beforeEach(() => {
    mockReducedMotion(false);
  });

  it("shows one poster card per founder and no player yet", () => {
    const { container } = render(<Founders content={content} />);

    const cards = container.querySelectorAll("[data-founder-card]");
    expect(cards).toHaveLength(content.items.length);

    // The player is the expensive part, so nothing mounts until it is asked for.
    expect(container.querySelector("iframe")).toBeNull();

    // Every card carries exactly one full-surface control.
    const buttons = surfaces(container);
    expect(buttons).toHaveLength(content.items.length);
    buttons.forEach((button) =>
      expect(button.getAttribute("aria-label")).toBeTruthy(),
    );
  });

  it("derives each poster from its own video id, so they cannot drift", () => {
    const { container } = render(<Founders content={content} />);
    const sources = [
      ...container.querySelectorAll("[data-founder-card] img"),
      // next/image wraps the remote URL; the id is what matters here.
    ].map((img) => decodeURIComponent(img.getAttribute("src") ?? ""));

    expect(sources).toHaveLength(content.items.length);
    content.items.forEach((founder, index) => {
      expect(sources[index]).toContain(`/vi/${founder.yt}/`);
    });
  });

  it("opens with one slide active, and clicking a sliver promotes it", () => {
    const { container } = render(<Founders content={content} />);
    expect(activeIndex(container)).toBe(0);

    fireEvent.click(surfaces(container)[2]);
    expect(activeIndex(container)).toBe(2);

    // Promotion is not navigation: nothing opens, and the earlier slide is still
    // on the rail — it has collapsed to a sliver rather than been replaced.
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(container.querySelectorAll("[data-founder-card]")).toHaveLength(
      content.items.length,
    );
  });

  it("labels a collapsed slide as promotable and an open slide as playable", () => {
    const { container } = render(<Founders content={content} />);
    const buttons = surfaces(container);
    const first = content.items[0];
    const third = content.items[2];
    if (!first || !third) throw new Error("expected at least three founders");

    // Same control, two jobs. The label has to say which one a press will do, or
    // the rail asks assistive tech to guess.
    expect(buttons[0]?.getAttribute("aria-label")).toBe(
      `${content.play}: ${first.name}, ${first.company}`,
    );
    expect(buttons[2]?.getAttribute("aria-label")).toBe(
      `${content.show}: ${third.name}`,
    );

    fireEvent.click(buttons[2]);
    const after = surfaces(container);
    expect(after[2]?.getAttribute("aria-label")).toBe(
      `${content.play}: ${third.name}, ${third.company}`,
    );
    expect(after[0]?.getAttribute("aria-label")).toBe(
      `${content.show}: ${first.name}`,
    );
  });

  it("plays the open slide and leaves a collapsed one to promotion", () => {
    const { container } = render(<Founders content={content} />);

    // A collapsed slide's press promotes; it must not open the player.
    fireEvent.click(surfaces(container)[1]);
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    // The now-active slide's press plays.
    fireEvent.click(surfaces(container)[1]);
    const dialog = container.querySelector('[role="dialog"]');
    if (!dialog) throw new Error("dialog did not open");
    const second = content.items[1];
    if (!second) throw new Error("expected a second founder");

    // The nocookie host, and autoplay, and the right video.
    const iframe = dialog.querySelector("iframe");
    const src = iframe?.getAttribute("src") ?? "";
    expect(src).toContain("youtube-nocookie.com/embed/" + second.yt);
    expect(src).toContain("autoplay=1");
    expect(iframe?.getAttribute("title")).toBe(second.name);

    // Escape closes it and gives the page its scroll back.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("clamps the arrows at both ends instead of wrapping", () => {
    const { container } = render(<Founders content={content} />);
    const prev = container.querySelector<HTMLButtonElement>(
      `[aria-label="${content.previous}"]`,
    );
    const next = container.querySelector<HTMLButtonElement>(
      `[aria-label="${content.next}"]`,
    );

    // At the first slide there is nothing before it, and a disabled control that
    // is still clickable is worse than no control at all.
    expect(prev?.disabled).toBe(true);
    fireEvent.click(prev as HTMLButtonElement);
    expect(activeIndex(container)).toBe(0);

    fireEvent.click(next as HTMLButtonElement);
    expect(activeIndex(container)).toBe(1);
    expect(prev?.disabled).toBe(false);

    // Walk to the end and stop there.
    for (let i = 1; i < content.items.length; i++) {
      fireEvent.click(next as HTMLButtonElement);
    }
    expect(activeIndex(container)).toBe(content.items.length - 1);
    expect(next?.disabled).toBe(true);
    fireEvent.click(next as HTMLButtonElement);
    expect(activeIndex(container)).toBe(content.items.length - 1);
  });

  it("moves the active slide from the dots and from the arrow keys", () => {
    const { container } = render(<Founders content={content} />);
    const rail = container.querySelector(".ph2-rail-track") as HTMLElement;

    const dot = container.querySelectorAll<HTMLButtonElement>(
      `[aria-label^="${content.pager}: "]`,
    );
    expect(dot).toHaveLength(content.items.length);
    fireEvent.click(dot[3] as HTMLButtonElement);
    expect(activeIndex(container)).toBe(3);
    expect(dot[3]?.getAttribute("aria-current")).toBe("true");
    expect(dot[0]?.getAttribute("aria-current")).toBeNull();

    // The rail is focusable, so the same promotion has to work from a key.
    fireEvent.keyDown(rail, { key: "ArrowLeft" });
    expect(activeIndex(container)).toBe(2);
    fireEvent.keyDown(rail, { key: "ArrowRight" });
    expect(activeIndex(container)).toBe(3);

    // Left at the end is a no-op, not a jump back to the first slide.
    fireEvent.keyDown(rail, { key: "ArrowRight" });
    expect(activeIndex(container)).toBe(3);
  });

  it("brings a promoted card into view, without gliding under reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<Founders content={content} />);

    // jsdom has no layout and no scroll engine, so `scrollIntoView` is stubbed
    // to record the call: the options are the only observable part.
    const calls: ScrollIntoViewOptions[] = [];
    const proto = window.HTMLElement.prototype as unknown as {
      scrollIntoView?: (options?: ScrollIntoViewOptions) => void;
    };
    const original = proto.scrollIntoView;
    proto.scrollIntoView = (options?: ScrollIntoViewOptions) => {
      calls.push(options ?? {});
    };

    try {
      fireEvent.click(surfaces(container)[2]);
    } finally {
      if (original) proto.scrollIntoView = original;
      else delete proto.scrollIntoView;
    }

    expect(calls).toHaveLength(1);
    // `block: nearest` keeps a desktop press from scrolling the page to the rail.
    expect(calls[0]?.block).toBe("nearest");
    expect(calls[0]?.behavior).toBe("auto");
  });

  it("closes on the backdrop and on the close control", () => {
    const { container } = render(<Founders content={content} />);
    const close = () =>
      container.querySelector(`[aria-label="${content.close}"]`) as HTMLElement;

    fireEvent.click(surfaces(container)[0]);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    fireEvent.click(close());
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    fireEvent.click(surfaces(container)[0]);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    // The backdrop is the first dialog-level button; it must not be the close
    // control, so the two ways out are genuinely different targets.
    const backdrop = container.querySelector(
      '[role="dialog"] > button',
    ) as HTMLElement;
    fireEvent.click(backdrop);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});