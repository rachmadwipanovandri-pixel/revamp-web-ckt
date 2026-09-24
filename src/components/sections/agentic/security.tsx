import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";

const ITEMS = [
  { key: "pdp", index: "01" },
  { key: "rbac", index: "02" },
  { key: "meta", index: "03" },
  { key: "iso", index: "04" },
] as const;

const TRUST = ["UU PDP", "Meta Partner", "RBAC", "ISO 27001 *"] as const;

/**
 * Enterprise readiness — vault cards on void + compact trust chips
 * (Lindy security strip). ISO status stays honest (in progress).
 */
export async function Security() {
  const t = await getTranslations("agentic.security");

  return (
    <section className="relative overflow-hidden bg-ink-void py-14 text-white md:py-28">
      <div
        aria-hidden
        className="ink-noise pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-orb-drift absolute top-10 right-[10%] h-56 w-56 rounded-full bg-primary/25 blur-[100px]" />
        <span className="animate-orb-drift absolute bottom-10 left-[8%] h-48 w-48 rounded-full bg-accent-sky/20 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow-rule-light mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-sky-300 uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-white">
                {t("headingLead")}{" "}
                <span className="bg-linear-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                  {t("headingAccent")}
                </span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-white/70 lg:col-span-5 lg:pb-2 lg:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={40} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {TRUST.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-sky-300/25 bg-sky-400/10 px-3.5 py-1.5 font-numeric text-[0.7rem] font-semibold tracking-[0.08em] text-sky-200"
              >
                {chip}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, index) => (
            <Reveal key={item.key} delay={index * 70} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-sky-300/35 hover:bg-white/[0.08]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-sky-300/80">
                  {item.index}
                </span>
                <h3 className="mt-4 font-numeric text-lg font-semibold tracking-[-0.025em] text-white">
                  {t(`${item.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {t(`${item.key}.body`)}
                </p>
                <span
                  aria-hidden
                  className="mt-auto h-0.5 w-10 rounded-full bg-sky-400/40 transition-all duration-500 group-hover:w-16 group-hover:bg-sky-300"
                />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-8">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-white/50">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
