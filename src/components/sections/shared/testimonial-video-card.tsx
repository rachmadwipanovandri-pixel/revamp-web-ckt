"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/offline";
import { lucidePlay } from "@/lib/icons";

/**
 * One unified case-study card: the face sits on the thumbnail, not in a
 * separate strip below. Keeps name/role as real text for tests and a11y.
 */
export function TestimonialVideoCard({
  videoId,
  name,
  role,
  imageSrc,
}: {
  videoId: string;
  name: string;
  role: string;
  imageSrc?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-ink-void shadow-[0_20px_40px_-28px_rgba(16,24,40,0.45)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_32px_56px_-30px_rgba(19,82,191,0.4)]">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            title={`${name} video testimonial`}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            className="absolute inset-0 size-full"
            allow="accelerate-compute; autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${name} video testimonial`}
            onClick={() => setPlaying(true)}
            className="absolute inset-0 size-full cursor-pointer"
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-ink-void via-ink-void/35 to-transparent"
            />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex size-14 items-center justify-center rounded-full border border-white/40 bg-white/92 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
                <span
                  aria-hidden
                  className="animate-pulse-soft absolute inset-0 rounded-full border border-white/50"
                />
                <Icon
                  icon={lucidePlay}
                  className="size-5 translate-x-0.5 text-primary"
                />
              </span>
            </span>

            {/* Identity lives on the frame — no detached footer strip */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-3 p-4 text-left sm:p-5">
              {imageSrc && (
                <Image
                  src={imageSrc}
                  alt=""
                  width={48}
                  height={48}
                  className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white/40 sm:size-12"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-numeric text-sm font-semibold text-white sm:text-[0.95rem]">
                  {name}
                </p>
                <p className="mt-0.5 truncate text-xs leading-snug text-white/70 sm:text-[0.8rem]">
                  {role}
                </p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* When playing, keep a compact identity bar under the player */}
      {playing && (
        <div className="flex items-center gap-3 border-t border-white/10 bg-ink-panel px-4 py-3.5">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt=""
              width={40}
              height={40}
              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
            />
          )}
          <div className="min-w-0">
            <p className="truncate font-numeric text-sm font-semibold text-white">
              {name}
            </p>
            <p className="truncate text-xs text-white/60">{role}</p>
          </div>
        </div>
      )}
    </article>
  );
}
