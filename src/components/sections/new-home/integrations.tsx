import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { TEASER_INTEGRATIONS } from "@/lib/integrations";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SafeIcon } from "./safe-icon";

export async function Integrations() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home.integrations");

  return (
    <SectionShell surface="gradient-brand">
      <div aria-hidden className="ink-noise pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            chapter="05"
            tone="ink"
            eyebrow={t("eyebrow")}
            title={t("heading")}
            lede={t("body")}
          />
          <Link
            href="/integrations"
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 py-3 font-numeric text-sm font-semibold text-primary-dark shadow-[0_16px_36px_-16px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          {/* Constellation plate — nodes float on staggered delays */}
          <div className="glass-ink relative overflow-hidden rounded-[1.75rem] p-7 md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-28 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-sky-400/25 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(147,197,253,0.35) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
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
    </SectionShell>
  );
}
