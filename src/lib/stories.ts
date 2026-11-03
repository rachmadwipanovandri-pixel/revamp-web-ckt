/**
 * Customer story registry. Slugs are shared across locales (next-intl
 * pathnames translate the prefix: /cerita vs /stories); the story COPY itself
 * lives in messages/* under home.testimonials + agentic.caseStudy so the
 * pages can never drift from the quotes already published on the homepage.
 */

export type StorySlug =
  "nature-craft" | "wall-street" | "putiih" | "threeland" | "rumah-zakat";

export interface StoryDef {
  slug: StorySlug;
  /** Key into `home.testimonials` in the message catalogs. */
  key: "natureCraft" | "wallStreet" | "putiih" | "threeland" | "rumahZakat";
  /** Recorded interview on YouTube, when one exists for this customer. */
  videoId?: string;
  /** Known photo asset; stories without one fall back to an initials avatar. */
  image?: string;
}

export const STORIES: StoryDef[] = [
  {
    slug: "nature-craft",
    key: "natureCraft",
    image: "/images/home/case-study-naturecraft.jpg",
  },
  { slug: "wall-street", key: "wallStreet" },
  { slug: "putiih", key: "putiih" },
  {
    slug: "threeland",
    key: "threeland",
    videoId: "IezNIgsGH5I",
    image: "/images/crm/adam-sulaiman.png",
  },
  {
    slug: "rumah-zakat",
    key: "rumahZakat",
    videoId: "wvOip0Gkx30",
    image: "/images/home/testimonial-wiji-astuti.jpg",
  },
];

export function getStory(slug: string): StoryDef | undefined {
  return STORIES.find((s) => s.slug === slug);
}

/** Page chrome only — quotes and metrics come from the message catalogs. */
export const STORY_COPY = {
  id: {
    metaTitleSuffix: "Cerita Pelanggan",
    eyebrow: "Cerita pelanggan",
    indexHeading: "Dari yang sudah menjalankannya",
    indexLead:
      "Setiap angka di halaman ini disampaikan langsung oleh pelanggan Cekat.AI dalam wawancara terekam — tidak dilebih-lebihkan, tidak diaudit pihak ketiga.",
    quoteLabel: "Dalam kata mereka",
    storyLabel: "Kisahnya",
    videoLabel: "Tonton wawancaranya",
    moreHeading: "Cerita lainnya",
    backToList: "Semua cerita",
    cta: "Coba gratis 14 hari",
    notFound: "Cerita tidak ditemukan",
  },
  en: {
    metaTitleSuffix: "Customer Stories",
    eyebrow: "Customer stories",
    indexHeading: "From teams already running it",
    indexLead:
      "Every figure on this page was reported directly by a Cekat.AI customer in a recorded interview — not embellished, not independently audited.",
    quoteLabel: "In their own words",
    storyLabel: "The story",
    videoLabel: "Watch the interview",
    moreHeading: "More stories",
    backToList: "All stories",
    cta: "Try free for 14 days",
    notFound: "Story not found",
  },
  cn: {
    metaTitleSuffix: "客户案例",
    eyebrow: "客户案例",
    indexHeading: "来自正在使用 Cekat.AI 的团队",
    indexLead:
      "本页每项数据均来自 Cekat.AI 客户的录制访谈，未经夸大，也未经第三方独立审计。",
    quoteLabel: "客户原话",
    storyLabel: "客户故事",
    videoLabel: "观看访谈",
    moreHeading: "更多案例",
    backToList: "全部案例",
    cta: "免费试用 14 天",
    notFound: "未找到客户案例",
  },
  jp: {
    metaTitleSuffix: "導入事例",
    eyebrow: "お客様の導入事例",
    indexHeading: "すでに活用しているチームから",
    indexLead:
      "このページの数値は、Cekat.AIのお客様への録画インタビューで直接報告されたものです。誇張や第三者による独立監査はありません。",
    quoteLabel: "お客様の言葉",
    storyLabel: "導入ストーリー",
    videoLabel: "インタビューを見る",
    moreHeading: "その他の事例",
    backToList: "事例一覧",
    cta: "14日間無料で試す",
    notFound: "導入事例が見つかりません",
  },
  kr: {
    metaTitleSuffix: "고객 사례",
    eyebrow: "고객 사례",
    indexHeading: "이미 Cekat.AI를 운영하는 팀들",
    indexLead:
      "이 페이지의 모든 수치는 녹화된 인터뷰에서 Cekat.AI 고객이 직접 전한 내용이며, 과장하거나 제3자가 독립적으로 감사한 수치가 아닙니다.",
    quoteLabel: "고객의 말",
    storyLabel: "고객 스토리",
    videoLabel: "인터뷰 보기",
    moreHeading: "더 많은 사례",
    backToList: "모든 사례",
    cta: "14일 무료 체험",
    notFound: "고객 사례를 찾을 수 없습니다",
  },
} as const;

export type StoryLocale = keyof typeof STORY_COPY;

export function storyCopyFor(locale: string): (typeof STORY_COPY)[StoryLocale] {
  return STORY_COPY[locale as StoryLocale] ?? STORY_COPY.en;
}
