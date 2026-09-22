import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { REGISTRY } from "@/lib/registry";
import type { FeatureCategory, LandingKind } from "@/lib/registry/types";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { VoidFinalCta } from "@/components/sections/shared/void-final-cta";
import { EntryGrid } from "./entry-card";

const HUB_TEMPLATE = {
  features: "/features",
  industries: "/industries",
  solutions: "/solutions",
} as const satisfies Record<LandingKind, AppPathname>;

const FEATURE_CATEGORY: Record<
  FeatureCategory,
  {
    navKey: string;
    /** AI has no product page, so its hub group header is label-only. */
    href?: "/chat" | "/crm" | "/marketing" | "/order";
    icon: string;
  }
> = {
  chat: { navKey: "chat", href: "/chat", icon: "MessageCircle" },
  ai: { navKey: "ai", icon: "Sparkles" },
  crm: { navKey: "crm", href: "/crm", icon: "LayoutGrid" },
  marketing: { navKey: "marketing", href: "/marketing", icon: "Megaphone" },
  order: { navKey: "order", href: "/order", icon: "Workflow" },
};

export async function hubMetadata(
  kind: LandingKind,
  params: Promise<{ locale: string }>,
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `${kind}Hub` });
  const { canonical, languages } = alternates(locale, HUB_TEMPLATE[kind]);
  const title = t("metaTitle");
  const description = t("metaDescription");

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

export async function LandingHub({
  kind,
  params,
}: {
  kind: LandingKind;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `${kind}Hub` });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tl = await getTranslations({ locale, namespace: "landing" });
  const readMore = tl("readMore");

  const entries = REGISTRY[kind].filter((entry) => entry.slugs[locale]);
  const categories = [...new Set(entries.map((entry) => entry.category))];
  const pathname = `${HUB_TEMPLATE[kind]}/[slug]` as "/features/[slug]";

  // Headline is often one long sentence — put the closing clause on the accent.
  const heading = t("heading");
  const splitAt = heading.lastIndexOf(", ");
  const headingLead =
    splitAt > 20 && splitAt < heading.length - 20
      ? heading.slice(0, splitAt)
      : heading;
  const headingAccent =
    splitAt > 20 && splitAt < heading.length - 20
      ? heading.slice(splitAt + 1)
      : undefined;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={headingLead}
        accent={headingAccent}
        subtitle={t("body")}
        chips={[t("trust")]}
      />

      <section className="relative overflow-hidden bg-surface-muted py-16 md:py-20 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(19,82,191,0.1) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <Container className="relative">
          <div className="flex flex-col gap-14">
            {categories.map((category, categoryIndex) => {
              const config =
                kind === "features"
                  ? FEATURE_CATEGORY[category as FeatureCategory]
                  : undefined;
              const items = entries.filter(
                (entry) => entry.category === category,
              );
              const headingLabel = config
                ? tn(config.navKey)
                : t(`category.${category}`);

              return (
                <div key={category}>
                  <Reveal>
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-foreground/10 pb-5">
                      <div className="min-w-0">
                        <p className="eyebrow-rule mb-3 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                          {String(categoryIndex + 1).padStart(2, "0")} ·{" "}
                          {headingLabel}
                        </p>
                        <p className="font-numeric text-sm font-medium text-subtle-foreground">
                          {items.length}
                        </p>
                      </div>
                      {config?.href && (
                        <Link
                          href={config.href}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/15 bg-white px-5 py-2.5 font-numeric text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                        >
                          {tn(config.navKey)}
                          <span aria-hidden>&rarr;</span>
                        </Link>
                      )}
                    </div>
                  </Reveal>
                  <Reveal delay={60}>
                    <EntryGrid
                      readMore={readMore}
                      items={items.map((entry) => ({
                        href: {
                          pathname,
                          params: { slug: entry.slugs[locale]! },
                        },
                        icon: entry.icon,
                        title: entry.title[locale]!,
                        tagline: entry.tagline?.[locale],
                      }))}
                    />
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <div className="cv-auto">
        <VoidFinalCta namespace="agentic.finalCta" />
      </div>
    </>
  );
}
