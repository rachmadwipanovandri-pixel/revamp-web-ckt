import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Integrations } from "./integrations";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(async () => "id"),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

describe("Integrations", () => {
  it("renders gradient icon IDs deterministically across server renders", async () => {
    const firstMarkup = renderToStaticMarkup(await Integrations());
    const secondMarkup = renderToStaticMarkup(await Integrations());

    expect(secondMarkup).toBe(firstMarkup);
  });
});
