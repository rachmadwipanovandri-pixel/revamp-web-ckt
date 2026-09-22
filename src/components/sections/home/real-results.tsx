import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { TestimonialVideoCard } from "@/components/sections/shared/testimonial-video-card";
import { MarqueeStrip } from "@/components/sections/shared/marquee-strip";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";

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
    <section className="border-t border-border bg-white max-sm:px-4">
      <Container className="border-x border-border px-4 py-10">
        <div className="w-full">
          <h2 className="font-numeric text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 font-numeric text-base text-foreground">
            {t("body")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialVideoCard
              key={`${testimonial.videoId}-${index}`}
              videoId={testimonial.videoId}
              name={testimonial.name}
              role={testimonial.role}
              imageSrc={testimonial.imageSrc}
            />
          ))}
        </div>
      </Container>

      {/* Logos Row with Borders */}
      <div className="border-t border-border bg-white">
        <Container className="border-x border-border">
          <div className="grid grid-cols-1 divide-border md:grid-cols-12 md:divide-x md:divide-y-0 md:divide-border">
            <div className="flex items-center max-sm:py-6 md:col-span-2 md:pr-6 lg:py-8">
              <h3 className="text-base leading-snug font-semibold text-foreground">
                {t("brandTitle")}
              </h3>
            </div>
            <div className="flex items-center overflow-hidden pt-6 pb-6 md:col-span-10 md:pt-0 md:pb-0 md:pl-8">
              <MarqueeStrip logos={TRUSTED_LOGOS} />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
