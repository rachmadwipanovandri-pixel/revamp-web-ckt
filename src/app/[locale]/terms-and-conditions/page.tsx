import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/sections/legal/legal-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return legalMetadata("terms", params);
}

export default function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage page="terms" params={params} />;
}
