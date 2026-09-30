import type { Metadata } from "next";
import {
  LandingPage,
  landingMetadata,
  landingStaticParams,
} from "@/components/sections/landing/landing-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return landingStaticParams("features");
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  return landingMetadata("features", params);
}

export default function FeatureLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return <LandingPage kind="features" params={params} />;
}
