import { describe, it, expect } from "vitest";
import {
  extractAdParams,
  appendAdParams,
  deriveMissingAdParams,
} from "./ad-params";

describe("extractAdParams", () => {
  it("captures the ENTIRE query string on an ad landing (any marker present)", () => {
    const search = new URLSearchParams(
      "utm_source=google&utm_medium=cpc&gclid=abc123&custom=keep",
    );
    // c_source is derived from gclid; there is no gc_id here, so no c_adid.
    expect(extractAdParams(search)).toBe(
      "utm_source=google&utm_medium=cpc&gclid=abc123&custom=keep&c_source=google",
    );
  });

  it("captures bespoke Google Ads params when a marker like gbraid/gad_ is present", () => {
    const search = new URLSearchParams(
      "gc_id=24021462646&h_ga_id=193485815010&h_keyword=cekat%20crm&gad_source=1&gad_campaignid=24021462646&gbraid=0AAAAA",
    );
    // No h_ad_id in this one, so c_adid is omitted rather than guessed from
    // gc_id, which is the campaign.
    expect(extractAdParams(search)).toBe(
      "gc_id=24021462646&h_ga_id=193485815010&h_keyword=cekat+crm&gad_source=1&gad_campaignid=24021462646&gbraid=0AAAAA" +
        "&c_source=google",
    );
  });

  it("returns '' when there is no ad marker (ordinary navigation)", () => {
    expect(extractAdParams(new URLSearchParams("page=2&q=search"))).toBe("");
    expect(extractAdParams(new URLSearchParams(""))).toBe("");
  });

  it("drops framework internals like _rsc", () => {
    expect(extractAdParams(new URLSearchParams("gclid=x&_rsc=abc"))).toBe(
      "gclid=x&c_source=google",
    );
  });

  it("captures Cekat's Meta params even when fbclid is absent", () => {
    // Meta substitutes c_source={{site_source_name}} and c_adid={{ad.id}}, but
    // does not always append fbclid, so these must be markers themselves.
    expect(
      extractAdParams(new URLSearchParams("c_source=fb&c_adid=120210001")),
    ).toBe("c_source=fb&c_adid=120210001");
  });

  it("drops macros the ad platform never substituted", () => {
    // A literal {{ad.id}} would otherwise be forwarded into the CRM as data.
    expect(
      extractAdParams(new URLSearchParams("c_source=fb&c_adid={{ad.id}}")),
    ).toBe("c_source=fb");
  });

  it("derives c_source and c_adid for a Meta click", () => {
    // No macros configured on the ad: c_source comes from the click ID and
    // c_adid from fbc_id, so attribution works with zero platform config.
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams(
          "utm_source=meta&fbc_id=120249809613040072&fbclid=PAdGRle",
        ),
      ),
    );
    expect(out.get("c_source")).toBe("meta");
    expect(out.get("c_adid")).toBe("120249809613040072");
  });

  it("takes the Meta ad id from utm_term when the ad sends no fbc_id", () => {
    // A real cekat.ai Meta landing: fbclid is present, fbc_id is not, and the
    // ad id sits in utm_term. This used to derive c_source but no c_adid.
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams(
          "c_utm_source=120249519334680069&utm_medium=paid&utm_source=th" +
            "&utm_id=120249519334680069&utm_content=120249519334660069" +
            "&utm_term=120249519334640069&utm_campaign=120249519334680069" +
            "&fbclid=PAcGRvZgRleHRuA2FlbQEwAGFkaWQBqzZN",
        ),
      ),
    );
    expect(out.get("c_source")).toBe("meta");
    expect(out.get("c_adid")).toBe("120249519334640069");
  });

  it("refuses a utm_term that is a keyword rather than an ad id", () => {
    // Some setups put a search term in that slot; storing it as c_adid would
    // put a phrase where the CRM expects a creative id.
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams("fbclid=abc123&utm_term=chatbot+whatsapp+murah"),
      ),
    );
    expect(out.get("c_source")).toBe("meta");
    expect(out.get("c_adid")).toBeNull();
  });

  it("never reads utm_term as the ad id on Google, where it is the keyword", () => {
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams("gclid=xyz789&utm_term=123456789012345"),
      ),
    );
    expect(out.get("c_source")).toBe("google");
    expect(out.get("c_adid")).toBeNull();
  });

  it("derives c_source and c_adid for a Google click", () => {
    // h_ad_id is the creative. gc_id here equals utm_campaign and
    // gad_campaignid, so it is the campaign and must NOT be used.
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams(
          "utm_campaign=22149994248&gc_id=22149994248&gad_campaignid=22149994248" +
            "&h_ga_id=176909855907&h_ad_id=811583692513&gclid=Cj0KCQjw",
        ),
      ),
    );
    expect(out.get("c_source")).toBe("google");
    expect(out.get("c_adid")).toBe("811583692513");
  });

  it("drops Google's single-brace macros when they fail to substitute", () => {
    // Real traffic carries a truncated "h_placement={placement".
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams(
          "gclid=abc&h_ad_id=811583692513&h_placement={placement&h_keyword={keyword}",
        ),
      ),
    );
    expect(out.has("h_placement")).toBe(false);
    expect(out.has("h_keyword")).toBe(false);
    expect(out.get("c_adid")).toBe("811583692513");
  });

  it("lets an explicit c_source from the ad platform win over inference", () => {
    // {{site_source_name}} resolves to the placement (fb / ig / an), which is
    // more precise than the platform we can infer.
    const out = new URLSearchParams(
      extractAdParams(
        new URLSearchParams("fbclid=x&fbc_id=999&c_source=ig&c_adid=111"),
      ),
    );
    expect(out.get("c_source")).toBe("ig");
    expect(out.get("c_adid")).toBe("111");
  });

  it("omits c_adid when the platform has no known ad-id param", () => {
    const out = new URLSearchParams(
      extractAdParams(new URLSearchParams("ttclid=tt1&utm_source=tiktok")),
    );
    expect(out.get("c_source")).toBe("tiktok");
    expect(out.has("c_adid")).toBe(false);
  });

  it("adds nothing to a non-ad visit", () => {
    expect(extractAdParams(new URLSearchParams("page=2"))).toBe("");
  });

  it("treats an all-macro URL as non-ad traffic", () => {
    // Nothing valid survives, so it must not clobber a previously stored visit.
    expect(
      extractAdParams(
        new URLSearchParams("c_source={{site_source_name}}&c_adid={{ad.id}}"),
      ),
    ).toBe("");
  });
});

