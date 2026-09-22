import { getTranslations } from "next-intl/server";
import { pillarCoverage } from "@/lib/comparison";
import { Container } from "@/components/layout/container";
import { LOGO_MARK_PATH } from "@/components/layout/logo";

/**
 * The three jobs a conversation has to do, and the claim that they run in one
 * place.
 *
 * The brief's headline was "most platforms stop at one", which the matrix
 * directly below refutes: all nine vendors there tick at least one row in all
 * three pillars. The diagram and the pillars survive that; the premise did
 * not. What replaced it is a depth claim, and `pillarCoverage()` derives it
 * from the same rows the table renders, so it cannot drift out of true.
 *
 * Inline SVG rather than the exported artwork: the labels have to read in two
 * languages and stay selectable, and text baked into a raster does neither.
 *
 * Geometry notes, because they are load-bearing rather than arbitrary. Three
 * r=86 circles on a triangle give every pair an overlap and a shared middle
 * for the logo. Each circle's own name sits on the arc furthest from the other
 * two, since an earlier version centred them and the CRM disc swallowed the
 * word "Marketing".
 *
 * Fills are opaque and ordered, not blended. The reference's three-way overlap
 * is brighter than any single circle, which multiply cannot produce, so that
 * region is drawn explicitly as a circle clipped by the other two. Every
 * coordinate below, the glyph's included, is arithmetic on the circle centres
 * rather than a number nudged until it looked right.
 */
export async function ThreePillars({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "comparison.pillars" });
  const { total, ours, usLeads } = pillarCoverage();

  const side = (key: "awareness" | "conversion") => (
    <div>
      <p className="font-numeric text-base font-semibold text-foreground">
        {t(`${key}.title`)}
      </p>
      <p className="mt-1 text-sm leading-snug font-semibold text-foreground">
        {t(`${key}.lead`)}
      </p>
      <p className="mt-1 text-sm leading-snug text-muted-foreground">
        {t(`${key}.body`)}
      </p>
    </div>
  );

  return (
    <section className="border-t border-border bg-surface-muted">
      <Container className="border-x border-border py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {t("body")}
          </p>
        </div>

        {/* Awareness left, Conversion right, Retention under the diagram, as
            the reference lays them out. On mobile the grid collapses and the
            three read in the same order down the page. */}
        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:text-right">{side("awareness")}</div>

          <div className="lg:col-span-6">
            <svg
              viewBox="0 0 320 300"
              role="img"
              aria-label={t("diagramLabel")}
              className="mx-auto h-auto w-full max-w-md"
            >
              <defs>
                <clipPath id="pillarClipMarketing">
                  <circle cx="118" cy="110" r="86" />
                </clipPath>
                <clipPath id="pillarClipChat">
                  <circle cx="205" cy="110" r="86" />
                </clipPath>
              </defs>

              {/* The two tints are the brand primary mixed with white at 14%
                  and 62%, computed rather than sampled, so they stay in the
                  family if the primary moves. Navy and the shared region use
                  the tokens directly. */}
              <circle cx="118" cy="110" r="86" fill="#dee7f6" />
              <circle cx="205" cy="110" r="86" fill="#6d94d7" />
              <circle cx="161" cy="192" r="86" fill="var(--primary-dark)" />
              <g clipPath="url(#pillarClipMarketing)">
                <g clipPath="url(#pillarClipChat)">
                  <circle cx="161" cy="192" r="86" fill="var(--primary)" />
                </g>
              </g>

              {/* Anchors tying each label to its circle. */}
              <g fill="var(--primary)">
                <circle cx="24" cy="112" r="4" />
                <circle cx="299" cy="112" r="4" />
                <circle cx="161" cy="292" r="4" />
              </g>
              <g stroke="var(--primary)" strokeWidth="1.5" opacity="0.5">
                <line x1="30" y1="112" x2="42" y2="112" />
                <line x1="281" y1="112" x2="293" y2="112" />
                <line x1="161" y1="280" x2="161" y2="286" />
              </g>

              <text
                x="74"
                y="118"
                textAnchor="middle"
                className="fill-primary font-numeric text-[13px] font-semibold"
              >
                {t("circles.marketing")}
              </text>
              <text
                x="246"
                y="104"
                textAnchor="middle"
                className="fill-white font-numeric text-[13px] font-semibold"
              >
                {t("circles.chatLine1")}
              </text>
              <text
                x="246"
                y="120"
                textAnchor="middle"
                className="fill-white font-numeric text-[13px] font-semibold"
              >
                {t("circles.chatLine2")}
              </text>
              <text
                x="161"
                y="252"
                textAnchor="middle"
                className="fill-white font-numeric text-[13px] font-semibold"
              >
                {t("circles.crm")}
              </text>

              {/* White glyph straight on the shared region, no badge, as the
                  reference has it. Centred on the centroid of the three
                  centres, (161.33, 137.33), and scaled from the mark's
                  measured 81.02 x 66.37 box to 40 wide. */}
              <g transform="translate(141.33 120.95) scale(0.49371)">
                <path d={LOGO_MARK_PATH} className="fill-white" />
              </g>
            </svg>
          </div>

          <div className="lg:col-span-3">{side("conversion")}</div>
        </div>

        <div className="mx-auto mt-4 max-w-sm text-center lg:mt-2">
          <p className="font-numeric text-base font-semibold text-foreground">
            {t("retention.title")}
          </p>
          <p className="mt-1 text-sm leading-snug font-semibold text-foreground">
            {t("retention.lead")}
          </p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            {t("retention.body")}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-lg border border-border bg-white px-6 py-5 text-center">
          <p className="font-numeric text-base font-semibold text-primary">
            {t("tagline")}
          </p>
          {/* Counted from the matrix below, not typed in. The lead clause only
              renders while we actually lead it. */}
          <p className="mt-2 text-sm text-muted-foreground">
            {usLeads
              ? t("coverageLead", { ours, total })
              : t("coverage", { ours, total })}
          </p>
        </div>
      </Container>
    </section>
  );
}
