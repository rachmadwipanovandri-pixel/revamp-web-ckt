import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { HeroSlider } from "./hero-slider";
import { buildHeroSliderCopy } from "./hero-slides";
import { REGISTER_URL, whatsAppUrlFor } from "@/lib/links";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/sections/home/hero-chat-demo", () => ({
  HeroChatDemo: () => <div data-testid="hero-chat-demo" />,
}));

const messages = {
  agentic: {
    hero: {
      eyebrow: "Cekat AI",
      titleLead: "AI Agent & Omnichannel CRM:",
      titleAccent: "Lifetime Customers",
      subtitle: "Turn first chats into loyal customers.",
      hubLabel: "Full Ecosystem",
      slideNav: {
        label: "Hero slide navigation",
      },
      slides: {
        ecosystem: {},
        crm: {
          eyebrow: "Cekat CRM",
          titleLead: "Cekat CRM:",
          titleAccent: "Notes fill themselves",
          subtitle: "Customer notes save themselves.",
          stageLabel: "Cekat CRM",
          pill1: "Auto activity",
          pill2: "Live pipeline",
          pill3: "Full history",
        },
        mini: {
          eyebrow: "Mini Agent",
          titleLead: "Mini Agent:",
          titleAccent: "Small help, fast results",
          subtitle: "Lightweight agent for quick wins.",
          stageLabel: "Mini Agent",
          pill1: "Quick setup",
          pill2: "One task",
          pill3: "Easy to combine",
        },
        oms: {
          eyebrow: "OMS",
          titleLead: "OMS:",
          titleAccent: "Orders finish in chat",
          subtitle: "Shipping and payment in one thread.",
          stageLabel: "Order Management",
          pill1: "Chat to order",
          pill2: "Shipping",
          pill3: "Simpler flow",
        },
        marketing: {
          eyebrow: "Cekat Marketing",
          titleLead: "Cekat Marketing:",
          titleAccent: "See which ads work",
          subtitle: "Broadcasts that know what converts.",
          stageLabel: "Cekat Marketing",
          pill1: "Segments",
          pill2: "ROI view",
          pill3: "Ad-ready",
        },
        consulting: {
          eyebrow: "Consulting Agent",
          titleLead: "Consulting Agent:",
          titleAccent: "Advice from your data",
          subtitle: "Next steps from your own numbers.",
          stageLabel: "Consulting Agent",
          pill1: "Your data",
          pill2: "Clear steps",
          pill3: "Team oversight",
        },
      },
    },
  },
  home: {
    hero: {
      ctaPrimary: "WhatsApp Us",
      ctaSecondary: "Start Free Trial",
    },
  },
};

function translate(namespace: "agentic.hero" | "home.hero") {
  const root =
    namespace === "agentic.hero" ? messages.agentic.hero : messages.home.hero;
  return (key: string) => {
    const value = key
      .split(".")
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === "object"
            ? (acc as Record<string, unknown>)[part]
            : undefined,
        root,
      );
    return typeof value === "string" ? value : key;
  };
}

function renderHero() {
  const copy = buildHeroSliderCopy({
    hero: translate("agentic.hero"),
    home: translate("home.hero"),
  });
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <HeroSlider copy={copy} />
    </NextIntlClientProvider>,
  );
}

describe("agentic Hero", () => {
  it("opens on the ecosystem slide with both CTAs in navbar order", () => {
    renderHero();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Full Ecosystem")).toBeInTheDocument();
    expect(screen.getByText("Start Free Trial").closest("a")).toHaveAttribute(
      "href",
      REGISTER_URL,
    );
    expect(screen.getByText("WhatsApp Us").closest("a")).toHaveAttribute(
      "href",
      whatsAppUrlFor(null, "en"),
    );
  });

  it("switches to Cekat CRM via a slide dot and does not auto-advance", async () => {
    const user = userEvent.setup();
    renderHero();

    // Two rails (desktop vertical + mobile horizontal) share the same labels.
    const crmDots = screen.getAllByRole("button", { name: "Cekat CRM" });
    await user.click(crmDots[0] as HTMLElement);

    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Cekat CRM" }).length).toBe(2);
    expect(
      screen.getAllByRole("button", { name: "Cekat CRM" })[0],
    ).toHaveAttribute("aria-current", "true");
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

    // No autoplay: title stays put after waiting past any plausible timer.
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves/ }),
    ).toBeInTheDocument();
  });

  it("jumps to any slide from the dot rail", async () => {
    const user = userEvent.setup();
    renderHero();

    const consultingDots = screen.getAllByRole("button", {
      name: "Consulting Agent",
    });
    await user.click(consultingDots[0] as HTMLElement);
    expect(
      screen.getByRole("heading", { level: 1, name: /Advice from your data/ }),
    ).toBeInTheDocument();

    const ecosystemDots = screen.getAllByRole("button", {
      name: "Full Ecosystem",
    });
    await user.click(ecosystemDots[0] as HTMLElement);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Full Ecosystem" })[0],
    ).toHaveAttribute("aria-current", "true");
  });

  it("renders one dot per slide on both rails", () => {
    renderHero();
    const rails = screen.getAllByRole("navigation", {
      name: "Hero slide navigation",
    });
    expect(rails).toHaveLength(2);
    for (const rail of rails) {
      expect(rail.querySelectorAll("button")).toHaveLength(6);
    }
  });

  it("still builds a full rail when a product key is missing", () => {
    const hero = (key: string) => {
      if (key.startsWith("slides.crm")) throw new Error("MISSING_MESSAGE");
      const value = key
        .split(".")
        .reduce<unknown>(
          (acc, part) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[part]
              : undefined,
          messages.agentic.hero,
        );
      return typeof value === "string" ? value : key;
    };
    const copy = buildHeroSliderCopy({
      hero,
      home: translate("home.hero"),
    });

    expect(copy.slides).toHaveLength(6);
    const crm = copy.slides.find((slide) => slide.key === "crm");
    expect(crm?.titleLead).toBe("crm:");
  });

  it("keeps the chat demo on ecosystem only and assigns stage visuals", () => {
    const copy = buildHeroSliderCopy({
      hero: translate("agentic.hero"),
      home: translate("home.hero"),
    });
    const ecosystem = copy.slides.find((slide) => slide.key === "ecosystem");
    expect(ecosystem?.visual).toBeNull();

    for (const slide of copy.slides.filter((s) => s.key !== "ecosystem")) {
      expect(slide.visual, slide.key).toBeTruthy();
    }
    expect(copy.slides.find((slide) => slide.key === "mini")?.visual).toBe(
      "/images/home/mini-agent.jpeg",
    );
  });
});
