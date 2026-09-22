"use client";

import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { solarGlobalLinear } from "@/lib/icons";
import { routing, type Locale, LOCALE_COOKIE } from "@/i18n/routing";
import { switchLocaleHref } from "@/lib/locale-switch";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persist an explicit language choice so the geo middleware honors it. */
function rememberLocaleChoice(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const LABELS: Record<string, string> = { en: "English", id: "Indonesian" };

export function LanguageSwitcher({
  currentLocale,
  inverted = false,
}: {
  currentLocale: string;
  inverted?: boolean;
}) {
  // With `pathnames` configured, usePathname() returns the route template
  // (e.g. "/features/[slug]"); the concrete slug comes from useParams().
  const pathname = usePathname();
  const { slug } = useParams<{ slug?: string }>() ?? {};

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "h-auto gap-1.5 bg-transparent px-0 py-0 text-xs font-semibold hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-popup-open:bg-transparent",
              inverted
                ? "text-white hover:bg-transparent! hover:text-white/80"
                : "text-foreground hover:text-black",
            )}
          >
            <Icon icon={solarGlobalLinear} className="size-3" />
            {LABELS[currentLocale] ?? currentLocale.toUpperCase()}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-40 gap-1">
              {routing.locales.map((locale) => (
                <li key={locale}>
                  <NavigationMenuLink
                    render={
                      <Link
                        href={switchLocaleHref(
                          pathname,
                          slug,
                          currentLocale as Locale,
                          locale,
                        )}
                        locale={locale}
                        onClick={() => rememberLocaleChoice(locale)}
                      />
                    }
                    aria-current={locale === currentLocale ? "true" : undefined}
                    className={cn(locale === currentLocale && "bg-muted/50")}
                  >
                    {LABELS[locale] ?? locale.toUpperCase()}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
