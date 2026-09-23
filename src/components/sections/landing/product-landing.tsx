import { getTranslations, setRequestLocale } from "next-intl/server";
import { LogoMarquee } from "@/components/sections/shared/logo-marquee";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { LandingHero } from "@/components/sections/landing/landing-hero";
import { Pillars } from "@/components/sections/landing/pillars";
import { BenefitAccordion } from "@/components/sections/landing/benefit-accordion";
import { LandingTestimonial } from "@/components/sections/landing/landing-testimonial";
import { RichFaq } from "@/components/sections/landing/rich-faq";
import { LandingCta } from "@/components/sections/landing/landing-cta";

export interface ProductStep {
  key: string;
  image: string;
}

/**
 * Shared shell for the four product pages (chat, crm, marketing, order).
 * Same chapter rhythm as pricing and the registry landings: void hero →
 * trust strip → soft pillar cards → numbered how-it-works → optional proof →
 * FAQ → void closer.
 */
export async function ProductLanding({
  locale,
  namespace,
  badge,
  steps,
  testimonial,
  faqCount = 3,
}: {
  locale: string;
  namespace: "chat" | "crm" | "marketing" | "order";
  badge: string;
  steps: ProductStep[];
  testimonial?: { image: string };
  faqCount?: number;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace });
  const tl = await getTranslations({ locale, namespace: "landing" });
  const tt = await getTranslations({ locale, namespace: "home.trustedBy" });

  const pillars = ([1, 2, 3] as const).map((n) => ({
    title: t(`whatMakes.card${n}.title` as const),
    body: t(`whatMakes.card${n}.description` as const),
  }));

  const benefits = steps.map((step) => ({
    title: t(`howItWorks.${step.key}.title` as const),
    body: t(`howItWorks.${step.key}.description` as const),
    image: step.image,
    imageAlt: t(`howItWorks.${step.key}.title` as const),
  }));

  const faqItems = Array.from({ length: faqCount }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  return (
    <>
      <div className="cv-auto">
        <LandingHero
          badge={badge}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
        />
      </div>

      <div className="cv-auto">
        <LogoMarquee heading={tt("heading")} logos={TRUSTED_LOGOS} />
      </div>

      <div className="cv-auto">
        <Pillars
          eyebrow={tl("pillarsEyebrow")}
          heading={t("whatMakes.heading")}
          pillars={pillars}
        />
      </div>

      <div className="cv-auto">
        <BenefitAccordion
          eyebrow={tl("benefitsEyebrow")}
          heading={t("howItWorks.heading")}
          benefits={benefits}
        />
      </div>

      {testimonial && (
        <div className="cv-auto">
          <LandingTestimonial
            eyebrow={tl("testimonialEyebrow")}
            heading={t("realResult.heading")}
            testimonial={{
              quote: t("realResult.quote"),
              name: t("realResult.name"),
              role: t("realResult.role"),
              image: testimonial.image,
            }}
          />
        </div>
      )}

      <div className="cv-auto">
        <RichFaq
          label={t("faq.label")}
          heading={t("faq.heading")}
          items={faqItems}
        />
      </div>

      <div className="cv-auto">
        <LandingCta heading={t("cta.heading")} body={t("cta.body")} />
      </div>
    </>
  );
}
