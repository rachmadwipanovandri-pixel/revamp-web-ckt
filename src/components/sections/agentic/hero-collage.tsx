"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { CollagePhoneChat } from "@/components/sections/agentic/collage-phone-chat";
import { CollageProductPanel } from "@/components/sections/agentic/collage-product-panel";
import type { HeroSlideKey } from "@/components/sections/agentic/hero-slides";
import {
  deriveChatPhase,
  INDUSTRY_AGENT,
  type ChatSync,
} from "@/components/sections/agentic/collage-chat-sync";
import { HERO_CHAT_SCENARIOS, type ChatModeKey } from "@/lib/hero-chat";

type FocusKey = HeroSlideKey;

/** Which side window lifts when a product is not the main panel. */
const LIFT_SIDE: Record<FocusKey, "phone" | "agent" | null> = {
  ecosystem: "phone",
  crm: null,
  mini: "agent",
  oms: null,
  marketing: null,
  consulting: "agent",
};

/**
 * Solo-product slides teach one product at a time (CRM / Mini Agent / OMS).
 * The phone chat drops away so the stage is only that product window.
 * Consulting is also solo — its own chat loop, not the WhatsApp thread.
 */
const SOLO_PRODUCT: Partial<Record<FocusKey, true>> = {
  crm: true,
  mini: true,
  oms: true,
  consulting: true,
};

const AGENT_LINES: Record<
  FocusKey,
  { cmd: string; body: { label: string; value: string }[]; done: string }
> = {
  ecosystem: {
    cmd: "resolve lead",
    body: [
      { label: "Intent:", value: "purchase · retail" },
      { label: "CRM:", value: "auto notes" },
      { label: "Next:", value: "catalog + offer" },
    ],
    done: "Listening…",
  },
  crm: {
    cmd: "fill customer 360",
    body: [
      { label: "From chat:", value: "prefs + cart" },
      { label: "Stage:", value: "Lead → Buyer" },
      { label: "Notes:", value: "written for you" },
    ],
    done: "CRM updated",
  },
  mini: {
    cmd: "spawn mini-agents",
    body: [
      { label: "FAQ:", value: "SOP.md ready" },
      { label: "Lead:", value: "scoring live" },
      { label: "Nudge:", value: "queue 12" },
    ],
    done: "3 agents · 5 min setup",
  },
  oms: {
    cmd: "checkout from chat",
    body: [
      { label: "Ongkir:", value: "JNE Rp 18.000" },
      { label: "Pay:", value: "QR issued" },
      { label: "Track:", value: "auto resi" },
    ],
    done: "Order in one thread",
  },
  marketing: {
    cmd: "attribute revenue",
    body: [
      { label: "Meta:", value: "ROAS 3.4×" },
      { label: "Broadcast:", value: "28% of sales" },
      { label: "Nudge:", value: "10% recovered" },
    ],
    done: "Sale → ad spend",
  },
  consulting: {
    cmd: "read your playbook",
    body: [
      { label: "Signal:", value: "pair Vit C + Omega" },
      { label: "Action:", value: "bundle −18%" },
      { label: "Owner:", value: "human approves" },
    ],
    done: "Advice from your data",
  },
};

/**
 * Incident.io-style product collage for Cekat.
 *
 * First (ecosystem) slide keeps the full unit stage visible at once:
 * chat · CRM · OMS · Mini Cekat Agent.
 *
 * CRM / Mini Agent / OMS slides are solo: only that product window (no phone).
 * Consulting is its own looping chat (owner ↔ agent). Marketing keeps the
 * WhatsApp thread beside a live attribution panel.
 *
 * OMS + Marketing read `orderPlaced` from the WhatsApp thread (invoice /
 * confirm / sale chip).
 */
