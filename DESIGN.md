# Cekat.AI Homepage Redesign — Design Direction

## Goal
Redesign the production homepage as a **modern, interactive, minimalist** marketing page with **many explanatory visuals**, keeping the existing Cekat color palette.

## Style anchor
**Linear product marketing × Stripe dashboard clarity × diagram-first editorial.**
Not the current dark "keynote void" stage. The page should feel like a product you can *understand in 30 seconds* — airy canvas, precise type, and living diagrams that explain the product instead of decorating it.

## Palette (unchanged tokens)
| Role | Hex |
|---|---|
| Brand primary | `#1352BF` |
| Primary deep | `#08214C` |
| Ink | `#0C111D` / `#101828` |
| Body muted | `#525C6B` / `#667085` |
| Canvas | `#FFFFFF` |
| Soft surface | `#F7F9FC` |
| Soft blue wash | `#E8F0FE` / `#DCE7FC` |
| Border | `#E4E7EC` |
| Dark bookend (kept, lighter use) | `#061A3A` → `#0B2F78` |
| Category accents | sky `#0EA5E9`, green `#22C55E`, teal `#13A8BF`, purple `#B64ABF` |

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
