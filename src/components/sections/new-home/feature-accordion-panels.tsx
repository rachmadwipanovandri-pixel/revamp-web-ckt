"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { lucideCheck, lucideChevronDown } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { FeatureLink } from "@/components/sections/home/feature-accordion-panels";
import { SafeIcon } from "./safe-icon";

const PRODUCTS = [
  { key: "chat", href: "/chat", image: "/images/chat/escalate-and-sync.png" },
  { key: "crm", href: "/crm", image: "/images/crm/track-customer-journey.png" },
  {
    key: "marketing",
    href: "/marketing",
    image: "/images/marketing/see-what-actually-works.png",
  },
  {
    key: "order",
    href: "/order",
    image: "/images/order/automation-triggers-instantly.png",
  },
] as const;

/**
 * Dark-chapter accordion: numbered rows, sticky media with glow,
 * grid-rows expand on a long expo-out curve.
 */
export function FeatureAccordionPanels({
  featureLinks,
}: {
  featureLinks: Record<(typeof PRODUCTS)[number]["key"], FeatureLink[]>;
}) {
  const t = useTranslations("home.featureAccordion");
  const tn = useTranslations("nav");
  const [open, setOpen] = useState(0);
  const [seen, setSeen] = useState<number[]>([0]);

  function select(index: number) {
    setOpen(index);
    setSeen((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
      <div className="flex flex-col gap-2 lg:col-span-5">
        {PRODUCTS.map((product, index) => {
          const isOpen = index === open;
          return (
            <div
              key={product.key}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen
                  ? "border-sky-400/35 bg-white/8 shadow-[0_24px_50px_-30px_rgba(14,165,233,0.35)]"
                  : "border-white/8 bg-white/3 hover:border-white/18",
              )}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-expanded={isOpen}
                  aria-controls={`new-feature-panel-${product.key}`}
                  id={`new-feature-tab-${product.key}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left focus-visible:ring-3 focus-visible:ring-sky-400/50 focus-visible:outline-none"
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      aria-hidden
                      className={cn(
                        "font-numeric text-xs font-bold tracking-[0.18em] transition-colors duration-300",
                        isOpen ? "text-sky-300" : "text-white/35",
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "font-numeric text-lg font-semibold tracking-[-0.02em] transition-colors duration-300",
                        isOpen ? "text-white" : "text-white/70",
                      )}
                    >
                      {t(`${product.key}.title`)}
                    </span>
                  </span>
                  <SafeIcon
                    icon={lucideChevronDown}
                    className={cn(
                      "size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen
                        ? "rotate-180 text-sky-300"
                        : "text-white/40",
                    )}
                    size="1.25rem"
                  />
                </button>
              </h3>

              <div
                id={`new-feature-panel-${product.key}`}
                role="region"
                aria-labelledby={`new-feature-tab-${product.key}`}
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6">
                    <p className="font-numeric text-xl font-semibold tracking-[-0.02em] text-white">
                      {t(`${product.key}.lead`)}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-primary-foreground-muted">
                      {t(`${product.key}.body`)}
                    </p>

                    {seen.includes(index) && (
                      <div className="relative mt-5 aspect-4/5 w-full overflow-hidden rounded-xl bg-white/5 lg:hidden">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 560px"
                          className="object-contain"
                        />
                      </div>
                    )}

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {(["pill1", "pill2", "pill3"] as const).map((pill) => (
                        <li
                          key={pill}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3.5 py-1.5 text-xs font-medium text-primary-foreground-muted"
                        >
                          <SafeIcon
                            icon={lucideCheck}
                            className="size-3.5 shrink-0 text-sky-300"
                            size="0.875rem"
                          />
                          {t(`${product.key}.${pill}`)}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-5 flex flex-col gap-1">
                      {featureLinks[product.key].map((feature) => (
                        <li key={feature.id}>
                          <Link
                            href={{
                              pathname: "/features/[slug]",
                              params: { slug: feature.slug },
                            }}
                            className="inline-flex min-h-7 items-center text-sm text-white/50 transition-colors hover:text-sky-300 hover:underline"
                          >
                            {feature.title}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={product.href}
                      className="mt-6 inline-flex min-h-7 items-center gap-1.5 rounded-full bg-sky-400/15 px-4 py-2 text-xs font-bold text-sky-300 transition-all hover:gap-2.5 hover:bg-sky-400/25"
                    >
                      {tn(product.key)}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-7 lg:sticky lg:top-28">
        <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] lg:block">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-8 z-0 bg-primary/25 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[1.5rem] ring-1 ring-white/10 ring-inset"
          />
          {PRODUCTS.map((product, index) =>
            seen.includes(index) ? (
              <Image
                key={product.key}
                src={product.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className={cn(
                  "relative z-[1] object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  index === open
                    ? "translate-y-0 scale-100 opacity-100 blur-0"
                    : "translate-y-3 scale-[1.02] opacity-0",
                )}
              />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
