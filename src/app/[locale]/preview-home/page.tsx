import { getPosts } from "@/lib/wordpress";
import PreviewHome, { type PreviewPost } from "@/components/preview-home/PreviewHome";

/** Selalu segar: artikel terbaru diambil per request (seperti /api/blog). */
export const dynamic = "force-dynamic";

export default async function PreviewHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  let posts: PreviewPost[] | undefined;
  try {
    const res = await getPosts({ page: 1, perPage: 3, lang: locale });
    posts = res.posts.map((p) => ({
      title: p.title,
      href: isEn ? `/en/blog/${p.slug}` : `/blog/${p.slug}`,
      meta: `${p.category?.name ?? (isEn ? "Article" : "Artikel")} · ${new Date(p.date).toLocaleDateString(
        isEn ? "en-US" : "id-ID",
        { day: "numeric", month: "short", year: "numeric" },
      )}`,
      img: p.image?.url,
    }));
  } catch {
    posts = undefined; // WordPress unreachable → kartu statis dari DATA
  }
  return <PreviewHome posts={posts} locale={locale} />;
}
