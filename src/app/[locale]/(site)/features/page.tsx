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
  return hubMetadata("features", params);
}

export default function FeaturesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingHub kind="features" params={params} />;
}
