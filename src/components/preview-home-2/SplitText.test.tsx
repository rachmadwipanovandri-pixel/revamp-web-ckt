import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitText } from "./SplitText";

/**
 * The split has two failure modes worth naming, because both are silent:
 *
 *   - a space rendered *inside* the mask is clipped away, and the heading
 *     ships as `DariLeadsSampaiJadi` — one unbroken string that is wrong to
 *     read and wrong to announce;
 *   - an index that restarts at the accent phrase staggers the second half
 *     from zero again, so the accent collides with the words before it.
 *
 * The accessible string is the third check: the split must not change what a
 * screen reader says, only what an animation moves.
 */
describe("preview-home-2 SplitText", () => {
  it("keeps the accessible text identical to the source string", () => {
    const { container } = render(
      <h2>
        <SplitText text="Dari Leads Sampai Jadi Pelanggan" />
      </h2>,
    );

    expect(container.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Dari Leads Sampai Jadi Pelanggan",
    );
  });

  it("renders every word in its own mask and the space outside it", () => {
    const { container } = render(
      <SplitText text="Satu Dua Tiga" />,
    );

    const masks = container.querySelectorAll(".ph2-word-mask");
    expect(masks).toHaveLength(3);

    // The space is a sibling text node between masks, never a child of one —
    // a mask would clip it and the words would run together.
    for (const mask of masks) {
      expect(mask.textContent).not.toMatch(/\s/);
      expect(mask.querySelector("[data-ph2-word]")).not.toBeNull();
    }
    expect(container.textContent).toContain("Satu Dua Tiga");
  });

  it("numbers words continuously across the accent phrase", () => {
    const { container } = render(
      <SplitText text="Dari Leads Sampai" accent="Jadi Pelanggan" />,
    );

    const indices = Array.from(
      container.querySelectorAll("[data-ph2-word]"),
    ).map((el) => (el as HTMLElement).style.getPropertyValue("--i"));

    expect(indices).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("styles the accent words and leaves the lead words alone", () => {
    const { container } = render(
      <SplitText text="Dari Leads Sampai" accent="Jadi Pelanggan" />,
    );

    const words = Array.from(
      container.querySelectorAll("[data-ph2-word]"),
    ) as HTMLElement[];

    expect(words[0].className).not.toContain("text-primary");
    expect(words.at(-1)?.className).toContain("text-primary");
    expect(words.at(-1)?.className).toContain("italic");
  });

  it("honours a custom accent treatment", () => {
    const { container } = render(
      <SplitText
        text="Selamanya"
        accent="Bersama Kami"
        accentClassName="text-white"
      />,
    );

    const words = Array.from(
      container.querySelectorAll("[data-ph2-word]"),
    ) as HTMLElement[];

    expect(words.at(-1)?.className).toContain("text-white");
    expect(words.at(-1)?.className).not.toContain("text-primary");
  });

  it("normalises runs of whitespace instead of emitting empty masks", () => {
    const { container } = render(<SplitText text="  Satu   Dua  " />);

    expect(container.querySelectorAll(".ph2-word-mask")).toHaveLength(2);
  });

  it("renders nothing but the accent when the lead is empty", () => {
    const { container } = render(<SplitText text="" accent="Cekat Sekarang" />);

    expect(container.querySelectorAll(".ph2-word-mask")).toHaveLength(2);
    expect(container.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Cekat Sekarang",
    );
  });

  it("leaves the heading readable with no script at all", () => {
    // The resting state is the finished state: no attribute on the words is
    // hiding them, `TextMotion` writes the start transform later.
    const { container } = render(
      <h2 data-ph2-split="">
        <SplitText text="Judul Yang Utuh" />
      </h2>,
    );

    const h2 = screen.getByRole("heading");
    expect(h2.getAttribute("data-ph2-armed")).toBeNull();
    expect(h2.getAttribute("data-ph2-in")).toBeNull();
    expect(container.querySelectorAll("[data-ph2-word]")).toHaveLength(3);
  });
});
