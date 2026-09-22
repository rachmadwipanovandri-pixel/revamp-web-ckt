import { getTranslations } from "next-intl/server";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp } from "@/lib/icons";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

/**
 * Light mid-page CTA band. The heavy LandingCta with its meteors stays the
 * page closer; repeating it mid-scroll would double the spectacle and dull
 * both. Same button pairing and order as the hero: WhatsApp filled, trial
 * outlined.
 */
export async function MidCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  const th = await getTranslations("home.hero");

  return (
    <section className="border-t border-border bg-surface-muted">
      <Container className="border-x border-border py-14 text-center lg:py-16">
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground lg:text-lg">
          {body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
            size="lg"
            className="px-5 py-4 text-xs"
            nativeButton={false}
            render={<AppAnchor href={REGISTER_URL} />}
          >
            {th("ctaSecondary")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
