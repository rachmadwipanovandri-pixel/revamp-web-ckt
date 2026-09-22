import localFont from "next/font/local";

/**
 * Keep the Google Sans Flex Latin subset local so next/font/local can inspect
 * the real font metrics and emit a size-adjusted fallback face. The Google
 * loader has no capsize metrics entry for this family, which caused a build
 * warning and left the browser without a metric-matched fallback.
 */
export const fontSans = localFont({
  src: "../assets/fonts/google-sans-flex-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: "Arial",
});
