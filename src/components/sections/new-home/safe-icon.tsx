import type { IconifyIcon } from "@iconify/react/offline";
import { cn } from "@/lib/utils";

/**
 * Renders offline Iconify data as plain SVG — no client component, no mount
 * tick. Icon body strings come from `src/lib/icons.ts` (static, trusted).
 *
 * Previously this deferred through `@iconify/react/offline` + setState to dodge
 * a React 19 TrustedHTML hydration mismatch, which blanked every icon until
 * after hydration. Painting the SVG on the server removes both the mismatch
 * and the delay.
 */
export function SafeIcon({
  icon,
  className,
  id,
  size = "1.5em",
}: {
  icon: IconifyIcon;
  className?: string;
  id?: string;
  /** CSS length for the placeholder box — keeps layout stable */
  size?: string;
}) {
  const width = icon.width ?? 24;
  const height = icon.height ?? 24;

  return (
    <span aria-hidden className="inline-flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        width={size}
        height={size}
        id={id}
        className={cn(className)}
        // Icon body is local icon data from `@iconify-json/*` via extract-icon,
        // not user input — safe for innerHTML.
        dangerouslySetInnerHTML={{ __html: icon.body }}
      />
    </span>
  );
}
