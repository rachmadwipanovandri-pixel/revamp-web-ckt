import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { Container } from "@/components/layout/container";

export interface Crumb {
  label: string;
  href?: ComponentProps<typeof Link>["href"];
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <div className="border-b border-border bg-white">
      <Container className="border-x border-border px-6 py-3 lg:px-6">
        <nav aria-label="Breadcrumb">
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
                    className="font-semibold text-foreground"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </div>
  );
}
