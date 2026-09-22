import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a product screenshot in a subtle app-window chrome, a title bar with
 * the macOS-style red/yellow/green dots (colors from docs/01-colors.md). Makes
 * screenshots read as a real product surface rather than a bare image.
 */
export function BrowserFrame({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        {label && (
          <span className="ml-2 truncate font-numeric text-xs text-subtle-foreground">
            {label}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
