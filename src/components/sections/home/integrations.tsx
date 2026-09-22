import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@iconify/react/offline";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { TEASER_INTEGRATIONS } from "@/lib/integrations";
import { Container } from "@/components/layout/container";

/**
 * Copy left, the marks we actually connect to right.
 *
 * Not a logo constellation: a wall of recognisable vendor logos is easy to
 * assemble and reads as a promise about every one of them. This shows only
 * what the site claims elsewhere and sends the rest to the integrations page.
 *
 * The marks sit in soft badges on one washed panel rather than in ruled
 * cells. Vendor logos bring their own colours and our own capabilities are
 * tinted to the brand, so the panel reads as a connected surface while still
 * saying which half of it is ours.
 */
export async function Integrations() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home.integrations");

  return (
    <section className="border-t border-border bg-surface-muted">
      <Container className="border-x border-border py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
              {t("heading")}
            </h2>
            <p className="mt-4 text-base text-muted-foreground lg:text-lg">
              {t("body")}
            </p>
            <Link
              href="/integrations"
              className="mt-7 inline-flex min-h-7 items-center gap-1.5 border-b border-primary/40 pb-0.5 font-numeric text-sm font-semibold text-primary transition-colors hover:border-primary"
            >
              {t("cta")}
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          {/* Two and five columns only: ten marks divide evenly into both, so
              no breakpoint ends on a half-empty row. The panel carries a
              faint wash and a glow behind the badges, which is what holds
              the marks together now that the cell rules are gone. */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-white to-primary/[0.04] lg:col-span-7">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-16 h-48 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]"
            />
            <ul className="relative grid grid-cols-2 gap-x-4 gap-y-7 p-6 sm:grid-cols-5 sm:gap-x-2 lg:p-8">
              {TEASER_INTEGRATIONS.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col items-center gap-2.5 text-center"
                >
                  {/* Brand logos carry hardcoded fills and ignore this tint;
                      our own mdi glyphs inherit it. One class, both families
                      right. */}
                  <span className="flex size-11 items-center justify-center rounded-full bg-white text-primary shadow-[0_2px_8px_color-mix(in_oklab,var(--primary)_12%,transparent)] ring-1 ring-primary/10">
                    <Icon
                      icon={item.icon}
                      id={`home-integration-${item.id}`}
                      className="h-6 w-auto"
                      aria-hidden
                    />
                  </span>
                  <span className="font-numeric text-xs leading-snug font-medium text-foreground">
                    {item.name[locale]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
