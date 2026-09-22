import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import {
  counterpartPostSlug,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/wordpress";
import { buildToc } from "@/lib/toc";
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

export const revalidate = 300;
export const dynamicParams = true;

// Rendered on demand (and cached), the free WP host isn't hit at build time.
export function generateStaticParams() {
  return [];
}

function canonicalFor(locale: Locale, slug: string) {
  return `${SITE_URL}${getPathname({ href: { pathname: "/blog/[slug]", params: { slug } }, locale })}`;
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
  if (!post) return {};

  const title = post.seo.title || post.title;
  const description = post.seo.description;
  const canonical = canonicalFor(locale, slug);

  // hreflang demands a reciprocal pair. Each translation has its own slug, so
  // advertising this one under both locales points crawlers at a URL that does
  // not exist. Emit the pair only when the counterpart is actually published,
  // matching how `sitemap-data.ts` builds its language map.
  const other: Locale = locale === "id" ? "en" : "id";
  const counterpart = await counterpartPostSlug(slug, other);
  const languages =
    counterpart.kind === "translated"
      ? {
          [locale === "id" ? "id-ID" : "en"]: canonical,
          [other === "id" ? "id-ID" : "en"]: canonicalFor(other, counterpart.slug),
          "x-default": locale === "id" ? canonical : canonicalFor(other, counterpart.slug),
        }
      : undefined;

  return {
    title,
    description,
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
      images: [{ url: post.seo.ogImage || "/graph-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.seo.ogImage || "/graph-image.jpg"],
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

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            headline: post.title,
            description: post.seo.description ?? post.excerpt,
            url,
            image: post.image,
            authorName: post.author.name,
            datePublished: post.dateIso,
            dateModified: post.modifiedIso,
            section: post.category?.name,
            language: locale === "id" ? "id-ID" : "en",
            keywords: post.tags,
          }),
          breadcrumbJsonLd([
            { name: tb("home"), url: `${SITE_URL}${getPathname({ href: "/", locale })}` },
            { name: t("heroTitle"), url: `${SITE_URL}${getPathname({ href: "/blog", locale })}` },
            { name: post.title, url },
          ]),
        ]}
      />

      <ArticleReadingBar title={post.title} backLabel={t("backToBlog")} />

      <article className="bg-white pt-16">
        {/* Header */}
        <Container className="px-6 py-10 lg:px-0 lg:py-14">
          <Link
            href="/blog"
            className="font-numeric text-sm font-semibold text-primary"
          >
            ← {t("backToBlog")}
          </Link>
          {post.category && (
            <span className="mt-6 block font-numeric text-xs font-semibold tracking-wide text-primary uppercase">
              {post.category.name}
            </span>
          )}
          <h1 className="mt-3 max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={44}
                height={44}
                className="size-11 rounded-full"
                unoptimized
              />
            )}
            <div className="font-numeric text-sm">
              <p className="font-semibold text-foreground">{post.author.name}</p>
              <time dateTime={post.date} className="text-subtle-foreground">
                {formatDate(post.date, locale)}
              </time>
            </div>
          </div>
        </Container>

        {/* Cover */}
        {post.image && (
          <Container className="px-6 lg:px-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface-subtle">
              <Image
                src={post.image.url}
                alt={post.image.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </Container>
        )}

        {/* Body + sticky sidebar (TOC · author · share) */}
        <Container className="px-6 py-10 lg:grid lg:grid-cols-[1fr_17rem] lg:gap-14 lg:px-0 lg:py-14">
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
    </>
  );
}
