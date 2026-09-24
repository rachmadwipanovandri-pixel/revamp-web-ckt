"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { HeroSlideKey } from "@/components/sections/agentic/hero-slides";
import { useLoopCursor } from "@/components/sections/agentic/collage-live-hooks";
import { CollageConsultingChat } from "@/components/sections/agentic/collage-consulting-chat";
import {
  deriveChatPhase,
  INDUSTRY_CRM,
  INDUSTRY_OMS,
  pickPhaseNote,
  type ChatSync,
} from "@/components/sections/agentic/collage-chat-sync";
import {
  HERO_CHAT_SCENARIOS,
  type ChatModeKey,
  type ChatStep,
} from "@/lib/hero-chat";

/**
 * Product-detail panel for each hero slide.
 * Ecosystem CRM / OMS follow the WhatsApp chat loop (phase + 4 industries).
 * Solo CRM / Mini / Marketing run their own live loops. Consulting is chat.
 */
export function CollageProductPanel({
  focus,
  orderPlaced,
  chatSync,
  chatSteps,
}: {
  focus: HeroSlideKey;
  orderPlaced: boolean;
  /** Ecosystem stage: drive CRM/OMS from the live WhatsApp thread. */
  chatSync?: ChatSync;
  chatSteps?: ChatStep[];
}) {
  if (focus === "consulting") {
    return (
      <div className="h-full w-full">
        <CollageConsultingChat />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="hero-collage-traffic">
        <i />
        <i />
        <i />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-2">
        {focus === "crm" ? (
          chatSync && chatSteps ? (
            <SyncedCrm chatSync={chatSync} chatSteps={chatSteps} />
          ) : (
            <CrmDetail />
          )
        ) : null}
        {focus === "mini" ? <MiniAgents /> : null}
        {focus === "oms" ? (
          chatSync ? (
            <SyncedOms chatSync={chatSync} />
          ) : (
            <OmsFlow orderPlaced={orderPlaced} />
          )
        ) : null}
        {focus === "marketing" ? <MarketingDetail orderPlaced={orderPlaced} /> : null}
        {focus === "ecosystem" ? (
          <EcosystemMix orderPlaced={orderPlaced} />
        ) : null}
      </div>
    </div>
  );
}

/** CRM window on the ecosystem stage — same loop & industry as the phone. */
function SyncedCrm({
  chatSync,
  chatSteps,
}: {
  chatSync: ChatSync;
  chatSteps: ChatStep[];
}) {
  const locale = useLocale() === "en" ? "en" : "id";
  const phase = deriveChatPhase(chatSteps, chatSync.cursor);
  const data = INDUSTRY_CRM[chatSync.scenario];
  const note = pickPhaseNote(data.notes, phase);
  const filled = chatSync.cursor > 0;

  return (
    <div
      className="relative flex h-full flex-col"
      key={`crm-${chatSync.scenario}-${chatSync.loop}-${chatSync.mode}`}
    >
      <PanelTitle
        label="Cekat CRM"
        tone="text-[#2563eb]"
        badge={phase === "idle" ? "Menunggu chat" : phase}
        badgeTone={phase === "closed" || phase === "paid" ? "emerald" : "cyan"}
      />
      <div
        className={cn(
          "mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
          filled ? "bg-sky-50" : "bg-slate-50",
        )}
      >
        <span className="grid size-6 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-[#2563eb] text-[9px] font-bold text-white">
          {data.customer[locale].charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-semibold text-[#101828]">
            {filled ? data.customer[locale] : "—"}
          </div>
          <div className="truncate text-[8px] text-slate-500">
            {filled ? `${data.source[locale]} · ${data.stage[locale]}` : "menunggu chat masuk…"}
          </div>
        </div>
        {filled ? (
          <span className="rounded bg-emerald-100 px-1 py-0.5 text-[7px] font-bold text-emerald-700">
            {data.badge[locale]}
          </span>
        ) : null}
      </div>

      <div className="mb-2 grid grid-cols-4 gap-1">
        {data.metrics.map((m, i) => (
          <div key={m.label.en} className="rounded border border-[#e4e7ec] bg-white px-1 py-1 text-center">
            <div className="text-[7px] tracking-wide text-slate-500 uppercase">
              {m.label[locale]}
            </div>
            <div
              className={cn(
                "text-[10px] font-bold transition-all",
                filled ? "text-[#101828]" : "text-slate-300",
              )}
            >
              {filled ? m.value : "·"}
            </div>
            {filled && i < 3 ? (
              <div className="text-[7px] text-emerald-600">+{i + 1}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mb-1 flex items-center justify-between text-[8px] font-semibold tracking-wide text-slate-500 uppercase">
        <span>Catatan otomatis</span>
        <span className="flex items-center gap-1 normal-case text-[7px] font-medium text-emerald-600">
          <span
            className={cn(
              "size-1 rounded-full",
              filled ? "animate-pulse-soft bg-emerald-500" : "bg-slate-300",
            )}
          />
          {filled ? "sync chat" : "idle"}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
        <div className="space-y-1">
          {filled ? (
            <>
              <div
                key={`${chatSync.scenario}-${phase}-${chatSync.cursor}-a`}
                className={cn(
                  "hero-collage-msg rounded-md border px-2 py-1.5",
                  phase === "paid" || phase === "closed"
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-sky-100 bg-white",
                )}
              >
                <div className="text-[9px] text-[#101828]">
                  <span className="font-semibold">{note.title[locale]}</span>
                </div>
                <div className="text-[7.5px] text-slate-500">{note.body[locale]}</div>
              </div>
              <div className="hero-collage-msg rounded-md border border-sky-100 bg-white px-2 py-1.5">
                <div className="text-[9px] text-[#101828]">
                  <span className="font-semibold">
                    {data.notes.profile?.title[locale] ?? "Profil"}
                  </span>
                </div>
                <div className="text-[7.5px] text-slate-500">
                  {data.notes.profile?.body[locale]}
                </div>
              </div>
              <div className="hero-collage-msg rounded-md border border-indigo-50 bg-indigo-50/40 px-2 py-1.5">
                <div className="text-[9px] text-indigo-900">
                  <span className="font-semibold">
                    {data.notes.offer?.title[locale] ?? "Next best action"}
                  </span>
                </div>
                <div className="text-[7.5px] text-indigo-700/80">
                  {data.notes.offer?.body[locale]}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 px-2 py-2 text-[8px] text-slate-400">
              CRM terisi sendiri dari chat di sebelah…
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 pt-0.5">
          {[
            { l: "Customer 360", v: filled ? "On" : "—" },
            { l: "Pipeline", v: filled ? "Live" : "—" },
            { l: "Follow-up", v: filled ? "Auto" : "—" },
          ].map((f) => (
            <div
              key={f.l}
              className="rounded border border-[#e4e7ec] bg-white px-1 py-0.5 text-center"
            >
              <div className="text-[6.5px] tracking-wide text-slate-500 uppercase">{f.l}</div>
              <div
                className={cn(
                  "text-[8px] font-bold",
                  filled ? "text-[#2563eb]" : "text-slate-300",
                )}
              >
                {f.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** OMS window on the ecosystem stage — order row follows chat phase. */
function SyncedOms({ chatSync }: { chatSync: ChatSync }) {
  const locale = useLocale() === "en" ? "en" : "id";
  const phase = deriveChatPhase(
    HERO_CHAT_SCENARIOS.find((s) => s.key === chatSync.scenario)?.modes[
      chatSync.mode as ChatModeKey
    ]?.steps ?? [],
    chatSync.cursor,
  );
  const pack = INDUSTRY_OMS[chatSync.scenario];
  const order = pack.orders[0]!;
  const status =
    order.statusByPhase[phase] ?? order.statusByPhase.quote ?? { id: "…", en: "…" };
  const show = chatSync.cursor > 0;

  const extras = pack.orders.slice(1);
  const fallback = pack.orders[0]!;

  return (
    <div
      className="relative flex h-full flex-col"
      key={`oms-${chatSync.scenario}-${chatSync.loop}-${chatSync.mode}`}
    >
      <PanelTitle
        label="OMS · Orders"
        tone="text-amber-600"
        badge={show ? status[locale] : "idle"}
        badgeTone={phase === "paid" || phase === "closed" ? "emerald" : "amber"}
      />
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
        <div className="space-y-1">
          {show ? (
            <div
              key={`${chatSync.scenario}-${phase}-${chatSync.cursor}`}
              className="hero-collage-msg rounded-md border border-amber-100 bg-amber-50/60 px-2 py-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[8px] font-bold tracking-wide text-slate-500 uppercase">
                  {order.id}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1 py-0.5 text-[7px] font-bold",
                    phase === "paid" || phase === "closed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-800",
                  )}
                >
                  {status[locale]}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-[#101828]">
                  {order.who[locale]} · {order.items[locale]}
                </span>
                <span className="shrink-0 text-[9px] font-bold text-amber-700">
                  {order.total}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 px-2 py-2 text-center text-[8px] text-slate-400">
              Order live muncul dari chat…
            </div>
          )}
          {[
            {
              id: fallback.id.replace(/\d+$/, (m) => String(Number(m) - 1)),
              who: fallback.who,
              items: fallback.items,
              total: fallback.total,
              st: locale === "id" ? "Dikirim" : "Shipped",
            },
            ...extras.map((e) => ({
              id: e.id,
              who: e.who,
              items: e.items,
              total: e.total,
              st: locale === "id" ? "Selesai" : "Done",
            })),
          ].map((row) => (
            <div
              key={row.id}
              className="rounded-md border border-slate-100 bg-slate-50/80 px-2 py-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[7.5px] font-bold tracking-wide text-slate-500 uppercase">
                  {row.id}
                </span>
                <span className="shrink-0 rounded bg-emerald-50 px-1 py-0.5 text-[6.5px] font-bold text-emerald-700">
                  {row.st}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-[8.5px] text-slate-600">
                  {row.who[locale]} · {row.items[locale]}
                </span>
                <span className="shrink-0 text-[8.5px] font-semibold text-amber-700">
                  {row.total}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded border border-amber-100 bg-amber-50/50 px-2 py-1 text-[7.5px] text-amber-900">
          <span className="font-semibold">
            {locale === "id" ? "Hari ini" : "Today"} · {show ? "1+" : "0"}{" "}
            {locale === "id" ? "baru" : "new"}
          </span>
          <span>
            {locale === "id" ? "Auto resi + QR" : "Auto resi + QR"}
          </span>
        </div>
      </div>
    </div>
  );
}

function PanelTitle({
  label,
  tone,
  badge,
  badgeTone = "cyan",
}: {
  label: string;
  tone: string;
  badge: string;
  badgeTone?: "cyan" | "emerald" | "amber" | "violet" | "slate";
}) {
  const badgeCls =
    badgeTone === "emerald"
      ? "bg-emerald-100 text-emerald-800"
      : badgeTone === "amber"
        ? "bg-amber-100 text-amber-800"
        : badgeTone === "violet"
          ? "bg-violet-100 text-violet-800"
          : badgeTone === "slate"
            ? "bg-slate-100 text-slate-500"
            : "bg-cyan-100 text-cyan-800";
  return (
    <div className="mb-2 flex items-center justify-between">
      <span
        className={cn("text-[10px] font-semibold tracking-[0.12em] uppercase", tone)}
      >
        {label}
      </span>
      <span className="flex items-center gap-1">
        <span className="size-1.5 animate-pulse-soft rounded-full bg-emerald-500" />
        <span className={cn("rounded-full px-1.5 py-0.5 text-[8px] font-semibold", badgeCls)}>
          {badge}
        </span>
      </span>
    </div>
  );
}

function Row({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hero-collage-msg rounded-md border border-sky-100 bg-white px-2 py-1.5",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Decorative spark dots so solo product windows don’t feel empty. */
function Sparks({ tone }: { tone: "sky" | "violet" | "cyan" | "amber" }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-400",
    violet: "bg-violet-400",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
  };
  return (
    <div className="hero-collage-sparks pointer-events-none absolute inset-0" aria-hidden>
      <span
        className={cn("hero-collage-spark", colors[tone])}
        style={{ left: "12%", top: "18%", animationDelay: "0s" }}
      />
      <span
        className={cn("hero-collage-spark", colors[tone])}
        style={{ left: "78%", top: "28%", animationDelay: "1.4s" }}
      />
      <span
        className={cn("hero-collage-spark", colors[tone])}
        style={{ left: "62%", top: "72%", animationDelay: "2.6s" }}
      />
    </div>
  );
}

/** Live metric tile that can tick a suffix. */
function LiveTile({
  l,
  v,
  hint,
}: {
  l: string;
  v: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-[#e4e7ec] bg-white px-1.5 py-1.5">
      <div className="text-[7px] tracking-wide text-slate-500 uppercase">{l}</div>
      <div className="text-[11px] font-bold text-[#101828]">{v}</div>
      {hint ? <div className="text-[7px] text-emerald-600">{hint}</div> : null}
    </div>
  );
}

/**
 * Cekat CRM — looping activity feed so the pipeline looks alive.
 * Customer 360, board stages, lead sources, auto follow-up (INNOV 2025).
 */
function CrmDetail() {
  const events = useMemo(
    () => [
      {
        id: "e1",
        title: "Customer 360 terisi",
        body: "Ayu · WA Ads · preferensi + cart",
        tone: "sky" as const,
      },
      {
        id: "e2",
        title: "Pipeline naik",
        body: "Lead → Deal · Rp 308.000",
        tone: "emerald" as const,
      },
      {
        id: "e3",
        title: "Lead source",
        body: "IG Ads · 14 lead baru hari ini",
        tone: "sky" as const,
      },
      {
        id: "e4",
        title: "Follow-up dijadwalkan",
        body: "Reminder reorder 30 hari",
        tone: "amber" as const,
      },
      {
        id: "e5",
        title: "Tag otomatis",
        body: "VIP · repeat · health stack",
        tone: "sky" as const,
      },
      {
        id: "e6",
        title: "Target deal diset",
        body: "Q3 · Rp 2,4jt / anggota",
        tone: "sky" as const,
      },
      {
        id: "e7",
        title: "Board dipindah",
        body: "Deal · Negotiation → Won",
        tone: "emerald" as const,
      },
      {
        id: "e8",
        title: "Laporan mingguan",
        body: "PDF auto-kirim ke owner",
        tone: "amber" as const,
      },
    ],
    [],
  );
  const delayFor = useMemo(() => () => 1600, []);
  const cursor = useLoopCursor(events.length, delayFor);
  const visible = events.slice(0, cursor);

  return (
    <div className="relative flex h-full flex-col">
      <Sparks tone="sky" />
      <PanelTitle
        label="Cekat CRM"
        tone="text-[#2563eb]"
        badge="Live · real-time"
        badgeTone="cyan"
      />
      <div className="mb-2 text-[9px] leading-snug text-slate-600">
        Data pelanggan lengkap & real-time — pipeline, lead, dan follow-up
        mengisi sendiri dari chat.
      </div>

      <div className="mb-2 flex items-center gap-2 rounded-md bg-sky-50 px-2 py-1.5">
        <span className="grid size-6 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-[#2563eb] text-[9px] font-bold text-white">
          A
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-semibold text-[#101828]">
            Ayu Wijaya · Retail
          </div>
          <div className="text-[8px] text-slate-500">
            Sumber: WA Ads · Visitor → Lead → Buyer
          </div>
        </div>
        <span className="animate-pulse-soft rounded bg-emerald-100 px-1 py-0.5 text-[7px] font-bold text-emerald-700">
          Hot · siap closing
        </span>
      </div>

      <div className="mb-2 grid grid-cols-4 gap-1">
        <LiveTile l="Visitor" v="48" hint="+6" />
        <LiveTile l="Lead" v="31" hint="+3" />
        <LiveTile l="Deal" v="12" hint="+1" />
        <LiveTile l="Buyer" v="9" hint="+2" />
      </div>

      <div className="mb-1 flex items-center justify-between text-[8px] font-semibold tracking-wide text-slate-500 uppercase">
        <span>Aktivitas otomatis</span>
        <span className="flex items-center gap-1 normal-case text-[7px] font-medium text-emerald-600">
          <span className="size-1 animate-pulse-soft rounded-full bg-emerald-500" />
          streaming
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
        <div className="min-h-0 flex-1 space-y-1 overflow-hidden">
          {visible.map((e) => (
            <Row
              key={e.id}
              className={
                e.tone === "emerald"
                  ? "border-emerald-100 bg-emerald-50/60"
                  : e.tone === "amber"
                    ? "border-amber-100 bg-amber-50/50"
                    : undefined
              }
            >
              <div
                className={cn(
                  "text-[9px]",
                  e.tone === "emerald"
                    ? "text-emerald-800"
                    : e.tone === "amber"
                      ? "text-amber-800"
                      : "text-[#101828]",
                )}
              >
                <span className="font-semibold">{e.title}</span>
              </div>
              <div className="text-[7.5px] text-slate-500">{e.body}</div>
            </Row>
          ))}
          {cursor < events.length ? (
            <div className="flex items-center gap-1 px-1 py-0.5">
              <span className="size-1 animate-bounce rounded-full bg-slate-300" />
              <span className="size-1 animate-bounce rounded-full bg-slate-300 [animation-delay:120ms]" />
              <span className="size-1 animate-bounce rounded-full bg-slate-300 [animation-delay:240ms]" />
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {[
            "Search & filter lead",
            "Board workflow",
            "Target & deal",
            "Sumber lead multi-channel",
            "Riwayat chat + order",
            "Export laporan",
          ].map((f) => (
            <div
              key={f}
              className="rounded-md border border-[#e4e7ec] bg-white px-1.5 py-1 text-[7.5px] font-medium text-[#101828]"
            >
              ✓ {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Mini Agent — agents light up one by one as jobs run (INNOV 2025 tools +
 * workflow automation).
 */
function MiniAgents() {
  const jobs = useMemo(
    () => [
      {
        name: "Cek Jadwal",
        task: "Webhook · baca Sheets",
        run: "Slot 13.00 kosong",
      },
      {
        name: "Reservasi",
        task: "Isi booking · dari WA",
        run: "Booked · Adit · 13.00",
      },
      {
        name: "Pembayaran",
        task: "Tagih & konfirmasi",
        run: "QR paid · INV-0831",
      },
      {
        name: "Follow-up Nudge",
        task: "Kejar cart ghosting",
        run: "12 antrean dikirim",
      },
      {
        name: "FAQ Responder",
        task: "SOP.md → jawaban",
        run: "48 balasan hari ini",
      },
      {
        name: "Lead Sorter",
        task: "Skor & tag lead",
        run: "18 lead diberi skor",
      },
    ],
    [],
  );
  const delayFor = useMemo(() => () => 1450, []);
  const cursor = useLoopCursor(jobs.length, delayFor);
  const running = Math.min(cursor, jobs.length);

  return (
    <div className="relative flex h-full flex-col">
      <Sparks tone="violet" />
      <PanelTitle
        label="Mini Agent · Automation"
        tone="text-violet-600"
        badge="1 agent = 1 tugas"
        badgeTone="violet"
      />
      <div className="mb-2 text-[9px] leading-snug text-slate-600">
        AI kecil yang mengambil alih tugas berulang — delegasi dari AI utama,
        unlimited agent, maintenance mudah.
      </div>

      <div className="mb-2 rounded-md border border-violet-100 bg-violet-50/50 px-2 py-1.5 text-[8.5px] leading-snug text-violet-900">
        <span className="font-semibold">Pipeline:</span> prompt → tools
        (webhook) → workflow (Sheets/API) → balik ke chat.
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
        <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
          {jobs.map((a, i) => {
            const done = i < running;
            const active = i === running;
            return (
              <div
                key={a.name}
                className={cn(
                  "hero-collage-msg flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors",
                  done
                    ? "border-emerald-100 bg-emerald-50/40"
                    : active
                      ? "animate-pulse-soft border-violet-200 bg-violet-50"
                      : "border-violet-100 bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-md text-[8px] font-bold",
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-violet-500 text-white"
                        : "bg-violet-100 text-violet-700",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[9.5px] font-semibold text-[#101828]">
                    {a.name}
                  </div>
                  <div className="truncate text-[8px] text-slate-500">
                    {done || active ? a.run : a.task}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded px-1 py-0.5 text-[7px] font-bold",
                    done
                      ? "bg-emerald-100 text-emerald-700"
                      : active
                        ? "bg-violet-500 text-white"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {done ? "Done" : active ? "Running" : "Idle"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-md border border-violet-100 bg-[#0f172a] px-2 py-1.5 font-mono text-[7.5px] leading-relaxed text-violet-100/80">
          <div className="text-white/40">› execution log</div>
          <div>
            <span className="text-emerald-300">ok</span> webhook POST /cek-jadwal
          </div>
          <div>
            <span className="text-emerald-300">ok</span> sheets.get rows=8
          </div>
          <div>
            <span className="text-cyan-300">→</span> reply chat · slot 11,13,14
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {[
            { l: "Tools", v: "Webhook" },
            { l: "Data", v: "Sheets / API" },
            { l: "Billing", v: "Unlimited" },
          ].map((m) => (
            <div key={m.l} className="rounded-md bg-white px-1.5 py-1.5 text-center">
              <div className="text-[7px] tracking-wide text-slate-500 uppercase">{m.l}</div>
              <div className="text-[9px] font-bold text-[#101828]">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** OMS — order list only (orders land from chat, then pay & ship). */
function OmsFlow({ orderPlaced }: { orderPlaced: boolean }) {
  const orders = [
    {
      id: "INV-2026-0831",
      who: "Ayu Wijaya",
      items: "Vit C ×2 + Omega ×1",
      total: "Rp 308.000",
      status: orderPlaced ? "Paid" : "Menunggu bayar",
      on: orderPlaced,
    },
    {
      id: "INV-2026-0830",
      who: "Budi Santoso",
      items: "Paket Family",
      total: "Rp 425.000",
      status: "Dikirim · JNE",
      on: true,
    },
    {
      id: "INV-2026-0829",
      who: "Citra Dewi",
      items: "Omega-3 1000mg",
      total: "Rp 120.000",
      status: "Selesai",
      on: true,
    },
    {
      id: "INV-2026-0828",
      who: "Damar Putra",
      items: "Vit C + Bundling",
      total: "Rp 265.000",
      status: "Resi otomatis",
      on: true,
    },
  ];
  return (
    <div className="relative flex h-full flex-col">
      <Sparks tone="amber" />
      <PanelTitle
        label="OMS · Orders"
        tone="text-amber-600"
        badge={`${orders.length} order`}
        badgeTone="amber"
      />
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
        <div className="space-y-1">
          {orders.map((o, i) => (
            <div
              key={o.id}
              className={cn(
                "hero-collage-msg rounded-md border px-2 py-1.5",
                o.on
                  ? "border-amber-100 bg-amber-50/60"
                  : "border-slate-100 bg-slate-50",
              )}
              style={{ animationDelay: `${150 + i * 120}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[8px] font-bold tracking-wide text-slate-500 uppercase">
                  {o.id}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded px-1 py-0.5 text-[7px] font-bold",
                    o.on
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {o.status}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-[#101828]">
                  {o.who} · {o.items}
                </span>
                <span className="shrink-0 text-[9px] font-bold text-amber-700">
                  {o.total}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { l: "Ongkir", v: "Auto" },
            { l: "Bayar", v: "QR / link" },
            { l: "Resi", v: "Auto" },
          ].map((m) => (
            <div key={m.l} className="rounded-md bg-white px-1 py-1 text-center">
              <div className="text-[6.5px] tracking-wide text-slate-500 uppercase">{m.l}</div>
              <div className="text-[8px] font-bold text-[#101828]">{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Cekat Marketing — attribution rows stream in; bars grow; sale chips land.
 */
function MarketingDetail({ orderPlaced }: { orderPlaced: boolean }) {
  const rows = useMemo(
    () => [
      { src: "Meta · Retarget A", pct: 62, amt: "Rp 308k", roas: "4.1×" },
      { src: "Broadcast WA", pct: 28, amt: "Rp 141k", roas: "3.2×" },
      { src: "Follow-up ghosting", pct: 10, amt: "Rp 50k", roas: "2.8×" },
      { src: "IG Click-to-WA", pct: 18, amt: "Rp 92k", roas: "3.0×" },
    ],
    [],
  );
  const delayFor = useMemo(() => () => 1500, []);
  const cursor = useLoopCursor(rows.length + 1, delayFor);

  return (
    <div className="relative flex h-full flex-col">
      <Sparks tone="cyan" />
      <PanelTitle
        label="Cekat Marketing"
        tone="text-cyan-700"
        badge={orderPlaced ? "1 sale attributed" : "Live ROAS"}
        badgeTone={orderPlaced ? "emerald" : "cyan"}
      />
      <div className="mb-2 grid grid-cols-3 gap-1">
        <LiveTile l="Spend" v="Rp 2.1jt" />
        <LiveTile l="Revenue" v="Rp 7.2jt" hint="+18%" />
        <LiveTile l="ROAS" v="3.4×" hint="↑ 0.3" />
      </div>
      <div className="mb-1 flex items-center justify-between text-[8px] font-semibold tracking-wide text-slate-500 uppercase">
        <span>Asal penjualan</span>
        <span className="flex items-center gap-1 normal-case text-[7px] font-medium text-cyan-700">
          <span className="size-1 animate-pulse-soft rounded-full bg-cyan-500" />
          attributing
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-2">
        <div className="min-h-0 flex-1 space-y-1 overflow-hidden">
          {rows.slice(0, cursor).map((r, i) => (
            <div
              key={r.src}
              className="hero-collage-msg rounded-md border border-cyan-50 bg-white px-2 py-1.5"
            >
              <div className="mb-1 flex justify-between text-[8.5px]">
                <span className="font-medium text-[#101828]">{r.src}</span>
                <span className="font-semibold text-cyan-700">
                  {r.amt} · {r.roas}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-cyan-50">
                <div
                  className="hero-collage-bar h-full rounded-full bg-linear-to-r from-cyan-400 to-[#2563eb]"
                  style={{ width: `${r.pct}%`, animationDelay: `${i * 120}ms` }}
                />
              </div>
            </div>
          ))}
          {cursor > rows.length ? (
            <div className="hero-collage-msg rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-[8.5px] font-medium text-emerald-800">
              ✳ Sale Rp 308k → Meta Retarget A · ROAS 4.1×
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {[
            "Segment broadcast",
            "Follow-up terjadwal",
            "CAPI / Pixel",
            "ROAS per campaign",
          ].map((f) => (
            <div
              key={f}
              className="rounded-md border border-cyan-50 bg-white px-1.5 py-1 text-[7.5px] font-medium text-[#101828]"
            >
              ✓ {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ecosystem — compact live ops when no single product is in focus. */
function EcosystemMix({ orderPlaced }: { orderPlaced: boolean }) {
  return (
    <div>
      <PanelTitle label="Cekat CRM" tone="text-[#2563eb]" badge="Live" />
      <div className="mb-2 grid grid-cols-3 gap-1">
        {[
          { l: "Chats", v: "1.284" },
          { l: "Leads", v: "312" },
          { l: "Closed", v: "96" },
        ].map((m) => (
          <div key={m.l} className="rounded-md border border-[#e4e7ec] bg-white px-1.5 py-1.5">
            <div className="text-[7px] tracking-wide text-slate-500 uppercase">{m.l}</div>
            <div className="text-[11px] font-bold text-[#101828]">{m.v}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {[
          { name: "Ayu · Retail", tag: "Hot" },
          { name: "Budi · Travel", tag: "Warm" },
          { name: "Citra · Clinic", tag: "New" },
        ].map((row, i) => (
          <div
            key={row.name}
            className="hero-collage-msg flex items-center gap-1.5 rounded-md border border-sky-100 bg-white px-2 py-1.5"
            style={{ animationDelay: `${400 + i * 180}ms` }}
          >
            <span className="size-3.5 shrink-0 rounded-full bg-linear-to-br from-cyan-400 to-[#2563eb]" />
            <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-[#101828]">
              {row.name}
            </span>
            <span className="rounded bg-sky-50 px-1 py-0.5 text-[7px] font-semibold text-sky-700">
              {row.tag}
            </span>
          </div>
        ))}
      </div>
      {orderPlaced ? (
        <div className="mt-2 rounded-md border border-amber-100 bg-amber-50 px-2 py-1.5 text-[8.5px] font-medium text-amber-800">
          OMS · order Rp 308.000 auto-filled
        </div>
      ) : null}
    </div>
  );
}
