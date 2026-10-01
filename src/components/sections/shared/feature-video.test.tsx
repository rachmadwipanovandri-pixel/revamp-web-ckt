import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { FeatureVideo } from "./feature-video";

function matchMediaStub(matches: boolean) {
  return ((query: string) => ({
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

describe("FeatureVideo", () => {
  it("stacks one video per clip, first active and autoplaying", () => {
    const { container } = render(
      <FeatureVideo
        clips={[{ webm: "/v/a.webm" }, { webm: "/v/b.webm", mp4: "/v/b.mp4" }]}
        poster="/images/fallback.jpg"
      />,
    );

    const box = container.firstElementChild;
    expect(box).toHaveClass(
      "relative",
      "aspect-square",
      "overflow-hidden",
      "rounded-[20px]",
      "ring-1",
    );

    const videos = container.querySelectorAll("video");
    expect(videos).toHaveLength(2);

    expect(videos[0]).toHaveClass("opacity-100");
    expect(videos[1]).toHaveClass("opacity-0");
    expect(videos[0]).toHaveProperty("muted", true);
    expect(videos[0]).toHaveProperty("loop", true);
    expect(videos[0]).toHaveProperty("playsInline", true);
    expect(videos[0]).toHaveProperty("autoplay", true);
    expect(videos[1]).toHaveProperty("autoplay", false);

    expect(videos[0].querySelectorAll("source")).toHaveLength(1);
    expect(videos[0].querySelector("source")).toHaveAttribute(
      "type",
      "video/webm",
    );
    const second = videos[1].querySelectorAll("source");
    expect(second[0]).toHaveAttribute("type", "video/webm");
    expect(second[1]).toHaveAttribute("type", "video/mp4");

    // Progress segments exist (one hairline per clip).
    expect(container.querySelectorAll(".origin-left")).toHaveLength(2);
  });

  it("crossfades to the next clip after the interval", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <FeatureVideo
          clips={[{ webm: "/v/a.webm" }, { webm: "/v/b.webm" }]}
          interval={100}
        />,
      );
      const videos = container.querySelectorAll("video");
      expect(videos[0]).toHaveClass("opacity-100");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(videos[0]).toHaveClass("opacity-0");
      expect(videos[1]).toHaveClass("opacity-100");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Wraps back to the first clip.
      expect(videos[0]).toHaveClass("opacity-100");
      expect(videos[1]).toHaveClass("opacity-0");
    } finally {
      vi.useRealTimers();
    }
  });

  it("applies per-clip posters over the shared fallback", () => {
    const { container } = render(
      <FeatureVideo
        poster="/images/fallback.jpg"
        clips={[
          { webm: "/v/a.webm", poster: "/images/custom.jpg" },
          { webm: "/v/b.webm" },
        ]}
      />,
    );

    const videos = container.querySelectorAll("video");
    expect(videos[0].getAttribute("poster")).toBe("/images/custom.jpg");
    expect(videos[1].getAttribute("poster")).toBe("/images/fallback.jpg");
  });

  it("renders the placeholder clip by default", () => {
    const { container } = render(<FeatureVideo />);
    const video = container.querySelector("video");
    const sources = video?.querySelectorAll("source");
    expect(sources?.[0]).toHaveAttribute("src", "/videos/feature.webm");
    expect(sources?.[1]).toHaveAttribute("src", "/videos/feature.mp4");
    expect(video?.getAttribute("poster")).toBe("/videos/feature-poster.jpg");
  });

  it("ships muted in server HTML so autoplay starts before hydration", () => {
    const html = renderToStaticMarkup(
      <FeatureVideo clips={[{ webm: "/v/a.webm" }]} />,
    );
    expect(html).toContain('muted=""');
    expect(html).toContain('poster="/videos/feature-poster.jpg"');
    expect(html).toContain('type="video/webm"');
    expect(html).toContain("opacity-100");
  });

  it("holds the first clip under prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = matchMediaStub(true);
    vi.useFakeTimers();
    try {
      const { container } = render(
        <FeatureVideo
          clips={[{ webm: "/v/a.webm" }, { webm: "/v/b.webm" }]}
          interval={50}
        />,
      );

      // No progress segments while rotation is off.
      expect(container.querySelector(".origin-left")).toBeNull();

      act(() => {
        vi.advanceTimersByTime(200);
      });
      const videos = container.querySelectorAll("video");
      expect(videos[0]).toHaveClass("opacity-100");
      expect(videos[1]).toHaveClass("opacity-0");
    } finally {
      vi.useRealTimers();
      window.matchMedia = original;
    }
  });
});
