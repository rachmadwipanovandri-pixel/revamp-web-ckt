"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  ArrowUp,
  BadgeCheck,
  BatteryFull,
  ChevronLeft,
  EllipsisVertical,
  GraduationCap,
  Phone,
  Plane,
  ShoppingBag,
  Signal,
  Stethoscope,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";
import {
  HERO_CHAT_MODES,
  HERO_CHAT_SCENARIOS,
  HERO_CHAT_UI,
  type ChatCard,
  type ChatMode,
  type ChatModeKey,
  type ChatProduct,
  type ChatRating,
  type ChatScenario,
  type ChatStep,
} from "@/lib/hero-chat";
import { WhatsAppAnchor } from "@/components/shared/whatsapp-anchor";
import { useInViewport } from "@/hooks/use-in-viewport";
import { cn } from "@/lib/utils";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getReducedMotionOnServer = () => false;

/**
 * WhatsApp's own chat ground. Deliberately unbranded and hardcoded: the whole
 * point of the frame is "this is the customer's WhatsApp", so the canvas has
 * to be the beige every Indonesian recognises, not a token from our palette.
 */
const WA_CANVAS = "#ece5dd";

/** How long the finished conversation holds before the loop starts over. The
 *  closing frame is the payoff (the customer saying yes, the attribution
 *  chip), so it gets a long beat, not a blink. */
const LOOP_HOLD_MS = 8000;

/** How long each device form holds before morphing (light stage only). */
const DEVICE_MORPH_MS = 7500;

type DeviceForm = "tablet" | "iphone";

function textReadingPause(text: string, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, 1100 + text.length * 12));
}

/** The player waits long enough for the bubble currently on screen to be
 * read, even when the next scripted event is short. This keeps large AI
 * replies legible without making short messages feel sluggish. */
function readingPause(step: ChatStep, locale: Locale) {
  if (step.kind === "user") {
    return textReadingPause(step.text[locale], 1700, 2800);
  }
  if (step.kind === "ai") {
    return textReadingPause(step.text[locale], 2000, 4200);
  }
  if (step.kind === "chip") {
    return textReadingPause(step.text[locale], 1700, 2600);
  }
  if (step.kind === "divider") return 1400;
  return 2200;
}

/**
 * Renders a stored "HH:MM" the way each locale writes clock time: Indonesian
 * keeps 24 hours with a dot separator (14.32), English goes to 12 hours with a
 * meridiem (2:32 PM). Hand-formatted rather than via Intl on a constructed
 * Date, so the output cannot shift with the runtime's locale data or timezone
 * and server and client always agree.
 */