export function HeroCollage({
  className,
  focus = "ecosystem",
}: {
  className?: string;
  focus?: FocusKey;
}) {
  const locale = useLocale() === "en" ? "en" : "id";
  const [chatSync, setChatSync] = useState<ChatSync>({
    scenario: "retail",
    mode: "lead",
    cursor: 0,
    loop: 0,
    orderPlaced: false,
  });

  const onProgress = useCallback(
    (info: {
      cursor: number;
      total: number;
      scenario: ChatSync["scenario"];
      mode: ChatModeKey;
      loop: number;
    }) => {
      setChatSync((prev) => ({
        scenario: info.scenario,
        mode: info.mode,
        cursor: info.cursor,
        loop: info.loop,
        // New loop resets order state so OMS restarts clean.
        orderPlaced: info.cursor === 0 ? false : prev.orderPlaced,
      }));
    },
    [],
  );

  const onOrderPlaced = useCallback(() => {
    setChatSync((prev) => ({ ...prev, orderPlaced: true }));
  }, []);

  const lift = LIFT_SIDE[focus];
  const solo = Boolean(SOLO_PRODUCT[focus]);

  const chatSteps = useMemo(() => {
    const scenario = HERO_CHAT_SCENARIOS.find((s) => s.key === chatSync.scenario);
    return scenario?.modes[chatSync.mode as ChatModeKey]?.steps ?? [];
  }, [chatSync.scenario, chatSync.mode]);

  const phase = useMemo(
    () => deriveChatPhase(chatSteps, chatSync.cursor),
    [chatSteps, chatSync.cursor],
  );

  /** Ecosystem agent console follows industry + chat phase. */
  const agent = useMemo(() => {
    if (focus === "ecosystem") {
      const ind = INDUSTRY_AGENT[chatSync.scenario];
      return {
        cmd: ind.cmd,
        body: ind.body.map((row) => ({
          label: row.label[locale],
          value: row.value[locale],
        })),
        done: (ind.doneByPhase[phase] ?? ind.doneByPhase.idle)?.[locale] ?? "…",
        live: phase !== "idle",
      };
    }
    const fallback = AGENT_LINES[focus] ?? AGENT_LINES.ecosystem;
    return { ...fallback, live: true };
  }, [focus, chatSync.scenario, phase, locale]);

  const sideClass = useCallback(
    (name: "phone" | "agent") => cn(lift === name && "is-focus"),
    [lift],
  );

  const omsLive = useMemo(
    () => chatSync.orderPlaced || focus === "oms",
    [chatSync.orderPlaced, focus],
  );

  return (
    <div className={cn("hero-collage-root", className)}>
      <div className="hero-collage" data-hero-collage data-focus={focus}>
        <div className="hero-collage-glow" aria-hidden />

        <div className="hero-collage-orbs" aria-hidden>
          <span
            className="hero-collage-orb"
            style={{
              left: "78%",
              top: "70%",
              width: "55%",
              background:
                "radial-gradient(circle, rgba(251,191,36,0.85) 0%, transparent 70%)",
              opacity: 0.55,
            }}
          />
          <span
            className="hero-collage-orb"
            style={{
              left: "30%",
              top: "88%",
              width: "62%",
              background:
                "radial-gradient(circle, rgba(34,211,238,0.85) 0%, transparent 70%)",
              opacity: 0.5,
              animationDelay: "-3s",
            }}
          />
          <span
            className="hero-collage-orb"
            style={{
              left: "88%",
              top: "40%",
              width: "42%",
              background:
                "radial-gradient(circle, rgba(19,82,191,0.9) 0%, transparent 70%)",
              opacity: 0.65,
              animationDelay: "-6s",
            }}
          />
        </div>

        {/* First slide: chat · CRM · OMS · Mini Cekat Agent all at once,
            every window looping in lockstep with the WhatsApp thread. */}
        {focus === "ecosystem" ? (
          <>
            <div
              className="hero-collage-win hero-collage-win-crm is-focus"
              aria-hidden
            >
              <CollageProductPanel
                focus="crm"
                orderPlaced={chatSync.orderPlaced}
                chatSync={chatSync}
                chatSteps={chatSteps}
              />
            </div>
            <div
              className={cn(
                "hero-collage-win hero-collage-win-oms",
                omsLive ? "hero-collage-panel-live" : "hero-collage-panel-pending",
              )}
              aria-hidden
            >
              <CollageProductPanel
                focus="oms"
                orderPlaced={chatSync.orderPlaced}
                chatSync={chatSync}
                chatSteps={chatSteps}
              />
            </div>
          </>
        ) : (
          /* Product slides: one large window that teaches that product. */
          <div
            className={cn(
              "hero-collage-win hero-collage-win-product is-focus",
              solo && "is-solo",
            )}
            aria-hidden
          >
            <CollageProductPanel
              focus={focus}
              orderPlaced={chatSync.orderPlaced}
            />
          </div>
        )}

        {/* Phone — WhatsApp thread. Hidden on solo product slides. */}
        {!solo ? (
          <div className={cn("hero-collage-win hero-collage-win-phone", sideClass("phone"))}>
            <CollagePhoneChat
              onOrderPlaced={onOrderPlaced}
              onProgress={focus === "ecosystem" || focus === "marketing" ? onProgress : undefined}
            />
          </div>
        ) : null}

        {/* Mini Cekat Agent console — copy follows chat industry + phase. */}
        <div
          className={cn(
            "hero-collage-win hero-collage-win-agent",
            sideClass("agent"),
            solo && "hidden",
          )}
          aria-hidden
        >
          <div className="flex items-center gap-2 border-b border-white/8 px-2.5 py-1.5">
            <div className="flex gap-1">
              <i className="block size-1.5 rounded-full bg-[#ff5f57]" />
              <i className="block size-1.5 rounded-full bg-[#febc2e]" />
              <i className="block size-1.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-1 text-[8px] text-white/40">
              <span className="text-white/70">Mini Cekat Agent</span>
            </span>
          </div>
          <div
            key={`agent-${chatSync.scenario}-${phase}-${chatSync.loop}`}
            className="flex flex-col gap-1 px-2.5 py-1.5 text-[8.5px] leading-relaxed"
          >
            <div className="-mx-2.5 bg-white/8 px-2.5 py-0.5 text-white/85">
              <span className="text-white/35">› </span>
              {agent.cmd}
            </div>
            {agent.body.map((row) => (
              <div key={row.label} className="text-white/70">
                <span className="text-white/90">{row.label}</span> {row.value}
              </div>
            ))}
            <div className="mt-1 border-t border-white/8 pt-1 text-white/45">
              <div>
                <span className="text-white/35">› </span>tools.call webhook
              </div>
              <div>
                <span className="text-white/35">› </span>crm.upsert contact
              </div>
              <div>
                <span className="text-white/35">› </span>oms.queue order
              </div>
            </div>
            {agent.live && (phase === "paid" || phase === "closed" || omsLive) ? (
              <div className="text-emerald-300">✳ {agent.done}</div>
            ) : (
              <div className="text-white/40">✳ {agent.done}</div>
            )}
          </div>
        </div>

        {/* Status pill — ambient only when the full unit stage is showing */}
        {!solo ? (
          <div className="hero-collage-pills" aria-hidden>
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#1352bf] to-[#1068e5] text-[9px] font-bold text-white">
              C
            </span>
            <span className="hero-collage-shimmer">Cekat.AI is composing…</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}