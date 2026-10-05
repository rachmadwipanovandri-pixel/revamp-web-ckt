import { useTranslations } from "next-intl";
import type { IconifyIcon } from "@iconify/react/offline";
import { Icon } from "@iconify/react/offline";
import { Container } from "@/components/layout/container";
import { LogoMark } from "@/components/layout/logo";
import {
  lucidePresentation,
  lucideShieldCheck,
  lucideTag,
  mdiClockOutline,
} from "@/lib/icons";
import { ContactSalesForm } from "./contact-sales-form";

/**
 * Icons for the three sales reasons, paired with their translation keys so the
 * numbered list is data rather than three near-identical JSX blocks.
 */
const POINTS: Array<{ icon: IconifyIcon; n: 1 | 2 | 3 }> = [
  { icon: lucidePresentation, n: 1 },
  { icon: lucideTag, n: 2 },
  { icon: lucideShieldCheck, n: 3 },
];

/**
 * Two-column sales page: the form on the right (what the visitor came to do),
 * reassurance on the left. Intercom stacks these, but on a wide screen the
 * split puts the submit button near the top of the fold instead of below three
 * paragraphs of copy.
 */
export function ContactSalesHero() {
  const t = useTranslations("contactSales");

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      {/* Soft brand wash — the same blue-50 gradient the rest of the site uses,
          so the page reads as part of Cekat.AI rather than a bolted-on
          landing page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_32rem_at_15%_-10%,#EFF6FF,transparent_70%)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* Brand glyph, not the wordmark: the header is 50px away and already
              carries the full logo, so repeating it here is noise. */}
          <LogoMark className="mx-auto size-9 text-primary" />

          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-1.5 font-numeric text-xs font-semibold tracking-[0.08em] text-primary uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("intro")}
          </p>

          <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Icon icon={mdiClockOutline} className="size-4 text-primary" />
            {t("replyTime")}
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-14">
          {/* Reassurance rail */}
          <div className="order-2 lg:order-1">
            <h2 className="font-numeric text-xl font-semibold text-foreground">
              {t("asideTitle")}
            </h2>

            <ul className="mt-6 space-y-5">
              {POINTS.map(({ icon, n }) => (
                <li key={n} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-primary">
                    <Icon icon={icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-numeric text-base font-semibold text-foreground">
                      {t(`aside${n}Title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(`aside${n}Body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Trust note — the 3,000+ figure the homepage already uses, so a
                visitor arriving straight from an ad lands on the same claim. */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-5">
              <Icon
                icon={lucideShieldCheck}
                className="mt-0.5 size-5 shrink-0 text-primary"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t("trustNote")}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_1px_2px_rgba(11,18,32,0.04),0_28px_56px_-28px_rgba(11,18,32,0.28)] sm:p-8">
              <ContactSalesForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
