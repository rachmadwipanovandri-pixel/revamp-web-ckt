import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/sections/new-home/reveal";
import {
  groupRolesByTeam,
  OPEN_ROLES,
  type CareerRole,
} from "@/lib/careers";
import type { Locale } from "@/i18n/routing";

/**
 * Open roles, in the shape fun.xyz uses: a heading, then the roles grouped by
 * team, each row a single link out to the posting that actually receives the
 * application.
 *
 * Two decisions worth stating.
 *
 * **The whole row is the link.** The visible label is "Apply", which on its own
 * tells a visitor nothing about where it goes; making the entire row the target
 * means the obvious thing — click the job — is the useful thing.
 *
 * **The external link is stated, not implied.** A `target="_blank"` row with no
 * signal reads as a trap, so the note above the list and the arrow icon both
 * say the application happens on LinkedIn. Silently dumping someone into a
 * third-party site is the fastest way to lose a candidate.
 */
export async function OpenRoles({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "careers" });
  const groups = groupRolesByTeam(OPEN_ROLES);

  return (
    <section className="relative bg-white py-16 md:py-20">
      <Container>
        <Reveal>
          <h2
            id="open-roles"
            className="text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance text-foreground"
          >
            {t("openRoles")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {t("openRolesNote")}
          </p>
        </Reveal>

        {groups.length === 0 ? (
          <Reveal delay={60} className="mt-8">
            <div className="rounded-[1.25rem] border border-foreground/10 bg-slate-50 p-6">
              <p className="text-base font-semibold text-foreground">
                {t("emptyTitle")}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("emptyBody")}
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 space-y-12">
            {groups.map((group, index) => (
              <Reveal key={group.team} delay={60 + index * 60}>
                <h3 className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  <span
                    aria-hidden
                    className="h-px w-8 bg-primary/30"
                  />
                  {t(`teams.${group.team}`)}
                </h3>

                <ul className="mt-4 border-t border-foreground/10">
                  {group.roles.map((role) => (
                    <li key={role.id}>
                      <RoleRow
                        role={role}
                        applyLabel={t("apply")}
                        // Labels are resolved here rather than inside the row:
                        // `role.type` is a key (`fullTime`), and a sync row
                        // component cannot reach the message bundle.
                        meta={[t(`types.${role.type}`)]}
                        seniority={
                          role.seniority
                            ? t(`seniority.${role.seniority}`)
                            : null
                        }
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function RoleRow({
  role,
  applyLabel,
  meta,
  seniority,
}: {
  role: CareerRole;
  applyLabel: string;
  /** Already-translated employment labels, in reading order. */
  meta: string[];
  /** Translated seniority band, or null when the posting states none. */
  seniority: string | null;
}) {
  return (
    <a
      href={role.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 border-b border-foreground/10 py-5 transition-colors duration-200 hover:bg-slate-50/80 sm:flex-row sm:items-center sm:gap-6 sm:px-3"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[1.05rem] leading-snug font-semibold tracking-[-0.02em] text-foreground">
          {role.title}
        </span>
        {/*
          Location first because it is the fact a candidate screens on, then
          employment type, then seniority when the posting stated one. Each
          separator is decorative so a screen reader reads a clean list.
        */}
        <span className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
          {[role.location, ...meta, seniority]
            .filter((part): part is string => Boolean(part))
            .map((part, index) => (
              <span key={part} className="contents">
                {index > 0 ? (
                  <span aria-hidden className="text-foreground/25">
                    ·
                  </span>
                ) : null}
                <span>{part}</span>
              </span>
            ))}
        </span>
      </span>

      {/*
        The pill is hidden on the narrowest screens where the row is already a
        single obvious target; the arrow stays, so the outbound direction is
        never unstated.
      */}
      <span className="hidden shrink-0 items-center gap-1.5 sm:inline-flex">
        <span className="inline-flex h-9 items-center rounded-full bg-foreground/5 px-4 text-sm font-semibold text-foreground transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
          {applyLabel}
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </span>
    </a>
  );
}
