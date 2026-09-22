import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SplitHeading, Eyebrow } from "./split-heading";

const ROWS = [
  {
    key: "buildAiAgent",
    image: "/images/home/simpler-ai-builder.png",
    flip: false,
    eyebrow: "AI builder",
    lead: "Build an agent",
    accent: "in five minutes",
  },
  {
    key: "aiAgentFlow",
    image: "/images/home/visual-flow-designer.png",
    flip: true,
    eyebrow: "Chat flow",
    lead: "Route every chat",
    accent: "to the right brain",
  },
] as const;

/**
 * Alternating capability rows — text column + floating UI card. Quiet light
 * rhythm between the pillar grid and the muted builder act.
 */
export async function CapabilityRows() {
  const tBuild = await getTranslations("home.buildAiAgent");
  const tFlow = await getTranslations("home.aiAgentFlow");
  const t = (key: (typeof ROWS)[number]["key"]) =>
    key === "buildAiAgent" ? tBuild : tFlow;

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-7xl space-y-20 px-4 sm:px-6 md:space-y-28 lg:px-8">
        {ROWS.map((row) => {
          const tt = t(row.key);
          const features = (
            row.key === "buildAiAgent"
              ? (["feature1", "feature2", "feature3"] as const)
              : (["feature1", "feature2", "feature3"] as const)
          ).map((f) => ({
            title: tt(`${f}.title`),
            description: tt(`${f}.description`),
          }));

          return (
            <div
              key={row.key}
              className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
            >
              <Reveal
                className={
                  row.flip ? "lg:col-span-5 lg:order-2" : "lg:col-span-5"
                }
              >
                <Eyebrow>{row.eyebrow}</Eyebrow>
                <SplitHeading
                  className="mt-5"
                  lead={row.lead}
                  accent={row.accent}
                />
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                  {row.key === "buildAiAgent" ? tBuild("body") : tFlow("body")}
                </p>
                <ul className="mt-8 flex flex-col gap-5">
                  {features.map((feature, index) => (
                    <li key={feature.title} className="flex gap-4">
                      <span
                        aria-hidden
                        className="mt-1 font-numeric text-xs font-bold tracking-[0.14em] text-primary/60"
                      >
                        0{index + 1}
                      </span>
                      <div>
                        <p className="font-semibold tracking-[-0.02em] text-foreground">
                          {feature.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                delay={80}
                className={
                  row.flip ? "lg:col-span-7 lg:order-1" : "lg:col-span-7"
                }
              >
                <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-surface-muted p-2 shadow-[0_36px_70px_-40px_rgba(16,24,40,0.45)]">
                  <div className="mb-2 flex items-center gap-1.5 px-2 pt-1">
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span className="size-2 rounded-full bg-foreground/15" />
                    <span aria-hidden className="ml-2 h-1.5 flex-1 rounded-full bg-foreground/8" />
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white">
                    <Image
                      src={row.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 640px"
                      className="object-contain object-bottom p-2"
                    />
                  </div>
                  {/* Soft brand wash behind the card edge */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-10 -z-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
                  />
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
