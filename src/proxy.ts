import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing, LOCALE_COOKIE } from "./i18n/routing";
import { toEnglishPath } from "./lib/geo-route";
import { AD_COOKIE, AD_COOKIE_MAX_AGE, extractAdParams } from "./lib/ad-params";

// Next 16 renamed Middleware → Proxy; next-intl's handler is the default export.
const handleI18n = createMiddleware(routing);

// Crawlers and link-preview scrapers must see the canonical default (Indonesian)
// at the root so geo redirection never interferes with indexing or hreflang.
// Google's non-crawler agents (Google-InspectionTool, GoogleOther, ...) carry no
// "bot" token, so they are matched explicitly: URL Inspection has to see exactly
// what Googlebot sees, or the report is about a page nobody else gets.
const BOT_RE =
  /bot|crawl|spider|slurp|mediapartners|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|embedly|linkedinbot|twitterbot|pinterest|google-inspectiontool|googleother|google-extended|google-read-aloud|apis-google|feedfetcher/i;

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Geo-aware locale routing. On any default-locale (Indonesian, unprefixed)
 * page, visitors from outside Indonesia are sent to the English (/en)
 * equivalent of that page; everyone else gets the Indonesian default. An
 * explicit NEXT_LOCALE cookie (set by the language switcher) always wins, so a
 * manual choice is never overridden, and known crawlers are left on the
 * default so SEO/hreflang is unaffected. Already-prefixed paths (/en, /id) are
 * left to next-intl.
 */
/**
 * Expose the visitor's country to the client (for region-specific WhatsApp
 * numbers) as a non-HttpOnly cookie, so pages can stay statically rendered and
 * pick the number after hydration. Only written when it changes.
 */
function stampCountry(
  response: NextResponse,
  country: string,
  existing: string | undefined,
) {
  if (country && country !== existing) {
    response.cookies.set("wa_country", country, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
  }
}

/**
 * Capture ad-attribution params off the landing URL into a readable cookie so
 * they survive internal navigation and can be forwarded to the app subdomain.
 * Last-touch: refresh whenever a fresh ad landing carries params.
 *
 * Runs on the edge before any HTML: UTM / gclid / fbclid (and derived
 * `c_source` / `c_adid`) are available to tags via cookie without waiting on
 * hydration. Pure string work — no extra round trip, no redirect.
 */
function captureAds(
  response: NextResponse,
  request: NextRequest,
  existing: string | undefined,
) {
  const ads = extractAdParams(request.nextUrl.searchParams);
  if (ads && ads !== existing) {
    response.cookies.set(AD_COOKIE, ads, {
      path: "/",
      maxAge: AD_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Cloudflare fronts the app, so cf-ipcountry is authoritative; fall back to
  // Vercel's header if Cloudflare is ever removed.
  const country = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toUpperCase();
  const waCookie = request.cookies.get("wa_country")?.value;
  const adCookie = request.cookies.get(AD_COOKIE)?.value;

  const isPrefixed =
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    pathname === "/id" ||
    pathname.startsWith("/id/");

  if (!isPrefixed) {
    // Only an EXPLICIT language choice (the switcher) overrides geo. We ignore
    // next-intl's own NEXT_LOCALE cookie, so geo re-applies on every visit
    // until the visitor actively picks a language.
    const choice = request.cookies.get(LOCALE_COOKIE)?.value;
    const ua = request.headers.get("user-agent") ?? "";

    const preferred =
      choice === "en" || choice === "id"
        ? choice
        : !BOT_RE.test(ua) && country && country !== "ID" && country !== "XX"
          ? "en"
          : "id";

    // null means this page has no English counterpart, so there is nothing to
    // redirect to; serve the Indonesian page rather than manufacture a 404.
    const englishPath = preferred === "en" ? toEnglishPath(pathname) : null;

    if (englishPath) {
      const url = request.nextUrl.clone();
      url.pathname = englishPath;
      const response = NextResponse.redirect(url, 307);
      // The redirect is per-visitor (geo/choice), so no shared cache may store it.
      response.headers.set("Cache-Control", "no-store");
      stampCountry(response, country, waCookie);
      captureAds(response, request, adCookie);
      return response;
    }
  }

  const response = handleI18n(request);
  stampCountry(response, country, waCookie);
  captureAds(response, request, adCookie);
  return response;
}

export const config = {
  // Skip API, Next internals, and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
