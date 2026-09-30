import { getPosts } from "@/lib/wordpress";
import { buildPage } from "@/components/preview-home/render";
import PreviewHome from "@/components/preview-home/PreviewHome";
import { DATA } from "@/components/preview-home/data";
import { DATA_EN } from "@/components/preview-home/data-en";
import { faqPageJsonLd, videoJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/json-ld";

type PreviewPost = {
  title: string;
  href: string;
  meta: string;
  img?: string;
  author?: string;
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
      author: p.author?.name,
    }));
  } catch {
    posts = undefined; // WordPress unreachable → kartu statis dari DATA
  }
  const d = isEn ? DATA_EN : DATA;
  return (
    <>
      {/* FAQ tampil di halaman — schema-nya ikut, sama seperti beranda produksi. */}
      <JsonLd
        data={[
          faqPageJsonLd(d.faq.items.map((i) => ({ q: i.q, a: i.a }))),
          // Video testimonial: schema for the four embedded interviews.
          ...d.videos.items.map((v) =>
            videoJsonLd({
              name: `${v.co} — ${v.who}`,
              description: isEn
                ? `Customer interview with ${v.who} sharing results from Cekat.AI.`
                : `Wawancara pelanggan bersama ${v.who} membagikan hasil pemakaian Cekat.AI.`,
              videoId: v.yt,
            }),
          ),
        ]}
      />
      {/*
        HTML murni hasil buildPage — dibuat di server, tidak melewati props
        komponen client, jadi tidak ter-serialize ganda di flight payload.
      */}
      <div className="ph-root" dangerouslySetInnerHTML={{ __html: buildPage(posts, locale) }} />
      <PreviewHome />
    </>
  );
}
