import { getTranslations } from "next-intl/server";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import {
  SectionBand,
  SectionShell,
  Eyebrow,
  PhotoOverlay,
} from "@/components/sections/agentic/shell";

const CHECKS = ["item1", "item2", "item3"] as const;

/**
 * Closing chapter — oversized display type, dual CTAs, quiet checklist.
 * Clean ink field (incident.io closer energy), no orbs.
 */
export async function FinalCta() {
  const t = await getTranslations("agentic.finalCta");
  const th = await getTranslations("home.hero");

  return (
    <SectionBand tone="ink" className="relative isolate overflow-hidden border-t border-white/10">
      <PhotoOverlay
        src="/images/home/overlay-team.jpg"
        wash="from-[#0B1220]/92 via-[#0B1220]/78 to-[#0B1220]/88"
      />
      <SectionShell className="relative py-20 md:py-28 lg:py-32">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow tone="light" className="mb-5">
                {t("eyebrow")}
              </Eyebrow>
              <h2 className="text-[clamp(2.35rem,5.5vw,4rem)] leading-[1.03] font-semibold tracking-[-0.045em] text-balance text-white">
                {t("headingLead")}{" "}
                <span className="text-[#8EC5FF]">{t("headingAccent")}</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-[1.65] text-white/70 md:text-lg">
                {t("body")}
              </p>

              <ul className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-7">
                {CHECKS.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2.5 text-sm font-medium text-white/90"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">
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
                  className="h-12 rounded-full bg-white px-8 text-sm text-[#0B1220] hover:bg-[#F0F4FF]"
                >
                  {th("ctaSecondary")}
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="h-12 rounded-full border-white/25 bg-white/[0.06] px-8 text-sm text-white hover:border-white/50 hover:bg-white/10"
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
      </SectionShell>
    </SectionBand>
  );
}
