"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  GraduationCap,
  Plane,
  ShoppingBag,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "next-intl";
import {
  HERO_CHAT_MODES,
  HERO_CHAT_SCENARIOS,
  HERO_CHAT_UI,
  type ChatModeKey,
  type ChatScenario,
  type ChatStep,
} from "@/lib/hero-chat";
import { cn } from "@/lib/utils";

const SCENARIO_ICONS: Record<ChatScenario["key"], LucideIcon> = {
  retail: ShoppingBag,
  travel: Plane,
  healthcare: Stethoscope,
  education: GraduationCap,
};

/** How long the finished conversation holds before replaying. */
const LOOP_HOLD_MS = 5000;

/** Compact player for every step kind in the shared scenario catalog. */
type VisibleStep = {
  key: string;
  kind: ChatStep["kind"];
  side: "user" | "ai" | "system";
  title?: string;
  text?: string;
  meta?: string;
  time?: string;
  accent?: boolean;
};

function flattenStep(step: ChatStep, locale: "id" | "en", index: number): VisibleStep {
  const id = `s${index}`;
  if (step.kind === "user" || step.kind === "ai") {
    return {
      key: `${id}-${step.kind}`,
      kind: step.kind,
      side: step.kind === "user" ? "user" : "ai",
      text: step.text[locale],
      time: step.time,
    };
  }
  if (step.kind === "chip") {
    return {
      key: `${id}-chip`,
      kind: "chip",
      side: "system",
      text: step.text[locale],
      accent: step.accent,
      time: step.time,
    };
  }
  if (step.kind === "divider") {
    return {
      key: `${id}-div`,
      kind: "divider",
      side: "system",
      text: step.text[locale],
      meta: step.date?.[locale],
    };
  }
  if (step.kind === "product") {
    return {
      key: `${id}-prod`,
      kind: "product",
      side: "ai",
      title: step.product.title[locale],
      meta: step.product.price[locale],
      time: step.time,
    };
  }
  if (step.kind === "card") {
    const total = step.card.total
      ? `${step.card.total.label[locale]} ${step.card.total.value[locale]}`
      : step.card.meta[locale];
    return {
      key: `${id}-card`,
      kind: "card",
      side: "ai",
      title: step.card.title[locale],
      text: step.card.meta[locale],
      meta: step.card.status
        ? `${step.card.status[locale]} · ${total}`
        : total,
      time: step.time,
    };
  }
  // rating
  return {
    key: `${id}-rate`,
    kind: "rating",
    side: "ai",
    title: step.rating.title[locale],
    text: step.rating.prompt[locale],
    meta: step.rating.options.map((o) => o[locale]).join(" · "),
    time: step.time,
  };
}

function stepDelay(step: ChatStep): number {
  if (step.kind === "divider") return 1200;
  return Math.min(3200, Math.max(1400, step.delay));
}

/**
 * Full WhatsApp thread for one industry + conversation mode. Plays every
 * step from `HERO_CHAT_SCENARIOS` (bubbles, products, cards, chips, ratings,
 * time skips) and auto-scrolls like the production hero demo.
 *
 * `onOrderPlaced` fires once when an invoice/card or sale chip lands, so the
 * OMS + Analytics panels can fill in the same beat the customer orders.
 */
