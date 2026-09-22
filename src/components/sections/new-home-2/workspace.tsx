import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/sections/new-home/reveal";
import { SplitHeading, Eyebrow } from "./split-heading";

const IMAGES = {
  feature1:
    "/images/home/track-and-optimize-your-marketing-performance-in-one-unified-platform.png",
  feature2: "/images/home/automate-your-business-logic-no-coding-needed.png",
  feature3: "/images/home/your-crm-built-for-growth-and-real-conversations.png",
} as const;

/**
 * Light “workspace” act: one unified product stage plus three capability cards.
 * Screenshots float on soft brand washes — the airy composition from ref 1.
 */
export async function Workspace() {
  const t = await getTranslations("home.platformOverview");

  const cards = (["feature1", "feature2", "feature3"] as const).map((key) => ({
    key,
    image: IMAGES[key],
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  }));

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-primary/[0.03] to-white py-20 md:py-28 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-10 right-[10%] h-64 w-64 rounded-full bg-accent-sky/10 blur-[90px]" />
        <span className="absolute bottom-20 left-[5%] h-56 w-56 rounded-full bg-primary/8 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow align="center">Workspace</Eyebrow>
            <SplitHeading
              className="mt-5"
              lead="Your all-in-one"
              accent="growth workspace"
              align="center"
            />
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Campaigns, conversations, and customer data live on one surface —
              so your team stops switching tabs and starts closing.
            </p>
          </div>
        </Reveal>

        {/* Hero product stage */}
        <Reveal delay={60} className="mt-14">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white p-2 shadow-[0_40px_80px_-48px_rgba(16,24,40,0.45)]">
            <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span aria-hidden className="ml-3 h-2 flex-1 rounded-full bg-surface-subtle" />
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-muted">
              <Image
                src={IMAGES.feature1}
                alt={cards[0].title}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <Reveal key={card.key} delay={80 + index * 50} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-foreground/8 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_48px_-32px_rgba(19,82,191,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-foreground/8 bg-surface-muted">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-primary/70">
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 text-base leading-snug font-semibold tracking-[-0.02em] text-foreground text-balance">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
