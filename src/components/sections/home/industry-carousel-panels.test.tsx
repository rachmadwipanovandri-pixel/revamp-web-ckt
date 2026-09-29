import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  IndustryCarouselPanels,
  type IndustryPanel,
} from "./industry-carousel-panels";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a
      href={
        typeof href === "string"
          ? href
          : `/industries/${(href as unknown as { params: { slug: string } })
              .params.slug}`
      }
      {...props}
    >
      {children}
    </a>
  ),
}));

const PANELS: IndustryPanel[] = [
  {
    id: "healthcare",
    slug: "kesehatan",
    title: "Kesehatan",
    tagline: "Jawab & booking pasien 24/7",
    photo: "/images/industries/healthcare.webp",
    description: "Jawab setiap pasien, bahkan setelah klinik tutup.",
    useCases: ["Jawab pasien 24/7", "Booking dari chat"],
  },
  {
    id: "retail",
    slug: "ritel",
    title: "Ritel & E-Commerce",
    tagline: "Jualan & layani di semua channel",
    photo: "/images/industries/retail.webp",
    description: "Jualan dan layani di semua channel.",
    useCases: ["Cek stok instan", "Checkout dari chat"],
  },
  {
    id: "logistics",
    slug: "logistik",
    title: "Logistik",
    tagline: "Lacak kiriman tanpa chat manual",
    photo: "/images/industries/logistics.webp",
    description: "Update kiriman tanpa menunggu admin.",
    useCases: ["Lacak resi", "Klaim keluhan"],
  },
];

const LABELS = {
  useCases: "Solusi Kami",
  learnMore: "Pelajari lebih lanjut",
  previous: "Industri sebelumnya",
  next: "Industri berikutnya",
};

// jsdom has no layout: the rail reports 0px of scroll room and an empty
// offsetLeft, so both would short-circuit the arrow logic. Stand in real
// numbers for a three-card rail — 400px cards in a 400px window.
const STRIDE = 400;
const CLIENT_WIDTH = 400;
const SCROLL_WIDTH = 1400;
const MAX_SCROLL = SCROLL_WIDTH - CLIENT_WIDTH;

type Scrollable = HTMLElement & { __scrollLeft?: number };

const savedDescriptors = new Map<string, PropertyDescriptor | undefined>();
let scrollToMock: ReturnType<typeof vi.fn>;
let scrollByMock: ReturnType<typeof vi.fn>;

function defineOnPrototype(key: string, descriptor: PropertyDescriptor) {
  savedDescriptors.set(
    key,
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, key),
  );
  Object.defineProperty(HTMLElement.prototype, key, {
    configurable: true,
    ...descriptor,
  });
}

beforeEach(() => {
  scrollToMock = vi.fn(function (this: Scrollable, options?: ScrollToOptions) {
    if (typeof options?.left === "number") this.__scrollLeft = options.left;
  });
  scrollByMock = vi.fn(function (this: Scrollable, options?: ScrollToOptions) {
    this.__scrollLeft = (this.__scrollLeft ?? 0) + (options?.left ?? 0);
  });

  defineOnPrototype("scrollLeft", {
    get(this: Scrollable) {
      return this.__scrollLeft ?? 0;
    },
    set(this: Scrollable, value: number) {
      this.__scrollLeft = value;
    },
  });
  defineOnPrototype("scrollWidth", { get: () => SCROLL_WIDTH });
  defineOnPrototype("clientWidth", { get: () => CLIENT_WIDTH });
  defineOnPrototype("offsetLeft", {
    get(this: HTMLElement) {
      const parent = this.parentElement;
      if (!parent) return 0;
      return Array.prototype.indexOf.call(parent.children, this) * STRIDE;
    },
  });
  defineOnPrototype("scrollTo", { value: scrollToMock });
  defineOnPrototype("scrollBy", { value: scrollByMock });
});

afterEach(() => {
  for (const [key, descriptor] of savedDescriptors) {
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, key, descriptor);
    } else {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)[
        key
      ];
    }
  }
  savedDescriptors.clear();
});

function renderCarousel() {
  return render(<IndustryCarouselPanels panels={PANELS} labels={LABELS} />);
}

function rail(container: HTMLElement) {
  const track = container.querySelector("ul.snap-rail");
  if (!track) throw new Error("rail not rendered");
  return track as Scrollable;
}

function progressBar(container: HTMLElement) {
  const fill = container.querySelector('div[style*="width"]');
  if (!fill) throw new Error("progress fill not rendered");
  return fill as HTMLElement;
}

describe("IndustryCarouselPanels", () => {
  it("renders every industry as a card link with its own copy", () => {
    const { container } = renderCarousel();

    expect(screen.getByRole("heading", { name: "Kesehatan" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Logistik" })).toBeVisible();
    expect(
      screen.getByText(/Jawab setiap pasien, bahkan setelah klinik tutup/),
    ).toBeVisible();
    expect(screen.getByText("Klaim keluhan")).toBeVisible();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(PANELS.length);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      PANELS.map((panel) => `/industries/${panel.slug}`),
    );
    expect(container.querySelectorAll("ul.snap-rail > li")).toHaveLength(
      PANELS.length,
    );
  });

  it("moves exactly one card per arrow press", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel();

    await user.click(screen.getByRole("button", { name: LABELS.next }));

    expect(scrollByMock).toHaveBeenCalledWith({
      left: STRIDE,
      behavior: "smooth",
    });
    expect(rail(container).__scrollLeft).toBe(STRIDE);
  });

  it("wraps backwards from the first card to the last", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel();

    await user.click(screen.getByRole("button", { name: LABELS.previous }));

    expect(scrollToMock).toHaveBeenCalledWith({
      left: MAX_SCROLL,
      behavior: "smooth",
    });
    expect(rail(container).__scrollLeft).toBe(MAX_SCROLL);
  });

  it("wraps forwards from the last card to the first", async () => {
    const user = userEvent.setup();
    const { container } = renderCarousel();
    rail(container).__scrollLeft = MAX_SCROLL;

    await user.click(screen.getByRole("button", { name: LABELS.next }));

    expect(scrollToMock).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
    expect(rail(container).__scrollLeft).toBe(0);
  });

  it("reports scroll position as a progress bar instead of a fixed count", async () => {
    const { container } = renderCarousel();

    expect(progressBar(container)).toHaveStyle({ width: "0%" });

    rail(container).__scrollLeft = MAX_SCROLL / 2;
    fireEvent.scroll(rail(container));

    await waitFor(() =>
      expect(progressBar(container)).toHaveStyle({ width: "50%" }),
    );
  });
});
