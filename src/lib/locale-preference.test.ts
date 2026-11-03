import { beforeEach, describe, expect, it } from "vitest";
import { LOCALE_COOKIE } from "@/i18n/routing";
import { rememberLocaleFromLinkTarget } from "./locale-preference";

describe("locale preference links", () => {
  beforeEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`;
  });

  it("persists Indonesian when its language-menu link is selected", () => {
    const link = document.createElement("a");
    link.dataset.locale = "id";
    const label = document.createElement("span");
    link.append(label);

    expect(rememberLocaleFromLinkTarget(label)).toBe(true);
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=id`);
  });

  it("ignores links without a supported locale", () => {
    const link = document.createElement("a");
    link.dataset.locale = "unsupported";

    expect(rememberLocaleFromLinkTarget(link)).toBe(false);
    expect(document.cookie).not.toContain(LOCALE_COOKIE);
  });
});
