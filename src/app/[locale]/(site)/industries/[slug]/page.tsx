import type { Metadata } from "next";
import {
  LandingPage,
  landingMetadata,
  landingStaticParams,
} from "@/components/sections/landing/landing-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return landingStaticParams("industries");
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  return landingMetadata("industries", params);
}

export default function IndustryLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return <LandingPage kind="industries" params={params} />;
}
