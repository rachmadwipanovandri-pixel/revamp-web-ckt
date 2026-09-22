import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { Container } from "@/components/layout/container";

export interface Crumb {
  label: string;
  href?: ComponentProps<typeof Link>["href"];
}

/**
 * Site breadcrumbs. Default is the full-width bar used under landing heroes;
 * `variant="bare"` is the nav-only form for embedding inside a pill (articles).
 */
export function Breadcrumbs({
  items,
  variant = "bar",
  className,
}: {
  items: Crumb[];
  variant?: "bar" | "bare";
  className?: string;
}) {
  const nav = (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-numeric text-xs text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <Icon
                icon={lucideChevronDown}
                className="size-3 -rotate-90 opacity-50"
                aria-hidden
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="max-w-[28ch] truncate font-semibold text-foreground sm:max-w-[42ch]"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  if (variant === "bare") return nav;

  return (
    <div className="border-b border-foreground/8 bg-white/90 backdrop-blur">
      <Container className="py-3.5">{nav}</Container>
    </div>
  );
}
