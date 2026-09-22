import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/sections/new-home/reveal";

const PRODUCTS = [
  {
    key: "frontline",
    image: "/images/home/chat-icon.png",
    tag: "01",
    href: "/chat",
  },
  {
    key: "mini",
    image: "/images/home/multiple-specialized-agents.png",
    tag: "02",
    href: null,
  },
  {
    key: "oms",
    image: "/images/home/order-icon.png",
    tag: "03",
    href: "/order",
  },
  {
    key: "crm",
    image: "/images/home/crm-icon.png",
    tag: "04",
    href: "/crm",
  },
  {
    key: "marketing",
    image: "/images/home/marketing-icon.png",
    tag: "05",
    href: "/marketing",
  },
  {
    key: "consulting",
    image: "/images/home/knowledge-source.png",
    tag: "06",
    href: null,
  },
] as const;

/**
 * Six-product ecosystem grid — Frontline, Mini Agent, OMS, CRM, Marketing,
 * Consulting. Card language mirrors the brand product screenshots: soft
 * surface, icon plate, short lead, three capability pills.
 */
export async function Products() {
  const t = await getTranslations("agentic.products");

  return (
    <section className="relative overflow-hidden bg-surface-muted py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(19,82,191,0.1) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
              {t("eyebrow")}
            </p>
            <h2 className="text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.08] font-semibold tracking-[-0.04em] text-balance text-foreground">
              {t("headingLead")}{" "}
              <span className="text-primary">{t("headingAccent")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, index) => (
            <Reveal key={product.key} delay={index * 50} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-foreground/8 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_50px_-32px_rgba(19,82,191,0.4)]">
                <div className="relative flex items-start justify-between gap-3 border-b border-foreground/8 bg-linear-to-b from-primary/[0.05] to-transparent px-5 pt-5 pb-3">
                  <span className="flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-foreground/8 bg-surface-muted">
                    <Image
                      src={product.image}
                      alt=""
                      width={40}
                      height={40}
                      className="size-9 object-contain"
                    />
                  </span>
                  <span className="font-numeric text-[0.65rem] font-bold tracking-[0.16em] text-subtle-foreground">
                    {product.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-numeric text-lg font-semibold tracking-[-0.025em] text-foreground">
                    {t(`${product.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-snug font-medium text-primary/90">
                    {t(`${product.key}.lead`)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`${product.key}.body`)}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2 border-t border-foreground/8 pt-4">
                    {(["pill1", "pill2", "pill3"] as const).map((pill) => (
                      <li
                        key={pill}
                        className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70"
                        />
                        {t(`${product.key}.${pill}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
