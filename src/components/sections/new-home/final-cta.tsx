"use client";

import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { SafeIcon } from "./safe-icon";

/**
 * Full-bleed closer: ink void + brand aurora + extreme type.
 * No rounded top shell — the page ends as one continuous dark act.
 */
export function FinalCTA({
  namespace = "home.finalCta",
}: {
  namespace?: string;
}) {
  const t = useTranslations(namespace);
  const th = useTranslations("home.hero");
  const checklist = t.has("item1")
    ? (["item1", "item2", "item3"] as const)
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-ink-void text-white">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-50" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute -top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/45 blur-[120px]" />
        <span
          className="animate-orb-drift absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent-sky/35 blur-[120px]"
          style={{ animationDelay: "-7s" }}
        />
        <span
          className="animate-orb-drift absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-accent-teal/20 blur-[100px]"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8 lg:py-36">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow-rule eyebrow-rule-light mb-6 font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-300 uppercase">
                CekatAI
              </p>
              <h2 className="max-w-[16ch] text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-white text-balance">
                {t("heading")}
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-primary-foreground-muted md:text-lg">
                {t("body")}
              </p>

              {checklist && (
                <ul className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                  {checklist.map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2.5 text-sm font-medium text-white/90"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-400/20 text-sky-300 ring-1 ring-sky-400/30">
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
              )}
            </div>

            <div className="lg:col-span-4 lg:justify-self-end">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <Button
                  nativeButton={false}
                  render={<AppAnchor href={REGISTER_URL} />}
                  className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_18px_40px_-18px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50 hover:text-primary-dark"
                >
                  {th("ctaSecondary")}
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="h-13 rounded-full border-white/30 bg-white/8 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15"
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
