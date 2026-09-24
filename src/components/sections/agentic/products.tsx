import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import { ProductCard } from "@/components/sections/agentic/product-card";

const PRODUCTS = [
  {
    key: "frontline",
    image: "/images/home/chat-icon.png",
    tag: "01",
    span: "lg:col-span-2",
  },
  {
    key: "mini",
    image: "/images/home/multiple-specialized-agents.png",
    tag: "02",
    span: "",
  },
  {
    key: "oms",
    image: "/images/home/order-icon.png",
    tag: "03",
    span: "",
  },
  {
    key: "crm",
    image: "/images/home/crm-icon.png",
    tag: "04",
    span: "lg:col-span-2",
  },
  {
    key: "marketing",
    image: "/images/home/marketing-icon.png",
    tag: "05",
    span: "",
  },
  {
    key: "consulting",
    image: "/images/home/knowledge-source.png",
    tag: "06",
    span: "",
  },
] as const;

/**
 * Asymmetric bento of six agents — Frontline and CRM span two columns
 * (not two rows) so cells stay content-height and never leave a tall void.
 */
export async function Products() {
  const t = await getTranslations("agentic.products");

  return (
    <section className="relative overflow-hidden bg-surface-muted py-14 md:py-28 lg:py-32">
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
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow-rule mb-5 inline-flex font-numeric text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                {t("eyebrow")}
              </p>
              <h2 className="text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-foreground">
                {t("headingLead")}{" "}
                <span className="text-primary">{t("headingAccent")}</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground lg:col-span-4 lg:pb-2 lg:text-lg">
              {t("body")}
            </p>
          </div>
        </Reveal>

        {/* Natural row heights — no auto-rows-fr + row-span (that forced
            a two-row featured cell taller than its content). */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {PRODUCTS.map((product, index) => (
            <Reveal
              key={product.key}
              delay={index * 50}
              className={`h-full ${product.span}`}
            >
              <ProductCard
                product={{
                  ...product,
                  span: product.span.includes("lg:col-span-2")
                    ? "bento-wide"
                    : "",
                }}
                copy={{
                  title: t(`${product.key}.title`),
                  lead: t(`${product.key}.lead`),
                  body: t(`${product.key}.body`),
                  pill1: t(`${product.key}.pill1`),
                  pill2: t(`${product.key}.pill2`),
                  pill3: t(`${product.key}.pill3`),
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
