"use client";

import Image from "next/image";
import { Icon } from "@iconify/react/offline";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { sceneArtwork, sceneKind } from "./scene-art";
import { sceneLayers, scenePause, scenePlay, sceneBolt } from "./scene-icons";
import { CoverageScene } from "./coverage-scene";

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", color: "#087b38" },
  { id: "instagram", label: "Instagram", color: "#bf2460" },
  { id: "messenger", label: "Messenger", color: "#1352bf" },
] as const;

/** A real, explorable product scene; no fabricated conversations or metrics. */
export function WorkflowScene({ image, imageAlt, title, index = 0, count, hero = false }: {
  image: string;
  imageAlt: string;
  title?: string;
  index?: number;
  count?: number;
  hero?: boolean;
}) {
  const locale = useLocale();
  const isId = locale === "id";
  const ref = useRef<HTMLDivElement>(null);
  const [original, setOriginal] = useState(false);
  const [paused, setPaused] = useState(false);
  const [channel, setChannel] = useState(0);
  const kind = sceneKind(image);
  const activeChannel = CHANNELS[channel];

  useEffect(() => {
    const root = ref.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || paused || typeof IntersectionObserver === "undefined") return;
    let cancelled = false;
    let inView = false;
    let context: { revert(): void } | undefined;
    let loading = false;
    let entrance: { play(): void; pause(): void } | undefined;
    let loop: { play(): void; pause(): void } | undefined;
    const sync = () => {
      if (media.matches) {
        context?.revert();
        context = undefined;
        entrance = undefined;
        loop = undefined;
        root.style.setProperty("--pointer-x", "0px");
        root.style.setProperty("--pointer-y", "0px");
      } else if (inView && !document.hidden) {
        if (context) { entrance?.play(); loop?.play(); }
        else if (!loading) {
          loading = true;
          void import("gsap").then(({ gsap }) => {
            loading = false;
            if (cancelled || media.matches || !inView || document.hidden) return;
            context = gsap.context(() => {
              entrance = gsap.from(root.querySelectorAll("[data-scene-layer]"), {
                y: 16, opacity: 0.65, stagger: 0.06, duration: 0.65,
                ease: "power3.out", clearProps: "transform,opacity",
              });
              loop = gsap.to(root.querySelector("[data-scene-float]"), {
                y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut",
              });
            }, root);
          }).catch(() => { loading = false; /* Static composition stays usable. */ });
        }
      } else {
        entrance?.pause(); loop?.pause();
        root.style.setProperty("--pointer-x", "0px");
        root.style.setProperty("--pointer-y", "0px");
      }
    };
    const blur = () => {
      root.style.setProperty("--pointer-x", "0px");
      root.style.setProperty("--pointer-y", "0px");
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("blur", blur);
    media.addEventListener("change", sync);
    return () => {
      cancelled = true;
      observer.disconnect();
      context?.revert();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("blur", blur);
      media.removeEventListener("change", sync);
    };
  }, [image, original, paused]);

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (paused || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`);
  }
  function resetPointer() {
    ref.current?.style.setProperty("--pointer-x", "0px");
    ref.current?.style.setProperty("--pointer-y", "0px");
  }

  return (
    <div ref={ref} className={`workflow-scene ${hero ? "workflow-scene--hero" : ""}`} data-kind={kind} data-paused={paused} onPointerMove={movePointer} onPointerLeave={resetPointer} onBlur={resetPointer}>
      <div className="workflow-scene__toolbar">
        <span className="workflow-scene__brand"><Image src="/revamp-web-cekat/assets/logo-mark.svg" alt="" width={22} height={22} /> <span className="workflow-scene__brand-name">Cekat.AI</span></span>
        <div className="workflow-scene__controls">
          <button type="button" aria-pressed={original} onClick={() => setOriginal(!original)} className="workflow-scene__mode">
            <Icon icon={sceneLayers} aria-hidden />
            {original ? (isId ? "Visual interaktif" : "Interactive view") : kind === "coverage" ? (isId ? "Gambar asli" : "Original artwork") : (isId ? "Gambar produk" : "Product image")}
          </button>
          <button type="button" className="workflow-scene__pause" aria-label={paused ? (isId ? "Putar animasi" : "Play animation") : (isId ? "Jeda animasi" : "Pause animation")} aria-pressed={paused} onClick={() => { resetPointer(); setPaused(!paused); }}>
            <Icon icon={paused ? scenePlay : scenePause} aria-hidden />
          </button>
        </div>
      </div>

      <div className="workflow-scene__canvas" data-original={original}>
        {kind === "coverage" && !original ? <CoverageScene imageAlt={imageAlt} isId={isId} /> : kind === "channels" && !original ? (
          <div className="channel-map" data-scene-layer>
            <div className="channel-map__routes" aria-hidden><i /><i /><i /></div>
            <div className="channel-map__core" data-scene-float>
              <Image src="/revamp-web-cekat/assets/logo-mark.svg" alt="" width={64} height={64} />
              <span>Cekat.AI</span>
            </div>
            {CHANNELS.map((item, i) => (
              <button key={item.id} type="button" className={`channel-map__node channel-map__node--${item.id}`} style={{ "--channel-color": item.color } as CSSProperties} aria-pressed={channel === i} onClick={() => setChannel(i)}>
                <Image src={`/revamp-web-cekat/assets/integrations/${item.id}.svg`} alt="" width={34} height={34} />
                <span>{item.label}</span>
              </button>
            ))}
            <div className="channel-map__connection" role="status" aria-live="polite" style={{ "--channel-color": activeChannel.color } as CSSProperties}>
              <Image src={`/revamp-web-cekat/assets/integrations/${activeChannel.id}.svg`} alt="" width={22} height={22} />
              <span>{activeChannel.label}</span><span aria-hidden>→</span><strong>Cekat.AI</strong>
            </div>
          </div>
        ) : (
          <div className="workflow-scene__composition" data-scene-layer>
            {!original && <div className="workflow-scene__backplate" aria-hidden />}
            <div className="workflow-scene__art" data-scene-float>
              <Image src={original ? image : sceneArtwork(image)} alt={imageAlt} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 640px" loading={hero ? "eager" : "lazy"} className="object-contain" />
            </div>
            {!original && <div className="workflow-scene__product-token" aria-hidden><Icon icon={sceneBolt} /><span>{kind === "pipeline" ? "CRM" : kind === "insights" ? "Marketing" : kind === "automation" ? "Automation" : kind === "intelligence" ? "AI Agent" : "Cekat Chat"}</span></div>}
          </div>
        )}
      </div>

      <div className="workflow-scene__footer" data-scene-layer>
        <span className="workflow-scene__step">{String(index + 1).padStart(2, "0")}{count && <span> / {String(count).padStart(2, "0")}</span>}</span>
        <p>{title ?? imageAlt}</p>
        <span aria-hidden className="workflow-scene__status"><i /><i /><i /></span>
      </div>
    </div>
  );
}
