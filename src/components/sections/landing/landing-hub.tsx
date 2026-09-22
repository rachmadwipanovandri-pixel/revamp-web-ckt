import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { REGISTRY } from "@/lib/registry";
import type { FeatureCategory, LandingKind } from "@/lib/registry/types";
import { Container } from "@/components/layout/container";
import { RegistryIcon } from "@/components/layout/registry-icon";
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

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-linear-to-b from-surface-muted to-white pt-16">
        <Container className="border-x border-border px-6 py-14 lg:py-20">
          <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-numeric text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 max-w-2xl font-numeric text-base text-muted-foreground md:text-lg">
            {t("body")}
          </p>
          <div className="mt-6 flex items-center gap-2 font-numeric text-sm text-subtle-foreground">
            <span
              className="size-1.5 rounded-full bg-accent-green"
              aria-hidden
            />
            {t("trust")}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="bg-white">
        <Container className="border-x border-border px-6 py-12 lg:py-16">
          <div className="flex flex-col gap-14">
            {categories.map((category) => {
              const config =
                kind === "features"
                  ? FEATURE_CATEGORY[category as FeatureCategory]
                  : undefined;
              const items = entries.filter(
                (entry) => entry.category === category,
              );
              const heading = config
                ? tn(config.navKey)
                : t(`category.${category}`);

              return (
                <div key={category}>
                  <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <RegistryIcon
                          name={config?.icon ?? "LayoutGrid"}
                          className="size-4.5"
                        />
                      </span>
                      <h2 className="font-numeric text-xl font-semibold tracking-tight text-foreground">
                        {heading}
                      </h2>
                      <span className="font-numeric text-sm text-subtle-foreground">
                        {items.length}
                      </span>
                    </div>
                    {config?.href && (
                      <Link
                        href={config.href}
                        className="hidden font-numeric text-sm font-semibold text-primary hover:underline sm:inline"
                      >
                        {tn(config.navKey)} →
                      </Link>
                    )}
                  </div>
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
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