export function CollagePhoneChat({
  onOrderPlaced,
  onProgress,
}: {
  onOrderPlaced?: () => void;
  /** Fires on every cursor change + loop restart so sibling panels can sync. */
  onProgress?: (info: {
    cursor: number;
    total: number;
    scenario: ChatScenario["key"];
    mode: ChatModeKey;
    loop: number;
  }) => void;
}) {
  const locale = useLocale() === "en" ? "en" : "id";
  const [scenarioKey, setScenarioKey] = useState<ChatScenario["key"]>("retail");
  const [modeKey, setModeKey] = useState<ChatModeKey>("lead");
  const [cursor, setCursor] = useState(0);
  const [playbackKey, setPlaybackKey] = useState({ scenarioKey, modeKey });
  const loopRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const orderNotified = useRef(false);

  const scenario = useMemo(
    () =>
      HERO_CHAT_SCENARIOS.find((s) => s.key === scenarioKey) ??
      HERO_CHAT_SCENARIOS[0],
    [scenarioKey],
  );
  const mode = scenario.modes[modeKey];
  const steps = mode.steps;
  const visibleSteps = useMemo(
    () =>
      steps
        .slice(0, cursor)
        .map((s, i) => flattenStep(s, locale, i)),
    [steps, cursor, locale],
  );

  // Reset during render when the script restarts — avoids setState-in-effect.
  if (
    playbackKey.scenarioKey !== scenarioKey ||
    playbackKey.modeKey !== modeKey
  ) {
    setPlaybackKey({ scenarioKey, modeKey });
    setCursor(0);
  }

  // Player: advance through the full script, hold, then replay.
  // Every cursor bump notifies parent so CRM / OMS / Agent track the same beat.
  useEffect(() => {
    orderNotified.current = false;
    let cancelled = false;
    let timer = 0;
    let i = 0;

    const emit = (c: number, lap: number) => {
      onProgress?.({
        cursor: c,
        total: steps.length,
        scenario: scenarioKey,
        mode: modeKey,
        loop: lap,
      });
    };

    emit(0, loopRef.current);

    const tick = () => {
      if (cancelled) return;
      if (i >= steps.length) {
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setCursor(0);
          orderNotified.current = false;
          i = 0;
          loopRef.current += 1;
          emit(0, loopRef.current);
          timer = window.setTimeout(tick, 400);
        }, LOOP_HOLD_MS);
        return;
      }
      i += 1;
      setCursor(i);
      emit(i, loopRef.current);
      const landed = steps[i - 1]!;
      // Order moment: invoice card, sale-attribute chip, or explicit confirm.
      const looksLikeOrder =
        landed.kind === "card" ||
        (landed.kind === "chip" && landed.accent) ||
        (landed.kind === "user" &&
          /confirm|bayar|pesan|order|daftar sekarang/i.test(
            landed.text.en + " " + landed.text.id,
          ));
      if (!orderNotified.current && looksLikeOrder) {
        orderNotified.current = true;
        onOrderPlaced?.();
      }
      timer = window.setTimeout(tick, stepDelay(landed));
    };

    timer = window.setTimeout(tick, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [steps, scenarioKey, modeKey, onOrderPlaced, onProgress]);

  // Keep the latest bubbles in view as the thread grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [cursor]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Phone hardware chrome */}
      <div
        aria-hidden
        className="relative shrink-0 border-b border-white/8 bg-[#0a1628]/80 px-[calc(var(--u)*10)] pb-[calc(var(--u)*4)] pt-[calc(var(--u)*10)]"
      >
        <div className="mx-auto mb-[calc(var(--u)*4)] h-[calc(var(--u)*6)] w-[calc(var(--u)*42)] rounded-full bg-black/80" />
        <div className="flex items-center gap-[calc(var(--u)*3)] text-[calc(var(--u)*6)] text-white/50">
          <span>9:41</span>
          <span className="ml-auto">▮▮▮ ᯤ ▰</span>
        </div>
      </div>
      <div className="flex items-center gap-[calc(var(--u)*6)] border-b border-white/8 px-[calc(var(--u)*8)] py-[calc(var(--u)*5)]">
        <span className="size-[calc(var(--u)*12)] shrink-0 rounded-full bg-[#25D366]" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[calc(var(--u)*9)] leading-tight font-semibold text-white">
            {mode.business}
          </div>
          <div className="text-[calc(var(--u)*7)] text-white/45">
            {HERO_CHAT_UI.online[locale]}
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label={locale === "id" ? "Industri" : "Industry"}
        className="flex shrink-0 items-center justify-between gap-[calc(var(--u)*4)] border-b border-white/6 bg-white/4 px-[calc(var(--u)*8)] py-[calc(var(--u)*5)]"
      >
        {HERO_CHAT_SCENARIOS.map((entry) => {
          const Icon = SCENARIO_ICONS[entry.key];
          const active = entry.key === scenarioKey;
          return (
            <button
              key={entry.key}
              type="button"
              aria-label={entry.label[locale]}
              aria-pressed={active}
              title={entry.label[locale]}
              onClick={() => {
                setScenarioKey(entry.key);
                setCursor(0);
                orderNotified.current = false;
                loopRef.current += 1;
                onProgress?.({
                  cursor: 0,
                  total: steps.length,
                  scenario: entry.key,
                  mode: modeKey,
                  loop: loopRef.current,
                });
              }}
              className={cn(
                "grid size-[calc(var(--u)*22)] shrink-0 cursor-pointer place-items-center rounded-[calc(var(--u)*6)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                active
                  ? "bg-linear-to-b from-cyan-300 to-[#2563eb] text-white shadow-[0_4px_14px_-4px_rgba(34,211,238,0.7)]"
                  : "bg-white/10 text-sky-100/70 hover:bg-white/18 hover:text-white",
              )}
            >
              <Icon
                aria-hidden
                className="size-[calc(var(--u)*12)]"
                strokeWidth={2.2}
              />
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Conversation type"
        data-conversation-mode-tabs="collage"
        className="flex shrink-0 items-center gap-[calc(var(--u)*4)] border-b border-white/6 px-[calc(var(--u)*8)] py-[calc(var(--u)*4)]"
      >
        {HERO_CHAT_MODES.map((entry) => {
          const active = entry.key === modeKey;
          return (
            <button
              key={entry.key}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setModeKey(entry.key);
                setCursor(0);
                orderNotified.current = false;
                loopRef.current += 1;
                onProgress?.({
                  cursor: 0,
                  total: steps.length,
                  scenario: scenarioKey,
                  mode: entry.key,
                  loop: loopRef.current,
                });
              }}
              className={cn(
                "min-h-[calc(var(--u)*18)] flex-1 cursor-pointer rounded-[calc(var(--u)*6)] px-[calc(var(--u)*4)] py-[calc(var(--u)*3)] text-[calc(var(--u)*7.5)] font-semibold whitespace-nowrap transition-colors duration-300",
                active
                  ? "bg-linear-to-r from-[#2563eb] to-cyan-500 text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.65)]"
                  : "bg-white/10 text-sky-100/70 hover:bg-white/18 hover:text-white",
              )}
            >
              {entry.label[locale]}
            </button>
          );
        })}
      </div>

      {/* Full scripted thread — scrolls as the player advances. */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-[calc(var(--u)*5)] overflow-y-auto px-[calc(var(--u)*8)] py-[calc(var(--u)*6)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        <div className="mx-auto rounded-full bg-white/8 px-[calc(var(--u)*6)] py-[calc(var(--u)*1.5)] text-[calc(var(--u)*6.5)] text-white/45">
          {mode.date[locale]}
        </div>

        {visibleSteps.map((row) => {
          if (row.kind === "divider") {
            return (
              <div
                key={row.key}
                className="hero-collage-msg my-[calc(var(--u)*2)] flex flex-col items-center gap-[calc(var(--u)*1)]"
              >
                <span className="rounded-full bg-white/8 px-[calc(var(--u)*6)] py-[calc(var(--u)*1.5)] text-[calc(var(--u)*6.5)] text-white/50">
                  {row.text}
                </span>
                {row.meta ? (
                  <span className="text-[calc(var(--u)*6)] text-white/30">
                    {row.meta}
                  </span>
                ) : null}
              </div>
            );
          }

          if (row.kind === "chip") {
            return (
              <div
                key={row.key}
                className={cn(
                  "hero-collage-msg rounded-[calc(var(--u)*7)] border px-[calc(var(--u)*6)] py-[calc(var(--u)*3)] text-[calc(var(--u)*7)] leading-snug",
                  row.accent
                    ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-50"
                    : "border-indigo-300/25 bg-indigo-400/12 text-indigo-50/85",
                )}
              >
                <span className="mr-[calc(var(--u)*3)] opacity-70">
                  {HERO_CHAT_UI.system[locale]}
                </span>
                {row.text}
              </div>
            );
          }

          const isUser = row.side === "user";
          return (
            <div
              key={row.key}
              className={cn(
                "hero-collage-msg max-w-[95%]",
                isUser ? "self-end" : "self-start",
              )}
            >
              {row.kind === "product" ? (
                <div className="rounded-[calc(var(--u)*9)] rounded-tl-[calc(var(--u)*2)] border border-amber-200/25 bg-amber-300/12 px-[calc(var(--u)*6)] py-[calc(var(--u)*4)]">
                  <div className="text-[calc(var(--u)*8)] font-semibold text-amber-50">
                    {row.title}
                  </div>
                  <div className="text-[calc(var(--u)*8)] text-amber-200">
                    {row.meta}
                  </div>
                </div>
              ) : row.kind === "card" ? (
                <div className="rounded-[calc(var(--u)*9)] rounded-tl-[calc(var(--u)*2)] border border-emerald-200/25 bg-emerald-300/12 px-[calc(var(--u)*6)] py-[calc(var(--u)*4)]">
                  <div className="text-[calc(var(--u)*8)] font-semibold text-white">
                    {row.title}
                  </div>
                  {row.text ? (
                    <div className="mt-[calc(var(--u)*1)] text-[calc(var(--u)*7)] text-sky-100/75">
                      {row.text}
                    </div>
                  ) : null}
                  <div className="mt-[calc(var(--u)*2)] text-[calc(var(--u)*7)] font-medium text-emerald-300">
                    {row.meta}
                  </div>
                </div>
              ) : row.kind === "rating" ? (
                <div className="rounded-[calc(var(--u)*9)] rounded-tl-[calc(var(--u)*2)] border border-white/12 bg-white/12 px-[calc(var(--u)*6)] py-[calc(var(--u)*4)]">
                  <div className="text-[calc(var(--u)*8)] font-semibold text-white">
                    {row.title}
                  </div>
                  <div className="mt-[calc(var(--u)*1)] text-[calc(var(--u)*7.5)] text-white/85">
                    {row.text}
                  </div>
                  <div className="mt-[calc(var(--u)*2)] text-[calc(var(--u)*6.5)] text-white/50">
                    {row.meta}
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-[calc(var(--u)*8)] px-[calc(var(--u)*6)] py-[calc(var(--u)*4)] text-[calc(var(--u)*8.5)] leading-snug",
                    isUser
                      ? "rounded-tr-[calc(var(--u)*2)] bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_4px_12px_-4px_rgba(37,99,235,0.55)]"
                      : "rounded-tl-[calc(var(--u)*2)] bg-white/16 text-white",
                  )}
                >
                  {row.text}
                </div>
              )}
              {row.time ? (
                <div
                  className={cn(
                    "mt-[calc(var(--u)*1)] text-[calc(var(--u)*6)] text-white/35",
                    isUser ? "text-right" : "",
                  )}
                >
                  {row.time}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-auto mb-[calc(var(--u)*5)] mx-[calc(var(--u)*7)] flex shrink-0 items-center gap-[calc(var(--u)*5)] rounded-full bg-white/8 px-[calc(var(--u)*6)] py-[calc(var(--u)*3)]">
        <span className="size-[calc(var(--u)*5)] shrink-0 animate-pulse rounded-full bg-[#25D366]" />
        <span className="truncate text-[calc(var(--u)*7)] text-white/55">
          {HERO_CHAT_UI.inputPlaceholder[locale]}
        </span>
      </div>
    </div>
  );
}
