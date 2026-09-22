import { useTranslations } from "next-intl";
import Image from "next/image";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function FeatureHero({
  namespace,
  backgroundSrc,
}: {
  namespace: string;
  backgroundSrc: string;
}) {
  const t = useTranslations(`${namespace}.hero`);
  const th = useTranslations("home.hero");

  return (
    <section className="relative flex items-center overflow-hidden lg:min-h-[600px]">
      <Image
        src={backgroundSrc}
        alt=""
        fill
        priority
        className="object-cover object-top"
      />
      <Container className="relative py-24 text-center lg:px-0">
        <h1 className="mx-auto max-w-2xl text-4xl leading-14 font-semibold text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 pb-16">
          <Button
            size="lg"
            className="px-5 py-4 text-xs"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <Icon icon={mdiWhatsapp} className="size-4" />
            {th("ctaPrimary")}
          </Button>
          <Button
            variant="outline-primary"
            nativeButton={false}
            size="lg"
            className="px-5 py-4 text-xs"
            render={<AppAnchor href={REGISTER_URL} />}
          >
            {th("ctaSecondary")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
