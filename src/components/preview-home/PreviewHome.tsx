"use client";

import { useEffect, useRef } from "react";
import { buildPage } from "./render";
import { initPreviewHome } from "./behaviors";

export type PreviewPost = {
  title: string;
  href: string;
  meta: string;
  img?: string;
  cls?: string;
  tt?: string;
};

/**
 * Preview homepage (draft) — dirender penuh di client: string HTML dari
 * render.js + interaksi dari behaviors.ts. `posts` = artikel terbaru dari
 * WordPress (diambil server-side oleh page.tsx); kosong → fallback statis.
 */
export default function PreviewHome({ posts, locale }: { posts?: PreviewPost[]; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    try {
      root.innerHTML = buildPage(posts, locale);
      const cleanup = initPreviewHome(root);
      return () => {
        cleanup();
        root.innerHTML = "";
      };
    } catch (err) {
      console.error("[preview-home] init error", err);
    }
  }, [posts, locale]);

  return <div ref={ref} className="ph-root" />;
}
