import Image from "next/image";
import { Icon } from "@iconify/react/offline";
import { lucideCheck, lucideX } from "@/lib/icons";
import type { Locale } from "@/i18n/routing";
import type { Cell } from "@/lib/comparison";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

/**
 * What each mark means, for screen readers. The glyphs alone said nothing:
 * a tick is an unlabelled icon, so the whole matrix used to read as rows of
 * empty cells. Held here rather than in messages because this component takes
 * a locale rather than a translator, like the rest of the comparison code.
 */
const CELL_LABELS = {
  yes: { id: "Tersedia", en: "Available" },
  no: { id: "Tidak tersedia", en: "Not available" },
} as const;

/**
 * One matrix cell. Shared by the full comparison page and the homepage
 * snapshot so a tick never renders one way in one place and another way in the
 * other; both read the same matrix, and now the same renderer.
 *
 * Only the ticks carry colour. Eight competitors against five rows is around
 * thirty-five negatives, and drawn in red they became a wall that read as an
 * attack rather than as evidence; neutral greys let our column be the thing
 * the eye lands on.
 */
export function ComparisonCell({
  cell,
  locale,
}: {
  cell: Cell;
  locale: Locale;
}) {
  if (cell.kind === "text") {
    return (
      <span className="text-sm text-foreground">{cell.value[locale]}</span>
    );
  }

  const yes = cell.kind === "yes";
  return (
    // The height is reserved whether or not a note follows, so one vendor's
    // footnote cannot make its row taller than the rest of the table.
    <span className="inline-flex min-h-11 flex-col items-center justify-center gap-1">
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full",
          yes
            ? "bg-primary text-primary-foreground"
            : "bg-surface-muted text-subtle-foreground ring-1 ring-border ring-inset",
        )}
      >
        <Icon
          icon={yes ? lucideCheck : lucideX}
          className="size-3.5"
          aria-hidden
        />
      </span>
      <span className="sr-only">{CELL_LABELS[yes ? "yes" : "no"][locale]}</span>
      {cell.note && (
        <span className="text-[11px] leading-tight text-subtle-foreground">
          {cell.note[locale]}
        </span>
      )}
    </span>
  );
}

/**
 * Column header: our own logo, everyone else's wordmark in grey.
 *
 * Competitor marks arrive in their own brand colours at wildly different
 * aspect ratios, from respond.io at 6:1 to SleekFlow at 2:1. Sized by height
 * alone they ranged from 38px to 112px wide, and in full colour eight rival
 * brands were louder on our own page than we were. A fixed box bounds both
 * dimensions, and grey recesses them behind the one column that matters.
 *
 * Greyscale carries that on its own, with no opacity fade: measured against
 * white, fading these to 65 percent dropped Halo AI's mark to 2.5:1 and Odoo's
 * to 3.2:1, which is mush. Removing the colour is what made our column the
 * only coloured thing here; dimming them further only cost legibility.
 */
export function VendorHeaderCell({
  name,
  logo,
  isUs,
}: {
  name: string;
  logo: string;
  isUs?: boolean;
}) {
  if (isUs) {
    // The SVG carries role="img" and aria-label="Cekat.AI", so the column
    // still announces itself.
    return <Logo className="mx-auto h-5 w-auto" />;
  }
  return (
    <span className="flex h-6 items-center justify-center">
      <Image
        src={logo}
        alt={name}
        width={120}
        height={28}
        className="h-auto max-h-6 w-auto max-w-[6.5rem] object-contain grayscale"
      />
    </span>
  );
}
