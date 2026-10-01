/**
 * Content contract for the /preview-home-2 redesign.
 *
 * The shape is declared once and both locales are typed as `HomeContent`, so a
 * key added to `id` fails `pnpm typecheck` until `en` gains it too. That is the
 * one thing preview-home could not guarantee (two untyped 540-line literals).
 */
import type { Locale } from "@/i18n/routing";

export type { Locale };

/** A resolved link. `href` is already locale-correct (it includes `/en` when needed). */
export type ContentLink = {
  label: string;
  href: string;
};

export type MegaColumn = {
  title: string;
  items: ContentLink[];
};

export type NavLink = {
  label: string;
  /** Either a direct link… */
  href?: string;
  /** …or a mega-menu panel. */
  mega?: MegaColumn[];
  megaIntro?: string;
};

export type Metric = {
  value: string;
  suffix: string;
  label: string;
};

export type Pillar = {
  index: string;
  title: string;
  body: string;
  points: string[];
  accent: string;
};

export type Step = {
  index: string;
  title: string;
  body: string;
  hint: string;
  accent: string;
};

export type TrustCard = {
  index: string;
  title: string;
  body: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type PricingTier = {
  name: string;
  tag: string;
  rows: { label: string; value: string }[];
  cta: ContentLink;
  popular?: boolean;
};

export type FooterColumn = {
  title: string;
  links: ContentLink[];
};

export type StageCardKind =
  "chat" | "order" | "crm" | "mini" | "consulting" | "marketing";

/**
 * One product card on the looping hero stage. `kind` selects the mini-UI the
 * card renders; the optional arrays carry that kind's detail, so one card can
 * look like a real inbox, a real order, and so on without a separate type per
 * product.
 */
export type StageCard = {
  kind: StageCardKind;
  /** Small uppercase eyebrow, e.g. "OMS · Order Management". */
  label: string;
  title: string;
  /** Main body lines; meaning depends on `kind`. */
  lines: string[];
  /** State chip: AI Agent, BARU, Live, Berjalan, Mingguan. */
  badge?: string;
  /** Small chips: tags, channels, sync targets. */
  chips?: string[];
  /** Label/value rows: order totals, CRM stats, campaign stats, product picks. */
  rows?: { label: string; value: string }[];
  /** Steps of a flow or rail, e.g. Dibuat → Dibayar → Dikirim. */
  steps?: string[];
  /** Action pills: chat quick replies, the mini agent's CTA. */
  quick?: string[];
  metric?: { value: string; label: string };
  footnote?: string;
  /** Chart: bar heights in %, plus the labels under them. */
  bars?: number[];
  days?: string[];
  /** Sparkline: values 0–100, higher sits higher. */
  spark?: number[];
};

export type LiveStage = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Accessible description of the auto-looping stage. */
  caption: string;
  cards: StageCard[];
};

export type SignalChip = { text: string; accent: string };

/** The Cekat app window the floating cards sit on top of. */
export type HeroDashboard = {
  url: string;
  /** Sidebar items; the first one renders as active. */
  nav: string[];
  title: string;
  rows: {
    initials: string;
    accent: string;
    who: string;
    msg: string;
    chip: string;
  }[];
  stats: { value: string; label: string; spark?: boolean }[];
};

export type Signals = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Three rows of chips; rows alternate scroll direction. */
  rows: SignalChip[][];
  cta: ContentLink;
};

export type DeckItem = {
  title: string;
  headline: string;
  body: string;
  points: string[];
  accent: string;
  image: { src: string; alt: string };
  cta: ContentLink;
};

export type Deck = {
  eyebrow: string;
  heading: string;
  body: string;
  hint: string;
  items: DeckItem[];
};

export type LoveCard = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  avatar?: string;
};

export type Love = {
  eyebrow: string;
  heading: string;
  body: string;
  /** Four columns; adjacent columns scroll in opposite directions. */
  columns: LoveCard[][];
};

export type HomeContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    login: ContentLink;
    cta: ContentLink;
    links: NavLink[];
    /** Accessible label for the mobile menu toggle. */
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
  };
  hero: {
    /** Announcement pill above the headline; links to the feature it announces. */
    pill: ContentLink;
    titleLead: string;
    titleAccent: string;
    sub: string;
    /**
     * Inline email capture, following Amplemarket's hero: one conversion
     * action instead of two competing buttons.
     */
    form: {
      label: string;
      placeholder: string;
      cta: string;
      note: string;
      errorRequired: string;
      errorInvalid: string;
      /** Quiet tertiary link under the form. */
      secondary: ContentLink;
    };
    trust: string[];
  };
  /** Cekat app window + the looping product cards that float over it. */
  dashboard: HeroDashboard;
  proof: {
    eyebrow: string;
    heading: string;
    stats: Metric[];
    logosLabel: string;
    logosNote: string;
  };
  pillars: {
    eyebrow: string;
    heading: string;
    body: string;
    items: Pillar[];
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    body: string;
    stageLabel: string;
    steps: Step[];
  };
  caseStudy: {
    eyebrow: string;
    client: string;
    title: string;
    body: string;
    quote: string;
    attribution: string;
    metrics: Metric[];
    cta: ContentLink;
  };
  trust: {
    eyebrow: string;
    heading: string;
    body: string;
    chips: string[];
    cards: TrustCard[];
    integrationsLabel: string;
    integrationsNote: string;
    integrations: string[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    body: string;
    items: FaqItem[];
    cta: ContentLink;
  };
  pricing: {
    eyebrow: string;
    heading: string;
    body: string;
    note: string;
    popularLabel: string;
    tiers: PricingTier[];
    compare: ContentLink;
  };
  finalCta: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body: string;
    checks: string[];
    ctaPrimary: ContentLink;
    ctaSecondary: ContentLink;
  };
  liveStage: LiveStage;
  signals: Signals;
  deck: Deck;
  love: Love;
  footer: {
    about: string;
    partner: string;
    columns: FooterColumn[];
    copyright: string;
    socials: ContentLink[];
  };
};
