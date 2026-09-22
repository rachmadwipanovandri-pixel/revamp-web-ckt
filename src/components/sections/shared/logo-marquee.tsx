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
    <div className="border-y border-foreground/8 bg-white py-6">
      <Container>
        <div className="flex flex-col gap-5 rounded-[1.5rem] border border-foreground/8 bg-surface-muted/70 px-6 py-6 shadow-[0_16px_40px_-36px_rgba(16,24,40,0.35)] md:flex-row md:items-center md:gap-10">
          <h2 className="shrink-0 font-numeric text-sm font-bold tracking-[0.16em] text-foreground uppercase">
            {heading}
          </h2>
          <div className="min-w-0 flex-1 overflow-hidden">
            <MarqueeStrip logos={logos} />
          </div>
        </div>
      </Container>
    </div>
  );
}
