import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CONTENT } from "./content";
import { HeroForm } from "./HeroForm";

const form = CONTENT.id.hero.form;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("preview-home-2 hero email form", () => {
  it("blocks an empty submit and announces why", async () => {
    const user = userEvent.setup();
    render(<HeroForm form={form} />);

    await user.click(screen.getByRole("button", { name: form.cta }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      form.errorRequired,
    );
    expect(screen.getByLabelText(form.label)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("rejects a malformed address", async () => {
    const user = userEvent.setup();
    render(<HeroForm form={form} />);

    await user.type(screen.getByLabelText(form.label), "bukan-email");
    await user.click(screen.getByRole("button", { name: form.cta }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      form.errorInvalid,
    );
  });

  it("clears the error as soon as the visitor keeps typing", async () => {
    const user = userEvent.setup();
    render(<HeroForm form={form} />);

    await user.click(screen.getByRole("button", { name: form.cta }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText(form.label), "a");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByText(form.note)).toBeInTheDocument();
  });

  it("hands a valid address to the register flow", async () => {
    const user = userEvent.setup();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    render(<HeroForm form={form} />);

    await user.type(screen.getByLabelText(form.label), "budi@perusahaan.com");
    await user.click(screen.getByRole("button", { name: form.cta }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