function formatTime(time: string, locale: Locale) {
  const [hours, minutes] = time.split(":");
  if (locale === "id") return `${hours}.${minutes}`;
  const hour = Number(hours);
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${minutes} ${hour < 12 ? "AM" : "PM"}`;
}

const SCENARIO_ICONS: Record<ChatScenario["key"], LucideIcon> = {
  retail: ShoppingBag,
  travel: Plane,
  healthcare: Stethoscope,
  education: GraduationCap,
};

/**
 * The hero visual: a phone (ink stage) or tablet (light stage) playing a
 * scripted WhatsApp conversation for the picked vertical, one message at a
 * time, seen from the customer's side. The business speaks in brand blue and
 * every reply is attributed to Cekat.AI. Industry tabs select the scenario;
 * the conversation mode switcher sits inside the screen.
 *
 * The ink stage is an **iPhone Duo fold** (CSS cover/rear from globals.css):
 * a compact device that opens every 8.6s so the desktop hero never clips a
 * tall static phone. The light stage keeps the timed tablet↔iPhone morph.
 * Reduced motion opts out of both and shows the conversation at rest.
 */
export function HeroChatDemo({
  className,
  stage = "light",
}: {
  className?: string;
  /** Visual stage the demo sits on — ink (dark hero) vs light (sky hero). */
  stage?: "light" | "ink";
}) {
  const locale = useLocale() as Locale;
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
  const isInk = stage === "ink";
  const [scenarioKey, setScenarioKey] = useState<ChatScenario["key"]>("retail");
  const [modeKey, setModeKey] = useState<ChatModeKey>("lead");
  const [device, setDevice] = useState<DeviceForm>("tablet");
  const [morphPaused, setMorphPaused] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(demoRef, 0.25);
  const scenario =
    HERO_CHAT_SCENARIOS.find((entry) => entry.key === scenarioKey) ??
    HERO_CHAT_SCENARIOS[0];
  const mode = scenario.modes[modeKey];
  const ScenarioIcon = SCENARIO_ICONS[scenario.key];
  // Ink stage is locked to the phone form; light stage morphs.
  const isPhone = isInk || device === "iphone";

  // Timed discrete auto-loop only on the light production hero.
  useEffect(() => {
    if (isInk || reducedMotion || morphPaused || !inView) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
    ) {
      return;
    }
    const timer = setTimeout(() => {
      setDevice((current) => (current === "tablet" ? "iphone" : "tablet"));
    }, DEVICE_MORPH_MS);
    return () => clearTimeout(timer);
  }, [device, reducedMotion, morphPaused, inView, isInk]);

  // The opening step is always the customer's first message; its timestamp
  // doubles as the status-bar clock so the device agrees with its own thread.
  const firstStep = mode.steps[0];
  const statusTime = firstStep.kind === "user" ? firstStep.time : "09:00";

  return (
    <div
      ref={demoRef}
      role="group"
      aria-label={HERO_CHAT_UI.demoLabel[locale]}
      onMouseEnter={() => setMorphPaused(true)}
      onMouseLeave={() => setMorphPaused(false)}
      onFocus={() => setMorphPaused(true)}
      onBlur={() => setMorphPaused(false)}
      className={cn(
        "relative flex flex-col items-center lg:flex-row lg:items-center lg:justify-center lg:gap-4",
        className,
      )}
    >
      <IndustryTabs
        locale={locale}
        onScenarioChange={setScenarioKey}
        scenarioKey={scenario.key}
        stage={stage}
      />

      <div className="min-w-0">
        <div
          style={{
            perspective: "1400px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div
            data-ipad-frame="true"
            data-device-form={isInk ? "iphone" : device}
            data-mobile-device={isPhone ? "iphone" : "tablet"}
            className={cn(
              // Match production mobile size on cekat.ai: fixed 600×~330 phone frame.
              "relative isolate mx-auto flex h-[600px] w-full max-w-[330px] flex-col overflow-hidden bg-gradient-to-br from-slate-700 via-foreground to-slate-950 p-2.5 shadow-2xl ring-1 ring-black/10 rounded-[2.5rem] transition-[width,max-width,height,border-radius,padding] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none will-change-[width,height,border-radius]",
              isPhone
                ? "sm:aspect-auto sm:h-[600px] sm:w-[330px] sm:max-w-[330px] sm:rounded-[2.75rem] lg:mx-0"
                : "sm:aspect-4.5/4 sm:h-auto sm:w-full sm:max-w-none sm:rounded-[2.25rem] lg:mx-0 lg:max-w-145",
            )}
          >
            <span
              aria-hidden
              data-phone-hardware="island"
              className={cn(
                "pointer-events-none absolute top-2.5 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground ring-1 ring-white/10 transition-opacity duration-500",
                isPhone ? "opacity-100" : "opacity-0",
              )}
            />
            <span
              aria-hidden
              data-ipad-hardware="camera"
              className={cn(
                "pointer-events-none absolute top-1.5 left-1/2 z-20 size-1.5 -translate-x-1/2 rounded-full bg-foreground/70 ring-1 ring-white/15 transition-opacity duration-500",
                isPhone ? "opacity-0" : "opacity-100",
              )}
            />
            <div
              className={cn(
                "relative flex h-full flex-col overflow-hidden bg-slate-950 p-2 transition-[border-radius] duration-500",
                isPhone ? "rounded-[2rem]" : "rounded-[1.75rem]",
              )}
            >
              <div
                className={cn(
                  "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white text-left transition-[border-radius] duration-500",
                  isPhone ? "rounded-[1.55rem]" : "rounded-[1.4rem]",
                )}
              >
                {/* Status bar and conversation header share WhatsApp's one blue
              block; ours is simply brand blue. The clock is the script's own
              opening timestamp, and the call/menu glyphs are set dressing,
              not controls. */}
                <div
                  data-whatsapp-header="true"
                  className="relative shrink-0 bg-primary px-4 pt-2.5 pb-3 text-primary-foreground"
                >
                  <div className="flex items-center justify-between font-numeric text-[11px] font-semibold tabular-nums">
                    <span>{formatTime(statusTime, locale)}</span>
                    <span aria-hidden className="flex items-center gap-1">
                      <Signal className="size-3" />
                      <Wifi className="size-3" />
                      <BatteryFull className="size-3.5" />
                    </span>
                  </div>
                  <div
                    data-whatsapp-action-row="true"
                    className="mt-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <ChevronLeft
                        aria-hidden
                        className="-ml-1.5 size-4 shrink-0 text-primary-foreground/90"
                      />
                      <span
                        aria-hidden
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15"
                      >
                        <ScenarioIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 text-sm leading-tight font-semibold">
                          <span className="truncate">{mode.business}</span>
                          <BadgeCheck
                            aria-hidden
                            className="size-3.5 shrink-0"
                          />
                          <span className="sr-only">
                            {HERO_CHAT_UI.verified[locale]}
                          </span>
                        </p>
                        <p className="mt-0.5 text-[11px] leading-tight text-primary-foreground-muted">
                          {HERO_CHAT_UI.online[locale]}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <ConversationModeTabs
                        variant="desktop"
                        modeKey={modeKey}
                        onModeChange={setModeKey}
                        locale={locale}
                        isPhone={isPhone}
                        className={isPhone ? "sm:w-0" : "sm:w-auto"}
                      />
                      <span
                        aria-hidden
                        className="flex shrink-0 items-center gap-3 text-primary-foreground/90"
                      >
                        <Phone className="size-4" />
                        <EllipsisVertical className="size-4" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stacked mode row expands/collapses via grid-rows so the header
                and thread reflow with the morph instead of snapping. */}
                <div
                  data-mode-tabs-shell="mobile"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isPhone
                      ? "grid-rows-[1fr]"
                      : "max-sm:grid-rows-[1fr] sm:grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <ConversationModeTabs
                      variant="mobile"
                      modeKey={modeKey}
                      onModeChange={setModeKey}
                      locale={locale}
                      isPhone={isPhone}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Keyed so either picker remounts the thread and the playback state
              resets on its own instead of by hand. */}
                <ChatThread
                  key={`${scenario.key}-${modeKey}`}
                  mode={mode}
                  locale={locale}
                  reducedMotion={reducedMotion}
                />

                <div className="shrink-0 border-t border-border bg-white p-3">
                  <WhatsAppAnchor
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={HERO_CHAT_UI.inputLabel[locale]}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-full border border-border bg-surface-muted py-1.5 pr-1.5 pl-4 transition-colors hover:border-primary/40"
                  >
                    <span className="truncate text-sm text-subtle-foreground">
                      {HERO_CHAT_UI.inputPlaceholder[locale]}
                    </span>
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                    >
                      <ArrowUp className="size-4" />
                    </span>
                  </WhatsAppAnchor>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndustryTabs({
  locale,
  onScenarioChange,
  scenarioKey,
  stage = "light",
}: {
  locale: Locale;
  onScenarioChange: (scenarioKey: ChatScenario["key"]) => void;
  scenarioKey: ChatScenario["key"];
  stage?: "light" | "ink";
}) {
  const isInk = stage === "ink";
  return (
    <div
      role="group"
      aria-label="Industry"
      data-industry-tabs="true"
      className={cn(
        "flex shrink-0 justify-center px-1",
        // Side dock on lg for both stages (matches the staged product shot).
        "mb-3 lg:order-2 lg:mb-0",
      )}
    >
      <div
        className={cn(
          "relative z-20 flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5 backdrop-blur-md lg:flex-col lg:gap-1.5",
          "transition-all duration-500",
          isInk
            ? "border border-white/12 bg-white/8 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.7)]"
            : "border border-white/80 bg-white/75 shadow-md",
        )}
      >
        {HERO_CHAT_SCENARIOS.map((entry) => {
          const IndustryIcon = SCENARIO_ICONS[entry.key];
          const active = entry.key === scenarioKey;
          return (
            <button
              key={entry.key}
              type="button"
              aria-label={entry.label[locale]}
              aria-pressed={active}
              data-industry-tab={entry.key}
              onClick={() => onScenarioChange(entry.key)}
              className={cn(
                "group relative inline-flex min-h-9 cursor-pointer items-center justify-center rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:outline-none",
                // Ink dock: compact icon chips only — no reserved label space
                isInk && "size-10 p-0 lg:size-11",
                // Light dock: keeps inline caption below lg (production tests)
                !isInk && "gap-1.5 px-3 py-1.5 lg:size-11 lg:min-h-0 lg:p-0",
                active
                  ? isInk
                    ? "bg-linear-to-b from-sky-400 to-primary text-white shadow-[0_8px_18px_-8px_rgba(56,189,248,0.55)] ring-1 ring-white/20"
                    : "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_rgba(19,82,191,0.65)]"
                  : isInk
                    ? "bg-white/8 text-primary-foreground-muted hover:bg-white/16 hover:text-white"
                    : "bg-white/70 text-muted-foreground hover:bg-white hover:text-foreground",
                isInk &&
                  "focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                !isInk &&
                  "focus-visible:ring-primary focus-visible:ring-offset-2",
              )}
            >
              <IndustryIcon aria-hidden className="size-4 shrink-0" />
              {/* Label lives only in the floating tooltip — never inline in the dock */}
              <span
                role="tooltip"
                data-industry-tab-tooltip={entry.key}
                className={cn(
                  "text-xs font-semibold",
                  !isInk && "lg:hidden",
                  "pointer-events-none absolute top-1/2 left-full z-30 ml-2.5 -translate-y-1/2 translate-x-0 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-md transition-all duration-200",
                  isInk
                    ? "hidden bg-ink-panel text-white ring-1 ring-white/15 lg:block lg:translate-x-[-4px] lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100"
                    : "lg:absolute lg:block lg:bg-foreground lg:text-background lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100",
                  !isInk && "lg:pointer-events-none lg:left-full lg:ml-2.5",
                )}
              >
                {entry.label[locale]}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 right-full hidden -translate-y-1/2 border-4 border-transparent lg:block",
                    isInk ? "border-r-ink-panel" : "border-r-foreground",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConversationModeTabs({
  className,
  locale,
  modeKey,
  onModeChange,
  variant,
  isPhone,
}: {
  className?: string;
  locale: Locale;
  modeKey: ChatModeKey;
  onModeChange: (modeKey: ChatModeKey) => void;
  variant: "desktop" | "mobile";
  /** Phone hardware form: collapse header pills, reveal stacked tabs. */
  isPhone?: boolean;
}) {
  const isDesktop = variant === "desktop";
  return (
    <div
      role="group"
      aria-label="Conversation type"
      data-conversation-mode-tabs={variant}
      className={cn(
        isDesktop
          ? cn(
              "hidden items-center gap-1 overflow-hidden border-0 bg-transparent p-0 sm:flex",
              "transition-[max-width,opacity,gap] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              isPhone
                ? "pointer-events-none sm:max-w-0 sm:opacity-0 sm:gap-0"
                : "sm:max-w-[220px] sm:opacity-100",
            )
          : "flex shrink-0 justify-center border-b border-border bg-white/95 px-3 py-2",
        className,
      )}
    >
      <div
        className={cn(
          "inline-flex max-w-full",
          isDesktop
            ? "gap-1"
            : "rounded-xl border border-border bg-surface-muted p-1 shadow-xs",
        )}
      >
        {HERO_CHAT_MODES.map((entry) => {
          const active = entry.key === modeKey;
          return (
            <button
              key={entry.key}
              type="button"
              aria-pressed={active}
              onClick={() => onModeChange(entry.key)}
              className={cn(
                "min-h-8 cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                isDesktop
                  ? active
                    ? "bg-white text-primary shadow-xs"
                    : "text-primary-foreground/85 hover:bg-white/15 hover:text-primary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label[locale]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatThread({
  mode,
  locale,
  reducedMotion,
}: {
  mode: ChatMode;
  locale: Locale;
  reducedMotion: boolean;
}) {
  const steps = mode.steps;
  // The opening customer message is server-rendered; playback continues from
  // there so hydration never wipes a visible conversation to restart it.
  const [visible, setVisible] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= steps.length) {
      // Script finished. Under reduced motion the conversation stays put;
      // otherwise it holds on the closing frame and loops from the top.
      if (reducedMotion) return;
      const timer = setTimeout(() => setVisible(1), LOOP_HOLD_MS);
      return () => clearTimeout(timer);
    }
    const current = steps[visible - 1];
    const delay = Math.max(steps[visible].delay, readingPause(current, locale));
    const timer = setTimeout(
      () => setVisible((count) => count + 1),
      reducedMotion ? 0 : delay,
    );
    return () => clearTimeout(timer);
  }, [visible, steps, locale, reducedMotion]);

  // Follow the newest message the way a chat app would. Long cards, such as
  // the invoice with its QR, snap after layout so their heading cannot remain
  // above the viewport while the composer leaves empty space below.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const currentStep = steps[visible - 1];
    const latestEl = container.querySelector<HTMLElement>(
      `[data-step-index="${visible - 1}"]`,
    );

    if (currentStep?.kind === "card" && latestEl) {
      // Ensure the top of the card (e.g. "Invoice · SehatMax Store") is visible
      // and not scrolled out of view above the top edge.
      const targetTop = Math.max(0, latestEl.offsetTop - 8);
      container.scrollTo?.({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      return;
    }

    if (currentStep?.kind === "chip" && visible >= 2) {
      const prevStep = steps[visible - 2];
      if (prevStep?.kind === "card") {
        const cardEl = container.querySelector<HTMLElement>(
          `[data-step-index="${visible - 2}"]`,
        );
        if (cardEl) {
          const cardTop = Math.max(0, cardEl.offsetTop - 8);
          const scrollBottom = container.scrollHeight - container.clientHeight;
          const cardHeight = cardEl.offsetHeight;
          const chipHeight = latestEl?.offsetHeight ?? 40;
          if (cardHeight + chipHeight + 20 <= container.clientHeight) {
            container.scrollTo?.({
              top: scrollBottom,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          } else {
            container.scrollTo?.({
              top: cardTop,
              behavior: reducedMotion ? "auto" : "smooth",
            });
          }
          return;
        }
      }
    }

    container.scrollTo?.({
      top: container.scrollHeight,
      behavior:
        reducedMotion || currentStep?.kind === "card" ? "auto" : "smooth",
    });
  }, [visible, steps, reducedMotion]);

  const next = visible < steps.length ? steps[visible] : null;
  const typing =
    next !== null &&
    (next.kind === "ai" ||
      next.kind === "card" ||
      next.kind === "product" ||
      next.kind === "rating") &&
    !reducedMotion;

  return (
    <div
      ref={scrollRef}
      data-chat-thread="true"
      // Deliberately NOT a live region: the script loops forever, and a
      // looping live region would announce the same theatre endlessly. The
      // pitch itself lives in the surrounding copy.
      style={{ backgroundColor: WA_CANVAS }}
      className="min-h-0 flex-1 scroll-pb-3 overflow-y-auto p-3 pb-3"
    >
      <div className="flex min-h-full flex-col gap-2">
        <div className="mt-auto" />
        <DateChip>
          <span className="font-numeric">{mode.date[locale]}</span>
        </DateChip>
        {steps.slice(0, visible).map((step, index) => (
          <ChatMessage key={index} index={index} step={step} locale={locale} />
        ))}
        {typing && <TypingBubble />}
      </div>
    </div>
  );
}

/** Centred white pill on the beige canvas, the way WhatsApp itself marks a
 *  change of day. */
function DateChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <span className="rounded-lg bg-white/95 px-2.5 py-1 text-center text-[10px] font-medium text-subtle-foreground shadow-xs">
        {children}
      </span>
    </div>
  );
}

function ChatMessage({
  step,
  locale,
  index,
}: {
  step: ChatStep;
  locale: Locale;
  index: number;
}) {
  // The customer's perspective, as their WhatsApp draws it: their own words in
  // white on the left, the business in brand blue on the right, every reply
  // attributed to Cekat.AI (or the named human it was handed to) under the
  // bubble. No avatars; side and colour carry the sender.
  if (step.kind === "user") {
    return (
      <div
        data-step-index={index}
        className="w-fit max-w-[85%] sm:max-w-[360px]"
      >
        <div
          data-chat-bubble="user"
          className="w-fit max-w-full rounded-[14px] rounded-bl-none bg-white px-3 py-1.5 shadow-xs"
        >
          <p className="text-xs leading-relaxed text-foreground">
            {step.text[locale]}
          </p>
        </div>
        <p className="mt-1 px-1 font-numeric text-[10px] text-subtle-foreground">
          {formatTime(step.time, locale)}
        </p>
      </div>
    );
  }
  if (step.kind === "ai") {
    return (
      <div
        data-step-index={index}
        className="ml-auto flex w-fit max-w-[85%] flex-col items-end sm:max-w-[360px]"
      >
        <div
          data-chat-bubble="ai"
          className="w-fit max-w-full rounded-[14px] rounded-br-none bg-primary px-3 py-1.5 shadow-xs"
        >
          <p className="text-xs leading-relaxed text-primary-foreground">
            {step.text[locale]}
          </p>
        </div>
        <Attribution
          locale={locale}
          time={step.time}
          from={step.from}
          outreach={step.outreach}
        />
      </div>
    );
  }
  if (step.kind === "chip") {
    // System events as WhatsApp draws its notices: a centred white card on
    // the beige, ours carrying the event and a time-and-system meta line.
    return (
      <div data-step-index={index} className="flex justify-center px-3">
        <div
          data-chat-bubble="chip"
          className={cn(
            "max-w-[80%] rounded-lg px-3 py-1 text-center shadow-xs sm:max-w-[380px]",
            step.accent ? "bg-primary text-primary-foreground" : "bg-white/80",
          )}
        >
          <p
            className={cn(
              "text-[11px] leading-snug font-medium",
              step.accent ? "text-primary-foreground" : "text-foreground/80",
            )}
          >
            {step.text[locale]}
          </p>
          <p
            className={cn(
              "mt-0.5 font-numeric text-[10px]",
              step.accent
                ? "text-primary-foreground/70"
                : "text-subtle-foreground",
            )}
          >
            {step.time ? `${formatTime(step.time, locale)} · ` : ""}
            {HERO_CHAT_UI.system[locale]}
          </p>
        </div>
      </div>
    );
  }
  if (step.kind === "divider") {
    return (
      <div data-step-index={index}>
        <DateChip>
          {step.text[locale]}
          {step.date && (
            <span className="font-numeric"> &middot; {step.date[locale]}</span>
          )}
        </DateChip>
      </div>
    );
  }
  if (step.kind === "product") {
    return (
      <div
        data-step-index={index}
        className="ml-auto flex w-[90%] flex-col items-end sm:w-full sm:max-w-[280px]"
      >
        <ProductCardView product={step.product} locale={locale} />
        <Attribution locale={locale} time={step.time} />
      </div>
    );
  }
  if (step.kind === "rating") {
    return (
      <div
        data-step-index={index}
        className="ml-auto flex w-[90%] flex-col items-end sm:w-full sm:max-w-[340px]"
      >
        <RatingCardView rating={step.rating} locale={locale} />
        <Attribution locale={locale} time={step.time} />
      </div>
    );
  }
  return (
    <div
      data-step-index={index}
      className="ml-auto flex w-[90%] flex-col items-end sm:w-full sm:max-w-[340px]"
    >
      <ChatCardView card={step.card} locale={locale} />
      <Attribution locale={locale} time={step.time} />
    </div>
  );
}

/** The reply's provenance, written under the bubble the way the reference
 *  demo writes it: "Dibalas Cekat.AI · 14.33", or the named human after a
 *  handoff. Proactive follow-ups answer nothing, so they say "Dikirim"
 *  instead. This line is the whole pitch in eight characters. */
function Attribution({
  locale,
  time,
  from,
  outreach,
}: {
  locale: Locale;
  time: string;
  from?: string;
  outreach?: boolean;
}) {
  const verb = outreach ? HERO_CHAT_UI.sentBy : HERO_CHAT_UI.answeredBy;
  return (
    <p className="mt-0.5 px-1 font-numeric text-[10px] text-subtle-foreground">
      {verb[locale]} {from ?? "Cekat.AI"} &middot; {formatTime(time, locale)}
    </p>
  );
}

/** Hidden from assistive tech: it announces nothing, the message that follows
 *  does the announcing. */
function TypingBubble() {
  return (
    <div aria-hidden className="ml-auto flex max-w-[85%] items-end">
      <span
        data-chat-bubble="typing"
        className="flex items-center gap-1 rounded-[14px] rounded-br-none bg-white px-3 py-2.5 shadow-xs"
      >
        {[0, 150, 300].map((delayMs) => (
          <span
            key={delayMs}
            className="size-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: `${delayMs}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

function ChatCardView({ card, locale }: { card: ChatCard; locale: Locale }) {
  const statusTone = {
    amber: "bg-amber-500/10 text-amber-700",
    blue: "bg-primary/10 text-primary",
    green: "bg-accent-green/10 text-accent-green-deep",
  }[card.statusTone ?? "green"];

  return (
    <div
      data-chat-bubble="card"
      className="w-full rounded-[14px] rounded-br-none bg-white p-2.5 shadow-xs sm:p-3"
    >
      <p className="text-xs font-semibold text-foreground">
        {card.title[locale]}
      </p>
      <p className="mt-0.5 font-numeric text-[11px] text-subtle-foreground">
        {card.meta[locale]}
      </p>
      <dl className="mt-1.5">
        {card.rows.map((row) => (
          <div
            key={row.label[locale]}
            className="flex items-center justify-between gap-3 border-b border-dashed border-border py-1"
          >
            <dt className="text-[11px] text-muted-foreground">
              {row.label[locale]}
            </dt>
            <dd className="text-right font-numeric text-[11px] font-medium text-foreground">
              {row.value[locale]}
            </dd>
          </div>
        ))}
        {card.total && (
          <div className="flex items-center justify-between gap-3 py-1">
            <dt className="text-xs font-semibold text-foreground">
              {card.total.label[locale]}
            </dt>
            <dd className="font-numeric text-xs font-bold text-foreground">
              {card.total.value[locale]}
            </dd>
          </div>
        )}
      </dl>
      {card.qr && <FakeQr />}
      {card.status && (
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              statusTone,
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                card.statusTone === "amber"
                  ? "bg-amber-500"
                  : card.statusTone === "blue"
                    ? "bg-primary"
                    : "bg-accent-green",
              )}
            />
            {card.status[locale]}
          </span>
        </div>
      )}
    </div>
  );
}

