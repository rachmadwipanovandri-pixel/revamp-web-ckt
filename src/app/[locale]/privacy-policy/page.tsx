import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/sections/legal/legal-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return legalMetadata("privacy", params);
}

export default function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage page="privacy" params={params} />;
}
