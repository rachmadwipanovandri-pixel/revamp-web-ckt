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
  return hubMetadata("industries", params);
}

export default function IndustriesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LandingHub kind="industries" params={params} />;
}
