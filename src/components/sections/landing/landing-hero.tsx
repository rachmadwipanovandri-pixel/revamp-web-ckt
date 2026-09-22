import { useTranslations } from "next-intl";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";
import { PageHero } from "@/components/sections/shared/page-hero";

export function LandingHero({
  badge,
  title,
  subtitle,
  useCases,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  useCases?: string[];
}) {
  const th = useTranslations("home.hero");

  return (
    <PageHero
      eyebrow={badge}
      title={title}
      subtitle={subtitle}
      chips={useCases}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
        <Button
          size="lg"
          className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_16px_40px_-16px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
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
          className="h-13 rounded-full border-white/30 bg-white/8 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/15"
          nativeButton={false}
          render={<AppAnchor href={REGISTER_URL} />}
        >
          {th("ctaSecondary")}
        </Button>
      </div>
    </PageHero>
  );
}
