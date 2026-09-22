import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PlatformOverview } from "./platform-overview";

const messages = {
  home: {
    platformOverview: {
      heading: "One Platform to Manage All Customer Conversations",
      body: "Cekat.AI is Indonesia's leading AI agent platform.",
      feature1: {
        title: "Monitor and Optimize Marketing in One Platform",
        description: "Track campaign performance.",
      },
      feature2: {
        title: "Automate Business Workflows Without Coding",
        description: "Let AI reply to chats.",
      },
      feature3: {
        title: "CRM to Help Your Business Grow",
        description: "All lead data stays organized.",
      },
    },
  },
};

describe("PlatformOverview", () => {
  it("renders all three feature titles", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PlatformOverview />
      </NextIntlClientProvider>,
    );
    expect(
      screen.getByText("Monitor and Optimize Marketing in One Platform"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Automate Business Workflows Without Coding"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("CRM to Help Your Business Grow"),
    ).toBeInTheDocument();
  });
});
