import Image from "next/image";

export interface Logo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * CSS-only logo ticker. One track, ping-pong via `animate-marquee-x-alt` —
 * no client JS (react-fast-marquee forced a client boundary) and no second
 * copy of every logo in the HTML (a duplicated track roughly doubled the
 * ticker markup).
 */
export function MarqueeStrip({ logos }: { logos: Logo[] }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-max animate-marquee-x-alt motion-reduce:animate-none">
        {logos.map((logo) => (
          <div key={logo.src} className="mx-6 flex items-center">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-5 w-auto object-contain opacity-70 grayscale"
            />
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
