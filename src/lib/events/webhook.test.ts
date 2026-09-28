import { describe, expect, it } from "vitest";
import {
  checkWebhookUrl,
  parseSheetUrl,
  resolveDeliverTarget,
} from "./webhook";

describe("checkWebhookUrl", () => {
  it("rejects an empty link", () => {
    const result = checkWebhookUrl("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects a non-URL", () => {
    const result = checkWebhookUrl("bukan-url");
    expect(result.ok).toBe(false);
  });

  it("rejects http (only https webhooks are forwarded)", () => {
    const result = checkWebhookUrl("http://example.com/hook");
    expect(result.ok).toBe(false);
  });

  it("flags a plain spreadsheet edit URL with an actionable message", () => {
    const result = checkWebhookUrl(
      "https://docs.google.com/spreadsheets/d/abc123/edit?gid=0#gid=0",
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("link Google Sheet/Forms biasa");
      expect(result.error).toContain("/exec");
    }
  });

  it("flags a Google Forms edit URL too", () => {
    const result = checkWebhookUrl("https://docs.google.com/forms/d/abc/edit");
    expect(result.ok).toBe(false);
  });

  it("accepts an Apps Script web app URL", () => {
    const result = checkWebhookUrl(
      "https://script.google.com/macros/s/AKfycb-test/exec",
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url.hostname).toBe("script.google.com");
  });

  it("accepts any other https endpoint (custom webhooks)", () => {
    expect(checkWebhookUrl("https://hooks.example.com/sheet").ok).toBe(true);
  });
});

describe("parseSheetUrl", () => {
  it("parses an edit link with a gid", () => {
    const target = parseSheetUrl(
      "https://docs.google.com/spreadsheets/d/15GQj1tggxoOmnjuk5_4lYmBD4HIvWSV4kfdSRcg3v2o/edit?gid=0#gid=0",
    );
    expect(target).toEqual({
      spreadsheetId: "15GQj1tggxoOmnjuk5_4lYmBD4HIvWSV4kfdSRcg3v2o",
      gid: 0,
    });
  });

  it("parses a bare link without gid", () => {
    const target = parseSheetUrl(
      "https://docs.google.com/spreadsheets/d/abc-DEF_123/edit",
    );
    expect(target).toEqual({ spreadsheetId: "abc-DEF_123", gid: null });
  });

  it("rejects published /d/e/ links (not a spreadsheet id)", () => {
    expect(
      parseSheetUrl("https://docs.google.com/spreadsheets/d/e/2PACX-xyz/pubhtml"),
    ).toBeNull();
  });

  it("rejects non-sheets URLs", () => {
    expect(parseSheetUrl("https://script.google.com/macros/s/x/exec")).toBeNull();
    expect(parseSheetUrl("not a url")).toBeNull();
  });
});

describe("resolveDeliverTarget", () => {
  it("classifies an empty link", () => {
    expect(resolveDeliverTarget("").kind).toBe("empty");
  });

  it("sends plain sheet links to the Sheets API path", () => {
    const result = resolveDeliverTarget(
      "https://docs.google.com/spreadsheets/d/abc123/edit#gid=0",
    );
    expect(result.kind).toBe("sheet");
  });

  it("sends Apps Script /exec links to the webhook path", () => {
    const result = resolveDeliverTarget(
      "https://script.google.com/macros/s/AKfycb/exec",
    );
    expect(result.kind).toBe("webhook");
  });

  it("flags published share links with an actionable message", () => {
    const result = resolveDeliverTarget(
      "https://docs.google.com/spreadsheets/d/e/2PACX-xyz/pubhtml",
    );
    expect(result.kind).toBe("error");
    if (result.kind === "error") expect(result.error).toContain("address bar");
  });
});
