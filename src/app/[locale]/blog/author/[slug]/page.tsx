import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { metaSnippet, SITE_URL } from "@/lib/seo";
import { getAuthorBySlug, getPosts } from "@/lib/wordpress";
import { breadcrumbJsonLd, profilePageJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { PageHero } from "@/components/sections/shared/page-hero";
import { PostCard } from "@/components/sections/blog/post-card";

export const revalidate = 300;
export const dynamicParams = true;

// Rendered on demand (and cached) — free WP host is not hit at build time.
export function generateStaticParams() {
  return [];
}

const PER_PAGE = 9;

function authorPath(locale: Locale, slug: string) {
  return getPathname({
    href: { pathname: "/blog/author/[slug]", params: { slug } },
    locale,
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { robots: { index: false, follow: false } };
  }

  const t = await getTranslations({ locale, namespace: "blog" });
  const title = metaSnippet(t("authorMetaTitle", { name: author.name }), 70);
  const description = metaSnippet(
    author.bio || t("authorMetaDescription", { name: author.name }),
    158,
  );
  const canonical = `${SITE_URL}${authorPath(locale, slug)}`;
  const images = author.avatar
    ? [{ url: author.avatar, alt: author.name }]
    : [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${authorPath("en", slug)}`,
        id: `${SITE_URL}${authorPath("id", slug)}`,
        "x-default": `${SITE_URL}${authorPath("id", slug)}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "profile",
      images,
    },
    twitter: {
      card: author.avatar ? "summary" : "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const { posts, total } = await getPosts({
    page: 1,
    perPage: PER_PAGE,
    author: author.id,
    lang: locale,
  });

  const bio = author.bio || t("authorBio");
  const url = `${SITE_URL}${authorPath(locale, slug)}`;
  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const blogUrl = `${SITE_URL}${getPathname({ href: "/blog", locale })}`;
  const chips = [t("authorPostCount", { count: total })];

  return (
    <>
      <JsonLd
        data={[
          profilePageJsonLd({
            url,
            name: author.name,
            description: bio,
            image: author.avatar,
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: t("heroTitle"), url: blogUrl },
            { name: author.name },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("authorEyebrow")}
        title={author.name}
        subtitle={bio}
        chips={chips}
      >
        <div className="mx-auto flex max-w-xl items-center justify-center gap-4 rounded-[1.35rem] border border-white/12 bg-white/8 p-5 backdrop-blur lg:mx-0 lg:max-w-md">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={72}
              height={72}
              className="size-16 shrink-0 rounded-full ring-2 ring-white/25"
              unoptimized
              priority
            />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/25 font-numeric text-2xl font-semibold text-white ring-2 ring-white/25">
              {author.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0 text-left">
            <p className="font-numeric text-base font-semibold text-white">
              {author.name}
            </p>
            <p className="mt-0.5 font-numeric text-sm text-sky-100/80">
              {t("authorRole")}
            </p>
            <p className="mt-2 font-numeric text-xs tracking-[0.12em] text-sky-200/70 uppercase">
              {t("authorPostCount", { count: total })}
            </p>
          </div>
        </div>
      </PageHero>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
        />
        <Container className="relative">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  {t("authorEyebrow")}
                </p>
                <h2 className="text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-foreground">
                  {t("authorArticles", { name: author.name })}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {t("authorArticlesSubtitle", { name: author.name })}
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 bg-white px-4 py-2 font-numeric text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {t("backToBlog")}
              </Link>
            </div>
          </Reveal>

          {posts.length === 0 ? (
            <p className="mt-16 text-center font-numeric text-base text-muted-foreground">
              {t("authorEmpty")}
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
