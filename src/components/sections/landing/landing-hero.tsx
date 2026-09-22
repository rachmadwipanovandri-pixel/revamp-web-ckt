import { useTranslations } from "next-intl";
import Image from "next/image";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { Icon } from "@iconify/react/offline";
import { mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

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
    <section className="relative flex items-center overflow-hidden">
      <Image
        src="/images/features/hero-background.png"
        alt=""
        fill
        priority
        className="object-cover object-top"
      />
      <Container className="relative py-20 text-center lg:px-0 lg:py-24">
        {badge && (
          <p className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 font-numeric text-xs font-semibold text-primary shadow-card">
            {badge}
          </p>
        )}
        <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-semibold text-foreground sm:text-5xl sm:leading-14">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground">
          {subtitle}
        </p>

        {/* What this vertical uses the platform for, at a glance. Styled as
            labels rather than buttons: they summarise the page's own benefit
            sections, and dressing them as tabs would promise navigation the
            hero does not provide. */}
        {useCases && useCases.length > 0 && (
          <ul className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-full border border-border bg-background/80 px-3.5 py-1.5 font-numeric text-xs font-medium text-muted-foreground backdrop-blur"
              >
                {useCase}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex items-center justify-center gap-4 pb-4">
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
