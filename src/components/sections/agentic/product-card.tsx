"use client";

import Image from "next/image";
import { useSpotlight } from "@/components/sections/agentic/motion-hooks";

type Product = {
  key: string;
  image: string;
  tag: string;
  span: string;
};

/**
 * One bento cell. Spotlight follows the pointer. Wide cells (Frontline /
 * CRM) get a bit more horizontal room; height stays content-driven so the
 * card never leaves a tall empty slab.
 */
export function ProductCard({
  product,
  copy,
}: {
  product: Product;
  copy: {
    title: string;
    lead: string;
    body: string;
    pill1: string;
    pill2: string;
    pill3: string;
  };
}) {
  const ref = useSpotlight<HTMLElement>();
  const isWide = product.span === "bento-wide";

  return (
    <article
      ref={ref}
      className="spotlight-card group flex h-full min-h-[11rem] flex-col overflow-hidden rounded-[1.5rem] border border-foreground/8 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_32px_60px_-36px_rgba(19,82,191,0.4)]"
    >
      <div className="relative flex items-start justify-between gap-3 border-b border-foreground/8 bg-linear-to-b from-primary/[0.06] to-transparent px-5 pt-5 pb-3">
        <span className="flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-foreground/8 bg-surface-muted transition-transform duration-500 group-hover:scale-105">
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
        <h3
          className={
            isWide
              ? "font-numeric text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl"
              : "font-numeric text-lg font-semibold tracking-[-0.025em] text-foreground"
          }
        >
          {copy.title}
        </h3>
        <p className="mt-2 text-sm leading-snug font-medium text-primary/90">
          {copy.lead}
        </p>
        <p
          className={
            isWide
              ? "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
              : "mt-3 text-sm leading-relaxed text-muted-foreground"
          }
        >
          {copy.body}
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-foreground/8 pt-4">
          {([copy.pill1, copy.pill2, copy.pill3] as const).map((pill) => (
            <li
              key={pill}
              className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70 transition-transform duration-300 group-hover:scale-125"
              />
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
