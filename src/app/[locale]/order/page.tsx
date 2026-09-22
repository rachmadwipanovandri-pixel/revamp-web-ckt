import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/lib/seo";
import { FeatureHero } from "@/components/sections/features/feature-hero";
import { WhatMakes } from "@/components/sections/features/what-makes";
import { HowItWorks } from "@/components/sections/features/how-it-works";
import { Faq } from "@/components/sections/features/faq";
import { LogoMarquee } from "@/components/sections/shared/logo-marquee";
import { TRUSTED_LOGOS } from "@/components/sections/shared/trusted-logos";
import { FinalCTA } from "@/components/sections/home/final-cta";

const HOW_IT_WORKS_STEPS = [
  {
    key: "step1",
    image: "/images/order/conversations-come-in-from-every-channel.png",
  },
  { key: "step2", image: "/images/order/automation-triggers-instantly.png" },
  { key: "step3", image: "/images/order/auto-create-ticket.png" },
  {
    key: "step4",
    image: "/images/order/automatic-notifications-to-the-right-team.png",
  },
  {
    key: "step5",
    image: "/images/order/full-visibility-across-every-automation-step.png",
  },
  {
    key: "step6",
    image: "/images/order/end-to-end-operational-efficiency.png",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "order.meta" });
  const { canonical, languages } = alternates(locale, "/order");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CekatAI",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        { url: "/graph-image.jpg", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/graph-image.jpg"],
    },
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.trustedBy" });

  return (
    <>
      <FeatureHero
        namespace="order"
        backgroundSrc="/images/features/hero-background.png"
      />
      <LogoMarquee heading={t("heading")} logos={TRUSTED_LOGOS} />
      <WhatMakes namespace="order" />
      <HowItWorks
        namespace="order"
        backgroundSrc="/images/features/how-it-works-background.png"
        steps={HOW_IT_WORKS_STEPS}
      />
      <Faq namespace="order" />
      <FinalCTA namespace="order.cta" />
    </>
  );
}
