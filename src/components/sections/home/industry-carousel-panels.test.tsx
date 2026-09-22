import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  IndustryCarouselPanels,
  type IndustryPanel,
} from "./industry-carousel-panels";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

const PANELS: IndustryPanel[] = [
  {
    id: "healthcare",
    slug: "kesehatan",
    title: "Kesehatan",
    photo: "/images/industries/healthcare.webp",
    description: "Jawab setiap pasien, bahkan setelah klinik tutup.",
    useCases: ["Jawab pasien 24/7", "Booking dari chat"],
  },
  {
    id: "retail",
    slug: "ritel",
    title: "Ritel & E-Commerce",
    photo: "/images/industries/retail.webp",
    description: "Jualan dan layani di semua channel.",
    useCases: ["Cek stok instan", "Checkout dari chat"],
  },
  {
    id: "logistics",
    slug: "logistik",
    title: "Logistik",
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

function renderCarousel() {
  return render(<IndustryCarouselPanels panels={PANELS} labels={LABELS} />);
}

describe("IndustryCarouselPanels", () => {
  it("opens on the first industry with its copy and chips", () => {
    renderCarousel();
    expect(
      screen.getByRole("button", { pressed: true, name: /Kesehatan/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Jawab setiap pasien, bahkan setelah klinik tutup/),
    ).toBeInTheDocument();
    expect(screen.getByText("Jawab pasien 24/7")).toBeInTheDocument();
    // Only the open panel's copy is on the page, not all three at once.
    expect(
      screen.queryByText(/Jualan dan layani di semua channel/),
    ).not.toBeInTheDocument();
  });

  it("swaps the copy, chips, and link when another panel is picked", async () => {
    const user = userEvent.setup();
    renderCarousel();

    await user.click(screen.getByRole("button", { name: /Ritel/ }));

    expect(
      screen.getByRole("button", { pressed: true, name: /Ritel/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Jualan dan layani di semua channel/),
    ).toBeInTheDocument();
    expect(screen.getByText("Cek stok instan")).toBeInTheDocument();
    expect(screen.queryByText("Jawab pasien 24/7")).not.toBeInTheDocument();
  });

  it("wraps in both directions from the arrows", async () => {
    const user = userEvent.setup();
    renderCarousel();

    // Back from the first panel lands on the last, not on nothing.
    await user.click(screen.getByRole("button", { name: LABELS.previous }));
    expect(
      screen.getByRole("button", { pressed: true, name: /Logistik/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: LABELS.next }));
    expect(
      screen.getByRole("button", { pressed: true, name: /Kesehatan/ }),
    ).toBeInTheDocument();
  });
});
