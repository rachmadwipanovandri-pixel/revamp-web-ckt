import { describe, expect, it } from "vitest";
import { isValidEvent, readEvents, readListedEvents } from "./store";
import type { EventItem } from "./types";

function baseEvent(overrides: Partial<EventItem> = {}): EventItem {
  return {
    slug: "event-contoh",
    status: "published",
    title: "Contoh",
    badge: "",
    excerpt: "",
    cover: "",
    startsAt: "2030-01-01T10:00:00+07:00",
    dateLabel: "",
    timeLabel: "",
    locationLabel: "",
    priceLabel: "",
    registrationWebhook: "",
    sections: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("isValidEvent", () => {
  it("accepts a well-formed event", () => {
    expect(isValidEvent(baseEvent())).toBe(true);
  });

  it("rejects slugs that are not url-safe", () => {
    expect(isValidEvent(baseEvent({ slug: "Event Contoh!" }))).toBe(false);
    expect(isValidEvent(baseEvent({ slug: "UPPER" }))).toBe(false);
  });

  it("rejects unknown status values", () => {
    expect(
      isValidEvent({ ...baseEvent(), status: "live" as EventItem["status"] }),
    ).toBe(false);
  });

  it("rejects malformed sections", () => {
    expect(isValidEvent(baseEvent({ sections: [{ id: "x" }] as never }))).toBe(
      false,
    );
    expect(isValidEvent(baseEvent({ sections: "hero" as never }))).toBe(false);
  });

  it("rejects non-objects", () => {
    expect(isValidEvent(null)).toBe(false);
    expect(isValidEvent("event")).toBe(false);
    expect(isValidEvent([])).toBe(false);
  });
});

describe("readListedEvents", () => {
  it("only surfaces published events, upcoming before past", () => {
    const listed = readListedEvents();
    const published = readEvents().filter((e) => e.status === "published");
    expect(listed).toHaveLength(published.length);

    const firstPast = listed.findIndex((e) => e.isPast);
    if (firstPast !== -1) {
      // Everything after the first past event must also be past.
      expect(listed.slice(firstPast).every((e) => e.isPast)).toBe(true);
    }
    // isPast must agree with startsAt.
    const now = Date.now();
    for (const event of listed) {
      expect(event.isPast).toBe(new Date(event.startsAt).getTime() < now);
    }
  });
});
