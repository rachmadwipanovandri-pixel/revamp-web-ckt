"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useAppUrl } from "@/hooks/use-app-url";

/**
 * Anchor to an app-subdomain URL (chat.cekat.ai/register|login) that carries
 * captured ad-attribution params. Drop-in for the bare <a> passed to Base UI
 * Button's `render` prop, or used directly with children — Button-injected
 * className/children/ref are forwarded to the underlying <a>.
 */
export const AppAnchor = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & { href: string }
>(function AppAnchor({ href, ...props }, ref) {
  const resolved = useAppUrl(href);
  return <a ref={ref} href={resolved} {...props} />;
});
