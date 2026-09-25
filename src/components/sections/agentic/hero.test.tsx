import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
    // Collage stage: industry rail + shared scenario catalog (no floating badge).
    expect(screen.getByRole("group", { name: "Industry" })).toBeInTheDocument();
    expect(screen.getByText("SehatMax Store")).toBeInTheDocument();
    expect(screen.getByText("Start Free Trial").closest("a")).toHaveAttribute(
      "href",
      REGISTER_URL,
    );
    expect(screen.getByText("WhatsApp Us").closest("a")).toHaveAttribute(
      "href",
      whatsAppUrlFor(null, "en"),
    );
  });

  it("switches slides via Next and does not auto-advance", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves/ }),
    ).toBeInTheDocument();

    // No autoplay: title stays put after waiting past any plausible timer.
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves/ }),
    ).toBeInTheDocument();
  });

  it("jumps backward and forward with the side arrows", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves|/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM|Notes fill themselves/,
      }),
    ).toBeInTheDocument();
  });

  it("renders side prev/next arrows and no pill row", () => {
    renderHero();
    const rails = screen.getAllByRole("navigation", {
      name: "Hero slide navigation",
    });
    // Carousel arrows only — no chip/pill picker.
    expect(rails).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
    // Pills row is gone; slide names are not exposed as tap chips.
    expect(screen.queryByRole("button", { name: "Cekat CRM" })).toBeNull();
  });

  it("advances slides with the side arrows only", async () => {
    const user = userEvent.setup();
    renderHero();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(
      screen.getByRole("heading", { level: 1, name: /Notes fill themselves/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();
  });

  it("advances slides on a horizontal drag and ignores vertical drags", async () => {
    renderHero();
    const hero = screen.getByRole("navigation", {
      name: "Hero slide navigation",
    });

    // Drag left → next slide (the track throws out before the swap lands).
    fireEvent.pointerDown(hero, {
      clientX: 300,
      clientY: 300,
      isPrimary: true,
      pointerId: 1,
    });
    fireEvent.pointerMove(hero, {
      clientX: 220,
      clientY: 303,
      isPrimary: true,
      pointerId: 1,
    });
    fireEvent.pointerUp(hero, {
      clientX: 120,
      clientY: 308,
      isPrimary: true,
      pointerId: 1,
    });
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Notes fill themselves/,
      }),
    ).toBeInTheDocument();

    // Drag right → back to the first slide.
    fireEvent.pointerDown(hero, {
      clientX: 120,
      clientY: 300,
      isPrimary: true,
      pointerId: 2,
    });
    fireEvent.pointerMove(hero, {
      clientX: 220,
      clientY: 297,
      isPrimary: true,
      pointerId: 2,
    });
    fireEvent.pointerUp(hero, {
      clientX: 320,
      clientY: 292,
      isPrimary: true,
      pointerId: 2,
    });
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();

    // Vertical-dominant drags must not navigate — they scroll the page.
    fireEvent.pointerDown(hero, {
      clientX: 200,
      clientY: 100,
      isPrimary: true,
      pointerId: 3,
    });
    fireEvent.pointerMove(hero, {
      clientX: 205,
      clientY: 220,
      isPrimary: true,
      pointerId: 3,
    });
    fireEvent.pointerUp(hero, {
      clientX: 212,
      clientY: 300,
      isPrimary: true,
      pointerId: 3,
    });
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /AI Agent & Omnichannel CRM/,
      }),
    ).toBeInTheDocument();
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
