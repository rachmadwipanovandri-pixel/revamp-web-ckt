import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";

/**
 * Client logo wall for the sales page.
 *
 * A static grid, not the homepage's CSS ticker. A prospect is scanning for
 * either their own company or a peer of a similar size — a marquee animates
 * half the set out of view before they finish the first pass, and the ones
 * still moving are the ones nobody reads.
 *
 * The logos come from TRUSTED_LOGOS, the same list the homepage ticker uses, so
 * the two pages can never advertise different clients. Grayscale at rest and
 * full colour on hover, matching the homepage's treatment.
 */
export function ContactSalesLogos() {
  const t = useTranslations("contactSales");

  return (
    <section className="border-t border-border bg-surface-muted py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-numeric text-xs font-semibold tracking-[0.16em] text-[#64748B] uppercase">
            {t("logosHeading")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
            {t("logosSubheading")}
          </h2>
        </div>

        {/*
          `auto-rows` + a fixed tile height keeps every row the same height even
          though the source logos run from 55×75 (PLN, portrait) to 160×24
          (Sekolah Ciputra, wide). Without it a portrait mark stretches its row
          and the grid reads as ragged.
        */}
        <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TRUSTED_LOGOS.map((logo) => (
            <li key={logo.src}>
              <div className="flex h-16 items-center justify-center rounded-xl border border-border bg-white px-4 transition-colors duration-200 hover:border-[#BFDBFE]">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  /*
                    Painted at most 32px tall, and `sizes` is declared to match.
                    The natural widths run to 160px, so without it Next offers
                    `w=384` — for a 32px mark, twenty times over.
                  */
                  sizes="(min-width: 1024px) 190px, (min-width: 640px) 30vw, 45vw"
                  className="max-h-8 w-auto max-w-full object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          {t("logosNote")}
        </p>
      </Container>
    </section>
  );
}