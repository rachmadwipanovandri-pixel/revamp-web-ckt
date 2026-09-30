/**
 * Customer story registry. Slugs are shared across locales (next-intl
 * pathnames translate the prefix: /cerita vs /stories); the story COPY itself
 * lives in messages/* under home.testimonials + agentic.caseStudy so the
 * pages can never drift from the quotes already published on the homepage.
 */

export type StorySlug =
  | "nature-craft"
  | "wall-street"
  | "putiih"
  | "threeland"
  | "rumah-zakat";

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
  { slug: "nature-craft", key: "natureCraft", image: "/images/home/case-study-naturecraft.jpg" },
  { slug: "wall-street", key: "wallStreet" },
  { slug: "putiih", key: "putiih" },
  { slug: "threeland", key: "threeland", videoId: "IezNIgsGH5I", image: "/images/crm/adam-sulaiman.png" },
  { slug: "rumah-zakat", key: "rumahZakat", videoId: "wvOip0Gkx30", image: "/images/home/testimonial-wiji-astuti.jpg" },
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
} as const;

export type StoryLocale = keyof typeof STORY_COPY;
