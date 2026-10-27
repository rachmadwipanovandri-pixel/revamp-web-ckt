import "./preview-home-4.css";

/**
 * Scope isolation for /preview-home-4.
 *
 * Two jobs, both structural:
 *
 *   1. Import this draft's stylesheet here and nowhere else. The app-wide sheet
 *      is untouched, and so is /preview-home-2's and /preview-home-3's — three
 *      drafts that share a design lineage must not share a stylesheet, or a fix
 *      to one is a regression in the other two.
 *   2. Keep the page's own chrome and font requests out of the shared tree. The
 *      nav, the footer and the nav copy are imported from /preview-home-2 so
 *      the four drafts cannot drift apart on the one thing a visitor compares
 *      across them, but the elements and the route are this page's own.
 */
export default function PreviewHome4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}