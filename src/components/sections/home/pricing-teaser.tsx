import { getTranslations } from "next-intl/server";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp } from "@/lib/icons";
import { Link } from "@/i18n/navigation";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { ChatPlanCards } from "@/components/sections/pricing/chat-plan-cards";

/**
 * Homepage pricing teaser: the pricing page's own tier cards, not a homepage
 * copy of them. Reusing the component means the two views cannot drift, and
 * price visibility, the popular badge and the WhatsApp routing all keep
 * behaving exactly as they do on /harga.
 *
 * Only the Chat plan renders here. The pricing page switches between four
 * products with a full feature matrix under each, which is more than a
 * homepage should carry; the link below covers the other three.
 *
 * The cards come through ChatPlanCards so the tier lineup follows the
 * visitor's country, which only a client can know, while this section stays
 * server-rendered.
 */
export async function PricingTeaser() {
  const t = await getTranslations("home.pricingTeaser");
  const tp = await getTranslations("pricing");

  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start lg:gap-12">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground lg:col-span-6 lg:text-4xl">
            {t("heading")}
          </h2>
          <p className="text-base text-muted-foreground lg:col-span-6 lg:text-lg">
            {t("body")}
          </p>
        </div>

        <div className="mt-10">
          <ChatPlanCards />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="text-xs font-semibold"
            nativeButton={false}
            render={
              <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
            }
          >
            <Icon icon={mdiWhatsapp} className="size-4" />
            {tp("ctaWhatsApp")}
          </Button>
          <Link
            href="/pricing"
            className="inline-flex min-h-9 items-center gap-1 px-2 font-numeric text-sm font-semibold text-primary hover:underline"
          >
            {t("cta")}
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        <p className="mt-6 text-sm text-subtle-foreground">
          {tp("excludesVat")}
        </p>
      </Container>
    </section>
  );
}
