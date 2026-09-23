import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  metaSnippet,
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
  if (!url) return [{ url: "/graph-image.jpg", width: 1200, height: 630, alt: post.title }];
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
async function redirectToCounterpart(slug: string, locale: Locale): Promise<never> {
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

  const title = metaSnippet(post.seo.title || post.title, 70);
  const description = metaSnippet(
    post.seo.description || post.excerpt,
    158,
  );
  const canonical = canonicalFor(locale, slug);
  const images = ogImage(post);

  // hreflang demands a reciprocal pair. Each translation has its own slug, so
  // advertising this one under both locales points crawlers at a URL that does
  // not exist. Emit the pair only when the counterpart is actually published.
  // Keys are `en` / `id` (not `id-ID`) so they match the blog sitemap and
  // `alternates()` — mixed codes on one URL are a crawl-budget smell.
  const other: Locale = locale === "id" ? "en" : "id";
  const counterpart = await counterpartPostSlug(slug, other);
  const languages =
    counterpart.kind === "translated"
      ? reciprocalLanguages({
          en: canonicalFor("en", locale === "en" ? slug : counterpart.slug),
          id: canonicalFor("id", locale === "id" ? slug : counterpart.slug),
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

      {/* Void header — same keynote ground as the homepage / listing hero */}
      <section className="relative isolate overflow-hidden bg-ink-void text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#050b18] via-[#0a1a3d] to-[#0b1220]"
        />
        <div
          aria-hidden
          className="ink-noise pointer-events-none absolute inset-0 opacity-55"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-orb-drift absolute top-[10%] left-[8%] h-64 w-64 rounded-full bg-primary/35 blur-[110px]" />
          <span
            className="animate-orb-drift absolute top-[30%] right-[6%] h-72 w-72 rounded-full bg-accent-sky/25 blur-[120px]"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        <Container className="relative z-10 pt-28 pb-20 lg:pt-32 lg:pb-24">
          <div className="hero-stagger mx-auto max-w-3xl text-center lg:text-left">
            <nav aria-label="Breadcrumb" className="mb-6 flex justify-center lg:justify-start">
              <ol className="flex flex-wrap items-center justify-center gap-2 font-numeric text-xs text-sky-100/80">
                <li>
                  <Link
                    href="/"
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {tb("home")}
                  </Link>
                </li>
                <li aria-hidden className="text-sky-200/50">
                  /
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {t("heroTitle")}
                  </Link>
                </li>
                {post.category && (
                  <>
                    <li aria-hidden className="text-sky-200/50">
                      /
                    </li>
                    <li>
                      <Link
                        href={{
                          pathname: "/blog",
                          query: { category: post.category.slug },
                        }}
                        className="rounded-full border border-white/15 bg-white/8 px-3 py-1 transition-colors hover:border-white/40 hover:text-white"
                      >
                        {post.category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-white">
              {post.title}
            </h1>

            {description && (
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-sky-50/85 lg:mx-0">
                {description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full ring-2 ring-white/20"
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
                    className="font-semibold text-white hover:text-sky-200"
                  >
                    {post.author.name}
                  </Link>
                ) : (
                  <p className="font-semibold text-white">{post.author.name}</p>
                )}
                <p className="text-sky-100/75">
                  <time dateTime={post.dateIso}>
                    {formatDate(post.date, locale)}
                  </time>
                  {showUpdated && (
                    <>
                      <span aria-hidden> · </span>
                      <span className="text-sky-100/60">
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
                        className="rounded-full border border-white/15 bg-white/8 px-3 py-1 font-numeric text-[0.7rem] font-medium text-sky-100/90 backdrop-blur transition-colors hover:border-sky-300/50 hover:text-white"
                      >
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Container>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-linear-to-b from-transparent to-white"
        />
      </section>

      {/* Cover */}
      {post.image && (
        <Container className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface-subtle shadow-[0_32px_70px_-40px_rgba(11,18,32,0.55)]">
            <Image
              src={post.image.url}
              alt={post.image.alt || post.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </Container>
      )}

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
