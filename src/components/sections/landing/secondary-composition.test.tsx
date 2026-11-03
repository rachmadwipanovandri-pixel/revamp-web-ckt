import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { render as testingRender } from "@testing-library/react";
import { PageHero } from "../shared/page-hero";
import { BenefitAccordion } from "./benefit-accordion";
import { ProductStage } from "./product-stage";
import Link from "next/link";
import { HeadingWords } from "../shared/heading-words";
import { HighlightedText } from "../shared/highlighted-text";
import { WorkflowScene } from "./workflow-scene";
import { sceneArtwork, sceneKind } from "./scene-art";
import { DefinitionBlock } from "./definition-block";

vi.mock("../shared/hero-entrance", () => ({ HeroEntrance: () => null }));

function renderWithLocale(ui: ReactElement) {
  return testingRender(<NextIntlClientProvider locale="en" messages={{}}>{ui}</NextIntlClientProvider>);
}

describe("secondary page composition", () => {
  it("gives long existing statistics a full-width mobile card without shortening the value", () => {
    const { container } = render(<DefinitionBlock definition="Original definition" stats={[
      { value: "1,000,000+", label: "Original attribution" },
    ]} />);
    expect(screen.getByText("Original definition")).toBeVisible();
    expect(screen.getByText("1,000,000+")).toBeVisible();
    expect(screen.getByText("Original attribution")).toBeVisible();
    expect(container.querySelector("dl")).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4");
  });
  it("emphasizes an existing phrase without changing whitespace or punctuation", () => {
    const { container } = render(<h1><HighlightedText text="Original  message, exactly as written." /></h1>);
    expect(screen.getByRole("heading").textContent).toBe("Original  message, exactly as written.");
    expect(container.querySelector(".headline-highlight")).toHaveTextContent("as written.");
  });
  it("preserves a single unsplit accessible name for animated headings", () => {
    render(<HeadingWords text="Original section heading" />);
    expect(screen.getByRole("heading", { name: "Original section heading", level: 2 })).toHaveTextContent("Original section heading");
  });
  it("keeps original hero text and CTA while adding a separate visual", () => {
    render(
      <PageHero title="Original headline" subtitle="Original subtitle" chips={["Original use case"]} split visual={<div>Product visual</div>}>
        <Link href="/contact">Original action</Link>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Original headline");
    expect(screen.getByText("Original subtitle")).toBeVisible();
    expect(screen.getByText("Original use case")).toBeVisible();
    expect(screen.getByRole("link", { name: "Original action" })).toHaveAttribute("href", "/contact");
    expect(screen.getByText("Product visual")).toBeVisible();
  });

  it("renders every text-only benefit without an empty screenshot column", () => {
    const { container } = render(<BenefitAccordion heading="Benefits" benefits={[
      { title: "First benefit", body: "First original body" },
      { title: "Second benefit", body: "Second original body" },
    ]} />);
    expect(screen.getByText("First original body")).toBeVisible();
    expect(screen.getByText("Second original body")).toBeVisible();
    expect(container.querySelector(".benefit-editorial")).toBeInTheDocument();
    expect(container.querySelector(".benefit-studio__well")).not.toBeInTheDocument();
  });

  it("switches illustrated benefits and retains all original bodies", () => {
    renderWithLocale(<BenefitAccordion benefits={[
      { title: "Connect", body: "Connect original body", image: "/images/chat/connect-channels.png" },
      { title: "Train", body: "Train original body", image: "/images/chat/train-your-ai-agent.png" },
    ]} />);
    const first = screen.getByRole("button", { name: /Connect/ });
    const second = screen.getByRole("button", { name: /Train/ });
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Train original body")).toBeVisible();
    expect(screen.getByText("Connect original body")).toBeInTheDocument();
    expect(screen.getByText("Connect original body")).not.toBeVisible();
  });

  it("uses distinct accordion region IDs when instances share a page", () => {
    const benefits = [{ title: "Connect", body: "Body", image: "/images/chat/connect-channels.png" }];
    renderWithLocale(<><BenefitAccordion benefits={benefits} /><BenefitAccordion benefits={benefits} /></>);
    const buttons = screen.getAllByRole("button", { name: /Connect/ });
    expect(buttons[0].getAttribute("aria-controls")).not.toBe(buttons[1].getAttribute("aria-controls"));
  });

  it("uses a contextual product image rather than a faded background", () => {
    const { container } = renderWithLocale(<ProductStage image="/images/home/hero-dashboard.png" imageAlt="Cekat shared inbox" label="Chat" />);
    expect(screen.getByRole("img", { name: "Cekat shared inbox" })).toBeInTheDocument();
    expect(container.querySelector(".product-stage__photo")).not.toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeVisible();
  });

  it("selects channels and announces the chosen route", () => {
    renderWithLocale(<WorkflowScene image="/images/chat/connect-channels.png" imageAlt="Connect Channels" />);
    const instagram = screen.getByRole("button", { name: "Instagram" });
    fireEvent.click(instagram);
    expect(instagram).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "WhatsApp" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Instagram");
  });

  it("preserves the original channel artwork through the product-image toggle", () => {
    const { container } = renderWithLocale(<WorkflowScene image="/images/chat/connect-channels.png" imageAlt="Connect Channels" />);
    fireEvent.click(screen.getByRole("button", { name: "Product image" }));
    expect(screen.getByRole("img", { name: "Connect Channels" }).getAttribute("src")).toContain("connect-channels.png");
    expect(screen.getByRole("button", { name: "Interactive view" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".channel-map")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Interactive view" }));
    expect(screen.getByRole("button", { name: "Instagram" })).toBeInTheDocument();
  });

  it("offers an accessible pause and resume control", () => {
    const { container } = renderWithLocale(<WorkflowScene image="/images/home/hero-dashboard.png" imageAlt="Shared inbox" />);
    fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
    expect(container.querySelector(".workflow-scene")).toHaveAttribute("data-paused", "true");
    expect(screen.getByRole("button", { name: "Play animation" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
    expect(container.querySelector(".workflow-scene")).toHaveAttribute("data-paused", "false");
  });

  it("maps product artwork to optimized derivatives without replacing unrelated media", () => {
    expect(sceneArtwork("/images/crm/manage-work-with-boards.png")).toBe("/images/exploratory/crm-manage-work-with-boards.webp");
    expect(sceneArtwork("/images/home/hero-dashboard.png")).toBe("/images/exploratory/home-hero-dashboard.webp");
    expect(sceneArtwork("/images/industries/healthcare.webp")).toBe("/images/industries/healthcare.webp");
  });

  it("does not mistake the shared-inbox dashboard for a CRM board", () => {
    expect(sceneKind("/images/home/hero-dashboard.png")).toBe("inbox");
    expect(sceneKind("/images/crm/manage-work-with-boards.png")).toBe("pipeline");
  });
});
