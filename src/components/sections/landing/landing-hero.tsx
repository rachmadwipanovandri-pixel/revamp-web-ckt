import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { PageHero } from "@/components/sections/shared/page-hero";
import { ProductStage } from "./product-stage";

export function LandingHero({
  badge,
  title,
  subtitle,
  useCases,
  image,
  imageAlt,
  productImage,
  visualLabel,
  tone,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  useCases?: string[];
  /** Optional related photo used as the hero background (industry landings). */
  image?: string;
  imageAlt?: string;
  productImage?: string;
  visualLabel?: string;
  tone?: string;
}) {
  const th = useTranslations("home.hero");

  return (
    <PageHero
      eyebrow={badge}
      title={title}
      subtitle={subtitle}
      chips={useCases}
      split={Boolean(productImage)}
      visual={productImage ? <ProductStage image={productImage} imageAlt={imageAlt ?? title} photo={image} label={visualLabel ?? badge} tone={tone} /> : undefined}
      align="center"
      compactCenter={Boolean(useCases?.length)}
      tone={tone}
    >
      <div className={`flex w-full flex-wrap items-center gap-3 ${productImage ? "justify-start" : "justify-center"}`}>
        <Button
          size="lg"
            className="h-13 rounded-full bg-[#1352bf] px-8 text-sm text-white shadow-[0_16px_34px_-16px_rgba(19,82,191,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d439f]"
          nativeButton={false}
          render={
            <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
          }
        >
          <SafeIcon icon={mdiWhatsapp} className="size-4" size="1rem" />
          {th("ctaPrimary")}
        </Button>
        <Button
          variant="outline"
          size="lg"
            className="h-13 rounded-full border-[#1352bf]/20 bg-white/85 px-8 text-sm text-[#09214c] shadow-[0_14px_28px_-20px_rgba(9,33,76,0.5)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1352bf]/50 hover:bg-white"
          nativeButton={false}
          render={<AppAnchor href={REGISTER_URL} />}
        >
          {th("ctaSecondary")}
        </Button>
      </div>
    </PageHero>
  );
}
