import type { Logo } from "./marquee-strip";

/**
 * Every client logo we hold in public/images/home/logos, ordered so the most
 * recognisable names lead. width/height carry each file's real aspect ratio;
 * display size comes from the consuming component's CSS.
 */
export const TRUSTED_LOGOS: Logo[] = [
  { src: "/images/home/logos/pln.png", alt: "PLN", width: 55, height: 75 },
  {
    src: "/images/home/logos/sekolah-ciputra.jpeg",
    alt: "Sekolah Ciputra",
    width: 160,
    height: 24,
  },
  {
    src: "/images/home/logos/siloam.webp",
    alt: "Siloam Hospitals",
    width: 160,
    height: 40,
  },
  {
    src: "/images/home/logos/asuransi-sinarmas.webp",
    alt: "Asuransi Sinarmas",
    width: 140,
    height: 49,
  },
  {
    src: "/images/home/logos/telkom-university.png",
    alt: "Telkom University",
    width: 110,
    height: 39,
  },
  {
    src: "/images/home/logos/euromedica.png",
    alt: "Euromedica",
    width: 120,
    height: 43,
  },
  {
    src: "/images/home/logos/kb-insurance.png",
    alt: "KB Insurance Indonesia",
    width: 140,
    height: 35,
  },
  {
    src: "/images/home/logos/realfood.png",
    alt: "Realfood",
    width: 118,
    height: 30,
  },
  {
    src: "/images/home/logos/jago.png",
    alt: "Bank Jago",
    width: 110,
    height: 31,
  },
  { src: "/images/home/logos/aice.png", alt: "Aice", width: 61, height: 34 },
  {
    src: "/images/home/logos/healthy-go.png",
    alt: "Healthy Go",
    width: 90,
    height: 54,
  },
  {
    src: "/images/home/logos/hachi-group.png",
    alt: "Hachi Group",
    width: 120,
    height: 34,
  },
  {
    src: "/images/home/logos/klik-indogrosir.webp",
    alt: "Klik Indogrosir",
    width: 130,
    height: 25,
  },
  {
    src: "/images/home/logos/mnc.png",
    alt: "MNC Media Nusantara Citra",
    width: 110,
    height: 52,
  },
  {
    src: "/images/home/logos/tiki-logo.png",
    alt: "TIKI",
    width: 138,
    height: 45,
  },
];
