import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/sections/legal/legal-page";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return legalMetadata("refund", params);
}

export default function ReturnRefundDeliveryPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage page="refund" params={params} />;
}
