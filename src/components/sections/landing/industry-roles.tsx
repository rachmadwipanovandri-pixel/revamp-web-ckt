import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { REGISTRY } from "@/lib/registry";
import { Container } from "@/components/layout/container";
import { RegistryIcon } from "@/components/layout/registry-icon";

/**
 * "Solutions for every team in <industry>", the cross-section from the
 * reference industry pages: a reader who has decided the platform fits their
 * vertical still needs to know what their own team gets out of it.
 *
 * On the brand grey rather than the deep navy: the band sits between two
 * white sections, and a full-bleed dark block there read as a page break
 * rather than a continuation.
 *
 * Entirely registry-driven, so all 29 industry pages gain it without a line
 * of per-industry copy, and every role page picks up 29 inbound links. The
 * heading takes the industry name from the registry rather than the content
 * file, so it can never drift from the page's own title.
 */
export async function IndustryRoles({
  locale,
  industry,
}: {
  locale: Locale;
  industry: string;
}) {
  const t = await getTranslations({ locale, namespace: "landing" });
  const roles = REGISTRY.solutions
    .filter((entry) => entry.slugs[locale])
    .sort((a, b) => (a.nav?.order ?? 99) - (b.nav?.order ?? 99));

  if (roles.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-surface-muted py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"
      />
      <Container className="relative">
        <p className="eyebrow-rule mb-4 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
          {t("rolesEyebrow")}
        </p>
        <h2 className="max-w-3xl text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.04em] text-balance text-foreground">
          {t("rolesHeading", { industry })}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          {t("rolesBody")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={{
                pathname: "/solutions/[slug]",
                params: { slug: role.slugs[locale]! },
              }}
              className="group flex h-full flex-col gap-3 rounded-[1.35rem] border border-foreground/8 bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-surface-muted text-primary">
                <RegistryIcon name={role.icon} className="size-5" />
              </span>
              <div>
                <h3 className="font-numeric text-base font-semibold tracking-[-0.02em] text-foreground">
                  {role.title[locale]}
                </h3>
                {role.tagline?.[locale] && (
                  <p className="mt-1 font-numeric text-sm leading-snug text-muted-foreground">
                    {role.tagline[locale]}
                  </p>
                )}
              </div>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 font-numeric text-sm font-semibold text-primary">
                {t("readMore")}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
