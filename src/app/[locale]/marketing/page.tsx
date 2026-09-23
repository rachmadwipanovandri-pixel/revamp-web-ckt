import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternates } from "@/lib/seo";
import { ProductLanding } from "@/components/sections/landing/product-landing";

const HOW_IT_WORKS_STEPS = [
  {
    key: "step1",
    image: "/images/marketing/review-all-meta-ads-in-one-dashboard.png",
  },
  { key: "step2", image: "/images/marketing/understand-customer-behavior.png" },
  { key: "step3", image: "/images/marketing/see-what-actually-works.png" },
  {
    key: "step4",
    image: "/images/marketing/allocate-budget-with-precision.png",
  },
  {
    key: "step5",
    image: "/images/marketing/improve-performance-and-lower-cac.png",
  },
] as const;

const FAQ_COUNT = 4;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketing.meta" });
  const { canonical, languages } = alternates(locale, "/marketing");
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

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <ProductLanding
      locale={locale}
      namespace="marketing"
      badge={tn("marketing")}
      steps={[...HOW_IT_WORKS_STEPS]}
      faqCount={FAQ_COUNT}
    />
  );
}
