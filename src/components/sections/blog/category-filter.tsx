import { Link } from "@/i18n/navigation";
import type { BlogCategory } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  categories,
  activeSlug,
  allLabel,
}: {
  categories: BlogCategory[];
  activeSlug?: string;
  allLabel: string;
}) {
  if (categories.length === 0) return null;

  const pill = (active: boolean) =>
    cn(
      "inline-flex min-h-10 items-center rounded-full border px-4 py-1.5 font-numeric text-sm font-medium transition-all duration-300",
      active
        ? "border-ink-void bg-ink-void text-white shadow-[0_12px_28px_-16px_rgba(15,31,58,0.8)]"
        : "border-foreground/12 bg-white text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground",
    );

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/blog" className={pill(!activeSlug)}>
        {allLabel}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={{ pathname: "/blog", query: { category: cat.slug } }}
          className={pill(activeSlug === cat.slug)}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
