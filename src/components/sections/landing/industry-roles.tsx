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
    <section className="border-t border-border bg-surface-subtle">
      <Container className="border-x border-border px-6 py-12 lg:py-16">
        <p className="font-numeric text-sm font-semibold tracking-[0.08em] text-primary uppercase">
          {t("rolesEyebrow")}
        </p>
        <h2 className="mt-3 max-w-3xl font-numeric text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t("rolesHeading", { industry })}
        </h2>
        <p className="mt-4 max-w-2xl font-numeric text-base text-muted-foreground md:text-lg">
          {t("rolesBody")}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={{
                pathname: "/solutions/[slug]",
                params: { slug: role.slugs[locale]! },
              }}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary/30"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <RegistryIcon name={role.icon} className="size-5" />
              </span>
              <div>
                <h3 className="font-numeric text-base font-semibold text-foreground">
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
