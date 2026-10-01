import "./preview-home-2.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/preview-home-2/SmoothScroll";

/**
 * Route draft: redesign beranda kedua (kanvas terang, diagram-first).
 *
 * Sengaja di luar grup (site) supaya tidak dibungkus navbar/footer produksi,
 * dan tidak diindeks mesin pencari. Beranda produksi tetap
 * src/app/[locale]/(site)/page.tsx; preview-home tetap jadi pembanding.
 */
export const metadata: Metadata = {
  title: "Preview 2 — Homepage Baru (Draft)",
  robots: { index: false, follow: false },
};

export default function PreviewHome2Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      {children}
    </>
  );
}
