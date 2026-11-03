# Secondary pages — product-led editorial

## Direction
Bring the approved homepage's explanatory, blue/cyan/orange product language to
secondary routes without changing homepage markup, styles, or content.

- **Visual thesis:** real product surfaces, confident editorial scale, and a
  rhythm of white space, tinted product stages, and navy evidence panels.
- **Heroes:** asymmetric copy + layered contextual screenshot/photo on detail
  pages; a panoramic product collection on hubs; editorial lead stories on blog
  and customer-story indexes. Avoid a single generic centered heading everywhere.
- **Type/color:** retain Google Sans Flex and homepage brand tokens. Large, tight
  navy headlines; blue action pills; cyan/orange used to explain groupings.
- **Sequence:** product/context → definition/trust → capabilities → interactive
  detail → named evidence → FAQ → action. Keep existing text and section content.
- **Motion:** GSAP additive hero intro and accessible word-staggered section headings,
  existing Reveal entrance and purposeful accordion swaps, restrained
  transform hover feedback. Respect reduced motion. Retain the one existing Lenis
  engine; no additional scrolling library. No Three.js: readable product surfaces
  serve this project better than shaders or 3D decoration.
- **Assets:** use repository screenshots, industry photos, and known customer
  portraits. No competitor media, copied copy, invented metrics, or new claims.
- **Skills:** build-awwwards-quality-sites + ui-ux-pro-max, with React performance
  guidance. Search recommendations inform interaction only; approved homepage
  typography and colors override suggested alternate palettes.

## References inspected

- Intercom: oversized product surfaces, layered interface details, section pacing.
- Attio: editorial hierarchy, thin structural rules, clear capability chapters.
- HubSpot Marketing: contextual product demonstration and explicit conversion paths.

These are high-level composition references, not templates or asset sources.

## Third pass — color-coded product playground

The user rejected the second pass's repeated pale gradient + screenshot frame.
The next pass changes the media and interaction system, not just spacing.

- **Thesis:** show Cekat's workflows as explorable, color-coded product scenes.
  Connect → understand → organize → automate changes the composition and hue.
- **Hero:** retain the message, emphasize an existing phrase, compose live DOM
  product diagrams with repository channel marks and an original-artwork toggle.
- **Palette:** homepage blue/navy plus substantial cyan and warm orange chapters;
  use solid contrast and intentional color fields rather than generic gradient blobs.
- **Sequence:** typographic hero → customer proof → colorful capability chapters →
  interactive workflow theater → customer evidence → readable FAQ → action.
- **Media:** cropped WebP derivatives of existing Cekat artwork, plus a live
  channel-routing diagram. Original PNGs remain in the alternate product view.
  Keep industry photography and article media; no invented claims or competitor
  assets. Four illustration-generation requests failed with insufficient funds;
  no generated illustrations were saved or used, and no retries were made.
- **Motion:** GSAP scene-entry, bounded pointer depth, scene-change choreography,
  explicit pause control; stop offscreen/hidden and bypass under reduced motion.
  Retain the single existing Lenis; no Three.js and no additional scroll engine.
- **Scope:** shared secondary components only. Homepage files and content untouched.
- **Skills:** build-awwwards-quality-sites + ui-ux-pro-max + React best practices.

### Additional live SaaS research (2026-11-02)

Inspected live headings, media structure, and viewport captures, in addition to
the first three references. These are not downloaded assets or copied designs.

