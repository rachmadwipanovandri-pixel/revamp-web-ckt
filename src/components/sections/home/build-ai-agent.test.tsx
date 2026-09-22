import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { BuildAIAgent } from "./build-ai-agent";

const messages = {
  home: {
    buildAiAgent: {
      heading: "Build an AI Agent in 5 Minutes",
      body: "Manage every chat with an AI agent that's easy to build.",
      feature1: {
        title: "Simple AI Builder",
        description: "Build a powerful AI agent without coding.",
      },
      feature2: {
        title: "AI Knowledge Base",
        description: "Just paste your SOPs and business info.",
      },
      feature3: {
        title: "API Integration",
        description: "Connect the AI to various APIs.",
      },
    },
  },
};

describe("BuildAIAgent", () => {
  it("renders the heading and all three feature cards", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <BuildAIAgent />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByRole("heading", { name: "Build an AI Agent in 5 Minutes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Simple AI Builder")).toBeInTheDocument();
    expect(screen.getByText("AI Knowledge Base")).toBeInTheDocument();
    expect(screen.getByText("API Integration")).toBeInTheDocument();
  });
});
