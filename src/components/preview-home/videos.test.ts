import { describe, expect, it } from "vitest";
import { buildPage } from "./render";
import { initPreviewHome } from "./behaviors";
import { DATA } from "./data";
import { DATA_EN } from "./data-en";

/** Same YouTube videos the homepage "Dipakai bisnis yang serupa dengan Anda." wall uses. */
const HOMEPAGE_VIDEOS = [
  "ePdVgW7X01s",
  "wvOip0Gkx30",
  "O_xSafLehMQ",
  "681luT0Aa68",
];

describe("preview-home video wall", () => {
  it.each([
    ["id", DATA.videos],
    ["en", DATA_EN.videos],
  ] as const)(
    "renders the homepage testimonial videos (%s)",
    (locale, videos) => {
      expect(videos.items.map((i) => i.yt)).toEqual(HOMEPAGE_VIDEOS);

      const html = buildPage(undefined, locale);
      for (const id of HOMEPAGE_VIDEOS) {
        expect(html).toContain(`data-yt="${id}"`);
        expect(html).toContain(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
      }
      expect(html).not.toContain("/videos/");
    },
  );

  it("embeds the YouTube player when a card is clicked", () => {
    document.elementFromPoint = () => null;
    const root = document.createElement("div");
    root.innerHTML = buildPage(undefined, "id");
    document.body.appendChild(root);
    const cleanup = initPreviewHome(root);
    try {
      const [first, second] = Array.from(root.querySelectorAll("[data-vid]"));
      (first as HTMLElement).click();
      const frame = first.querySelector("iframe");
      expect(frame?.src).toBe(
        `https://www.youtube-nocookie.com/embed/${HOMEPAGE_VIDEOS[0]}?autoplay=1`,
      );
      expect(first.classList.contains("playing")).toBe(true);

      (second as HTMLElement).click();
      expect(first.querySelector("iframe")).toBeNull();
      expect(second.querySelector("iframe")).not.toBeNull();
    } finally {
      cleanup();
      root.remove();
    }
  });
});
