import type { Metadata } from "next";
import {
  LandingHub,
  hubMetadata,
} from "@/components/sections/landing/landing-hub";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return hubMetadata("solutions", params);
}

export default function SolutionsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingHub kind="solutions" params={params} />;
}
