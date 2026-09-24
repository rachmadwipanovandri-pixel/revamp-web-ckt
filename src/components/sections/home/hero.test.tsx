import { describe, it, expect, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { Hero } from "./hero";
import { HERO_CHAT_SCENARIOS } from "@/lib/hero-chat";
import { REGISTER_URL, whatsAppUrlFor } from "@/lib/links";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const messages = {
  home: {
    hero: {
      eyebrow: "#1 AI in Indonesia",
      title: "Maximize Every Customer's Revenue Potential With AI",
      subtitle: "Cekat.AI is Indonesia's leading AI agent platform.",
      ctaPrimary: "WhatsApp Us",
      ctaSecondary: "Start Free Trial",
    },
  },
};

function modeButton(label: string, variant: "desktop" | "mobile" = "mobile") {
  const tabs = document.querySelector(
    `[data-conversation-mode-tabs="${variant}"]`,
  );
  return within(tabs as HTMLElement).getByRole("button", { name: label });
}

function renderHero() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Hero />
    </NextIntlClientProvider>,
  );
}

describe("Hero", () => {
  it("renders the H1, subtitle, and both CTAs in navbar order", () => {
    renderHero();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Maximize Every Customer/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Indonesia's leading AI agent platform/),
    ).toBeInTheDocument();
    expect(screen.getByText("Start Free Trial").closest("a")).toHaveAttribute(
      "href",
      REGISTER_URL,
    );
    expect(screen.getByText("WhatsApp Us").closest("a")).toHaveAttribute(
      "href",
      whatsAppUrlFor(null, "en"),
    );
    // WhatsApp leads and the trial follows, matching the navbar so a visitor
    // who scrolled past the header meets the same primary action.
    const ctas = [...document.querySelectorAll("a")]
      .map((a) => a.textContent?.trim())
      .filter((t) => t === "WhatsApp Us" || t === "Start Free Trial");
    expect(ctas).toEqual(["WhatsApp Us", "Start Free Trial"]);
  });

  it("opens Retail in Lead Generation with the SehatMax client", () => {
    renderHero();
    expect(modeButton("Lead Generation")).toBeInTheDocument();
    expect(screen.getByText("SehatMax Store")).toBeInTheDocument();
    expect(
      screen.getByText(/Vitamin C 1000mg still available/),
    ).toBeInTheDocument();
  });

  it("holds the opening message long enough to read before showing the product", () => {
    vi.useFakeTimers();

    try {
      renderHero();
      expect(
        screen.queryByRole("img", { name: "Vitamin C 1000mg" }),
      ).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1900);
      });
      expect(
        screen.queryByRole("img", { name: "Vitamin C 1000mg" }),
      ).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(
        screen.getByRole("img", { name: "Vitamin C 1000mg" }),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("switches Retail to its Customer Service conversation", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(modeButton("Customer Service"));

    expect(modeButton("Customer Service")).toBeInTheDocument();
    expect(
      screen.getByText(/order INV-2026-0818 has not arrived after three days/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Vitamin C 1000mg still available/),
    ).not.toBeInTheDocument();
  });

  it("places the conversation mode tabs inside the device screen", async () => {
    const user = userEvent.setup();
    renderHero();

    const frame = document.querySelector("[data-ipad-frame]") as HTMLElement;
    const desktopModeTabs = document.querySelector(
      '[data-conversation-mode-tabs="desktop"]',
    ) as HTMLElement;
    const mobileModeTabs = document.querySelector(
      '[data-conversation-mode-tabs="mobile"]',
    ) as HTMLElement;
    const desktopHeader = desktopModeTabs.closest(
      "[data-whatsapp-header]",
    ) as HTMLElement | null;

    expect(frame).toContainElement(desktopModeTabs);
    expect(frame).toContainElement(mobileModeTabs);
    expect(desktopHeader).toContainElement(desktopModeTabs);
    expect(mobileModeTabs.closest("[data-whatsapp-header]")).toBeNull();
    const actionRow = document.querySelector(
      "[data-whatsapp-action-row]",
    ) as HTMLElement;
    expect(actionRow).toHaveClass("justify-between");
    expect(actionRow).toContainElement(desktopModeTabs);
    // Header pills stay in the DOM and fade with max-width so layout can
    // interpolate during the device morph (no display jump).
    expect(desktopModeTabs).toHaveClass("hidden", "sm:flex", "sm:opacity-100");
    expect(mobileModeTabs).toHaveClass("flex");
    expect(
      document.querySelector('[data-mode-tabs-shell="mobile"]'),
    ).toHaveClass("sm:grid-rows-[0fr]");
    expect(desktopModeTabs).toHaveClass("bg-transparent", "border-0");
    expect(
      within(desktopModeTabs as HTMLElement).getByRole("button", {
        name: "Lead Generation",
      }),
    ).toHaveClass("bg-white");
    expect(desktopModeTabs).toHaveClass("sm:w-auto");
    expect(mobileModeTabs).toHaveClass("w-full");

    await user.click(modeButton("Customer Service", "desktop"));
    expect(modeButton("Customer Service", "mobile")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps the selected mode while switching industries", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(modeButton("Customer Service"));
    await user.click(screen.getByRole("button", { name: "Travel" }));

    expect(
      screen.getByRole("button", { name: "Travel", pressed: true }),
    ).toBeInTheDocument();
    expect(modeButton("Customer Service")).toBeInTheDocument();
    expect(screen.getByText("Liburan Travel")).toBeInTheDocument();
    expect(
      screen.getByText(
        /change my Bali departure date from September 15 to September 22/,
      ),
    ).toBeInTheDocument();
  });

  it("keeps external industry tabs and omits client label pills", () => {
    renderHero();

    for (const label of ["Retail", "Travel", "Clinic", "Education"]) {
      const industryButtons = screen.getAllByRole("button", { name: label });
      expect(industryButtons).toHaveLength(1);
      expect(industryButtons[0]).toHaveAttribute("data-industry-tab");
      expect(industryButtons[0]).toHaveAttribute("aria-pressed");
    }
    expect(document.querySelector("[data-industry-tabs]")).toContainElement(
      screen.getByRole("button", { name: "Retail" }),
    );
    expect(document.querySelector("[data-ipad-dock]")).toBeNull();
    expect(
      screen.queryByText(
        /(SehatMax Store|Liburan Travel|GlassSkin Clinic|English Training) ·/,
      ),
    ).not.toBeInTheDocument();
  });

  it("stamps the retail Lead Generation conversation with its own time", () => {
    renderHero();
    // The same timestamp appears in the status bar and under the opening
    // message, so the iPad chrome agrees with the selected script.
    expect(screen.getAllByText("11:06 PM")).toHaveLength(2);
    expect(screen.getByText("August 18, 2026")).toBeInTheDocument();
  });

  it("keeps the WhatsApp business header for the active industry", async () => {
    const user = userEvent.setup();
    renderHero();
    expect(screen.getByText("SehatMax Store")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText(/CekatAI Verified/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Travel" }));
    expect(screen.getByText("Liburan Travel")).toBeInTheDocument();
  });

  it("uses image-backed product cards in Retail Lead Generation", () => {
    const retail = HERO_CHAT_SCENARIOS.find(
      (scenario) => scenario.key === "retail",
    );
    expect(retail?.modes.lead.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "product",
          product: expect.objectContaining({
            image: expect.objectContaining({
              src: "/images/home/hero-chat-vitamin-c.jpg",
            }),
          }),
        }),
        expect.objectContaining({
          kind: "product",
          product: expect.objectContaining({
            image: expect.objectContaining({
              src: "/images/home/hero-chat-omega-3.jpg",
            }),
          }),
        }),
      ]),
    );
  });

  it("keeps the complete product image inside its fixed media slot", () => {
    vi.useFakeTimers();

    try {
      renderHero();
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      const image = screen.getByRole("img", { name: "Vitamin C 1000mg" });
      expect(image).toHaveClass("object-contain");
      expect(image).not.toHaveClass("object-cover");
    } finally {
      vi.useRealTimers();
    }
  });

  it("points the composer at WhatsApp instead of faking an input", () => {
    renderHero();
    const composer = screen
      .getByLabelText(/Chat with the Cekat.AI team on WhatsApp/)
      .closest("a");
    expect(composer).toHaveAttribute("href", whatsAppUrlFor(null, "en"));
    expect(document.querySelector("form")).toBeNull();
    expect(document.querySelector("input")).toBeNull();
  });

  it("keeps the chat viewport compact for long payment cards", () => {
    renderHero();

    const chatThread = document.querySelector(
      "[data-chat-thread]",
    ) as HTMLElement | null;
    expect(chatThread).toHaveClass("pb-3", "scroll-pb-3");
  });

  it("renders a landscape tablet with interactive external industry tabs", async () => {
    const user = userEvent.setup();
    renderHero();

    const frame = document.querySelector("[data-ipad-frame]");
    expect(frame).toHaveAttribute("data-device-form", "tablet");
    expect(frame).toHaveAttribute("data-mobile-device", "tablet");
    expect(frame).toHaveClass("sm:aspect-4.5/4", "sm:h-auto");
    expect(frame).toHaveAttribute("data-ipad-frame", "true");
    // Island stays mounted at opacity-0 for a crossfade mid-morph.
    expect(document.querySelector('[data-phone-hardware="island"]')).toHaveClass(
      "opacity-0",
    );
    expect(document.querySelector('[data-ipad-hardware="camera"]')).toHaveClass(
      "opacity-100",
    );
    const industryTabs = document.querySelector(
      "[data-industry-tabs]",
    ) as HTMLElement | null;
    expect(industryTabs).toBeInTheDocument();
    expect(frame).not.toContainElement(industryTabs);
    expect(document.querySelector("[data-ipad-dock]")).toBeNull();

    for (const industry of ["retail", "travel", "healthcare", "education"]) {
      const industryTab = document.querySelector(
        `[data-industry-tab="${industry}"]`,
      );
      expect(industryTab).toHaveAttribute("type", "button");
      expect(industryTab).toHaveAttribute("aria-label");
      expect(industryTab).toHaveAttribute("aria-pressed");
      expect(industryTab).toHaveTextContent(
        industry === "healthcare"
          ? "Clinic"
          : industry.charAt(0).toUpperCase() + industry.slice(1),
      );
    }

    expect(
      document.querySelector('[data-industry-tab="retail"]'),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(
      screen.getByRole("button", { name: "Travel", pressed: false }),
    );
    expect(
      document.querySelector('[data-industry-tab="retail"]'),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      document.querySelector('[data-industry-tab="travel"]'),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("starts phone-shaped under sm and landscape on larger screens", () => {
    renderHero();

    const frame = document.querySelector("[data-ipad-frame]");
    expect(frame).toHaveClass(
      "h-[min(560px,72svh)]",
      "max-w-[330px]",
      "rounded-[2.75rem]",
      "sm:aspect-4.5/4",
      "sm:h-auto",
      "sm:max-w-none",
    );
    // Base form is tablet; the xs CSS still forces the phone silhouette.
    expect(frame).toHaveAttribute("data-device-form", "tablet");
  });

  it("auto-loops the hardware form from tablet to iPhone", () => {
    vi.useFakeTimers();

    try {
      renderHero();

      expect(
        document.querySelector("[data-ipad-frame]"),
      ).toHaveAttribute("data-device-form", "tablet");

      act(() => {
        vi.advanceTimersByTime(7600);
      });

      const frame = document.querySelector("[data-ipad-frame]");
      expect(frame).toHaveAttribute("data-device-form", "iphone");
      expect(frame).toHaveAttribute("data-mobile-device", "iphone");
      expect(
        document.querySelector('[data-phone-hardware="island"]'),
      ).toHaveClass("opacity-100");
      expect(frame).toHaveClass("sm:w-[300px]", "sm:h-[min(600px,68svh)]");

      // Phone form collapses header pills and expands the stacked tabs.
      const desktopModeTabs = document.querySelector(
        '[data-conversation-mode-tabs="desktop"]',
      ) as HTMLElement;
      const shell = document.querySelector(
        '[data-mode-tabs-shell="mobile"]',
      ) as HTMLElement;
      expect(desktopModeTabs).toHaveClass("sm:opacity-0", "sm:max-w-0");
      expect(shell).toHaveClass("grid-rows-[1fr]");

      act(() => {
        vi.advanceTimersByTime(7600);
      });
      expect(
        document.querySelector("[data-ipad-frame]"),
      ).toHaveAttribute("data-device-form", "tablet");
      expect(document.querySelector('[data-phone-hardware="island"]')).toHaveClass(
        "opacity-0",
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses compact typography and spacing for chat bubbles", () => {
    renderHero();

    const message = screen.getByText(/Vitamin C 1000mg still available/);
    const bubble = message.closest("[data-chat-bubble]");

    expect(bubble).toHaveClass("w-fit", "max-w-full", "px-3", "py-1.5");
    expect(message).toHaveClass("text-xs");
  });

  it("keeps the hero overflow-safe for the landscape iPad", () => {
    renderHero();

    const heroSection = screen
      .getByRole("heading", { level: 1 })
      .closest("section");
    expect(heroSection).toHaveClass("overflow-visible");
    expect(heroSection).not.toHaveClass("overflow-hidden");
  });

  it("constrains card bubbles with responsive max-width on tablet/desktop", () => {
    vi.useFakeTimers();

    try {
      renderHero();
      for (let i = 0; i < 14; i++) {
        act(() => {
          vi.advanceTimersByTime(3500);
        });
      }

      const invoiceTitle = screen.getByText(/Invoice · SehatMax Store/);
      expect(invoiceTitle).toBeInTheDocument();
      const cardWrapper = invoiceTitle.closest("[data-step-index]");
      expect(cardWrapper).toHaveClass("sm:max-w-[340px]");
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders vertical industry tabs with tooltips and a compact iPad on desktop", () => {
    renderHero();

    const industryTabs = document.querySelector("[data-industry-tabs]");
    expect(industryTabs?.firstElementChild).toHaveClass("lg:flex-col");
    expect(industryTabs).toHaveClass("lg:order-2");

    for (const industry of ["retail", "travel", "healthcare", "education"]) {
      const tooltip = document.querySelector(
        `[data-industry-tab-tooltip="${industry}"]`,
      );
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveClass(
        "lg:group-hover:opacity-100",
        "lg:group-focus-visible:opacity-100",
      );
    }

    const ipadFrame = document.querySelector("[data-ipad-frame]");
    expect(ipadFrame).toHaveClass("lg:max-w-145");
  });
});
