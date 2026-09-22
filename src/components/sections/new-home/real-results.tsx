import { useTranslations } from "next-intl";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { SectionShell } from "./section-shell";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  {
    name: "Silcia Brenda",
    role: "CEO & Founder - Moir Salon",
    videoId: "ePdVgW7X01s",
    imageSrc: "/images/home/testimonial-silica-brenda.jpg",
  },
  {
    name: "Tantan Supriantna",
    role: "Head Customer Relation - Rumah Zakat",
    videoId: "wvOip0Gkx30",
    imageSrc: "/images/chat/tantan-supriatna.png",
  },
  {
    name: "Hargyo T. N. Ignatis, Ph.D",
    role: "Direktur - Multimedia Nusantara Polytechnic (MNP)",
    videoId: "O_xSafLehMQ",
    imageSrc: "/images/home/testimonial-hargyo.jpg",
  },
  {
    name: "Rianti Yahya",
    role: "CEO - VIO Optical Clinic",
    videoId: "681luT0Aa68",
    imageSrc: "/images/home/rianti-yahya.png",
  },
  {
    name: "Gery Wilianto",
    role: "CEO & Founder - DokterHub",
    videoId: "vmXUCHVo6k8",
    imageSrc: "/images/home/gerry-wilianto.png",
  },
  {
    name: "Adam Sulaiman",
    role: "President Director - Threeland Property",
    videoId: "IezNIgsGH5I",
    imageSrc: "/images/crm/adam-sulaiman.png",
  },
] as const;

export function RealResults() {
  const t = useTranslations("home.realResults");

  return (
    <SectionShell surface="muted">
      <Reveal>
        <SectionHeading
          chapter="10"
          title={t("heading")}
          lede={t("body")}
        />
      </Reveal>

      {/* Even video wall — identity rides on the thumbnail, no vertical stagger */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <Reveal
            key={testimonial.videoId}
            delay={index * 50}
            y={36}
            className="h-full"
          >
            <div className="h-full">
              <TestimonialVideoCard
                videoId={testimonial.videoId}
                name={testimonial.name}
                role={testimonial.role}
                imageSrc={testimonial.imageSrc}
              />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={80} className="mt-14">
        <div className="flex flex-col gap-5 rounded-[1.5rem] border border-foreground/8 bg-white px-6 py-6 shadow-[0_16px_40px_-32px_rgba(16,24,40,0.35)] md:flex-row md:items-center md:gap-10">
          <h3 className="shrink-0 font-numeric text-sm font-bold tracking-[0.16em] text-foreground uppercase">
            {t("brandTitle")}
          </h3>
          <div className="min-w-0 flex-1 overflow-hidden">
            <MarqueeStrip logos={TRUSTED_LOGOS} />
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
