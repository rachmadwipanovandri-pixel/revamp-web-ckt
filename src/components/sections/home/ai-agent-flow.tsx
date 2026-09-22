"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000; // matches globals.css --animate-progress duration

const FEATURES = [
  { key: "feature1", image: "/images/home/multiple-specialized-agents.png" },
  { key: "feature2", image: "/images/home/visual-flow-designer.png" },
  { key: "feature3", image: "/images/home/ai-working-hours.png" },
] as const;

export function AIAgentFlow() {
  const t = useTranslations("home.aiAgentFlow");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % FEATURES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className="border-t border-border py-20">
      <Container className="mb-12">
        <h2 className="font-numeric text-3xl font-semibold text-foreground lg:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-2 font-numeric text-base text-foreground">
          {t("body")}
        </p>
      </Container>
      <Container className="grid items-center gap-12 md:grid-cols-12">
        <div className="relative order-2 aspect-square overflow-hidden md:order-1 md:col-span-5">
          <Image
            src="/images/home/ai-agent-flow-background.png"
            alt=""
            fill
            className="object-cover"
          />
          <div key={activeIndex} className="absolute inset-0 animate-panel-in">
            <Image
              src={FEATURES[activeIndex].image}
              alt={t(`${FEATURES[activeIndex].key}.title`)}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="order-1 md:order-2 md:col-span-7">
          <div className="w-full">
            {FEATURES.map(({ key }, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="block w-full pt-5 text-left"
                >
                  <h3
                    className={cn(
                      "font-numeric text-lg font-semibold transition-colors duration-300",
                      isActive ? "text-foreground" : "text-subtle-foreground",
                    )}
                  >
                    {t(`${key}.title`)}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 font-numeric text-lg transition-colors duration-300",
                      isActive ? "text-foreground" : "text-subtle-foreground",
                    )}
                  >
                    {t(`${key}.description`)}
                  </p>
                  <div className="relative mt-4 h-px w-full overflow-hidden bg-border">
                    {isActive && (
                      <div
                        key={activeIndex}
                        className="absolute inset-y-0 left-0 animate-progress bg-foreground"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
