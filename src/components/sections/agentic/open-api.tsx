import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { TEASER_INTEGRATIONS } from "@/lib/integrations";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { mdiApi } from "@/lib/icons";

const CAPABILITIES = ["cap1", "cap2", "cap3", "cap4"] as const;

/**
 * Open API + integrations chapter — dark brand surface so the page bookends
 * the light product grid with keynote ink. Constellation reuses the live
 * TEASER_INTEGRATIONS registry.
 */
export async function OpenApi() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("agentic.openApi");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-ink-void via-[#0c2a6b] to-ink-void py-20 text-white md:py-28 lg:py-32">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-45" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-10 right-[8%] h-64 w-64 rounded-full bg-sky-500/25 blur-[100px]" />
        <span className="absolute bottom-16 left-[4%] h-56 w-56 rounded-full bg-primary/35 blur-[90px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow-rule-light mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-300 uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-white">
            {t("headingLead")}{" "}
            <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              {t("headingAccent")}
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-sky-50/85">
            {t("body")}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((cap, index) => (
              <li
                key={cap}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 backdrop-blur"
              >
                <span
                  aria-hidden
                  className="mt-0.5 font-numeric text-xs font-bold tracking-[0.14em] text-sky-300"
                >
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm leading-snug font-semibold text-white">
                    {t(`${cap}.title`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-sky-100/75">
                    {t(`${cap}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/integrations"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 font-numeric text-sm font-semibold text-[#0b1f4a] shadow-[0_14px_32px_-16px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/6 p-7 shadow-[0_32px_70px_-40px_rgba(0,0,0,0.8)] backdrop-blur-md md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl"
            />
            <div className="relative mb-6 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="inline-flex items-center gap-2 font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-sky-300 uppercase">
                <SafeIcon icon={mdiApi} className="size-4" size="1rem" />
                {t("constellationLabel")}
              </span>
              <span className="font-numeric text-[0.65rem] text-sky-100/70">
                REST · Webhook · OAuth
              </span>
            </div>
            <ul className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-5 sm:gap-x-2">
              {TEASER_INTEGRATIONS.map((item, index) => (
                <li
                  key={item.id}
                  className="flex min-w-0 flex-col items-center gap-3 text-center"
                  style={{
                    animation: `floatSoft 7s ease-in-out ${index * 0.4}s infinite`,
                  }}
                >
                  <span className="flex size-16 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-sky-200 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-sky-300/40 hover:bg-white/12">
                    <SafeIcon
                      icon={item.icon}
                      className="h-7 w-auto"
                      size="1.75rem"
                    />
                  </span>
                  <span className="font-numeric text-xs leading-snug font-medium break-words text-white/85">
                    {item.name[locale]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
