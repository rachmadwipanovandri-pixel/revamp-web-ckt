import { Container } from "@/components/layout/container";
import { MarqueeStrip, type Logo } from "./marquee-strip";

export function LogoMarquee({
  heading,
  logos,
}: {
  heading: string;
  logos: Logo[];
}) {
  return (
    <div className="border-y border-border bg-white">
      <Container className="border-x border-border">
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-12 md:divide-x md:divide-y-0 md:divide-border">
          <div className="flex items-center py-8 md:col-span-4 md:pr-6">
            <h2 className="text-base leading-snug font-semibold text-foreground">
              {heading}
            </h2>
          </div>
          <div className="flex items-center overflow-hidden pt-6 pb-6 md:col-span-8 md:pt-0 md:pb-0 md:pl-8">
            <MarqueeStrip logos={logos} />
          </div>
        </div>
      </Container>
    </div>
  );
}
