"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useInViewport } from "@/hooks/use-in-viewport";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000; // matches globals.css --animate-progress duration

const FEATURES = [
  {
    key: "feature1",
    image:
      "/images/home/track-and-optimize-your-marketing-performance-in-one-unified-platform.png",
  },
  {
    key: "feature2",
    image: "/images/home/automate-your-business-logic-no-coding-needed.png",
  },
  {
    key: "feature3",
    image: "/images/home/your-crm-built-for-growth-and-real-conversations.png",
  },
] as const;

export function PlatformOverview() {
  const t = useTranslations("home.platformOverview");
  const [activeIndex, setActiveIndex] = useState(0);

  // Autoplay only while the carousel is on screen. Left running it advanced
  // every 5s forever, re-rendering the section and restarting the progress
  // animation for a viewer who had long since scrolled past.
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInViewport(sectionRef, 0.3);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % FEATURES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, inView]);

  return (
    <section ref={sectionRef} className="border-t border-border">
      <Container className="border-x border-border py-12 lg:py-16">
        <div className="flex flex-col gap-8">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-border lg:aspect-[21/9]">
            <Image
              src="/images/home/platform-overview-background.png"
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
                className="object-cover object-bottom"
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
                        className="absolute inset-y-0 left-0 w-full origin-left animate-progress bg-foreground"
                      />
                    )}
                  </div>
                  <h3
                    className={cn(
                      "font-numeric text-lg font-bold transition-colors duration-300",
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
