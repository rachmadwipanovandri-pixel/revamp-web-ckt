"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
// The only remaining framer-motion user. This is a scroll-linked pinned
// carousel, not a fade, and hand-rolling that on a scroll listener is where
// regressions live. `motion` rather than `m`: with the LazyMotion provider
// gone, `m` would have no feature context. The cost is scoped to feature
// routes instead of loading on every page from the root layout.
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export interface HowItWorksStep {
  key: string;
  image: string;
}

export function HowItWorks({
  namespace,
  backgroundSrc,
  steps,
}: {
  namespace: string;
  backgroundSrc: string;
  steps: HowItWorksStep[];
}) {
  const t = useTranslations(`${namespace}.howItWorks`);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  // Smooths the raw scroll progress so the carousel eases as it follows
  // scroll in either direction, instead of snapping 1:1 with each tick.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Translates the container so its right edge touches the viewport's right edge.
  // We use matching string formats so Framer Motion can interpolate them properly.
  const x = useTransform(
    smoothProgress,
    [0, 1],
    ["calc(0vw - 0%)", "calc(100vw - 100%)"],
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-white"
      style={{ height: `${steps.length * 80}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-12 lg:py-16">
        <Container className="px-6 lg:px-0">
          <h2 className="max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t("heading")}
          </h2>
        </Container>

        <div className="relative mt-10 w-full lg:mt-14">
          {/* Left Gradient */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-16 lg:w-32" />

          {/* Right Gradient */}
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-16 lg:w-32" />

          {/* Carousel container */}
          <motion.div
            style={{ x }}
            className="flex w-max gap-6 px-6 sm:px-16 lg:gap-8 lg:px-32"
          >
            {steps.map((step) => (
              <div
                key={step.key}
                className="w-[85vw] shrink-0 md:w-[45vw] lg:w-[25vw]"
              >
                <div className="flex h-full flex-col border border-border bg-white p-3 sm:p-5">
                  <div className="relative aspect-square w-full overflow-hidden bg-surface-subtle">
                    <Image
                      src={backgroundSrc}
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={step.image}
                        alt={t(`${step.key}.title`)}
                        width={1080}
                        height={1350}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-1 flex-col px-2 pb-2 lg:mt-8 lg:px-3 lg:pb-0">
                    <h3 className="font-numeric text-xl font-semibold text-foreground">
                      {t(`${step.key}.title`)}
                    </h3>
                    <p className="mt-3 font-numeric text-base leading-relaxed text-muted-foreground">
                      {t(`${step.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
