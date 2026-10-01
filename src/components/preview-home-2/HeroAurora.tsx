/**
 * Hero backdrop: a slowly drifting colour field.
 *
 * Amplemarket renders its hero background with a WebGL shader canvas
 * (`.shader-canvas` + home-hero.min.js) behind a mask. That is a lot of
 * machinery — and GPU/battery — for a soft colour wash, so this reaches the
 * same read the cheap way: four oversized radial-gradient blobs whose soft
 * falloff is baked into the gradient (nothing to blur) drifting on transform
 * only, which the compositor animates without repainting.
 *
 * The blobs carry `.ph2-anim`, so the off-screen gate pauses them once the hero
 * leaves the viewport and the reduced-motion block freezes them into a static
 * gradient. Colours are the documented brand accents at low alpha.
 */
export function HeroAurora() {
  return (
    <div aria-hidden className="ph2-aurora ph2-anim">
      <span className="ph2-aurora-blob ph2-aurora-1" />
      <span className="ph2-aurora-blob ph2-aurora-2" />
      <span className="ph2-aurora-blob ph2-aurora-3" />
      <span className="ph2-aurora-blob ph2-aurora-4" />
    </div>
  );
}
