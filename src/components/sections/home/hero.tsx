import { useTranslations } from "next-intl";
import Image from "next/image";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp } from "@/lib/icons";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroChatDemo } from "@/components/sections/home/hero-chat-demo";

export function Hero() {
  const t = useTranslations("home.hero");

  // Keep one screen as the desktop minimum, but let the hero grow with the
  // phone stage. This prevents a realistic tall phone from being clipped on
  // short desktop viewports.
  return (
    <section className="relative flex items-center overflow-visible lg:min-h-svh">
      {/* Decorative backdrop, and it outweighed the LCP image three to one
          while holding the same priority. A soft gradient survives q=50 with
          no visible artefacts, which halves the bytes competing with the
          dashboard above. */}
      <Image
        src="/images/home/hero-background-sky.png"
        alt=""
        fill
        loading="eager"
        quality={50}
        sizes="100vw"
        className="object-cover object-top"
      />
      <Container className="relative w-full py-20 pt-28 text-center lg:py-16 lg:pt-20 lg:text-left">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[35%_1fr] lg:gap-8">
          <div>
            <p className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 font-numeric text-xs font-semibold text-primary backdrop-blur">
              {t("eyebrow")}
            </p>
            {/* Drops a step at lg: at 44% of the container the full-size
                headline wrapped to five lines. */}
            <h1 className="mx-auto max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:mx-0 lg:text-4xl xl:text-[2.5rem]">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground lg:mx-0">
              {t("subtitle")}
            </p>

            {/* Same pairing and order as the navbar: WhatsApp filled, trial
                outlined. Repeating the nav's hierarchy means a visitor who
                scrolled past the header meets the same primary action. */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="px-5 py-4 text-xs"
                nativeButton={false}
                render={
                  <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                }
              >
                <Icon icon={mdiWhatsapp} className="size-4" />
                {t("ctaPrimary")}
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="px-5 py-4 text-xs"
                nativeButton={false}
                render={<AppAnchor href={REGISTER_URL} />}
              >
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>

          {/* Landscape iPad: the 4:3 frame keeps the chat readable while the
              vertical tabs on the left give visitors quick scenario switching. */}
          <HeroChatDemo className="mx-auto w-full max-w-[38rem] lg:w-full lg:max-w-full" />
        </div>
      </Container>
    </section>
  );
}
