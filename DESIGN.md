# Cekat.AI Homepage Redesign — Design Direction

## Goal
Redesign the production homepage as a **modern, interactive, minimalist** marketing page with **many explanatory visuals**, keeping the existing Cekat color palette.

## Style anchor
**Linear product marketing × Stripe dashboard clarity × diagram-first editorial.**
Not the current dark "keynote void" stage. The page should feel like a product you can *understand in 30 seconds* — airy canvas, precise type, and living diagrams that explain the product instead of decorating it.

## Palette (aligned to `cekat-brand-guidelines.html`)
Only documented tokens from the brand guidelines are used — no off-palette variants.
See `~/Downloads/cekat-brand-guidelines.html` as the source of truth.

| Role | Hex |
|---|---|
| Brand primary | `#1352BF` (Brand Blue) |
| Brand deep / dark bookends | `#0B1220` (Ink 900) · `#0F172A` (Slate 900) |
| Heading / body text | `#101828` (Gray 900) |
| Body muted | `#4B5563` (Slate 600) · `#64748B` (Slate 500) · `#94A3B8` (Slate 400) |
| Canvas | `#FFFFFF` (White) |
| Soft surface | `#F8FAFF` (Ice Blue) · `#FAFBFC` (Off White) · `#FAF9F5` (Cream) |
| Soft blue wash | `#EFF6FF` (Blue 50) |
| Light text on dark | `#F1F5F9` (Slate 100) · `#E2E8F0` (Border Light) |
| Border | `#E2E8F0` (Border Light) · `#BFDBFE` (Border Blue) · `#BBF7D0` (Border Green) |
| Blue ramp (hovers, charts, gradients) | `#2563EB` (Blue 600) · `#3B82F6` (Blue 500) |
| Category accents | sky `#0EA5E9`, green `#22C55E` / `#4ABF5D`, teal `#4AB6BF`, indigo `#4A4ABF`, purple `#B64ABF`, pink `#EC4899` / `#F472B6` |
| Status fills | Green 50 `#F0FDF4` bg + `#BBF7D0` border + Gray 900 text |

Rules applied in `/preview-home`:
- Dark bands (hero, signals, love, footer) use Ink 900 / Slate 900 grounds with Brand Blue radial glows — no invented navy shades.
- Success/status chips: pale documented tints with Gray 900 text; solid dots/checks use Success Green `#22C55E`.
- There is no amber/red in the brand file: former amber accents map to Indigo `#4A4ABF`, alert red maps to Pink `#EC4899`.

## Typography
- Family: Inter / Google Sans Flex (same as product)
- Display 64–72 / 700 / tracking -0.03em
- H1 48–56 / 700
- H2 32–40 / 700
- H3 20 / 600
- Body 16–18 / 400 / 1.6
- Caption / eyebrow 12 / 600 / tracking 0.08em uppercase

## Layout system
- Desktop frame: **1440**, content max **1200**, 12-col, margin 80, gutter 24
- Spacing: 8pt scale (8/16/24/32/48/64/96/128)
- Radius: cards 20, pills 999, inputs 12
- Elevation: 2 levels only (subtle border + soft lift)
- Density: generous — one idea per band, lots of negative space

## Signature moments (memorable)
1. **Growth Loop diagram** — interactive-looking circular flow: Chat → CRM → Order → Marketing → back to Chat. The product story in one picture.
2. **Live Stage** — floating product UI cards (inbox, CRM card, order, ROAS) orbiting a conversation, showing shared customer context.

## Page structure (10 bands)
1. **Nav** — logo, product menu, Login, primary CTA
2. **Hero** — light, diagram-forward. Headline + sub + dual CTA + Growth Loop visual
3. **Proof strip** — 3,000+ / 10B+ / 2M+ + logo wall
4. **Pillars** — Independent · Connected · Open (3 cards with mini diagrams)
5. **Explain: How it works** — 5-step rail with visual stage (lots of explanatory graphics)
6. **Capability grid** — 7 jobs with icon-diagram cards (chat, order, CRM, marketing, consulting, mini, OMS)
7. **Shared context visual** — one customer timeline diagram (the "why it sticks together" picture)
8. **Case study** — Nature Craft metrics as big numbers + photo
9. **Security + Integrations** — compact trust band + constellation
10. **Pricing teaser + Final CTA + Footer**

## Interactive affordances (design as states)
- Hover lift on cards, primary button pressed
- Tabbed product pills on Growth Loop (CRM / Mini / OMS / Marketing / Consulting)
- Step rail with active state
- Accordion FAQ

## Imagery / visuals
Prefer **explainer SVG diagrams** over stock:
- Growth Loop (signature)
- Channel → Agent → Outcome flow
- Customer timeline (chat, stage, purchase, campaign)
- Integration constellation
- Metric sparklines for case study

## Out of scope for this pass
- Code implementation of the Next.js site
- Mobile frame can follow as a second artboard once desktop is approved
