import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import {
  LEGAL_PATHNAME,
  loadLegalContent,
  type LegalContent,
  type LegalPageId,
} from "@/lib/legal";
import { PostBody } from "@/components/sections/blog/post-body";

/** First paragraph's text, trimmed to a meta-description length. */
function metaDescription(html: string): string {
  const firstP = html.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "";
  const text = firstP
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}

export async function legalMetadata(
  page: LegalPageId,
  params: Promise<{ locale: string }>,
): Promise<Metadata> {
  const { locale } = await params;
  const content = await loadLegalContent(page, locale as Locale);
  const { canonical, languages } = alternates(locale, LEGAL_PATHNAME[page]);
  const title = `${content.title} | CekatAI`;
  const description = metaDescription(content.html);

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
        {
          url: "/graph-image.jpg",
          width: 1200,
          height: 630,
          alt: content.title,
        },
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

export async function LegalPage({
  page,
  params,
}: {
  page: LegalPageId;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content: LegalContent = await loadLegalContent(page, locale as Locale);

  return (
    <div className="border-b border-border bg-white">
      <div className="mx-auto w-full max-w-3xl px-5 pt-28 pb-20 sm:px-6 lg:pt-36">
        <header className="border-b border-border pb-8">
          <h1 className="font-numeric text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            {content.title}
          </h1>
          {content.updated ? (
            <p className="mt-3 font-numeric text-sm text-muted-foreground">
              {content.updated}
            </p>
          ) : null}
        </header>
        <div className="mt-8">
          <PostBody html={content.html} />
        </div>
      </div>
    </div>
  );
}
