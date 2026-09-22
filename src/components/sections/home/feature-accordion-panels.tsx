"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Icon } from "@iconify/react/offline";
import { lucideCheck, lucideChevronDown } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * Accordion of the four products on the left, the open one's artwork on the
 * right. Only one panel is open at a time, so the visual always has a single
 * subject and the section height stays roughly constant as you move through it.
 *
 * Each panel also carries its product's three deep feature links, moved
 * here when this section replaced the old product-card grid: twelve internal
 * links from the highest-authority page on the site, which the merge was not
 * allowed to cost. The links arrive as props from the server wrapper so the
 * registry that resolves them never enters the client bundle.
 *
 * Pills describe capabilities, never outcomes. Every one corresponds to a row
 * this site already claims in the comparison matrix, which keeps them checkable.
 * The reference design this follows leads each panel with a before/after metric
 * instead; that was left out deliberately, because the only numbers available
 * are client-reported figures from the testimonials and restating them as
 * generic product claims would strip the attribution that makes them honest.
 */
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

export type FeatureLink = { id: string; slug: string; title: string };

export function FeatureAccordionPanels({
  featureLinks,
}: {
  featureLinks: Record<(typeof PRODUCTS)[number]["key"], FeatureLink[]>;
}) {
  const t = useTranslations("home.featureAccordion");
  const tn = useTranslations("nav");
  const [open, setOpen] = useState(0);
  // An <Image> in a closed panel is still fetched by the browser, whether it is
  // hidden by opacity or by display:none. Mount artwork only once its panel has
  // been opened, so a first load pulls one file rather than four.
  const [seen, setSeen] = useState<number[]>([0]);

  function select(index: number) {
    setOpen(index);
    setSeen((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }

  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:col-span-6 lg:text-4xl">
            {t("heading")}
          </h2>
          <p className="text-base text-muted-foreground lg:col-span-6 lg:text-lg">
            {t("body")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-3 lg:col-span-6">
            {PRODUCTS.map((product, index) => {
              const isOpen = index === open;
              return (
                <div
                  key={product.key}
                  className={cn(
                    "rounded-lg border transition-colors",
                    isOpen
                      ? "border-primary bg-primary"
                      : "border-border bg-white hover:border-primary/20",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => select(index)}
                      aria-expanded={isOpen}
                      aria-controls={`feature-panel-${product.key}`}
                      id={`feature-tab-${product.key}`}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                    >
                      <span
                        className={cn(
                          "font-numeric text-base font-semibold",
                          isOpen
                            ? "text-primary-foreground"
                            : "text-foreground",
                        )}
                      >
                        {t(`${product.key}.title`)}
                      </span>
                      <Icon
                        icon={lucideChevronDown}
                        aria-hidden
                        className={cn(
                          "size-5 shrink-0 text-subtle-foreground transition-transform",
                          isOpen && "rotate-180 text-primary-foreground",
                        )}
                      />
                    </button>
                  </h3>

                  {/* Panel stays mounted when closed so the accordion does not
                      shed content from the DOM. Crawlers and in-page search see
                      all four descriptions regardless of which one is open. */}
                  <div
                    id={`feature-panel-${product.key}`}
                    role="region"
                    aria-labelledby={`feature-tab-${product.key}`}
                    hidden={!isOpen}
                    className="px-5 pb-5"
                  >
                    <p className="font-numeric text-lg font-semibold text-primary-foreground">
                      {t(`${product.key}.lead`)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-primary-foreground-muted">
                      {t(`${product.key}.body`)}
                    </p>

                    {/* On mobile the artwork lives inside the open panel, so
                        it is never a screen away from the copy it belongs to.
                        Mounted only once opened; the sizes string must stay
                        identical to the desktop well's so the two hidden/shown
                        copies dedupe to one fetch. */}
                    {seen.includes(index) && (
                      <div className="relative mt-4 aspect-4/5 w-full overflow-hidden rounded-lg bg-white lg:hidden">
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 560px"
                          className="object-contain"
                        />
                      </div>
                    )}

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {(["pill1", "pill2", "pill3"] as const).map((pill) => (
                        <li
                          key={pill}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          <Icon
                            icon={lucideCheck}
                            aria-hidden
                            className="size-3.5 shrink-0 text-primary"
                          />
                          {t(`${product.key}.${pill}`)}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-4 flex flex-col gap-0.5">
                      {featureLinks[product.key].map((feature) => (
                        <li key={feature.id}>
                          <Link
                            href={{
                              pathname: "/features/[slug]",
                              params: { slug: feature.slug },
                            }}
                            className="inline-flex min-h-7 items-center text-sm text-primary-foreground-muted transition-colors hover:text-primary-foreground hover:underline"
                          >
                            {feature.title}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={product.href}
                      className="mt-5 inline-flex min-h-7 items-center gap-1 text-xs font-bold text-primary-foreground hover:underline"
                    >
                      {tn(product.key)}
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* One well, one image swapped inside it, desktop only: on mobile the
              artwork renders inside the open panel instead of stacking below
              all four. The well takes its height from the accordion column
              (grid stretch), so the two sides always carry the same visual
              weight no matter which panel is open. */}
          <div className="relative hidden w-full overflow-hidden rounded-lg border border-border bg-surface-muted lg:col-span-6 lg:block lg:self-stretch">
            {PRODUCTS.map((product, index) =>
              seen.includes(index) ? (
                <Image
                  key={product.key}
                  src={product.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className={cn(
                    "object-contain transition-opacity duration-500",
                    index === open ? "opacity-100" : "opacity-0",
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
