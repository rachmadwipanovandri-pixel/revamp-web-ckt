import { getTranslations } from "next-intl/server";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";

export async function LandingCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  const th = await getTranslations("home.hero");

  return (
    <section className="secondary-final-cta relative isolate overflow-hidden bg-ink-void text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0b1220] via-[#0a1a3d] to-[#050b18]"
      />
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-50"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/35 blur-[100px]" />
        <span className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-sky-500/20 blur-[110px]" />
      </div>

      <Container className="relative pt-24 pb-24 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow-rule-light mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-300 uppercase">
                {th("ctaPrimary")}
              </p>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-white">
                {heading}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-sky-50/85 md:text-lg">
                {body}
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <Button
                  nativeButton={false}
                  render={<AppAnchor href={REGISTER_URL} />}
                  className="h-13 rounded-full bg-white px-8 text-sm text-ink-void shadow-[0_18px_40px_-18px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  {th("ctaSecondary")}
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  className="h-13 rounded-full border-white/35 bg-white/10 px-8 text-sm text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/15"
                  render={
                    <WhatsAppAnchor target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <SafeIcon
                    icon={mdiWhatsapp}
                    className="size-4"
                    size="1rem"
                  />
                  {th("ctaPrimary")}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
