import { Icon } from "@iconify/react/offline";
import { lucideCheck, lucideX } from "@/lib/icons";
import { formatNumber, type Cell } from "@/lib/pricing";
import type { Locale } from "@/i18n/routing";

/**
 * Renders one matrix cell. Booleans become icons with a screen-reader label,
 * numbers are locale-formatted, and prose resolves from `pricing.values`.
 */
export function PricingCell({
  cell,
  locale,
  value,
  includedLabel,
  notIncludedLabel,
}: {
  cell: Cell;
  locale: Locale;
  /** Resolver for `pricing.values.<key>`, injected so this stays a server component. */
  value: (key: string) => string;
  includedLabel: string;
  notIncludedLabel: string;
}) {
  if (typeof cell === "boolean") {
    return cell ? (
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon icon={lucideCheck} className="size-3" aria-hidden />
        <span className="sr-only">{includedLabel}</span>
      </span>
    ) : (
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-surface-subtle text-muted-foreground">
        <Icon icon={lucideX} className="size-3" aria-hidden />
        <span className="sr-only">{notIncludedLabel}</span>
      </span>
    );
  }

  if ("number" in cell) {
    const formatted = formatNumber(cell.number, locale);
    return (
      <span className="font-numeric text-sm text-foreground">
        {cell.prefixKey ? `${value(cell.prefixKey)} ${formatted}` : formatted}
      </span>
    );
  }

  return (
    <span className="font-numeric text-sm text-foreground">
      {value(cell.textKey)}
    </span>
  );
}
