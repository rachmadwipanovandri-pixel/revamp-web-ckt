import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";

const CARDS = ["card1", "card2", "card3"] as const;

export function WhatMakes({ namespace }: { namespace: string }) {
  const t = useTranslations(`${namespace}.whatMakes`);

  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border lg:px-0">
        <div className="px-6 py-12 lg:py-16">
          <h2 className="max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("heading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 border-t border-border md:grid-cols-3">
          {CARDS.map((card, index) => (
            <div
              key={card}
              className={
                index > 0
                  ? "border-t border-border px-6 py-8 md:border-t-0 md:border-l lg:py-10"
                  : "px-6 py-8 lg:py-10"
              }
            >
              <h3 className="font-numeric text-lg font-semibold text-foreground">
                {t(`${card}.title`)}
              </h3>
              <p className="mt-3 font-numeric text-base text-muted-foreground">
                {t(`${card}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
