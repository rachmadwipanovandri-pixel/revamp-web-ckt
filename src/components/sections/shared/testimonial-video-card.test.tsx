import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestimonialVideoCard } from "./testimonial-video-card";

describe("TestimonialVideoCard", () => {
  it("renders name, role, and a thumbnail image before playing", () => {
    render(
      <TestimonialVideoCard
        videoId="ePdVgW7X01s"
        name="Rianti Yahya"
        role="CEO & Founder - Moir Salon"
      />,
    );
    expect(screen.getByText("Rianti Yahya")).toBeInTheDocument();
    expect(screen.getByText("CEO & Founder - Moir Salon")).toBeInTheDocument();
    expect(
      screen.queryByTitle("Rianti Yahya video testimonial"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });

  it("replaces the thumbnail with an iframe after clicking play", async () => {
    const user = userEvent.setup();
    render(
      <TestimonialVideoCard
        videoId="ePdVgW7X01s"
        name="Rianti Yahya"
        role="CEO & Founder - Moir Salon"
      />,
    );
    await user.click(screen.getByRole("button", { name: /play/i }));
    const iframe = screen.getByTitle("Rianti Yahya video testimonial");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/ePdVgW7X01s?autoplay=1",
    );
  });
});
