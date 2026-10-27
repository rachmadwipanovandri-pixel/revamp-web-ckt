# /preview-home-4 — motion pass (Parallax · Reveal · Scrub · Drag · Progress · Spotlight)

Enam item yang diminta, dikerjakan berurutan. Guard yang berlaku untuk semuanya:
`prefers-reduced-motion` (CSS `display:none` / early-return di Motion4), compositor-friendly
(transform/opacity saja), resting state = finished state.

- [ ] 1. Parallax — `.ph4-parallax` pakai CSS scroll-driven `animation-timeline: view()`
      dengan guard `@supports`; nol JS. Target: media PhotoBand, kartu melayang ProductSurface.
- [ ] 2. Reveal diperluas — statement besar (kutipan Voices, judul andalan Capabilities,
      statement Closer/Workflow) ikut word-by-word; `SplitHeading` dapat `size="none"`.
- [ ] 3. Band sticky + scrub — `ScrubBand.tsx`: sticky, ~210vh, kalimat terisi kata per
      kata mengikuti scroll (`data-ph4-scrub` di Motion4, `stagger` + `scrub`).
- [ ] 4. Carousel testimoni — `DragRail.tsx`: drag-to-scroll + snap + panah, tanpa dependensi.
- [ ] 5. Progress bar + index hidup di nav — perpanjang efek rAF `--p` yang sudah ada.
- [ ] 6. Spotlight kursor di kartu — `--ph4-spot-x/y` dari pointermove di Motion4.

Verifikasi: `pnpm typecheck`, ID+EN 200, screenshot per band, dan pastikan tidak ada
elemen yang transform-nya berebut (GSAP entrance vs CSS animation vs :hover).