describe("appendAdParams", () => {
  it("appends stored params to a bare app URL", () => {
    expect(
      appendAdParams(
        "https://chat.cekat.ai/register",
        "utm_source=google&gclid=abc",
      ),
    ).toBe("https://chat.cekat.ai/register?utm_source=google&gclid=abc");
  });

  it("returns the base URL unchanged when nothing is stored", () => {
    expect(appendAdParams("https://chat.cekat.ai/register", "")).toBe(
      "https://chat.cekat.ai/register",
    );
  });

  it("does not clobber params already on the base URL", () => {
    expect(
      appendAdParams(
        "https://chat.cekat.ai/register?utm_source=direct",
        "utm_source=google&gclid=abc",
      ),
    ).toBe("https://chat.cekat.ai/register?utm_source=direct&gclid=abc");
  });
});

describe("deriveMissingAdParams", () => {
  it("adds c_source and c_adid to a Meta landing", () => {
    const params = new URLSearchParams(
      "utm_term=120249519334640069&fbclid=PAcGRvZgRleHRu",
    );
    expect(deriveMissingAdParams(params)).toBe(true);
    expect(params.get("c_source")).toBe("meta");
    expect(params.get("c_adid")).toBe("120249519334640069");
  });

  it("adds them to a Google landing", () => {
    const params = new URLSearchParams("gclid=abc&h_ad_id=816703290389");
    expect(deriveMissingAdParams(params)).toBe(true);
    expect(params.get("c_source")).toBe("google");
    expect(params.get("c_adid")).toBe("816703290389");
  });

  it("leaves an organic landing untouched", () => {
    // The cookie may still hold a 90-day-old ad landing; painting it onto this
    // URL would invent attribution that never happened.
    const params = new URLSearchParams("ref=newsletter");
    expect(deriveMissingAdParams(params)).toBe(false);
    expect(params.toString()).toBe("ref=newsletter");
  });

  it("never overwrites what the platform already sent", () => {
    const params = new URLSearchParams(
      "fbclid=abc&utm_term=120249519334640069&c_adid=999&c_source=ig",
    );
    expect(deriveMissingAdParams(params)).toBe(false);
    expect(params.get("c_adid")).toBe("999");
    expect(params.get("c_source")).toBe("ig");
  });

  it("only ever adds, never drops what extractAdParams would filter", () => {
    // extractAdParams strips empty values and unsubstituted macros for the
    // cookie; the address bar keeps them, because it is the platform's.
    const params = new URLSearchParams(
      "gclid=abc&h_ad_id=816703290389&h_placement=&h_keyword={keyword}",
    );
    deriveMissingAdParams(params);
    expect(params.has("h_placement")).toBe(true);
    expect(params.get("h_keyword")).toBe("{keyword}");
    expect(params.get("c_adid")).toBe("816703290389");
  });
});
