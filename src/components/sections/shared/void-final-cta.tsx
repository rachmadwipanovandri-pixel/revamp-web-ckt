import { getTranslations } from "next-intl/server";
import { REGISTER_URL } from "@/lib/links";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { AppAnchor } from "@/components/shared/app-anchor";
import { lucideCheck, mdiWhatsapp } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SafeIcon } from "@/components/sections/new-home/safe-icon";

const DEFAULT_CHECKS = ["item1", "item2", "item3"] as const;

/**
 * Void closer for secondary pages — mirrors the homepage FinalCta so pricing,
 * hubs, and blog bookend in the same keynote ink.
 *
 * Copy can come from a namespace (`heading`/`body`/`item#`) or be overridden
 * with lead/accent heading parts when a namespace already splits them.
 */
export async function VoidFinalCta({
  namespace,
  eyebrow,
  headingLead,
  headingAccent,
}: {
  namespace: string;
  /** Overrides `${namespace}.label` / a hard-coded eyebrow when provided. */
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
}) {
  const t = await getTranslations(namespace);
  const th = await getTranslations("home.hero");

  const hasChecklist =
    t.has(DEFAULT_CHECKS[0]) && t.has(DEFAULT_CHECKS[1]) && t.has(DEFAULT_CHECKS[2]);
  const lead =
    headingLead ??
    (t.has("heading") ? t("heading") : t.has("headingLead") ? t("headingLead") : "");
  const accent =
    headingAccent ?? (t.has("headingAccent") ? t("headingAccent") : undefined);
  const eyebrowText = eyebrow ?? (t.has("eyebrow") ? t("eyebrow") : null);

  return (
    <section className="relative isolate overflow-hidden bg-ink-void text-white">
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

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-24 sm:px-6 md:pt-32 md:pb-28 lg:px-8 lg:pt-36 lg:pb-32">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              {eyebrowText && (
                <p className="eyebrow-rule-light mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-300 uppercase">
                  {eyebrowText}
                </p>
              )}
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-white">
                {lead}
                {accent ? (
                  <>
                    {" "}
                    <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                      {accent}
                    </span>
                  </>
                ) : null}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-sky-50/85 md:text-lg">
                {t("body")}
              </p>

              {hasChecklist && (
                <ul className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
                  {DEFAULT_CHECKS.map((key) => (
                    <li
                      key={key}
                      className="flex items-center gap-2.5 text-sm font-medium text-white/90"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-400/20 text-sky-200 ring-1 ring-sky-300/35">
                        <SafeIcon
                          icon={lucideCheck}
                          className="size-3.5"
                          size="0.875rem"
                        />
                      </span>
                      {t(key)}
                    </li>
                  ))}
                </ul>
              )}
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
      </div>
    </section>
  );
}
