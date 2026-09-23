/**
 * Shared shape for the homepage hero product slides. Copy is resolved on the
 * server (full next-intl catalog from disk) and passed into the client slider
 * as props — the client never calls `agentic.hero.slides.*`, so a partial
 * client message bundle cannot throw MISSING_MESSAGE on tab switch.
 */

export const PRODUCT_SLIDE_KEYS = [
  "crm",
  "mini",
  "oms",
  "marketing",
  "consulting",
] as const;

export type ProductSlideKey = (typeof PRODUCT_SLIDE_KEYS)[number];

export type HeroSlideKey = ProductSlideKey | "ecosystem";

export type HeroSlide = {
  key: HeroSlideKey;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  pills: string[];
  /** Short product name shown on the stage badge. */
  stageLabel: string;
  /** Small icon for the stage badge. */
  icon: string | null;
  /**
   * Large stage artwork for product slides. `null` means the phone chat demo
   * (ecosystem keynote only).
   */
  visual: string | null;
};

export type HeroSliderCopy = {
  slides: HeroSlide[];
  previousLabel: string;
  nextLabel: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

/** Badge icons (and ecosystem stays chat-demo only → no stage visual). */
const PRODUCT_ICONS: Record<HeroSlideKey, string | null> = {
  ecosystem: null,
  crm: "/images/home/crm-icon.png",
  mini: "/images/home/multiple-specialized-agents.png",
  oms: "/images/home/order-icon.png",
  marketing: "/images/home/marketing-icon.png",
  consulting: "/images/home/knowledge-source.png",
};

/** Stage artwork per product slide — related product UI, not the phone demo. */
const PRODUCT_VISUALS: Record<HeroSlideKey, string | null> = {
  // Phone chat demo only on the ecosystem slide.
  ecosystem: null,
  crm: "/images/home/your-crm-built-for-growth-and-real-conversations.png",
  // User-supplied Cekat.AI Automation flow (lightweight agent).
  mini: "/images/home/hero-mini-agent-automation.png",
  oms: "/images/home/hero-dashboard.png",
  marketing:
    "/images/home/track-and-optimize-your-marketing-performance-in-one-unified-platform.png",
  consulting: "/images/home/knowledge-source.png",
};

const KEYNOTE = ["Independent", "Integrated", "Open API"] as const;

type Translate = (key: string) => string;

/** Missing key must not white-screen the hero; fall back instead of throw. */
function read(t: Translate, key: string, fallback: string): string {
  try {
    const value = t(key);
    // next-intl can return the path itself when onError is non-throwing.
    return value && value !== key ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Ecosystem slide reads the top-level hero keys so the wireframe editor keeps
 * driving the default H1; product slides live under `slides.*`.
 */
export function buildHeroSliderCopy({
  hero,
  home,
}: {
  /** Translator for namespace `agentic.hero`. */
  hero: Translate;
  /** Translator for namespace `home.hero`. */
  home: Translate;
}): HeroSliderCopy {
  const slides: HeroSlide[] = [
    {
      key: "ecosystem",
      eyebrow: read(hero, "eyebrow", "Cekat AI"),
      titleLead: read(hero, "titleLead", ""),
      titleAccent: read(hero, "titleAccent", ""),
      subtitle: read(hero, "subtitle", ""),
      pills: [...KEYNOTE],
      stageLabel: read(hero, "hubLabel", "Full Ekosistem"),
      icon: PRODUCT_ICONS.ecosystem,
      visual: PRODUCT_VISUALS.ecosystem,
    },
    ...PRODUCT_SLIDE_KEYS.map((key): HeroSlide => {
      const prefix = `slides.${key}`;
      const titleLead = read(hero, `${prefix}.titleLead`, `${key}:`);
      return {
        key,
        eyebrow: read(hero, `${prefix}.eyebrow`, key),
        titleLead,
        titleAccent: read(hero, `${prefix}.titleAccent`, ""),
        subtitle: read(hero, `${prefix}.subtitle`, ""),
        pills: [
          read(hero, `${prefix}.pill1`, ""),
          read(hero, `${prefix}.pill2`, ""),
          read(hero, `${prefix}.pill3`, ""),
        ].filter(Boolean),
        stageLabel: read(hero, `${prefix}.stageLabel`, key),
        icon: PRODUCT_ICONS[key],
        visual: PRODUCT_VISUALS[key],
      };
    }),
  ];

  return {
    slides,
    previousLabel: read(hero, "slideNav.previous", "Slide sebelumnya"),
    nextLabel: read(hero, "slideNav.next", "Slide berikutnya"),
    ctaPrimary: read(home, "ctaPrimary", "WhatsApp Kami"),
    ctaSecondary: read(home, "ctaSecondary", "Coba Gratis"),
  };
}
