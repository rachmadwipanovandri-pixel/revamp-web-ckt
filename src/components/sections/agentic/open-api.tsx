import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { TEASER_INTEGRATIONS } from "@/lib/integrations";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { mdiApi } from "@/lib/icons";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  SoftCard,
  TextLink,
} from "@/components/sections/agentic/shell";

const CAPABILITIES = ["cap1", "cap2", "cap3", "cap4"] as const;

/**
 * Open API + integrations — light editorial chapter. Constellation sits in a
 * soft frame instead of a dark void panel.
 */
export async function OpenApi() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("agentic.openApi");

  return (
    <SectionBand tone="white" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              align="split"
              eyebrow={t("eyebrow")}
              lead={t("headingLead")}
              accent={t("headingAccent")}
              body={t("body")}
              className="lg:grid-cols-1"
            />
            <ul className="mt-8 grid gap-3">
              {CAPABILITIES.map((cap, index) => (
                <li
                  key={cap}
                  className="flex items-start gap-3 rounded-2xl border border-[#0C111D]/[0.07] bg-[#F6F7F9] px-4 py-3.5"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 font-numeric text-xs font-semibold tracking-[0.12em] text-primary"
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm leading-snug font-semibold text-[#0C111D]">
                      {t(`${cap}.title`)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#667085]">
                      {t(`${cap}.body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <TextLink href="/integrations" tone="brand">
                {t("cta")}
              </TextLink>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={80}>
            <SoftCard hover={false} className="overflow-hidden p-7 md:p-9">
              <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#0C111D]/[0.07] pb-4">
                <span className="inline-flex items-center gap-2 font-numeric text-[0.7rem] font-semibold tracking-[0.14em] text-[#667085] uppercase">
                  <SafeIcon icon={mdiApi} className="size-4 text-primary" size="1rem" />
                  {t("constellationLabel")}
                </span>
                <span className="font-numeric text-[0.7rem] text-[#98A2B3]">
                  REST · Webhook · OAuth
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-3">
                {TEASER_INTEGRATIONS.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 flex-col items-center gap-2.5 text-center"
                  >
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-[#0C111D]/[0.07] bg-[#F6F7F9] text-[#344054] transition-all duration-400 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white">
                      <SafeIcon
                        icon={item.icon}
                        className="h-6 w-auto"
                        size="1.5rem"
                      />
                    </span>
                    <span className="font-numeric text-xs leading-snug font-medium break-words text-[#525C6B]">
                      {item.name[locale]}
                    </span>
                  </li>
                ))}
              </ul>
            </SoftCard>
          </Reveal>
        </div>
      </SectionShell>
    </SectionBand>
  );
}
