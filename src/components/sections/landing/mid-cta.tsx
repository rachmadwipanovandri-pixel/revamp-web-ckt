import { getTranslations } from "next-intl/server";
import { mdiWhatsapp } from "@/lib/icons";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";

/**
 * Light mid-page CTA band. The heavy LandingCta void closer stays the page
 * end; repeating it mid-scroll would double the spectacle and dull both.
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
    <section className="relative overflow-hidden border-y border-foreground/8 bg-linear-to-b from-white via-primary/[0.05] to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-linear-to-r from-transparent via-primary/25 to-transparent" />
        <span className="absolute top-10 right-[10%] h-40 w-40 rounded-full bg-accent-sky/12 blur-[80px]" />
      </div>
      <Container className="relative py-16 text-center lg:py-20">
        <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
          {th("ctaSecondary")}
        </p>
        <h2 className="mx-auto max-w-3xl text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-foreground">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
          {body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full bg-ink-void px-7 text-sm text-white shadow-[0_16px_36px_-18px_rgba(15,31,58,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
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
            className="h-12 rounded-full border-foreground/15 bg-white/70 px-6 text-sm text-foreground backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white hover:text-primary"
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
