"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Icon } from "@iconify/react/offline";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { Meteors } from "@/components/ui/meteors";

export function FinalCTA({
  namespace = "home.finalCta",
}: {
  namespace?: string;
}) {
  const t = useTranslations(namespace);
  // One-shot reveal: the card lifts in the first time it is seen and
  // stays put, which is what viewport={{ once: true }} did.
  const cardRef = useRef<HTMLDivElement>(null);
  const revealed = useReveal(cardRef, 0.1);
  const th = useTranslations("home.hero");
  // Risk-reducer checklist; only the home namespace defines these keys, so
  // the product pages reusing FinalCTA render without it.
  const checklist = t.has("item1")
    ? (["item1", "item2", "item3"] as const)
    : null;

  return (
    <section className="relative overflow-hidden border-t border-border bg-linear-to-b from-white to-surface-subtle pt-3 lg:pt-6">
      {/* Meteors & Gradient Background Overlay on the section itself */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Meteors number={20} angle={70} />
      </div>

      <Container className="relative z-10 lg:px-0">
        <div
          ref={cardRef}
          className={cn(
            "reveal-on-scroll border-2 border-b-0 border-white bg-surface-muted p-8 shadow-[0px_0px_24px_0px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out md:p-12 lg:p-16",
            revealed ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
          )}
        >
          <div
            className={cn(
              "reveal-on-scroll transition-opacity delay-300 duration-700",
              revealed ? "opacity-100" : "opacity-0",
            )}
          >
            <h2 className="max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-2xl font-numeric text-base text-muted-foreground md:text-lg">
              {t("body")}
            </p>
            {checklist && (
              <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                {checklist.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 font-numeric text-sm font-medium text-foreground"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon icon={lucideCheck} className="size-3" />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="default"
                nativeButton={false}
                render={<AppAnchor href={REGISTER_URL} />}
                className="h-9 bg-primary px-3 py-2.5 text-xs font-semibold text-white"
              >
                {th("ctaSecondary")}
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                className="h-9 border-primary px-3 py-2.5 text-xs font-semibold text-primary hover:border-foreground hover:bg-white hover:text-foreground"
                render={
                  <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                }
              >
                <Icon icon={mdiWhatsapp} className="size-4" />
                {th("ctaPrimary")}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
