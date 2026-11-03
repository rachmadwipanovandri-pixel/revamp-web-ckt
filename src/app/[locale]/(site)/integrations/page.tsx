import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Icon } from "@iconify/react/offline";
import type { Locale } from "@/i18n/routing";
import { alternates, metaSnippet, metaTitle } from "@/lib/seo";
import { INTEGRATION_GROUPS } from "@/lib/integrations";
import { localeValue } from "@/lib/locale-value";
import { Container } from "@/components/layout/container";
import { LandingHero } from "@/components/sections/landing/landing-hero";
import { LandingCta } from "@/components/sections/landing/landing-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "integrations" });
  const { canonical, languages } = alternates(locale, "/integrations");
  const title = metaTitle(t("metaTitle"));
  const description = metaSnippet(t("metaDescription"), 158);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        { url: "/graph-image.jpg", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/graph-image.jpg"],
    },
  };
}

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "integrations" });

  return (
    <>
      <LandingHero
        badge={t("badge")}
        title={t("heading")}
        subtitle={t("subtitle")}
        productImage="/images/chat/connect-channels.png"
        imageAlt={t("heading")}
      />

      {/* One group per section rather than a single flat grid: what a WhatsApp
          connection does and what a webhook does are different promises, and
          the grouping is what keeps each honest. */}
      {INTEGRATION_GROUPS.map((group, index) => (
        <section
          key={group.id}
          className="integration-chapter border-t border-[#e5e9ef]"
          data-chapter={index % 3}
        >
          <Container className="py-20 lg:py-28">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
              <h2 className="text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.045em] text-balance text-[#09214c] lg:col-span-5">
                {localeValue(group.title, locale)}
              </h2>
              <p className="text-base leading-[1.6] text-[#3a4960] lg:col-span-7 lg:text-lg">
                {localeValue(group.body, locale)}
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-[20px] border border-[#e5e9ef] bg-white p-6 transition-colors hover:border-[#9eb8e5]"
                >
                  {/* Vendor logos ignore this tint, our own glyphs inherit
                      it; see the icon field on Integration. Height plus
                      w-auto because the brand marks are not all square. */}
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-border">
                    <Icon icon={item.icon} className="h-5 w-auto" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-numeric text-base font-semibold text-foreground">
                      {localeValue(item.name, locale)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {localeValue(item.note, locale)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}

      <section className="border-t border-border bg-surface-muted">
        <Container className="py-20 lg:py-24">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
            {t("missingHeading")}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground lg:text-lg">
            {t("missingBody")}
          </p>
        </Container>
      </section>

      <LandingCta heading={t("ctaHeading")} body={t("ctaBody")} />
    </>
  );
}
