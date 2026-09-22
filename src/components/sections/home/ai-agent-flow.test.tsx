import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AIAgentFlow } from "./ai-agent-flow";

const messages = {
  home: {
    aiAgentFlow: {
      heading: "AI Agents & Chat Flow",
      body: "Easily set up chat flows and route customers to the right AI or human agent.",
      feature1: {
        title: "Specialist AI Agents",
        description: "Create dedicated AI agents for sales, support, billing.",
      },
      feature2: {
        title: "Visual Flow Designer",
        description: "Design chat flows with drag and drop.",
      },
      feature3: {
        title: "AI Working Hours",
        description: "Set the AI's working hours.",
      },
    },
  },
};

describe("AIAgentFlow", () => {
  it("renders the heading and all three feature cards", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AIAgentFlow />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "AI Agents & Chat Flow" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Specialist AI Agents")).toBeInTheDocument();
    expect(screen.getByText("Visual Flow Designer")).toBeInTheDocument();
    expect(screen.getByText("AI Working Hours")).toBeInTheDocument();
  });
});
