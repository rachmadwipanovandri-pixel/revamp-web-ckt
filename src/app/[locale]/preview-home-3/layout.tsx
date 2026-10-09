import "./preview-home-3.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Route draft: "Precision Ledger" — the US B2B SaaS redesign.
 *
 * Two departures from the earlier drafts here are deliberate, not drift:
 *
 *   - It no longer imports `preview-home-2.css` and no longer carries
 *     `ph2-root`. This draft renders its own footer rather than sharing one, so
 *     nothing in it depends on another route's rules. That also removes the
 *     cascade hazard where a shared stylesheet's tokens could outrank the local
 *     ones regardless of import order.
 *   - Smooth scroll is not mounted here. `Motion3` owns Lenis, GSAP and
 *     ScrollTrigger as one stack with one rAF loop; a second scroll engine
 *     mounted by the layout would fight it for the scroll position.
 *
 * Typography stays on the brand face (Google Sans Flex, injected by the root
 * layout as `--font-sans`); monospace labels use the platform `ui-monospace`
 * stack, so the whole monospace system costs zero bytes of font download.
 * Everything is scoped under `.ph3-root` — a draft route outside `(site)`, not
 * indexed, which cannot leak into production.
 */
export const metadata: Metadata = {
  title: "Preview 3 — Precision Ledger (Draft)",
  robots: { index: false, follow: false },
};

export default function PreviewHome3Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}