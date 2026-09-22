import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, SITE_URL } from "@/lib/seo";
import { getCategories, getPosts } from "@/lib/wordpress";
import { blogListingJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { HeroFeatured } from "@/components/sections/blog/hero-featured";
import { CategoryFilter } from "@/components/sections/blog/category-filter";
import { BlogSearch } from "@/components/sections/blog/blog-search";
import { BlogFeed } from "@/components/sections/blog/blog-feed";

export const revalidate = 300;

const PER_PAGE = 9;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const query = (await searchParams).q?.trim();
  const t = await getTranslations({ locale, namespace: "blog" });
  const { canonical, languages } = alternates(locale, "/blog");
  const title = query ? t("searchResults", { query }) : t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    // Internal search results should not be indexed; the canonical still points
    // at the clean /blog URL so link equity stays on the hub.
    ...(query ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/graph-image.jpg"] },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const sp = await searchParams;
  const categorySlug = sp.category;
  const query = sp.q?.trim() || undefined;

  const t = await getTranslations({ locale, namespace: "blog" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const categories = await getCategories(locale);
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;
  const { posts, totalPages } = await getPosts({
    page: 1,
    perPage: PER_PAGE,
    categories: activeCategory?.ids,
    lang: locale,
    search: query,
  });

  // The featured story is the editorial lead-in, not a result — hide it while
  // filtering or searching so every card in view matches the query.
  const showFeatured = !categorySlug && !query && posts.length > 0;
  const featured = showFeatured ? posts[0] : undefined;
  const gridPosts = showFeatured ? posts.slice(1) : posts;
  const blogUrl = `${SITE_URL}${getPathname({ href: "/blog", locale })}`;

  return (
    <>
      <JsonLd
        data={[
          blogListingJsonLd({
            url: blogUrl,
            name: t("metaTitle"),
            description: t("metaDescription"),
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: `${SITE_URL}${getPathname({ href: "/", locale })}` },
            { name: t("heroTitle"), url: blogUrl },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("eyebrow")}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        chips={[t("latest")]}
      >
        {featured && (
          <HeroFeatured
            post={featured}
            locale={locale}
            featuredLabel={t("featuredLabel")}
            readMore={t("readMore")}
          />
        )}
      </PageHero>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  {t("eyebrow")}
                </p>
                <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-foreground">
                  {query ? t("searchResults", { query }) : t("latest")}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {query ? t("searchSubtitle") : t("latestSubtitle")}
                </p>
              </div>
              <BlogSearch
                initialQuery={query}
                placeholder={t("searchPlaceholder")}
                label={t("searchLabel")}
                clearLabel={t("searchClear")}
              />
            </div>
          </Reveal>

          <Reveal delay={40} className="mt-6">
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              allLabel={t("allCategories")}
            />
          </Reveal>

          {posts.length === 0 ? (
            <p className="mt-16 text-center font-numeric text-base text-muted-foreground">
              {query ? t("searchEmpty", { query }) : t("empty")}
            </p>
          ) : (
            <div className="mt-8">
              <BlogFeed
                key={`${categorySlug ?? "all"}-${query ?? ""}`}
                initialPosts={gridPosts.map((p) => ({ ...p, content: "" }))}
                initialPage={1}
                totalPages={totalPages}
                categorySlug={categorySlug}
                query={query}
                locale={locale}
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
