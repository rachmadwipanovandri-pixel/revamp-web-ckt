import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CoverageScene } from "./coverage-scene";
import { WorkflowScene } from "./workflow-scene";
import { sceneKind } from "./scene-art";

const description = "24/7 multilingual coverage across timezones in Cekat.AI";

describe("native 24/7 coverage scene", () => {
  it("replaces the mismatched working-hours artwork with an accessible UI preview", () => {
    const { container } = render(<NextIntlClientProvider locale="en" messages={{}}>
      <WorkflowScene image="/images/home/ai-working-hours.png" imageAlt={description} />
    </NextIntlClientProvider>);
    expect(sceneKind("/images/home/ai-working-hours.png")).toBe("coverage");
    expect(screen.getByRole("group", { name: description })).toBeInTheDocument();
    expect(container.querySelector('img[src*="ai-working-hours"]')).not.toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "UTC time preview" })).toHaveValue("17");
    expect(screen.getByRole("button", { name: "Tokyo" })).toHaveAttribute("aria-pressed", "true");
  });

  it("changes the selected timezone and politely announces its time and language", () => {
    render(<CoverageScene imageAlt={description} isId={false} />);
    expect(screen.getByRole("status")).toHaveTextContent("Tokyo · 02:00 · Night");
    expect(screen.getByRole("status")).toHaveTextContent("日本語");
    fireEvent.click(screen.getByRole("button", { name: "Jakarta" }));
    expect(screen.getByRole("button", { name: "Jakarta" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Tokyo" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Jakarta · 00:00 · Night");
    expect(screen.getByRole("status")).toHaveTextContent("Bahasa Indonesia");
  });

  it("updates all local times from the slider, including midnight and negative offsets", () => {
    render(<CoverageScene imageAlt={description} isId={false} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "3" } });
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "03:00 UTC");
    expect(screen.getByRole("status")).toHaveTextContent("Tokyo · 12:00 · Day");
    expect(screen.getByRole("button", { name: "New York" })).toHaveTextContent("22:00");
    fireEvent.click(screen.getByRole("button", { name: "New York" }));
    expect(screen.getByRole("status")).toHaveTextContent("New York · 22:00 · Night");
    expect(screen.getByText("Illustrative timezones · fixed UTC offsets")).toBeInTheDocument();
  });

  it("localizes functional labels without changing the supplied description", () => {
    render(<CoverageScene imageAlt="Cakupan AI 24/7" isId />);
    expect(screen.getByRole("group", { name: "Cakupan AI 24/7" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Simulasi waktu UTC" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Malam");
  });

  it("keeps the original PNG as an optional alternate view", () => {
    render(<NextIntlClientProvider locale="en" messages={{}}>
      <WorkflowScene image="/images/home/ai-working-hours.png" imageAlt={description} />
    </NextIntlClientProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Original artwork" }));
    expect(screen.getByRole("img", { name: description }).getAttribute("src")).toContain("ai-working-hours.png");
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Interactive view" }));
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});
