import "./preview-home.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Route draft: preview homepage baru (pola Amplemarket).
 * Sengaja TIDAK dijadikan beranda — beranda produksi tetap
 * src/app/[locale]/page.tsx. Tidak diindeks mesin pencari.
 */
export const metadata: Metadata = {
  title: "Preview — Homepage Baru (Draft)",
  robots: { index: false, follow: false },
};

export default function PreviewHomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
