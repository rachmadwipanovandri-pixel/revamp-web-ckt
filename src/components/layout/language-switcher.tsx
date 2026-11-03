"use client";

import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { solarGlobalLinear } from "@/lib/icons";
import { type Locale } from "@/i18n/routing";
import { switchLocaleHref } from "@/lib/locale-switch";
import { rememberLocaleChoice } from "@/lib/locale-preference";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const LANGUAGES = [
  { code: "en", label: "English", native: "EN", available: true },
  { code: "id", label: "Indonesia", native: "ID", available: true },
  { code: "kr", label: "한국어", native: "KR", available: true },
  { code: "jp", label: "日本語", native: "JP", available: true },
  { code: "cn", label: "中文", native: "CN", available: true },
] as const;

const LABELS: Record<string, string> = Object.fromEntries(
  LANGUAGES.map(({ code, label }) => [code, label]),
);

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
              "h-auto gap-1.5 rounded-full bg-transparent px-2 py-1 text-sm font-medium hover:bg-[#f3f6fd] focus:bg-[#f3f6fd] data-open:bg-[#f3f6fd] data-popup-open:bg-[#f3f6fd]",
              inverted
                ? "text-white hover:bg-transparent! hover:text-white/80"
                : "text-foreground hover:text-black",
            )}
          >
            <Icon icon={solarGlobalLinear} className="size-3" />
            {LABELS[currentLocale] ?? currentLocale.toUpperCase()}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-48 gap-1 p-1">
              {LANGUAGES.map((language) => (
                <li key={language.code}>
                  {language.available ? (
                    <NavigationMenuLink
                      render={
                        <Link
                          href={switchLocaleHref(
                            pathname,
                            slug,
                            currentLocale as Locale,
                            language.code as Locale,
                          )}
                          locale={language.code as Locale}
                          onClick={() => rememberLocaleChoice(language.code)}
                        />
                      }
                      aria-current={
                        language.code === currentLocale ? "true" : undefined
                      }
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                        language.code === currentLocale &&
                          "bg-[#f3f6fd] text-primary",
                      )}
                    >
                      <span>{language.label}</span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {language.native}
                      </span>
                    </NavigationMenuLink>
                  ) : null}
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
