"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Icon } from "@iconify/react/offline";
import { lucidePlay } from "@/lib/icons";

export function RealResult({
  namespace,
  imageSrc,
  videoId,
}: {
  namespace: string;
  imageSrc: string;
  videoId: string;
}) {
  const t = useTranslations(`${namespace}.realResult`);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="border-t border-border bg-white">
      <Container className="border-x border-border px-6 py-12 lg:px-0 lg:py-16">
        <div className="px-0 lg:px-10">
          <h2 className="max-w-3xl font-numeric text-3xl font-semibold text-foreground md:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 max-w-3xl font-numeric text-base text-foreground md:text-lg">
            {t("body")}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
            <div className="flex flex-col justify-center">
              <div className="font-numeric text-base leading-snug text-foreground md:text-lg">
                &ldquo;{t("quote")}&rdquo;
              </div>

              <figure className="mt-8 flex items-center gap-4">
                <Image
                  src={imageSrc}
                  alt={t("name")}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 object-cover"
                />
                <figcaption>
                  <p className="font-numeric text-base font-semibold text-foreground">
                    {t("name")}
                  </p>
                  <p className="mt-0.5 font-numeric text-sm text-muted-foreground">
                    {t("role")}
                  </p>
                </figcaption>
              </figure>
            </div>

            <div className="flex items-center justify-end">
              <div className="w-full overflow-hidden bg-white">
                <div className="relative aspect-video bg-black">
                  {playing ? (
                    <iframe
                      title={`${t("name")} video testimonial`}
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                      className="size-full"
                      allow="accelerate-compute; autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label={`Play ${t("name")} video testimonial`}
                      onClick={() => setPlaying(true)}
                      className="group relative size-full"
                    >
                      <Image
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <span className="flex size-14 items-center justify-center rounded-full bg-white/90">
                          <Icon
                            icon={lucidePlay}
                            className="size-6 text-primary"
                          />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
