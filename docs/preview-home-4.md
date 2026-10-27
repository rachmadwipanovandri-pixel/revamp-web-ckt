# /preview-home-4 — direction

A US-style marketing page for Cekat.AI, built on the conventions the six
references share (aira.app, arcade.software, godmodehq.com, spara.com, vapi.ai,
synthesia.io). It is a fourth draft, alongside `/preview-home`, `-2` and `-3`;
nothing here touches a production page.

## Visual thesis

**The product is the proof.**

Every reference on the list leads with the product's own interface and spends
its middle sections on *use cases* (For Marketing / For Sales / Built for
Enterprises) rather than on explaining what the product is. ph3 went the other
way: a precision instrument drawn with hairlines, all diagram and no pixels.

This draft inverts that. Where ph3 drew, ph4 shows. The product surface is the
first-class asset of every band; the use-case section is the page's spine; proof
(photos, logos, named quotes with attached figures) is stacked rather than
sprinkled. The intent is a page that reads as *a working product you could sign
up for*, not *a pitch about a product*.

## What is kept from ph3 — and why

The type system, geometry and palette are ph3's, because they are the voice that
already reads as US B2B SaaS, and because a fourth draft with a fourth identity
would be a worse draft:

- Radius collapses (3 / 4 / 6 / 8 / 10px). Pills and 20px cards were the single
  biggest "friendly local SaaS" tell.
- Structure is drawn with hairlines, not shadows.
- White paper, warm-neutral surface, near-black console bands.
- Brand blue is a signal — one accent word, a link, a checkmark — never a wash.
- Monospace telemetry labels for indices, step numbers, stat captions.
- Display weight 500 / hero 600, tight negative tracking.

## What changes

| ph3 | ph4 |
|---|---|
| Hero: composed window | Hero: product surface beside the copy, figures beneath it |
| One dashboard moment | **Full-bleed live band**: the interface at full width, doing nothing else |
| Features: 4 tabs over a drawn grid | **Use cases: rail of 4 situations + one large panel** |
| How: 3 numbered steps | Workflow: 4 steps, equal cards |
| Results: one story | **Case studies: four cards, photo + figure + quote** |
| No photography | **Field band**: the team's own brand frames, in colour |
| Trust: 4 prose cards | Trust: badge rail first, cards second |
| No developer surface | **API band**: a short, copyable call on the console |
| Voices: none | **Voices: one pull quote, faceless** (see below) |

## Section sequence

1. Announcement strip
2. Nav
3. Hero — headline, product surface, three-figure strip
4. Live band (console) — the interface at full width, figures across the top
5. Proof — large figures, logo marquee
6. **Use cases** (console) — the spine. A rail of four situations beside a
   large panel that swaps surface, copy and figure
7. Field band — five photographs, the only warm image moment on the page
8. Workflow — four steps from first chat to repeat order
9. Capabilities — four cards, each linking to a real route
10. Case studies — four cards: photo, name, title, one large figure, quote
11. Voices — one pull quote at display size, attribution, no picture
12. Trust — a rail of badges, then four cards
13. API band (console) — a short, copyable call
14. FAQ
15. Pricing
16. Closer (console)
17. Footer

The rhythm alternates deliberately — paper → console → surface → console →
surface → paper → surface → paper → surface → paper → console → surface →
paper → console — because the first version of this page had the right contents
and the wrong picture: thirteen evenly-weighted light bands, each a heading over
a row of cards. Every reference varies its weight sharply. A document where every
band is the same size reads as a template no matter how good the type is.

The three console bands are never adjacent, and each is a moment the page asks
something of the reader: the product at full size, the use cases, the developer
surface, and the close.

## Motion

GSAP + Lenis, one engine, wired the way ph3 wires them: Lenis stepped from
`gsap.ticker` (one rAF loop), ScrollTrigger updated on the same frame, both
dynamically imported inside one idle callback so ~35KB stays off the critical
path. Entrances are `data-ph4-enter` blocks released by `ScrollTrigger.batch`
with a ticker-driven rect sweep as the safety net for a block skipped between
two updates. Headings split word by word. Hairlines draw themselves. Figures
count up only where the animated run *is* the whole claim — a grouped thousands
run (`3,000+`) and a comparator (`<2 min`) stay static, because a figure that is
briefly wrong is worse than one that never moves. Reduced motion is a hard
bypass: no Lenis, no GSAP, final states rendered immediately.

**Three.js: no.** Not one reference on the list uses a shader background, and a
hero WebGL scene here would be ornamental noise over a product surface that is
the actual hero asset.

## Asset provenance

Nothing is generated, stock, or invented — and two files were deliberately left
out because they are not what their filenames claim:

- The product is **built as DOM, not pictured**. There is no honest capture of
  `app.cekat.ai` in the repo: `hero-dashboard.png` is a foreign-branded
  Messenger composite, and the `feature-*.webp` files are marketing
  illustrations, one of them a skeleton-loading mockup. A page whose thesis is
  "the product is the proof" cannot show those. See `ProductSurface.tsx`.
- Customer photographs: exactly **four verified faces** — `adam-sulaiman.png`,
  `testimonial-silica-brenda.jpg`, `testimonial-wiji-astuti.jpg`,
  `testimonial-hargyo.jpg` — and they are spoken for by the four case studies.
  `story-retail-owner.jpg` is a generated scene of a man in a shop, not
  Hariyudi; `hero-chat-vitamin-c.jpg` is a bottle of vitamin C. Neither is used
  as a person anywhere on this page, which is why Voices is one faceless pull
  quote rather than a six-card wall.
- Field photographs — `public/images/ph3/field/*.jpg` plus
  `gallery-store.jpg`, the team's own brand frames with provenance in
  `photos.ts`. The warehouse frame carries the real Cekat order kiosk on its
  screen, which is why it leads.
- Logos — `TRUSTED_LOGOS`, the real client marks.
- Ambient footage — the hero office loop (`ph4-hero-office.mp4`, Pexels 853822)
  and the closer packing loop (`ph4-closer-packing.mp4`, Pexels video 7855142
  by Kampus Production). Both are decorative layers under the navy scrim, free
  Pexels license, no attribution required: no face appears, so nobody reads as
  endorsing the product. The "nothing stock" rule above governs proof (people,
  numbers, product) — atmosphere was already stock in the hero.

No customer is quoted without a named person behind the quote, and no figure is
invented: every number on the page is one the site already states elsewhere.

## Honesty constraints

- `robots: { index: false, follow: false }` — a draft, never indexed.
- The same questions the FAQ answers ship as `faqPageJsonLd`.
- No invented metrics, no logo-wall theater with marks the company does not
  have, no compliance claim that is not actually held.
