import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
  PhotoOverlay,
} from "@/components/sections/agentic/shell";
import { Reveal } from "@/components/sections/new-home/reveal";

type GalleryItem = {
  src: string;
  className: string;
  alt: string;
};

const ITEMS: GalleryItem[] = [
  {
    src: "/images/home/case-study-naturecraft.jpg",
    className: "sm:col-span-2 sm:row-span-2 min-h-[220px] sm:min-h-[360px]",
    alt: "",
  },
  {
    src: "/images/home/story-lead-cs.jpg",
    className: "min-h-[180px] sm:min-h-[170px]",
    alt: "",
  },
  {
    src: "/images/home/gallery-desk.jpg",
    className: "min-h-[180px] sm:min-h-[170px]",
    alt: "",
  },
  {
    src: "/images/home/story-retail-owner.jpg",
    className: "min-h-[180px] sm:min-h-[170px]",
    alt: "",
  },
  {
    src: "/images/home/gallery-store.jpg",
    className: "min-h-[180px] sm:min-h-[170px]",
    alt: "",
  },
  {
    src: "/images/home/overlay-team.jpg",
    className: "sm:col-span-2 min-h-[180px] sm:min-h-[200px]",
    alt: "",
  },
];

/**
 * Editorial photo gallery — mosaic grid of customer/team moments.
 * Placeholder photography; swap for real brand shots later.
 */
export async function Gallery() {
  const t = await getTranslations("agentic.gallery");

  return (
    <SectionBand tone="white" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

        <Reveal delay={60} className="mt-12">
          <ul className="grid auto-rows-[minmax(160px,auto)] gap-3 sm:grid-cols-4 sm:gap-4">
            {ITEMS.map((item, index) => (
              <li
                key={item.src}
                className={`group relative overflow-hidden rounded-[1.25rem] border border-[#0C111D]/[0.06] bg-[#F6F7F9] ${item.className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B1220]/35 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-50" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-numeric text-[0.65rem] font-semibold tracking-[0.12em] text-[#0C111D] uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}

/**
 * Full-bleed photo band with overlaid quote — used between proof chapters.
 */
export async function PhotoBand() {
  const t = await getTranslations("agentic.photoBand");

  return (
    <SectionBand tone="ink" className="relative isolate overflow-hidden">
      <PhotoOverlay
        src="/images/home/overlay-team.jpg"
        wash="from-[#0B1220]/80 via-[#0B1220]/45 to-[#0B1220]/75"
      />
      <SectionShell className="relative py-24 md:py-32 lg:py-40">
        <Reveal>
          <p className="max-w-3xl text-[clamp(1.65rem,3.4vw,2.65rem)] leading-[1.15] font-semibold tracking-[-0.035em] text-balance text-white">
            &ldquo;{t("quote")}&rdquo;
          </p>
          <p className="mt-6 text-sm text-white/70 md:text-base">
            {t("attribution")}
          </p>
        </Reveal>
      </SectionShell>
    </SectionBand>
  );
}
