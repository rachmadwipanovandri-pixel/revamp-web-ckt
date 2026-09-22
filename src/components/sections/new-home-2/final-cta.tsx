"use client";

import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { SplitHeading, Eyebrow } from "./split-heading";

/**
 * Closer mirrors the hero gradient in reverse — soft sky collapsing into deep
 * navy — so the page bookends as one continuous blue act.
 */
export function FinalCta() {
  const t = useTranslations("home.finalCta");
  const th = useTranslations("home.hero");
  const checklist = (["item1", "item2", "item3"] as const);

  return (
    <section className="relative isolate overflow-hidden text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-white from-0% via-[#93c5fd] via-18% via-[#3b82f6] via-42% via-[#1546c4] via-70% to-[#050b18] to-100%"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 -z-10 opacity-55"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-sky-400/30 blur-[100px]" />
        <span className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-24 sm:px-6 md:pt-36 md:pb-32 lg:px-8 lg:pt-40 lg:pb-36">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow tone="ink">CekatAI</Eyebrow>
              <SplitHeading
                className="mt-5"
                lead="Turn every conversation"
                accent="into a sale"
                tone="ink"
                size="hero"
              />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-sky-50/85 md:text-lg">
                {t("body")}
              </p>

              <ul className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                {checklist.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2.5 text-sm font-medium text-white/90"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-400/20 text-sky-200 ring-1 ring-sky-300/35">
                      <SafeIcon
                        icon={lucideCheck}
                        className="size-3.5"
                        size="0.875rem"
                      />
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <Button
                  nativeButton={false}
                  render={<AppAnchor href={REGISTER_URL} />}
                  className="h-13 rounded-full bg-white px-8 text-sm text-[#0b1f4a] shadow-[0_18px_40px_-18px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  {th("ctaSecondary")}
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="h-13 rounded-full border-white/35 bg-white/10 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15"
                  render={
                    <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <SafeIcon
                    icon={mdiWhatsapp}
                    className="size-4"
                    size="1rem"
                  />
                  {th("ctaPrimary")}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
