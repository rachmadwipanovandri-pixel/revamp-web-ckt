"use client";

import { Ico } from "./Icon";
import { ProductSurface, text } from "./ProductSurface";
import { solar_check_circle_bold } from "./icons";
import { Action, Eyebrow, Section, SectionHead, Shell } from "./ui";
import { useEffect, useRef, useState } from "react";
import type { Copy4 } from "./content-types";

type UseCaseItem = Copy4["useCases"]["items"][number];

/*
 * Scroll to a panel through Lenis when it owns the page, so the glide eases
 * instead of jumping. Falls back to native smooth scrolling (or an instant
 * jump under reduced motion) wherever the motion layer never booted.
 */
function scrollToPanel(el: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const win = window as unknown as {
    __ph4Lenis?: {
      scrollTo(target: HTMLElement, opts?: { offset?: number }): void;
    };
    __ph5Lenis?: {
      scrollTo(target: HTMLElement, opts?: { offset?: number }): void;
    };
  };
  const lenis = win.__ph5Lenis ?? win.__ph4Lenis;
  if (lenis && !reduced) {
    // The sticky nav is ~88px; the offset parks the panel just beneath it.
    lenis.scrollTo(el, { offset: -104 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}

function UseCasePanel({
  item,
  index,
  en,
  ref,
}: {
  item: UseCaseItem;
  index: number;
  en: boolean;
  ref: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={ref}
      id={`ph4-uc-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`ph4-uc-tab-${index}`}
      tabIndex={0}
      data-ph4-drift={true}
      className="flex scroll-mt-28 flex-col gap-12 rounded-[var(--ph4-r-md)] border border-[var(--ph4-line)] bg-[var(--ph4-surface)] p-4 sm:p-6"
    >
      <ProductSurface
        surface={item.surface}
        url={text(item.path, en)}
        en={en}
      />
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="ph4-display text-[clamp(1.25rem,2.2vw,1.65rem)] text-[var(--ph4-ink)]">
            {text(item.title, en)}
          </h3>
          <p className="max-w-[40rem] text-[0.9375rem] leading-[1.6] text-[var(--ph4-muted)]">
            {text(item.body, en)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow>{text(item.figureLabel, en)}</Eyebrow>
          <span
            data-ph4-count={text(item.figure, en)}
            className="ph4-display ph4-num text-[clamp(2.25rem,4.4vw,3.25rem)] text-[var(--ph4-accent)]"
          >
            {text(item.figure, en)}
          </span>
        </div>
      </div>
      <ul className="grid gap-2 border-t border-[var(--ph4-line)] pt-4 sm:grid-cols-3">
        {item.points.map((point) => (
          <li
            key={text(point, en)}
            className="flex items-start gap-2 text-[0.8125rem] leading-[1.5] text-[var(--ph4-muted-2)]"
          >
            <Ico
              icon={solar_check_circle_bold}
              size={14}
              className="mt-px shrink-0 text-[var(--ph4-accent)]"
            />
            {text(point, en)}
          </li>
        ))}
      </ul>
      <div className="border-t border-[var(--ph4-line)] pt-4">
        <Action href="/contact-sales" variant="outline" arrow={true}>
          {en ? "Talk to sales" : "Hubungi tim sales"}
        </Action>
      </div>
    </div>
  );
}

export function UseCases({
  copy,
  locale,
}: {
  copy: Copy4["useCases"];
  locale: string;
}) {
  const en = locale === "en";
  const [active, setActive] = useState(0);
  const panelsRef = useRef<Array<HTMLElement | null>>([]);
  // Owned by a click glide until it lands — panels crossed mid-scroll must
  // not flicker the rail highlight on the way past.
  const lockRef = useRef(false);

  // Scroll-spy: the panel crossing the viewport middle owns the rail.
  useEffect(() => {
    const panels = panelsRef.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!panels.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = panels.indexOf(entry.target as HTMLElement);
          if (index !== -1)
            setActive((prev) => (prev === index ? prev : index));
        }
      },
      // A band around the viewport middle, so exactly one panel owns it.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const panel of panels) observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const count = copy.items.length;
    const next = (index + count) % count;
    setActive(next);
    const el = panelsRef.current[next];
    if (!el) return;
    lockRef.current = true;
    window.setTimeout(() => {
      lockRef.current = false;
      // Re-sync in case the reader grabbed the wheel mid-glide: an already
      // intersecting panel fires no new edge, so the rail would stick stale.
      const mid = window.innerHeight / 2;
      const panels = panelsRef.current;
      const at = panels.findIndex((panel) => {
        if (!panel) return false;
        const rect = panel.getBoundingClientRect();
        return rect.top <= mid && rect.bottom >= mid;
      });
      if (at !== -1) setActive((prev) => (prev === at ? prev : at));
    }, 1200);
    scrollToPanel(el);
  };

  return (
    <Section
      id="use-cases"
      tone="paper"
      rule={true}
      labelledBy="ph4-usecases-title"
      className="scroll-mt-24"
    >
      <Shell>
        <SectionHead
          id="ph4-usecases-title"
          index="02"
          eyebrow={text(copy.eyebrow, en)}
          title={copy.heading}
          accent={copy.accent}
          body={text(copy.body, en)}
        />
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12">
          {/* Rail — compact horizontal on mobile, sticky vertical on desktop.
              Light background, hairline separators, no dark console block. */}
          <div
            role="tablist"
            aria-label={en ? "Use cases" : "Kasus penggunaan"}
            aria-orientation="vertical"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault();
                goTo(active + 1);
              } else if (
                event.key === "ArrowUp" ||
                event.key === "ArrowLeft"
              ) {
                event.preventDefault();
                goTo(active - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                goTo(0);
              } else if (event.key === "End") {
                event.preventDefault();
                goTo(copy.items.length - 1);
              }
            }}
            className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:gap-0 lg:self-start lg:overflow-visible lg:pb-0"
          >
            {copy.items.map((entry, index) => (
              <button
                key={entry.key.id}
                type="button"
                role="tab"
                id={`ph4-uc-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`ph4-uc-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => goTo(index)}
                className={`flex shrink-0 items-center gap-3 rounded-[var(--ph4-r)] border px-4 py-3 text-left transition-colors lg:border-0 lg:px-4 lg:py-3.5 ${
                  active === index
                    ? "border-[var(--ph4-accent-line)] bg-[var(--ph4-accent-tint)]"
                    : "border-transparent hover:bg-[var(--ph4-surface)]"
                }`}
              >
                <span
                  className={`ph4-mono text-[0.625rem] ${
                    active === index
                      ? "text-[var(--ph4-accent)]"
                      : "text-[var(--ph4-muted-3)]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[0.9375rem] font-medium ${
                      active === index
                        ? "text-[var(--ph4-ink)]"
                        : "text-[var(--ph4-muted)]"
                    }`}
                  >
                    {text(entry.key, en)}
                  </span>
                  <span className="ph4-mono mt-0.5 block text-[0.5625rem] text-[var(--ph4-muted-3)]">
                    {text(entry.rail, en)}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {/* Panels — one per situation, stacked. The rail parks under the nav
              while these travel past; the one crossing the viewport middle
              owns the rail above. */}
          <div className="flex flex-col gap-8 lg:gap-12">
            {copy.items.map((entry, index) => (
              <UseCasePanel
                key={entry.key.id}
                item={entry}
                index={index}
                en={en}
                ref={(el) => {
                  panelsRef.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      </Shell>
    </Section>
  );
}
