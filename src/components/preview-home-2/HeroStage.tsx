"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { AnimGate } from "./AnimGate";
import type { HeroDashboard, LiveStage, StageCard } from "./types";

/** How long a card stays on stage once it has finished playing in. */
const INTERVAL = 5200;

/** Staggered entry: base CSS is the settled state, so `animation: none` is safe. */
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduce;
}

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      fill="none"
      stroke={light ? "#22C55E" : "#fff"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 3 4.5 9 2 6.5" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="ph2-dot h-1.5 w-1.5 rounded-full bg-[#94A3B8]"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </span>
  );
}

/** Incoming bubble + typing indicator + the AI reply that replaces it. */
function ChatThread({
  question,
  answer,
  incomingFirst = true,
}: {
  question: string;
  answer: string;
  incomingFirst?: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      <p
        className={cn(
          "ph2-in max-w-[86%] self-start rounded-[14px] bg-[#F1F5F9] px-3 py-2 text-[0.76rem] leading-[1.45] text-[#101828]",
          incomingFirst ? "rounded-tl-[5px]" : "rounded-tr-[5px]",
        )}
        style={at(90)}
      >
        {question}
        <span className="mt-1 block text-[0.6rem] text-[#94A3B8]">09:41</span>
      </p>

      {/* The typing bubble sits exactly where the reply will land, so nothing
          shifts when it swaps out — same trick as a real chat transcript. */}
      <div className="ph2-reply-slot self-end">
        <span className="ph2-typing ph2-typing-out" style={at(1150)}>
          <span
            className="ph2-in inline-flex rounded-[14px] rounded-tl-[5px] bg-[#F1F5F9] px-3 py-2.5"
            style={at(260)}
          >
            <TypingDots />
          </span>
        </span>
        <p
          className="ph2-in max-w-[86%] self-end rounded-[14px] rounded-tr-[5px] bg-primary px-3 py-2 text-[0.76rem] leading-[1.45] text-white"
          style={at(1080)}
        >
          {answer}
          <span className="mt-1 block text-[0.6rem] text-white/70">
            09:41{" "}
            <span className="tracking-[-2px] text-[#93C5FD]" aria-hidden>
              ✓✓
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

function CardHeader({
  card,
  icon,
  tone = "brand",
}: {
  card: StageCard;
  icon?: string;
  tone?: "brand" | "blue";
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-3">
      {icon ? (
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[0.68rem] font-bold",
            tone === "brand"
              ? "bg-primary text-white"
              : "bg-[#EFF6FF] text-primary",
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] font-bold tracking-[-0.01em] text-[#101828]">
          {card.title}
        </p>
        {card.footnote &&
        (card.kind === "mini" || card.kind === "consulting") ? (
          <p className="truncate text-[0.62rem] text-[#64748B]">
            {card.footnote}
          </p>
        ) : null}
      </div>
      {card.badge ? (
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-1 text-[0.56rem] font-bold",
            card.kind === "order"
              ? "bg-[#FAF9F5] text-[#BE185D]"
              : card.kind === "chat"
                ? "bg-[#EFF6FF] text-primary"
                : "flex items-center gap-1 bg-[#F0FDF4] text-[#101828]",
          )}
        >
          {(card.kind === "mini" || card.kind === "marketing") && (
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
            />
          )}
          {card.badge}
        </span>
      ) : null}
    </div>
  );
}

function Steps({ steps, start = 900 }: { steps: string[]; start?: number }) {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      {steps.map((step, index) => (
        <span
          key={step}
          className="ph2-in flex items-center gap-1.5"
          style={at(start + index * 110)}
        >
          {index > 0 ? (
            <span aria-hidden className="text-[0.6rem] text-[#94A3B8]">
              →
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[0.58rem] font-semibold",
              index === steps.length - 1
                ? "bg-primary text-white"
                : "border border-[#BBF7D0] bg-[#F0FDF4] text-[#101828]",
            )}
          >
            {step}
          </span>
        </span>
      ))}
    </div>
  );
}

function CtaPill({ label, delay = 1400 }: { label: string; delay?: number }) {
  return (
    <p
      className="ph2-in mt-3 rounded-xl bg-primary px-3 py-2 text-center text-[0.7rem] font-bold text-white"
      style={at(delay)}
    >
      {label}
    </p>
  );
}

function sparkPaths(values: number[], w = 300, h = 40) {
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((value, index) => ({
    x: index * step,
    y: h - (value / 100) * h,
  }));
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  return {
    line,
    area: `${line} L${w} ${h} L0 ${h} Z`,
    last: points[points.length - 1],
  };
}

/** The per-product mini UI. `kind` decides which one is drawn. */
function CardBody({ card }: { card: StageCard }) {
  switch (card.kind) {
    case "chat":
      return (
        <>
          <div className="flex items-center gap-2.5 border-b border-[#F1F5F9] pb-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[0.7rem] font-bold text-primary">
              SW
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.8rem] font-bold text-[#101828]">
                {card.title}
              </p>
              <p className="flex items-center gap-1.5 text-[0.62rem] font-medium text-[#22C55E]">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
                />
                {card.footnote}
              </p>
            </div>
            {card.badge ? (
              <span className="shrink-0 rounded-full bg-[#EFF6FF] px-2 py-1 text-[0.56rem] font-bold text-primary">
                {card.badge}
              </span>
            ) : null}
          </div>

          <ChatThread question={card.lines[0]} answer={card.lines[1]} />

          {card.quick ? (
            <div
              className="ph2-in mt-3 flex flex-wrap gap-1.5"
              style={at(1450)}
            >
              <span className="rounded-full bg-primary px-2.5 py-1.5 text-[0.64rem] font-semibold text-white">
                {card.quick[0]}
              </span>
              <span className="rounded-full border border-border bg-white px-2.5 py-1.5 text-[0.64rem] font-semibold text-[#4B5563]">
                {card.quick[1]}
              </span>
            </div>
          ) : null}
        </>
      );

    case "order":
      return (
        <>
          <CardHeader card={card} />

          <div className="ph2-in mt-3 flex items-center gap-2.5" style={at(90)}>
            <span
              aria-hidden
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#0B1220]"
            >
              <span className="absolute inset-x-3 inset-y-2.5 rounded-[4px] border border-white/55" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.78rem] font-semibold text-[#101828]">
                {card.lines[0]}
              </p>
              <p className="truncate text-[0.66rem] text-[#64748B]">
                {card.lines[1]}
              </p>
            </div>
          </div>

          <ul className="mt-3 flex flex-col gap-1.5">
            {card.rows?.map((row, index) => {
              const total = index === (card.rows?.length ?? 0) - 1;
              return (
                <li
                  key={row.label}
                  className={cn(
                    "ph2-in flex items-center justify-between gap-2 text-[0.72rem]",
                    total
                      ? "border-t border-dashed border-border pt-1.5 font-bold text-[#101828]"
                      : "text-[#64748B]",
                  )}
                  style={at(180 + index * 110)}
                >
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.value}</span>
                </li>
              );
            })}
          </ul>

          {card.footnote ? (
            <p
              className="ph2-in mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[0.72rem] font-bold text-[#101828]"
              style={at(620)}
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#22C55E]">
                <Check />
              </span>
              {card.footnote}
            </p>
          ) : null}

          {card.chips ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {card.chips.map((chip, index) => (
                <span
                  key={chip}
                  className="ph2-in inline-flex items-center gap-1 rounded-full border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-1 text-[0.58rem] font-semibold text-[#4B5563]"
                  style={at(760 + index * 90)}
                >
                  {chip}
                  <span aria-hidden className="text-[#22C55E]">
                    ✓
                  </span>
                </span>
              ))}
            </div>
          ) : null}

          {card.steps ? <Steps steps={card.steps} start={1030} /> : null}
        </>
      );

    case "crm":
      return (
        <>
          <div className="flex items-center gap-2.5">
            <span
              className="ph2-in grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-[0.72rem] font-bold text-primary"
              style={at(70)}
            >
              SW
            </span>
            <div className="min-w-0">
              <p
                className="ph2-in truncate text-[0.8rem] font-bold text-[#101828]"
                style={at(110)}
              >
                {card.title}
              </p>
              <p
                className="ph2-in truncate text-[0.64rem] text-[#64748B]"
                style={at(150)}
              >
                {card.lines[0]}
              </p>
            </div>
          </div>

          {card.chips ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.chips.map((chip, index) => (
                <span
                  key={chip}
                  className={cn(
                    "ph2-in rounded-full px-2 py-1 text-[0.58rem] font-semibold",
                    index === 0
                      ? "bg-[#EFF6FF] text-primary"
                      : "border border-border bg-white text-[#4B5563]",
                  )}
                  style={at(230 + index * 90)}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {card.rows ? (
            <dl className="mt-3 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-2 text-center"
                  style={at(500 + index * 100)}
                >
                  <dd className="text-[0.78rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </dd>
                  <dt className="mt-0.5 text-[0.56rem] text-[#64748B]">
                    {row.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          {card.steps ? <Steps steps={card.steps} start={840} /> : null}
        </>
      );

    case "mini":
      return (
        <>
          <CardHeader card={card} icon="C" />

          <ChatThread
            question={card.lines[0]}
            answer={card.lines[1]}
            incomingFirst={false}
          />

          {card.rows ? (
            <div className="mt-2.5 flex gap-2">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in flex flex-1 items-center gap-2 rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] px-2 py-2"
                  style={at(1280 + index * 120)}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-7 w-7 shrink-0 rounded-lg",
                      index === 0
                        ? "bg-gradient-to-br from-[#4ABF5D] to-[#22C55E]"
                        : "bg-gradient-to-br from-[#FAF9F5] to-[#453F3D]",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.62rem] font-semibold text-[#101828]">
                      {row.label}
                    </span>
                    <span className="block text-[0.56rem] font-bold text-primary">
                      {row.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {card.quick ? <CtaPill label={card.quick[0]} delay={1560} /> : null}
        </>
      );

    case "consulting":
      return (
        <>
          <CardHeader card={card} icon="◆" tone="blue" />

          <ul className="mt-3 flex flex-col gap-2">
            {card.lines.map((line, index) => (
              <li
                key={line}
                className="ph2-in flex items-start gap-2 text-[0.72rem] leading-[1.45] text-[#4B5563]"
                style={at(120 + index * 140)}
              >
                <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#F0FDF4]">
                  <Check light />
                </span>
                {line}
              </li>
            ))}
          </ul>

          {card.bars && card.days && card.metric ? (
            <div
              className="ph2-in mt-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFF] p-2.5"
              style={at(560)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.58rem] font-semibold text-[#4B5563]">
                  {card.metric.label}
                </span>
                <span className="text-[0.62rem] font-bold text-[#22C55E]">
                  {card.metric.value}
                </span>
              </div>
              <div className="mt-2 flex h-10 items-end gap-1">
                {card.bars.map((height, index) => (
                  <span
                    key={index}
                    className="ph2-bar flex-1 rounded-sm bg-gradient-to-t from-[#1352BF] to-[#3B82F6]"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${620 + index * 70}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex">
                {card.days.map((day, index) => (
                  <span
                    key={index}
                    className="flex-1 text-center text-[0.54rem] text-[#94A3B8]"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {card.quick ? <CtaPill label={card.quick[0]} delay={1180} /> : null}
        </>
      );

    case "marketing": {
      const spark = card.spark ? sparkPaths(card.spark) : null;
      return (
        <>
          <CardHeader card={card} icon="M" />

          <p
            className="ph2-in mt-3 text-[0.68rem] text-[#64748B]"
            style={at(90)}
          >
            {card.lines[0]}
          </p>

          {card.rows ? (
            <dl className="mt-2.5 grid grid-cols-3 gap-1.5">
              {card.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="ph2-in rounded-lg border border-[#F1F5F9] bg-[#F8FAFF] px-1.5 py-1.5 text-center"
                  style={at(170 + index * 90)}
                >
                  <dd className="text-[0.72rem] font-bold text-[#101828] tabular-nums">
                    {row.value}
                  </dd>
                  <dt className="mt-px text-[0.54rem] text-[#64748B]">
                    {row.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          {card.metric ? (
            <div
              className="ph2-in mt-3 flex items-baseline gap-2"
              style={at(470)}
            >
              <span className="text-[1.5rem] leading-none font-bold tracking-[-0.03em] text-[#101828] tabular-nums">
                {card.metric.value}
              </span>
              <span className="text-[0.58rem] text-[#64748B]">
                {card.metric.label}
              </span>
            </div>
          ) : null}

          {spark ? (
            <svg
              viewBox="0 0 300 40"
              fill="none"
              className="mt-2 h-10 w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="ph2-spark-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1352BF" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#1352BF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={spark.area} fill="url(#ph2-spark-fill)" />
              <path
                className="ph2-draw"
                d={spark.line}
                stroke="#1352BF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx={spark.last.x}
                cy={spark.last.y}
                r="3.5"
                fill="#1352BF"
              />
            </svg>
          ) : null}

          {card.footnote ? (
            <p
              className="ph2-in mt-2 text-[0.62rem] font-semibold text-[#101828]"
              style={at(1150)}
            >
              {card.footnote}
            </p>
          ) : null}
        </>
      );
    }
  }
}

/** The Cekat app window the card floats on. */
function Dashboard({ dashboard }: { dashboard: HeroDashboard }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-border bg-white shadow-[0_1px_2px_rgba(11,18,32,0.05),0_44px_84px_-54px_rgba(11,18,32,0.5)]">
      <div className="flex items-center gap-1.5 border-b border-[#F1F5F9] bg-[#FAFBFC] px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
        ))}
        <span className="ml-2 truncate rounded-full border border-border bg-white px-3 py-1 text-[0.65rem] text-[#64748B]">
          {dashboard.url}
        </span>
      </div>

      {/* `lg:px-10` is the exact width the floating card overlaps, so it never
          covers a label or a number. */}
      <div className="grid lg:grid-cols-[164px_minmax(0,1fr)] lg:px-10 xl:grid-cols-[164px_minmax(0,1fr)_186px]">
        <aside className="hidden border-r border-[#F1F5F9] py-4 pr-3.5 lg:block">
          {dashboard.nav.map((item, index) => (
            <div
              key={item}
              className={cn(
                "mb-0.5 flex items-center gap-2 rounded-lg px-3 py-2 text-[0.72rem]",
                index === 0
                  ? "bg-[#EFF6FF] font-semibold text-primary"
                  : "text-[#64748B]",
              )}
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-current opacity-25"
              />
              {item}
            </div>
          ))}
        </aside>

        <div className="p-4 lg:px-5 lg:py-5">
          <p className="text-[0.75rem] font-bold tracking-[-0.01em] text-[#101828]">
            {dashboard.title}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {dashboard.rows.map((row) => (
              <div
                key={row.who}
                className="flex gap-2.5 rounded-xl border border-border bg-white p-2.5"
              >
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.6rem] font-bold text-white"
                  style={{ background: row.accent }}
                >
                  {row.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.7rem] font-semibold text-[#101828]">
                    {row.who}
                  </p>
                  <p className="mt-0.5 text-[0.68rem] leading-[1.4] text-[#64748B]">
                    {row.msg}
                  </p>
                  <span className="mt-1.5 inline-flex rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[0.6rem] font-semibold text-primary">
                    {row.chip}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden flex-col gap-2 border-l border-[#F1F5F9] py-4 pl-3.5 xl:flex">
          {dashboard.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-2.5"
            >
              <p className="text-[0.9rem] font-bold tracking-[-0.02em] text-[#101828] tabular-nums">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[0.6rem] leading-[1.3] text-[#64748B]">
                {stat.label}
              </p>
              {stat.spark ? (
                <div aria-hidden className="mt-1.5 flex h-5 items-end gap-0.5">
                  {[40, 55, 48, 70, 66, 84, 96].map((height, index) => (
                    <i
                      key={index}
                      className="flex-1 rounded-sm bg-gradient-to-t from-[#1352BF] to-[#3B82F6]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </aside>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white lg:hidden"
      />
    </div>
  );
}

function StageCardView({ card, active }: { card: StageCard; active: boolean }) {
  return (
    <div
      aria-hidden={!active || undefined}
      className={cn(
        "ph2-stage-card w-full rounded-[18px] border bg-white p-4",
        active
          ? "border-[#BFDBFE] opacity-100 shadow-[0_1px_2px_rgba(11,18,32,0.06),0_32px_64px_-30px_rgba(19,82,191,0.5)]"
          : "border-border opacity-0 shadow-[0_1px_2px_rgba(11,18,32,0.05),0_20px_44px_-30px_rgba(11,18,32,0.4)]",
      )}
      style={{ transform: active ? "none" : "translateY(16px) scale(0.975)" }}
    >
      <p className="mb-3 text-[0.58rem] font-bold tracking-[0.1em] text-[#64748B] uppercase">
        {card.label}
      </p>
      <CardBody card={card} />
    </div>
  );
}

/**
 * Hero stage — the Cekat dashboard with the looping product cards floating on
 * top of it, ported from /preview-home's `#heroSec/div[2]`.
 *
 * One full-size card at a time (as in /preview-home), not six small ones: each
 * card plays its own mini UI in sequence — the chat shows a typing bubble that
 * is replaced by the reply and its read ticks, the order fills in its rows and
 * rail, the consulting chart grows its bars.
 *
 * There is no control bar: the loop runs continuously for as long as the
 * visitor is on the page, and only the pointer resting on the stage (or focus
 * inside it) holds the current card so it can be read. With
 * `prefers-reduced-motion` the loop is replaced by a static gallery instead of a
 * paused carousel, so no card is unreachable.
 */
export function HeroStage({
  dashboard,
  stage,
}: {
  dashboard: HeroDashboard;
  stage: LiveStage;
}) {
  const cards = stage.cards;
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduce = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Hovering or focusing the stage holds the current card so it can be read.
  const running = !hovered && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setActive((current) => (current + 1) % cards.length);
      setCycle((current) => current + 1);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [running, cards.length]);

  /**
   * Scroll-linked growth: the stage swells from 88% to full size as it travels
   * into view, then holds. `--stage` is written straight to the DOM inside a
   * rAF, so it tracks the scroll exactly instead of playing a transition
   * behind it.
   *
   * `transform-origin: center top` (see the CSS) is what keeps this stable: the
   * top edge does not move when the element scales, so the rect measured here
   * never depends on the value being written.
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (reduceMotion.matches) {
        el.style.setProperty("--stage", "1");
        return;
      }
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 0 when the stage's top sits on the bottom edge of the viewport, 1 once
      // it has travelled 60% of the viewport upwards.
      const p = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport * 0.6)),
      );
      el.style.setProperty("--stage", (0.88 + 0.12 * p).toFixed(4));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduceMotion.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduceMotion.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div role="group" aria-label={stage.heading}>
      <p className="sr-only">{stage.caption}</p>

      <div ref={stageRef} className="ph2-stage-scale">
        {reduce ? (
          // No motion: unfold the loop into a plain gallery, so all six product
          // views stay readable instead of five of them being unreachable.
          <div className="flex flex-col gap-8">
            <div className="mx-auto w-full max-w-[880px]">
              <Dashboard dashboard={dashboard} />
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <li key={card.label}>
                  <StageCardView card={card} active />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <AnimGate>
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocusCapture={() => setHovered(true)}
              onBlurCapture={() => setHovered(false)}
            >
              <div className="relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-10 top-4 bottom-4 hidden rounded-[48px] bg-[radial-gradient(55%_55%_at_50%_50%,rgba(19,82,191,0.10),transparent_72%)] lg:block"
                />

                <div className="relative lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:items-center xl:grid-cols-[380px_minmax(0,1fr)]">
                  {/* Desktop: all six cards share one grid cell, so the column is
                  always as tall as the tallest card and the swap never jumps. */}
                  <div className="ph2-anim relative z-20 hidden lg:grid">
                    {cards.map((card, index) => {
                      const isActive = index === active;
                      return (
                        <div
                          key={`${card.label}-${isActive ? cycle : 0}`}
                          className="col-start-1 row-start-1"
                        >
                          <StageCardView card={card} active={isActive} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative z-10 lg:-ml-10">
                    <Dashboard dashboard={dashboard} />
                  </div>
                </div>

                {/* Below lg the card drops under the window and overlaps its edge. */}
                <div className="ph2-anim relative z-20 -mt-6 grid lg:hidden">
                  {cards.map((card, index) => {
                    const isActive = index === active;
                    return (
                      <div
                        key={`${card.label}-${isActive ? cycle : 0}`}
                        className="col-start-1 row-start-1 w-[min(92vw,440px)] justify-self-center"
                      >
                        <StageCardView card={card} active={isActive} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AnimGate>
        )}
      </div>
    </div>
  );
}
