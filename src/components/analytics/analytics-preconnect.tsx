/**
 * Warm DNS/TLS for third-party origins we load after paint, so when GTM /
 * Meta / Cekat / HYROS finally run they are not paying connection setup on
 * the critical path. Pure `<link>` tags — no JS, no bundle cost.
 */
const ANALYTICS_ORIGINS = [
  "https://www.googletagmanager.com",
  "https://connect.facebook.net",
  "https://t.cekat.ai",
  "https://grw.cekat.ai",
] as const;

export function AnalyticsPreconnect() {
  return (
    <>
      {ANALYTICS_ORIGINS.map((href) => (
        <link key={href} rel="preconnect" href={href} />
      ))}
      {ANALYTICS_ORIGINS.map((href) => (
        <link key={`dns-${href}`} rel="dns-prefetch" href={href} />
      ))}
    </>
  );
}
