import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppAnchor } from "./app-anchor";

const REGISTER = "https://chat.cekat.ai/register";

function setAdCookie(value: string) {
  // Value is stored URL-encoded by the middleware; the hook decodes it.
  document.cookie = `cekat_ads=${encodeURIComponent(value)}; path=/`;
}

afterEach(() => {
  document.cookie = "cekat_ads=; path=/; max-age=0";
});

describe("AppAnchor", () => {
  it("renders the bare base URL when no ad cookie is present", () => {
    render(<AppAnchor href={REGISTER}>Register</AppAnchor>);
    expect(screen.getByText("Register").closest("a")).toHaveAttribute(
      "href",
      REGISTER,
    );
  });

  it("appends the captured ad params from the cookie", () => {
    setAdCookie("utm_source=google&gclid=abc123&fbc_id=xyz");
    render(<AppAnchor href={REGISTER}>Register</AppAnchor>);
    expect(screen.getByText("Register").closest("a")).toHaveAttribute(
      "href",
      `${REGISTER}?utm_source=google&gclid=abc123&fbc_id=xyz`,
    );
  });

  it("forwards className and other props to the anchor", () => {
    render(
      <AppAnchor href={REGISTER} className="cta">
        Register
      </AppAnchor>,
    );
    expect(screen.getByText("Register").closest("a")).toHaveClass("cta");
  });
});
