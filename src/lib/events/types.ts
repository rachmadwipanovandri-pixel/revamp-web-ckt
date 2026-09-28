/** Event content model — stored in `src/content/events/events.json`. */

export type EventSectionType =
  | "hero"
  | "problems"
  | "takeaways"
  | "speakers"
  | "stats"
  | "faq"
  | "register";

export interface HeroSection {
  id: string;
  type: "hero";
  visible: boolean;
  eyebrow: string;
  quote: string;
  headline: string;
  body: string;
  ctaLabel: string;
  image: string;
  imageAlt: string;
}

export interface ProblemItem {
  id: string;
  icon: string;
  title: string;
  body: string;
}

export interface ProblemsSection {
  id: string;
  type: "problems";
  visible: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
  items: ProblemItem[];
}

export interface TakeawayItem {
  id: string;
  title: string;
  body: string;
}

export interface TakeawaysSection {
  id: string;
  type: "takeaways";
  visible: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
  items: TakeawayItem[];
}

export interface SpeakerItem {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface SpeakersSection {
  id: string;
  type: "speakers";
  visible: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
  items: SpeakerItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface StatsSection {
  id: string;
  type: "stats";
  visible: boolean;
  eyebrow: string;
  heading: string;
  items: StatItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection {
  id: string;
  type: "faq";
  visible: boolean;
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}

export interface FormField {
  id: string;
  /** Stable key sent to the sheet webhook. */
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  required: boolean;
  /** One option per line, for `select` fields. */
  options: string;
}

export interface RegisterSection {
  id: string;
  type: "register";
  visible: boolean;
  eyebrow: string;
  heading: string;
  /** Quote shown above the form. */
  quote: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  disclaimer: string;
  fields: FormField[];
}

export type EventSection =
  | HeroSection
  | ProblemsSection
  | TakeawaysSection
  | SpeakersSection
  | StatsSection
  | FaqSection
  | RegisterSection;

export interface EventItem {
  slug: string;
  status: "draft" | "published";
  title: string;
  badge: string;
  excerpt: string;
  cover: string;
  /** ISO datetime used for sorting on the listing. */
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  priceLabel: string;
  /** Apps Script / webhook URL registrations are forwarded to. */
  registrationWebhook: string;
  /** Array order is the render order — drag & drop rewrites it. */
  sections: EventSection[];
  updatedAt: string;
}

export const SECTION_LABELS: Record<EventSectionType, string> = {
  hero: "Hero",
  problems: "Kenali Situasi",
  takeaways: "Bawa Pulang",
  speakers: "Pembicara",
  stats: "Hasil",
  faq: "FAQ",
  register: "Form Pendaftaran",
};
