import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import { cn } from "@/lib/utils";

const PROBLEMS = ["p1", "p2", "p3"] as const;
const SOLUTIONS = ["s1", "s2", "s3"] as const;

/**
 * Problem → Solution split (incident.io pattern). Left: friction cards with
 * muted strike treatment. Right: brand solution cards with lift + accent rail.
 * Sits before How-it-works so the path has a reason.
 */
export async function ProblemSolution() {
  const t = await getTranslations("agentic.problemSolution");

  return (
    <section className="relative overflow-hidden bg-white py-14 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {t("headingLead")}{" "}
                <span className="text-primary">{t("headingAccent")}</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground lg:col-span-5 lg:pb-2 lg:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-surface-muted/70 p-6 md:p-8">
              <p className="font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-subtle-foreground uppercase">
                {t("beforeLabel")}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-4">
                {PROBLEMS.map((key, index) => (
                  <li
                    key={key}
                    className="flex gap-3 rounded-2xl border border-foreground/8 bg-white/70 p-4"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 font-numeric text-xs font-bold text-subtle-foreground"
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-numeric text-base font-semibold tracking-[-0.02em] text-foreground/85 line-through decoration-foreground/25 decoration-2">
                        {t(`${key}.title`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {t(`${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-primary/20 bg-ink-void p-6 text-white md:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-primary/30 blur-[80px]"
              />
              <p className="relative font-numeric text-[0.68rem] font-semibold tracking-[0.16em] text-sky-300 uppercase">
                {t("afterLabel")}
              </p>
              <ul className="relative mt-5 flex flex-1 flex-col gap-4">
                {SOLUTIONS.map((key, index) => (
                  <li
                    key={key}
                    className={cn(
                      "flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/[0.1]",
                      index === 1 && "lg:mt-2",
                    )}
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 font-numeric text-xs font-bold text-sky-300"
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-numeric text-base font-semibold tracking-[-0.02em] text-white">
                        {t(`${key}.title`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">
                        {t(`${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="relative mt-6 border-t border-white/10 pt-4 text-sm text-sky-200/90">
                {t("note")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
