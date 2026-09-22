import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternates, SITE_URL } from "@/lib/seo";
import { getCategories, getPosts } from "@/lib/wordpress";
import { blogListingJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
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

      {/* Hero, copy + featured story */}
      <section className="relative overflow-hidden pt-16">
        <Image
          src="/images/home/hero-background-sky.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <Container className="relative px-6 py-14 lg:px-0 lg:py-20">
          {/* One unified block: frosted copy header fused to the white card. */}
          <div className="overflow-hidden shadow-[0px_24px_70px_-24px_rgba(11,18,32,0.5)]">
            <div className="bg-black/20 px-6 py-8 backdrop-blur-sm lg:px-10 lg:py-10">
              <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
                <div>
                  <p className="font-numeric text-sm font-semibold tracking-[0.12em] text-white/75 uppercase">
                    {t("eyebrow")}
                  </p>
                  <h1 className="mt-3 font-numeric text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    {t("heroTitle")}
                  </h1>
                </div>
                <p className="font-numeric text-base text-white/90 md:text-lg lg:pb-2">
                  {t("heroSubtitle")}
                </p>
              </div>
            </div>
            {featured && (
              <HeroFeatured
                post={featured}
                locale={locale}
                featuredLabel={t("featuredLabel")}
                readMore={t("readMore")}
              />
            )}
          </div>
        </Container>
      </section>

      {/* Latest articles */}
      <section className="bg-white">
        <Container className="px-6 py-12 lg:px-0 lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-numeric text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {query ? t("searchResults", { query }) : t("latest")}
              </h2>
              <p className="mt-2 font-numeric text-base text-muted-foreground">
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

          <div className="mt-6">
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              allLabel={t("allCategories")}
            />
          </div>

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
