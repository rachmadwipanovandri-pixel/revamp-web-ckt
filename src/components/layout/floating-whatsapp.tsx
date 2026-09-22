"use client";

import { Icon } from "@iconify/react/offline";
import { usePathname } from "@/i18n/navigation";
import { mdiWhatsapp } from "@/lib/icons";
import { useWhatsAppUrl } from "@/hooks/use-whatsapp-url";

/**
 * Fixed click-to-chat WhatsApp button, bottom-right on every page.
 *
 * Cekat blue rather than WhatsApp green: the button belongs to this site, and
 * the WhatsApp mark alone carries the channel. White on --primary is 7.03:1,
 * comfortably past the 4.5:1 AA needs for a 14px bold label.
 *
 * Elevation uses the house shadow rather than a coloured glow. The old glow
 * read as a mismatched halo; this is the same shadow the floating pills use.
 */
export function FloatingWhatsApp({ label }: { label: string }) {
  const href = useWhatsAppUrl();
  const pathname = usePathname();
  // Would sit on top of the wireframe editor's mobile save bar.
  if (pathname === "/wireframe") {
    return null;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed right-5 bottom-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-primary py-3 pr-5 pl-3.5 font-numeric font-semibold text-primary-foreground shadow-card transition-transform duration-200 hover:scale-105 hover:bg-primary-dark focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:outline-none"
    >
      <Icon icon={mdiWhatsapp} className="size-7" />
      <span className="text-sm">{label}</span>
    </a>
  );
}
