import type { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/crm",
  // next-intl's locale-aware Link; the `locale` prop is not a DOM attribute.
  Link: ({
    children,
    locale,
    ...props
  }: ComponentProps<"a"> & { locale?: string }) => {
    void locale;
    return <a {...props}>{children}</a>;
  },
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({}),
}));

function renderWithIntl(locale: string) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={{ common: { languageName: locale } }}
    >
      <LanguageSwitcher currentLocale={locale} />
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  it("shows the current language on the trigger", () => {
    renderWithIntl("en");
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("shows the current language for the other locale too", () => {
    renderWithIntl("id");
    expect(screen.getByText("Indonesian")).toBeInTheDocument();
  });
});
