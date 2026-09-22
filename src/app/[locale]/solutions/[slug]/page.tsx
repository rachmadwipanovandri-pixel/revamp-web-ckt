import type { Metadata } from "next";
import {
  LandingPage,
  landingMetadata,
  landingStaticParams,
} from "@/components/sections/landing/landing-page";

export const dynamicParams = false;

export function generateStaticParams() {
  return landingStaticParams("solutions");
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  return landingMetadata("solutions", params);
}

export default function SolutionLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return <LandingPage kind="solutions" params={params} />;
}
