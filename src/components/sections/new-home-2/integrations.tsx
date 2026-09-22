import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { TEASER_INTEGRATIONS } from "@/lib/integrations";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { SplitHeading, Eyebrow } from "./split-heading";

/**
 * Light integrations constellation — same data as the homepage, inverted surface so
 * the page stays in its airy middle chapters.
 */
export async function Integrations() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home.integrations");

  return (
    <section className="relative overflow-hidden bg-surface-muted py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(19,82,191,0.12) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SplitHeading
            className="mt-5"
            lead="Connect every tool"
            accent="in one platform"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
          <Link
            href="/integrations"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/30 bg-white px-6 py-3 font-numeric text-sm font-semibold text-primary shadow-[0_12px_28px_-18px_rgba(19,82,191,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-white p-7 shadow-[0_28px_60px_-40px_rgba(16,24,40,0.4)] md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
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
                  <span className="flex size-16 items-center justify-center rounded-2xl border border-foreground/8 bg-surface-muted text-primary shadow-[0_12px_28px_-18px_rgba(19,82,191,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/35 hover:bg-white">
                    <SafeIcon
                      icon={item.icon}
                      className="h-7 w-auto"
                      size="1.75rem"
                    />
                  </span>
                  <span className="font-numeric text-xs leading-snug font-medium break-words text-foreground/80">
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
