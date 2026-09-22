"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/offline";
import { lucideChevronDown } from "@/lib/icons";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export function Faq({
  namespace,
  count = 3,
}: {
  namespace: string;
  count?: number;
}) {
  const t = useTranslations(`${namespace}.faq`);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <section className="bg-white">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        <p className="font-numeric text-sm font-semibold tracking-wide text-primary uppercase">
          {t("label")}
        </p>
        <h2 className="mt-2 max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t("heading")}
        </h2>

        <div className="mt-10">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item} className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-numeric text-base font-semibold text-foreground md:text-lg">
                    {t(`q${item}`)}
                  </span>
                  <Icon
                    icon={lucideChevronDown}
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  inert={!isOpen}
                  aria-hidden={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-5 font-numeric text-base text-muted-foreground">
                      {t(`a${item}`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
