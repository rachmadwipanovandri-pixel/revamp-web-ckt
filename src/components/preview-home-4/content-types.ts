export type Lang = "id" | "en";

/**
 * The shapes behind /preview-home-4's copy.
 *
 * Split from the copy itself (`copy-id.ts` / `copy-en.ts`) because a single
 * 1,200-line data file is where a missing key goes unnoticed, and because the
 * two locales are the only things that differ — every field below is written
 * twice, once per file, so a field added to one and forgotten in the other is a
 * `tsc` error rather than an `undefined` in the HTML.
 *
 * ── The register this page writes in ───────────────────────────────────────
 *
 * Every band states a result. It does not reassure, and it does not explain the
 * product to somebody who has never heard of it. The failure mode being designed
 * against is the one the pages around this one fall into: a paragraph explaining
 * why a risk is not a risk, a restatement of a feature the reader can already
 * work out, and "no coding" repeated until it reads as a worry rather than a
 * feature. Each of those sentences exists to lower a worry, and lowering a worry
 * tells the reader they should have it.
 *
 * So: outcome first, short clauses, the figure attached to the claim it belongs
 * to. Trust is carried by badges and by named people with photographs, never by
 * an argument that nothing bad will happen to you.
 */

/** One localised string. `en` defaults to `id` when the two read the same. */
export type L = { id: string; en: string };
export const l = (id: string, en: string = id): L => ({ id, en });

/**
 * Read a localised string for a locale.
 *
 * This lives here rather than beside any component because both halves of the
 * page need it — the Server Component bands and the Client Component surfaces —
 * and a helper exported from a `"use client"` module cannot be *called* from a
 * Server Component at all. RSC may pass a client function to a client component;
 * it may not invoke one. A shared non-client module is the only arrangement that
 * works for both.
 */
export const text = (v: L, en: boolean) => (en ? v.en : v.id);

/**
 * One use case.
 *
 * `surface` names the product surface this situation lands in and is what the
 * band renders as real, interactive DOM — not a picture of one. There is no
 * honest screenshot of `app.cekat.ai` in `public/images/`: `hero-dashboard.png`
 * is a foreign-branded Messenger composite, and the `feature-*.webp` files are
 * marketing illustrations with grey placeholder bars. So the product on this
 * page is *built*, which is also the only version that can be interacted with.
 */
export type UseCase = {
  /** Rail heading. A situation, not a feature name. */
  key: L;
  /** One line under the rail heading. */
  rail: L;
  title: L;
  body: L;
  /** Outcome statements, not capabilities. */
  points: L[];
  figure: L;
  figureLabel: L;
  surface: "inbox" | "profile" | "order" | "campaign";
  /** The address bar text, so the frame reads as a real session. */
  path: L;
};

/**
 * A customer, quoted.
 *
 * `photo` is required and there is no initials fallback. Every quote on this
 * page belongs to a named, real customer with a photograph on file: a quote
 * without a face reads as invented, which is the one thing proof cannot afford
 * to look like, and an initials tile is the exact shape of that tell.
 */
export type Voice = {
  quote: L;
  name: string;
  role: L;
  company: string;
  photo: string;
  /** Describes the frame. Never "X smiling" — never a claim about the person. */
  alt: L;
};

export type CaseStudy = Voice & {
  /** A result statement, taken from what the customer actually reported. */
  result: L;
  /** One figure, labelled for what it actually measures. */
  value: L;
  valueLabel: L;
  href: L;
};

export type Copy4 = {
  /** The strip above the nav. Three of the six references carry one. */
  announcement: { label: L; text: L; cta: L; href: L };
  /**
   * The full-bleed product showcase.
   *
   * Modelled on aira.app's "Aira enriched 4,120 accounts" band: the whole width
   * given over to the running product with live figures moving across it. On
   * every reference this page was built from, the one moment where a visitor
   * sees the actual interface at full size is a band that does nothing else — and
   * on this page it has to be, because the product is drawn as DOM rather than
   * captured as an image.
   */
  live: { eyebrow: L; heading: string; accent: string; body: L; url: L };
  /** The photography band. Provenance for the frames is in `photos.ts`. */
  photos: { eyebrow: L; heading: string; accent: string; body: L };
  /** Developer credibility. Three of the six references carry a code block. */
  api: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    note: L;
    cta: L;
  };
  hero: {
    pill: L;
    lead: string;
    accent: string;
    sub: L;
    primary: L;
    secondary: L;
    note: L;
    stats: { value: L; label: L }[];
  };
  proof: {
    heading: string;
    stats: { value: L; label: L }[];
    logosLabel: L;
    logosNote: L;
  };
  useCases: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    items: UseCase[];
  };
  workflow: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    steps: { index: L; title: L; body: L; hint: L }[];
  };
  capabilities: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    items: { title: L; body: L; points: L[]; href: L }[];
  };
  cases: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    items: CaseStudy[];
  };
  /**
   * The scrubbed statement — one sentence the reader writes by scrolling.
   *
   * It exists for the motion, not for the content: every reference this page
   * was rebuilt against parks a single statement under the nav and fills it in
   * against scroll position, and it is the one movement the rest of the page
   * cannot imitate with a trigger, because the sentence has to be *partly*
   * readable at every position. That is also why it carries one line of copy
   * and nothing else — a band this tall that says two things says neither.
   */
  statement: { eyebrow: L; line1: string; accent: string; note: L };
  /**
   * One large pull quote, typographic and faceless.
   *
   * This replaced a six-card testimonial wall. There are exactly four verified
   * customer photographs on file — Adam Sulaiman, Silcia Brenda, Wiji Astuti and
   * Hargyo — and they are already spoken for by the four case studies. A sixth
   * quote without a face is a quote that reads as invented, and the two obvious
   * workarounds were both worse than the problem: `story-retail-owner.jpg` is a
   * generated scene of a man in a shop, not Hariyudi, and
   * `hero-chat-vitamin-c.jpg` is a photograph of a bottle of vitamin C. Putting
   * either beside a named customer presents a stock image as a person.
   *
   * So the band is one quote at display size with the attribution beneath it and
   * no picture at all — which is also what aira and vapi do with theirs.
   */
  voices: {
    eyebrow: L;
    heading: string;
    accent: string;
    quote: L;
    name: string;
    role: L;
    company: string;
  };
  trust: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    badges: { label: L; note: L }[];
    points: { title: L; body: L }[];
  };
  faq: { eyebrow: L; heading: string; items: { q: string; a: string }[] };
  pricing: {
    eyebrow: L;
    heading: string;
    body: L;
    plans: {
      name: L;
      price: L;
      period: L;
      note: L;
      featured?: boolean;
      featuredLabel: L;
      points: L[];
      cta: L;
    }[];
    footnote: L;
    compare: L;
  };
  finalCta: {
    eyebrow: L;
    heading: string;
    accent: string;
    body: L;
    primary: L;
    secondary: L;
    checks: L[];
  };
};
