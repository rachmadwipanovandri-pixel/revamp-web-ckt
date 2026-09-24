"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Product = {
  key: string;
  image: string;
  tag: string;
  span: string;
};

/**
 * Platform product card — clean type hierarchy, quiet icon tile, feature
 * checklist. Matches incident.io product list rows more than bento noise.
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
  const isWide = product.span === "bento-wide";

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#0C111D]/[0.08] bg-white",
        "shadow-[0_1px_2px_rgba(12,17,29,0.04),0_18px_40px_-28px_rgba(12,17,29,0.16)]",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_1px_2px_rgba(12,17,29,0.04),0_28px_56px_-30px_rgba(19,82,191,0.28)]",
      )}
    >
      <div className="flex items-start gap-4 px-6 pt-6">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#0C111D]/[0.06] bg-[#F6F7F9]">
          <Image
            src={product.image}
            alt=""
            width={36}
            height={36}
            className="size-8 object-contain"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "font-numeric font-semibold tracking-[-0.03em] text-[#0C111D]",
                isWide ? "text-xl md:text-2xl" : "text-lg",
              )}
            >
              {copy.title}
            </h3>
            <span className="font-numeric text-[0.7rem] font-semibold tracking-[0.12em] text-[#98A2B3]">
              {product.tag}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-primary">{copy.lead}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6">
        <p
          className={cn(
            "mt-4 leading-[1.65] text-[#525C6B]",
            isWide ? "max-w-2xl text-[0.98rem] md:text-base" : "text-sm",
          )}
        >
          {copy.body}
        </p>
        <ul className="mt-5 grid gap-2 border-t border-[#0C111D]/[0.06] pt-5">
          {([copy.pill1, copy.pill2, copy.pill3] as const).map((pill) => (
            <li
              key={pill}
              className="flex items-start gap-2.5 text-sm leading-snug text-[#525C6B]"
            >
              <span
                aria-hidden
                className="mt-[0.4rem] size-1.5 shrink-0 rounded-full bg-primary/70"
              />
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
