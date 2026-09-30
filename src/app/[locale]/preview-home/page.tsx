import { getPosts } from "@/lib/wordpress";
import { buildPage } from "@/components/preview-home/render";
import PreviewHome from "@/components/preview-home/PreviewHome";

type PreviewPost = {
  title: string;
  href: string;
  meta: string;
  img?: string;
};

/**
 * ISR 60 detik: kartu blog boleh maksimal satu menit tertinggal (fetch
 * WordPress-nya sendiri sudah di-revalidate 300s), tapi HTML-nya disajikan
 * dari cache Vercel alih-alih di-render ulang tiap request — TTFB jatuh dari
 * ~800ms (render + fetch per kunjungan) ke hit edge/cache.
 */
export const revalidate = 60;

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
  return (
    <>
      {/*
        HTML murni hasil buildPage — dibuat di server, tidak melewati props
        komponen client, jadi tidak ter-serialize ganda di flight payload.
      */}
      <div className="ph-root" dangerouslySetInnerHTML={{ __html: buildPage(posts, locale) }} />
      <PreviewHome />
    </>
  );
}
