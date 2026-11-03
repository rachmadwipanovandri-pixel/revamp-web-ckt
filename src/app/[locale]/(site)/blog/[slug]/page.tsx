import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  metaSnippet,
  metaTitle,
  reciprocalLanguages,
  SITE_URL,
} from "@/lib/seo";
import {
  counterpartPostSlug,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/wordpress";
import { buildToc, wordCount } from "@/lib/toc";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { formatDate } from "@/lib/format-date";
import { PostBody } from "@/components/sections/blog/post-body";
import { RelatedPosts } from "@/components/sections/blog/related-posts";
import { ShareButtons } from "@/components/sections/blog/share-buttons";
import { ArticleReadingBar } from "@/components/sections/blog/article-reading-bar";
import { TableOfContents } from "@/components/sections/blog/table-of-contents";
import { AuthorCard } from "@/components/sections/blog/author-card";
import { VoidFinalCta } from "@/components/sections/shared/void-final-cta";

export const revalidate = 300;
export const dynamicParams = true;

// Rendered on demand (and cached), the free WP host isn't hit at build time.
export function generateStaticParams() {
  return [];
}

function canonicalFor(locale: Locale, slug: string) {
  return `${SITE_URL}${getPathname({ href: { pathname: "/blog/[slug]", params: { slug } }, locale })}`;
}

function ogImage(post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>) {
  const url = post.seo.ogImage || post.image?.url;
  if (!url)
    return [
      { url: "/graph-image.jpg", width: 1200, height: 630, alt: post.title },
    ];
  return [
    {
      url,
      width: post.image?.width ?? 1200,
      height: post.image?.height ?? 630,
      alt: post.image?.alt || post.title,
    },
  ];
}

/**
 * Sends a request for a slug that does not exist in `locale` somewhere useful,
 * then throws: a published translation redirects to its own slug, an article
 * still awaiting translation falls back to the blog index in that locale, and
 * an unknown slug 404s so we never soft-404 a bad URL into a listing page.
 */
async function redirectToCounterpart(
  slug: string,
  locale: Locale,
): Promise<never> {
  const counterpart = await counterpartPostSlug(slug, locale);
  if (counterpart.kind === "translated") {
    redirect(
      getPathname({
        href: { pathname: "/blog/[slug]", params: { slug: counterpart.slug } },
        locale,
      }),
    );
  }
  if (counterpart.kind === "untranslated") {
    redirect(getPathname({ href: "/blog", locale }));
  }
  notFound();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = await getPostBySlug(slug, locale);

  // Missing in this locale: do NOT inherit the layout's homepage canonical.
  // The page component still runs counterpart redirect / 404; noindex here is
  // belt-and-suspenders if a bot ever inspects the intermediate response.
  if (!post) {
    return { robots: { index: false, follow: false } };
  }

  const title = metaTitle(post.seo.title || post.title);
  const description = metaSnippet(post.seo.description || post.excerpt, 158);
  const canonical = canonicalFor(locale, slug);
  const images = ogImage(post);

  // hreflang demands a reciprocal pair. Each translation has its own slug, so
  // advertising this one under both locales points crawlers at a URL that does
  // not exist. Emit the pair only when the counterpart is actually published.
  // Keys are `en` / `id` (not `id-ID`) so they match the blog sitemap and
  // `alternates()` — mixed codes on one URL are a crawl-budget smell.
  // Paths are RELATIVE: reciprocalLanguages prefixes SITE_URL itself, and
  // passing canonicalFor()'s absolute URL here used to yield
  // `https://cekat.aihttps://cekat.ai/...` (URL-parsed down to `...aihttps//...`).
  const other: Locale = locale === "id" ? "en" : "id";
  const counterpart = await counterpartPostSlug(slug, other);
  const languages =
    counterpart.kind === "translated"
      ? reciprocalLanguages({
          en: getPathname({
            href: {
              pathname: "/blog/[slug]",
              params: { slug: locale === "en" ? slug : counterpart.slug },
            },
            locale: "en",
          }),
          id: getPathname({
            href: {
              pathname: "/blog/[slug]",
              params: { slug: locale === "id" ? slug : counterpart.slug },
            },
            locale: "id",
          }),
        })
      : undefined;

  return {
    title,
    description,
    // Explicit index/follow: layout does not set robots, and a stale override
    // would otherwise be possible after a previous noindex response shape.
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      publishedTime: post.dateIso,
      modifiedTime: post.modifiedIso,
      authors: [post.author.name],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = await getPostBySlug(slug, locale);
  // Polylang gives every translation its own slug, so the language switcher
  // (which renders in the layout and cannot see this article) links to the
  // same slug under the other locale. Resolve where that should really land.
  if (!post) return await redirectToCounterpart(slug, locale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const related = await getRelatedPosts(post, 3, locale);
  const url = canonicalFor(locale, slug);
  const { html: bodyHtml, toc } = buildToc(post.content);
  const description = metaSnippet(post.seo.description || post.excerpt, 158);
  const showUpdated = post.modifiedIso !== post.dateIso;
  const coverAspectRatio =
    post.image?.width && post.image.height
      ? `${post.image.width} / ${post.image.height}`
      : "4 / 3";

  const homeUrl = `${SITE_URL}${getPathname({ href: "/", locale })}`;
  const blogUrl = `${SITE_URL}${getPathname({ href: "/blog", locale })}`;

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            headline: post.title,
            description,
            url,
            image: post.image,
            authorName: post.author.name,
            authorUrl: post.author.slug
              ? `${SITE_URL}${getPathname({
                  href: {
                    pathname: "/blog/author/[slug]",
                    params: { slug: post.author.slug },
                  },
                  locale,
                })}`
              : undefined,
            datePublished: post.dateIso,
            dateModified: post.modifiedIso,
            section: post.category?.name,
            language: locale === "id" ? "id-ID" : "en",
            keywords: post.tags,
            wordCount: wordCount(post.content),
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: homeUrl },
            { name: t("heroTitle"), url: blogUrl },
            // Last node: name only (Google's BreadcrumbList examples omit `item`).
            { name: post.title },
          ]),
        ]}
      />

      <ArticleReadingBar title={post.title} backLabel={t("backToBlog")} />

      {/* Editorial masthead: readable and consistent with the light site openings. */}
      <section className="article-hero relative isolate overflow-hidden border-b border-[#e5e9ef] bg-[#f3f6fd] text-[#09214c]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(0,180,200,0.13),transparent_42%),radial-gradient(circle_at_88%_10%,rgba(19,82,191,0.12),transparent_38%),linear-gradient(to_bottom,#f3f6fd,#fff)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute top-[10%] left-[8%] h-64 w-64 rounded-full bg-primary/5 blur-[110px]" />
          <span
            className="absolute top-[30%] right-[6%] h-72 w-72 rounded-full bg-accent-sky/5 blur-[120px]"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        <Container
          className={`relative z-10 pt-16 pb-16 lg:pt-20 lg:pb-20 ${post.image ? "lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14" : ""}`}
        >
          <div className="max-w-[850px] text-left">
            <nav aria-label="Breadcrumb" className="mb-8 flex">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-[#505f73]">
                <li>
                  <Link
                    href="/"
                    className="rounded-full border border-[#ccdaf1] bg-white px-3 py-1 transition-colors hover:border-[#1352bf] hover:text-[#1352bf]"
                  >
                    {tb("home")}
                  </Link>
                </li>
                <li aria-hidden className="text-[#717b91]">
                  /
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="rounded-full border border-[#ccdaf1] bg-white px-3 py-1 transition-colors hover:border-[#1352bf] hover:text-[#1352bf]"
                  >
                    {t("heroTitle")}
                  </Link>
                </li>
                {post.category && (
                  <>
                    <li aria-hidden className="text-[#717b91]">
                      /
                    </li>
                    <li>
                      <Link
                        href={{
                          pathname: "/blog",
                          query: { category: post.category.slug },
                        }}
                        className="rounded-full border border-[#ccdaf1] bg-white px-3 py-1 transition-colors hover:border-[#1352bf] hover:text-[#1352bf]"
                      >
                        {post.category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.1] font-semibold tracking-[-0.05em] text-balance text-[#09214c]">
              {post.title}
            </h1>

            {description && (
              <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-[#3a4960]">
                {description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full ring-2 ring-[#ccdaf1]"
                  unoptimized
                />
              )}
              <div className="font-numeric text-sm text-left">
                {post.author.slug ? (
                  <Link
                    href={{
                      pathname: "/blog/author/[slug]",
                      params: { slug: post.author.slug },
                    }}
                    className="font-semibold text-[#09214c] hover:text-[#1352bf]"
                  >
                    {post.author.name}
                  </Link>
                ) : (
                  <p className="font-semibold text-[#09214c]">
                    {post.author.name}
                  </p>
                )}
                <p className="text-[#505f73]">
                  <time dateTime={post.dateIso}>
                    {formatDate(post.date, locale)}
                  </time>
                  {showUpdated && (
                    <>
                      <span aria-hidden> · </span>
                      <span className="text-[#717b91]">
                        {locale === "id" ? "Diperbarui" : "Updated"}{" "}
                      </span>
                      <time dateTime={post.modifiedIso}>
                        {formatDate(post.modified, locale)}
                      </time>
                    </>
                  )}
                </p>
              </div>
              {post.tags.length > 0 && (
                <ul className="flex flex-wrap items-center justify-center gap-2 lg:ml-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>
                      <Link
                        href={{ pathname: "/blog", query: { q: tag } }}
                        className="rounded-xl border border-[#ccdaf1] bg-white px-3 py-1 text-sm font-medium text-[#0a3173] transition-colors hover:border-[#1352bf]"
                      >
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {post.image && (
            <div className="article-cover-stage relative mt-10 rounded-[28px] border border-[#ccdaf1] bg-[#e4ebf9] p-5 lg:mt-0 lg:p-7">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_50px_-30px_rgba(9,33,76,0.3)]"
                style={{ aspectRatio: coverAspectRatio }}
              >
                <Image
                  src={post.image.url}
                  alt={post.image.alt || post.title}
                  fill
                  preload
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </Container>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-b from-transparent to-white"
        />
      </section>

      {/* Body + sticky sidebar (TOC · author · share) */}
      <article>
        <Container className="px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[1fr_17rem] lg:gap-14 lg:px-8 lg:py-16">
          <div className="min-w-0 max-w-3xl">
            <PostBody html={bodyHtml} />
          </div>
          <aside className="mt-12 lg:mt-0">
            <div className="flex flex-col gap-8 lg:sticky lg:top-32">
              <TableOfContents items={toc} label={t("onThisPage")} />
              <AuthorCard
                author={post.author}
                label={t("aboutAuthor")}
                role={t("authorRole")}
                fallbackBio={t("authorBio")}
                profileLabel={t("viewAuthorProfile")}
              />
              <ShareButtons
                url={url}
                title={post.title}
                shareLabel={t("share")}
                copyLabel={t("copyLink")}
                copiedLabel={t("copied")}
              />
            </div>
          </aside>
        </Container>
      </article>

      <RelatedPosts
        posts={related}
        heading={t("relatedHeading")}
        locale={locale}
      />
      <div className="cv-auto">
        <VoidFinalCta namespace="agentic.finalCta" />
      </div>
    </>
  );
}