function ProductCardView({
  product,
  locale,
}: {
  product: ChatProduct;
  locale: Locale;
}) {
  return (
    <div
      data-chat-bubble="product"
      className="w-full overflow-hidden rounded-[14px] rounded-br-none bg-white p-2 shadow-xs"
    >
      <Image
        src={product.image.src}
        alt={product.image.alt[locale]}
        width={344}
        height={292}
        className="h-28 w-full rounded-lg object-contain"
      />
      <div className="px-1 pt-1.5 pb-0.5">
        <p className="text-xs font-semibold text-foreground">
          {product.title[locale]}
        </p>
        <p className="mt-0.5 font-numeric text-xs font-medium text-primary">
          {product.price[locale]}
        </p>
      </div>
    </div>
  );
}

function RatingCardView({
  rating,
  locale,
}: {
  rating: ChatRating;
  locale: Locale;
}) {
  return (
    <div
      data-chat-bubble="rating"
      className="w-full rounded-[14px] rounded-br-none bg-white p-3 shadow-xs"
    >
      <p className="text-xs font-semibold text-foreground">
        {rating.title[locale]}
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        {rating.prompt[locale]}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {rating.options.map((option, index) => (
          <span
            key={option[locale]}
            className={cn(
              "rounded-md border px-2 py-1 text-center text-[10px] font-medium",
              index === 0
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface-muted text-muted-foreground",
            )}
          >
            {option[locale]}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Decorative stand-in for a payment QR. The pattern is hand-placed and
 *  encodes nothing: a scannable code on a demo invoice would invite people to
 *  pay a shop that does not exist. */
const QR_FINDERS = [
  [0, 0],
  [14, 0],
  [0, 14],
] as const;

const QR_MODULES = [
  [9, 1],
  [11, 2],
  [9, 4],
  [12, 5],
  [10, 6],
  [2, 9],
  [5, 9],
  [8, 8],
  [10, 9],
  [16, 9],
  [2, 11],
  [6, 11],
  [14, 10],
  [18, 11],
  [9, 12],
  [15, 13],
  [11, 14],
  [13, 16],
  [17, 15],
  [9, 16],
  [15, 17],
  [18, 18],
  [10, 19],
  [13, 19],
] as const;

function FakeQr() {
  return (
    <svg
      viewBox="0 0 21 21"
      aria-hidden
      className="mx-auto mt-2 block size-12 text-foreground"
    >
      <g fill="currentColor">
        {QR_FINDERS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
          </g>
        ))}
        {QR_MODULES.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1.5" height="1.5" />
        ))}
      </g>
    </svg>
  );
}
