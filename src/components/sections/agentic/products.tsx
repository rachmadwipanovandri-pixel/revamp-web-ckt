import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/sections/new-home/reveal";
import { ProductCard } from "@/components/sections/agentic/product-card";
import {
  SectionBand,
  SectionShell,
  SectionHeading,
} from "@/components/sections/agentic/shell";

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
 * Platform product grid — clean feature cards with checklist rails.
 * Frontline and CRM stay wide so hierarchy reads at a glance.
 */
export async function Products() {
  const t = await getTranslations("agentic.products");

  return (
    <SectionBand tone="white" className="py-20 md:py-28 lg:py-32">
      <SectionShell>
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            lead={t("headingLead")}
            accent={t("headingAccent")}
            body={t("body")}
          />
        </Reveal>

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
      </SectionShell>
    </SectionBand>
  );
}
