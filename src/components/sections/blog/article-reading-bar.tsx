"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * Slim bar under the navbar that reveals the article title, a back link, and a
 * reading progress indicator once the reader scrolls past the header.
 */
export function ArticleReadingBar({
  title,
  backLabel,
}: {
  title: string;
  backLabel: string;
}) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);
        setShow(scrollTop > 360);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-16 z-40 border-b border-border bg-background/90 backdrop-blur transition-all duration-300",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <Container className="flex h-12 items-center gap-4 lg:px-0">
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1 font-numeric text-sm font-semibold text-primary hover:text-primary-dark"
        >
          <span aria-hidden>←</span>
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
        <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
        <p className="truncate font-numeric text-sm font-semibold text-foreground">
          {title}
        </p>
      </Container>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
