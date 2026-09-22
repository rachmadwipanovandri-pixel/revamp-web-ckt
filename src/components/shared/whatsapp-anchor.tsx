"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useWhatsAppUrl } from "@/hooks/use-whatsapp-url";

/**
 * Anchor whose href is the region-specific WhatsApp link. Drop-in for the bare
 * <a> passed to Base UI Button's `render` prop — Button injects className,
 * children, and a ref, all forwarded to the underlying <a>.
 */
export const WhatsAppAnchor = forwardRef<
  HTMLAnchorElement,
  Omit<ComponentPropsWithoutRef<"a">, "href">
>(function WhatsAppAnchor(props, ref) {
  const href = useWhatsAppUrl();
  return <a ref={ref} href={href} {...props} />;
});
