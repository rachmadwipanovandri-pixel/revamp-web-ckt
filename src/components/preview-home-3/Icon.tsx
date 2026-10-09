import type { IconifyIcon } from "@iconify/react/offline";

/**
 * Renders an extracted Solar icon as inline SVG.
 *
 * Written by hand rather than pulled from `@iconify/react`: the default entry
 * fetches unregistered icons from api.iconify.design at runtime and defers
 * rendering to the client, and even the `/offline` entry needs a client
 * component. Every path in `./icons.ts` is already `fill="currentColor"`, so a
 * single `fill` on the root recolours the whole set — the icons inherit
 * `currentColor` and never need to know a colour.
 *
 * This is a server component: icons add zero client JS to the page.
 */
export function Ico({
  icon,
  size = 20,
  className,
  strokeWidth,
}: {
  icon: IconifyIcon;
  /** Rendered size in px; the viewBox always stays at the icon's own grid. */
  size?: number;
  className?: string;
  /**
   * Opt-in optical correction. The Solar *bold* cuts are drawn for a filled
   * shape, so at small sizes a 1.5px stroke icon can look heavier than the
   * hairline context it sits in.
   */
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      strokeWidth={strokeWidth}
    >
      <g dangerouslySetInnerHTML={{ __html: icon.body }} />
    </svg>
  );
}