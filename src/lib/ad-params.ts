/**
 * Ad-attribution parameters captured on landing and forwarded to the app
 * (chat.cekat.ai) so a signup can be tied back to the ad that drove it.
 * Shared by the middleware (capture) and the client (append) — keep it pure.
 */

/** JS-readable cookie the middleware writes and the client reads. */
export const AD_COOKIE = "cekat_ads";
export const AD_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

// Keep the cookie comfortably under the ~4 KB browser limit (Next url-encodes it).
const MAX_QUERY_LENGTH = 3500;

/**
 * Presence of any of these marks the URL as an ad landing, at which point the
 * WHOLE query string is captured (not just these keys) — ad networks tack on
 * many bespoke params (gc_id, gad_*, h_*, …) we can't enumerate. Names are
 * matched case-insensitively; prefixes match the start of the key.
 */
const AD_MARKER_PREFIXES = ["utm_", "gad_"];
const AD_MARKERS = new Set([
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "gclsrc",
  "gc_id",
  "fbclid",
  "fbc_id",
  "fbc",
  "ttclid",
  "msclkid",
  "li_fat_id",
  "twclid",
  "sccid",
  "epik",
  "rdt_cid",
  "irclickid",
  "mc_cid",
  "mc_eid",
  // Cekat's own params, set from Meta's dynamic macros
  // (c_source={{site_source_name}}, c_adid={{ad.id}}). They are markers in
  // their own right because Meta does not always append fbclid, and without a
  // marker the whole landing would be captured as non-ad traffic.
  "c_source",
  "c_adid",
]);

function isAdMarker(key: string): boolean {
  const k = key.toLowerCase();
  return AD_MARKER_PREFIXES.some((p) => k.startsWith(p)) || AD_MARKERS.has(k);
}

// Framework/query internals we never store or forward.
function isInternalParam(key: string): boolean {
  return key.startsWith("_"); // e.g. Next's _rsc on soft navigations
}

/**
 * A template macro the ad platform failed to substitute. Meta uses double
 * braces ("{{ad.id}}"); Google uses single ones ("{placement}", "{keyword}"),
 * and a truncated "{placement" shows up in real traffic. Storing any of these
 * would forward junk into the CRM, so the param is dropped.
 */
function isUnsubstitutedMacro(value: string): boolean {
  return (
    value.includes("{{") ||
    value.includes("}}") ||
    value.startsWith("{") ||
    value.endsWith("}")
  );
}

/**
 * Ad platform, inferred from whichever click ID the network appended. Order
 * matters only in the unlikely case a URL carries two networks' IDs.
 */
const PLATFORM_BY_PARAM: ReadonlyArray<readonly [string, string]> = [
  ["fbclid", "meta"],
  ["fbc_id", "meta"],
  ["fbc", "meta"],
  ["gclid", "google"],
  ["gbraid", "google"],
  ["wbraid", "google"],
  ["gclsrc", "google"],
  ["dclid", "google"],
  ["gc_id", "google"],
  ["ttclid", "tiktok"],
  ["msclkid", "bing"],
  ["li_fat_id", "linkedin"],
  ["twclid", "twitter"],
  ["rdt_cid", "reddit"],
  ["epik", "pinterest"],
  ["sccid", "snapchat"],
];

/**
 * Which params carry the AD (creative) id on each platform, in order of
 * confidence, confirmed against live ad URLs. Deliberately not the click id
 * (fbclid / gclid): those are unique per click, so they could never be grouped
 * by ad, and they already ride along in the captured query anyway.
 *
 * Google's hierarchy is unambiguous in real traffic:
 *   gc_id == utm_campaign == gad_campaignid  -> campaign
 *   h_ga_id == utm_content                   -> ad group
 *   h_ad_id                                  -> the ad
 * On Meta, fbc_id == utm_term, both being the slot templates fill with
 * {{ad.id}}. Plenty of live Meta ads send no fbc_id at all and carry the id
 * only in utm_term, which is why that fallback exists; without it those
 * landings derived c_source but no c_adid.
 *
 * utm_term is trusted only when it looks like an id, because in other setups
 * (and on Google, which never consults it) that slot holds a keyword. Ad ids
 * are long integers, so a phrase is rejected rather than stored as one.
 *
 * Platforms absent here simply get no c_adid rather than a guess.
 */