| Platform | Relevant high-level finding | Cekat application |
| --- | --- | --- |
| [Stripe](https://stripe.com) | Oversized editorial message; expressive focal media; dark infrastructure chapter | Strong focal scenes and contrast, not a cloned gradient |
| [Slack](https://slack.com) | Clear chapter identities; strong solid color; numerous contextual product clips | Change hue and visual narrative per workflow |
| [Linear](https://linear.app) | Product-led chapter structure and precise interface hierarchy | Preserve readable content around the interactive scene; reject hiding the message behind long entrances |
| [Notion](https://www.notion.com) | Existing action word emphasized; approachable focal collage; live UI context | Highlight existing words without replacing copy; explorable media |
| [monday.com](https://monday.com) | Product scenes explain people/agent work; varied workflow chapters | A composable scene library across Chat, CRM, Marketing and Order |
| [Figma](https://www.figma.com) | Layered expressive visual collage; contrasting creative chapters | Original layered product imagery, purposeful color blocking |

## Native 24/7 coverage illustration

The user specifically identified `/images/home/ai-working-hours.png` as visually
inconsistent with the new layout. `CoverageScene` replaces that image in the
shared secondary-page scene renderer, including Travel and AI Working Hours.
Homepage consumers and the source PNG remain unchanged.

- **Original DOM/CSS artwork:** blue/cyan globe, Cekat mark, day/night symbols,
  language chips, and four selectable timezone cards. This is an explanatory
  illustration, not a screenshot of a shipped product interface.
- **Honest data:** the UTC slider uses explicitly labeled fixed offsets. The
  displayed hours are a simulation, not live local times, working schedules,
  customer conversations, or new performance claims. London/New York do not
  automatically apply daylight-saving time.
- **Interaction:** native buttons and range input support keyboard/touch;
  selection updates one atomic polite status. Original artwork remains an
  alternate view. Pausing decorative motion does not disable timezone controls.
- **Motion:** reuse the shared GSAP lifecycle and bounded pointer response;
  stop floating motion offscreen, when hidden, or paused, and bypass it for
  reduced motion. No new animation or smooth-scroll dependency.
- **Compact layout:** canvas height follows its content, preventing the simulator
  note from clipping at 320px. Mobile timezone cards put the hour on a separate
  line, preserving whole city names. Long existing definition statistics use
  one column on mobile, two from `sm`, and four from `lg`; figures are not shortened.
- **Provenance:** Cekat's existing logo mark and Lucide sun/moon icons; original
  CSS geometry. No newly generated image or competitor artwork is used.

## Validation history

- **Before coverage:** production route audit passed 30 routes at desktop and
  mobile (60 checks). Checked HTTP responses, horizontal overflow, image loading,
  browser errors, controls, keyboard pricing navigation, no-JS content, and
  homepage isolation.
- **Before coverage:** single-worker full-suite run passed 357/360 tests. The
  three failures were existing homepage hardware-size expectations (two) and
  the language-switcher's `Indonesian` versus `Indonesia` expectation (one).
  This result is not a full-suite run of the later coverage changes.
- **Current targeted tests:** 26/26 passed across coverage interactions,
  secondary composition/copy preservation, and the inbox/coverage motion
  lifecycle. Targeted ESLint passed. Latest production build generated 234 pages.
- **Coverage runtime:** floating animation, bounded pointer, pause/resume,
  controls while paused, offscreen stopping, reduced motion, original PNG
  loading, and returning to the interactive view passed without browser errors.
- **Final coverage audit:** 25/25 route/viewport combinations passed on the
  rebuilt port-3002 server: EN/ID Travel, EN/ID AI Working Hours, and EN Healthcare
  at 320, 390, 768, 1024, and 1440px. No HTTP failures, browser errors, document
  overflow, scene clipping/overlap, or wrapped city names. Verified all four
  city selections, slider Home/Arrow/End keys, unchanged active benefit text,
  and visible no-JS benefit content.
- **Final playground checks:** six checks passed: channel controls/original
  images at 320/390/1440px; bounded pointer and static pause/reduced motion;
  no-JS content/homepage isolation at 390/1440px. Accordion-number contrast was
  6.85:1. `git diff --check` passed.
- **Screenshot investigation:** the earlier 1024px element-capture timeout was
  not reproduced in isolated runs; 90 animation-frame samples showed unchanged
  scene bounds. Geometry and viewport-clip capture replace reliance on the
  element screenshot's stability wait. No application change was made for that
  unverified timeout.

Audit scripts/captures are retained in the session's approved temporary
`opencode/playground-review` folder; they are not public site assets. Existing
multi-lockfile warnings remain non-blocking. Earlier Lighthouse scores were
accessibility 97, best practices 100, SEO 100; this is not a new coverage audit.
Existing footer contrast and language-summary naming issues remain outside this
illustration change. Pre-existing homepage/navigation edits and removed preview
routes were not reverted or claimed as part of this work.
