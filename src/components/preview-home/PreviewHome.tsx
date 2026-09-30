"use client";

import { useEffect } from "react";
import { initPreviewHome } from "./behaviors";

/**
 * Preview homepage (draft) — konten HTML-nya dibangun di server oleh
 * page.tsx (buildPage) dan di-stream sebagai <div class="ph-root"> biasa,
 * sehingga sudah ada di first paint dan tidak ikut ter-serialize dua kali
 * lewat props client. Komponen ini hanya memasang interaksi (behaviors)
 * setelah hydration.
 */
export default function PreviewHome() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ph-root");
    if (!root) return;
    try {
      return initPreviewHome(root);
    } catch (err) {
      console.error("[preview-home] init error", err);
    }
  }, []);

  return null;
}
