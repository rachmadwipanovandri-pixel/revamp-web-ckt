import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternates } from "@/lib/seo";
import { ProductLanding } from "@/components/sections/landing/product-landing";

const HOW_IT_WORKS_STEPS = [
  { key: "step1", image: "/images/chat/connect-channels.png" },
  { key: "step2", image: "/images/chat/train-your-ai-agent.png" },
  { key: "step3", image: "/images/chat/ai-handles-conversations.png" },
  { key: "step4", image: "/images/chat/escalate-and-sync.png" },
  { key: "step5", image: "/images/chat/analyze-and-improve.png" },
] as const;

const FAQ_COUNT = 3;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chat.meta" });
  const { canonical, languages } = alternates(locale, "/chat");
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

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <ProductLanding
      locale={locale}
      namespace="chat"
      badge={tn("chat")}
      steps={[...HOW_IT_WORKS_STEPS]}
      testimonial={{ image: "/images/chat/tantan-supriatna.png" }}
      faqCount={FAQ_COUNT}
    />
  );
}
