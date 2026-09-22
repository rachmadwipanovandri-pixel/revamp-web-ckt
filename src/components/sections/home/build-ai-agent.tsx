"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000; // matches globals.css --animate-progress duration

const FEATURES = [
  { key: "feature1", image: "/images/home/simpler-ai-builder.png" },
  { key: "feature2", image: "/images/home/knowledge-source.png" },
  { key: "feature3", image: "/images/home/api-integration.png" },
] as const;

export function BuildAIAgent() {
  const t = useTranslations("home.buildAiAgent");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % FEATURES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className="border-t border-border py-10">
      <Container>
        <div className="w-full">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-2.5 text-base text-foreground">{t("body")}</p>
        </div>

        <div className="mt-12 flex flex-col gap-8">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden">
            <Image
              src="/images/home/build-ai-agent-background.png"
              alt=""
              fill
              className="object-cover"
            />
            <div
              key={activeIndex}
              className="absolute inset-0 animate-panel-in"
            >
              <Image
                src={FEATURES[activeIndex].image}
                alt={t(`${FEATURES[activeIndex].key}.title`)}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 items-start gap-6 sm:grid-cols-3">
            {FEATURES.map(({ key }, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="flex h-full flex-col text-left"
                >
                  <div className="relative mb-4 h-px w-full overflow-hidden bg-border">
                    {isActive && (
                      <div
                        key={activeIndex}
                        className="absolute inset-y-0 left-0 animate-progress bg-foreground"
                      />
                    )}
                  </div>
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
                      "mt-2 font-numeric text-lg transition-colors duration-300",
                      isActive
                        ? "text-muted-foreground"
                        : "text-subtle-foreground",
                    )}
                  >
                    {t(`${key}.description`)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
