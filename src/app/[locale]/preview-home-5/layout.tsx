import "../preview-home-4/preview-home-4.css";
import "./preview-home-5.css";

/**
 * Scope isolation for /preview-home-5.
 *
 * Imports ph4's stylesheet (the components are reused, not forked) plus the
 * ph5 overrides: light bands where ph4 goes console, and the iOS motion
 * tokens. Nothing here touches /preview-home-4's own route.
 */
export default function PreviewHome5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