type AdIdSource = {
  param: string;
  /** Only accept a run of digits, for a slot that may hold a keyword. */
  idShapedOnly?: boolean;
};

const AD_ID_SOURCES: Record<string, readonly AdIdSource[]> = {
  meta: [{ param: "fbc_id" }, { param: "utm_term", idShapedOnly: true }],
  google: [{ param: "h_ad_id" }],
};

const AD_ID_RE = /^\d{6,}$/;

function derivePlatform(params: URLSearchParams): string | undefined {
  for (const [key, platform] of PLATFORM_BY_PARAM) {
    if (params.get(key)) return platform;
  }
  for (const key of params.keys()) {
    if (key.toLowerCase().startsWith("gad_")) return "google";
  }
  return undefined;
}

/**
 * Fills in Cekat's normalized params so every ad click carries them without
 * configuring each ad in every network. Anything the URL already supplies
 * wins: an explicit c_source from Meta's {{site_source_name}} macro is more
 * precise than what we can infer (it distinguishes fb / ig / an / msg,
 * whereas we can only tell the platform apart).
 */
function addCekatParams(out: URLSearchParams): void {
  const platform = derivePlatform(out);
  if (!platform) return;

  if (!out.has("c_source")) out.set("c_source", platform);

  if (!out.has("c_adid")) {
    for (const { param, idShapedOnly } of AD_ID_SOURCES[platform] ?? []) {
      const adId = out.get(param);
      if (!adId) continue;
      if (idShapedOnly && !AD_ID_RE.test(adId)) continue;
      out.set("c_adid", adId);
      break;
    }
  }
}

/**
 * If the URL is an ad landing (has at least one ad marker), returns its entire
 * query string (minus framework internals) so all attribution params carry
 * over. Otherwise returns "" — so ordinary navigation never clobbers a stored
 * value.
 */
export function extractAdParams(search: URLSearchParams): string {
  const out = new URLSearchParams();
  let hasMarker = false;
  let size = 0;
  for (const [key, value] of search) {
    if (!value || isInternalParam(key)) continue;
    // Dropped before the marker check: a macro the platform never substituted
    // carries no information, so it must not mark this as an ad landing either.
    if (isUnsubstitutedMacro(value)) continue;
    if (isAdMarker(key)) hasMarker = true;
    const cost = key.length + value.length + 2;
    if (size + cost > MAX_QUERY_LENGTH) continue;
    out.set(key, value);
    size += cost;
  }
  if (!hasMarker) return "";
  addCekatParams(out);
  return out.toString();
}

/**
 * Adds Cekat's derived params to `params`, in place, when the URL is an ad
 * landing that does not already carry them. Returns true when it changed
 * something, so a caller can skip a pointless history write.
 *
 * Purely additive. The address bar belongs to whatever the ad platform sent,
 * so nothing is removed or overwritten here, even though `extractAdParams`
 * drops empty values and unsubstituted macros for the cookie. An organic
 * landing derives nothing and is left exactly as it arrived, which is what
 * keeps 90-day cookie values from being painted onto a later non-ad visit.
 */
export function deriveMissingAdParams(params: URLSearchParams): boolean {
  const derived = new URLSearchParams(extractAdParams(params));
  let changed = false;
  for (const key of ["c_source", "c_adid"] as const) {
    const value = derived.get(key);
    if (value && !params.has(key)) {
      params.set(key, value);
      changed = true;
    }
  }
  return changed;
}

/**
 * Appends a stored ad-param query string to a base URL. Existing params on the
 * base URL win, so we never clobber an intentional query on the target.
 */
export function appendAdParams(baseUrl: string, stored: string): string {
  if (!stored) return baseUrl;
  const [path, existing = ""] = baseUrl.split("?");
  const params = new URLSearchParams(existing);
  for (const [key, value] of new URLSearchParams(stored)) {
    if (!params.has(key)) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
