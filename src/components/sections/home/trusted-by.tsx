"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useInViewport } from "@/hooks/use-in-viewport";
import { Container } from "@/components/layout/container";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { cn } from "@/lib/utils";

/**
 * Ordered turnover first: the three speakers who reported a revenue figure
 * lead, then conversion, then response time. The quotes themselves are
 * untouched, since they are recorded interview words and reordering the
 * sentences inside one would change what the person said.
 */
const TESTIMONIALS = [
  { id: "natureCraft" },
  { id: "threeland" },
  { id: "putiih" },
  { id: "wallStreet" },
  { id: "rumahZakat" },
] as const;

const ROTATE_MS = 7000; // longer than the logo cadence: these quotes are long

export function TrustedBy() {
  const t = useTranslations("home.trustedBy");
  const tq = useTranslations("home.testimonials");
  const [activeId, setActiveId] = useState<string>(TESTIMONIALS[0].id);

  // Only rotates while on screen, and stops for good once a dot is clicked.
  const quotesRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(quotesRef, 0.3);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!autoRotate || !inView) return;
    const timer = setTimeout(() => {
      setActiveId((prevId) => {
        const index = TESTIMONIALS.findIndex((item) => item.id === prevId);
        return TESTIMONIALS[(index + 1) % TESTIMONIALS.length].id;
      });
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [activeId, autoRotate, inView]);

  function selectQuote(id: string) {
    setAutoRotate(false);
    setActiveId(id);
  }

  const active =
    TESTIMONIALS.find((item) => item.id === activeId) ?? TESTIMONIALS[0];

  return (
    <section className="bg-white">
      {/* A static wall rather than the marquee the other pages use. This one
          sits just under the hero, and a perpetually scrolling strip that high
          animates from load whether or not anyone is looking at it. */}
      <div className="border-b border-border bg-white">
        {/* Copy on the left, logo wall on the right. Stacked, these three
            blocks each claimed a full-width row and the section ran tall while
            most of a 1280px page sat empty either side of centred text. */}
        <Container className="border-x border-border py-10 lg:py-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-center text-3xl font-semibold tracking-tight text-primary md:text-4xl lg:text-left">
                {t("heading")}
              </h2>

              <div className="mt-6 flex flex-col items-center divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0 lg:items-start">
                {(["stat1", "stat2"] as const).map((stat, index) => (
                  <div
                    key={stat}
                    className={cn(
                      "py-2 text-center sm:px-6 lg:text-left",
                      index === 0 && "sm:pl-0",
                    )}
                  >
                    <p className="font-numeric text-2xl font-semibold text-primary-dark">
                      {t(`${stat}Value`)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`${stat}Label`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-center text-sm leading-snug font-semibold text-foreground lg:text-left">
                  {t("partnersHeading")}
                </h3>
                {/* Matched on width, not height. These two wordmarks have very
                    different aspect ratios (Meta is 4.9:1, TikTok 3.4:1), so an
                    equal height renders Meta noticeably larger. Side by side
                    rather than stacked, to keep this column short. */}
                <div className="mt-4 flex items-center justify-center gap-8 lg:justify-start">
                  <Image
                    src="/images/home/meta-icon.webp"
                    alt="Meta"
                    width={960}
                    height={194}
                    className="h-auto w-28 object-contain"
                  />
                  <Image
                    src="/images/home/tiktok.svg"
                    alt="TikTok"
                    width={2500}
                    height={731}
                    className="h-auto w-28 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 lg:border-l lg:border-border lg:pl-12">
              <div className="grid grid-cols-3 items-center gap-x-6 gap-y-7 sm:grid-cols-4 lg:grid-cols-5">
                {TRUSTED_LOGOS.map((logo) => (
                  <Image
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    /* max-w-full matters at this column width: the widest marks
                       (Sekolah Ciputra is 6.7:1) would otherwise overrun their
                       cell rather than scale down to fit it. */
                    className="mx-auto h-7 w-auto max-w-full object-contain"
                  />
                ))}
              </div>

              {/* Below the wall, not inside it. As a grid cell this opened a
                  fourth row holding one stranded item; the 15 logos fill five
                  columns exactly, so the caption belongs outside that rhythm. */}
              <p className="mt-7 text-center text-sm text-muted-foreground">
                {t("moreClients")}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Quote-led testimonials on the brand grey (Light 100). The shift in
          ground still marks the change of voice: everything above this is the
          brand talking, this is customers talking. Every text tone below was
          checked against #f2f4f7 and clears AA. */}
      <div className="bg-surface-subtle">
        <Container
          ref={quotesRef}
          className="border-x border-border py-12 lg:py-16"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {tq("heading")}
              </h2>
              {/* Doubles as the accuracy qualifier. Every number in these quotes
                is the client's own, said on camera and never independently
                audited, so the page should say where they came from. */}
              <p className="mt-4 text-base text-muted-foreground">
                {tq("body")}
              </p>
            </div>

            <div className="lg:col-span-8">
              {/* The speaker's own headline number, pulled out of their quote
                  rather than added to it, so the outcome reads before the
                  operational detail that produced it. */}
              <div key={active.id} className="animate-fade-in-up-blur">
                <p className="font-numeric text-4xl leading-none font-semibold tracking-tight text-primary tabular-nums md:text-5xl">
                  {tq(`${active.id}.metricValue`)}
                </p>
                <p className="mt-2 max-w-md font-numeric text-sm leading-snug text-muted-foreground">
                  {tq(`${active.id}.metricLabel`)}
                </p>

                <blockquote className="mt-6 font-numeric text-xl leading-snug font-semibold text-foreground md:text-2xl">
                  &ldquo;{tq(`${active.id}.quote`)}&rdquo;
                </blockquote>
              </div>

              <div className="mt-8">
                <p className="font-semibold text-foreground">
                  {tq(`${active.id}.industry`)}
                </p>
                <p className="text-muted-foreground">
                  {tq(`${active.id}.function`)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tq(`${active.id}.name`)}, {tq(`${active.id}.role`)},{" "}
                  {tq(`${active.id}.company`)}
                </p>
              </div>

              {/* The dot stays 10px; the button around it is 24px so the touch
                  target meets WCAG 2.5.8. Sized as a hit area rather than a
                  bigger dot, and the row loses its gap to compensate: centres
                  land 24px apart instead of 20px, which is imperceptible. */}
              <div className="mt-6 -ml-3 flex items-center">
                {TESTIMONIALS.map((item) => {
                  const isActive = item.id === active.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectQuote(item.id)}
                      aria-label={tq(`${item.id}.company`)}
                      aria-current={isActive}
                      className="flex size-6 cursor-pointer items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2.5 rounded-full transition-colors",
                          isActive
                            ? "bg-primary"
                            : "bg-foreground/25 hover:bg-foreground/40",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
