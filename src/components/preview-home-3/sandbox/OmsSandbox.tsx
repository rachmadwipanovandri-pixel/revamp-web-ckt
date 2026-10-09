"use client";

import { useState } from "react";
import type { SandboxCopy } from "./copy";
import { Ico } from "../Icon";
import { solar_verified_check_bold } from "../icons";
import {
  ORDERS,
  ORDER_STAGE_LABEL,
  type L,
  type Order,
  type OrderStage,
} from "./data";

/**
 * OMS — the order book, filterable and advanceable.
 *
 * Different from the CRM on purpose. A CRM is about money and people and has
 * long, uneven columns; an order book is a ledger, and a ledger is read by
 * narrowing it. So the interaction here is the filter plus the status stepper —
 * "which orders are stuck?" is the question this screen exists to answer.
 */
export function OmsSandbox({
  copy,
  en,
}: {
  copy: SandboxCopy["oms"];
  en: boolean;
}) {
  const t = (l: L) => (en ? l.en : l.id);
  const [stages, setStages] = useState<Record<string, OrderStage>>({});
  const [filter, setFilter] = useState<OrderStage | "all">("all");
  const [query, setQuery] = useState("");

  const stageOf = (order: Order): OrderStage => stages[order.id] ?? order.stage;

  function advance(id: string) {
    setStages((current) => {
      const order = ORDERS.find((o) => o.id === id);
      if (!order) return current;
      const next = (((current[id] ?? order.stage) + 1) % 4) as OrderStage;
      return { ...current, [id]: next };
    });
  }

  const needle = query.trim().toLowerCase();
  const rows = ORDERS.filter((order) => {
    if (filter !== "all" && stageOf(order) !== filter) return false;
    if (!needle) return true;
    return (
      order.id.toLowerCase().includes(needle) ||
      order.customer.toLowerCase().includes(needle)
    );
  });

  // "Stuck" is the question a ledger gets opened for: nothing has moved and
  // nothing is paid.
  const stuck = ORDERS.filter((o) => stageOf(o) === 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--ph3-line)] px-3 py-2.5">
        <label className="flex min-w-[10rem] flex-1 items-center rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-2.5 py-1.5 focus-within:border-[var(--ph3-line-2)]">
          <span className="sr-only">{copy.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            className="min-w-0 flex-1 bg-transparent text-[0.8125rem] outline-none placeholder:text-[var(--ph3-muted-3)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", 0, 1, 2, 3] as const).map((value) => {
            const on = filter === value;
            return (
              <button
                key={String(value)}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(value)}
                className={`ph3-mono h-6 rounded-[var(--ph3-r-xs)] border px-2 text-[0.5625rem] transition-colors ${
                  on
                    ? "border-[var(--ph3-accent)] text-[var(--ph3-accent)]"
                    : "border-[var(--ph3-line)] text-[var(--ph3-muted-3)] hover:border-[var(--ph3-line-2)]"
                }`}
              >
                {value === "all"
                  ? copy.all
                  : t(ORDER_STAGE_LABEL[value as OrderStage])}
              </button>
            );
          })}
        </div>

        <span className="ph3-mono shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
          <span className="text-[var(--ph3-accent)]">{stuck}</span> {copy.stuck}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="px-3 py-10 text-center text-[0.8125rem] text-[var(--ph3-muted-3)]">
          {copy.empty}
        </p>
      ) : (
        <ul className="list-none">
          {rows.map((order) => {
            const stage = stageOf(order);
            return (
              <li
                key={order.id}
                className="grid items-center gap-2 border-b border-[var(--ph3-line)] px-3 py-2.5 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto_auto]"
              >
                <span className="ph3-mono shrink-0 text-[0.625rem]">
                  {order.id}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-[0.8125rem]">
                    {t(order.items)}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.625rem] text-[var(--ph3-muted-3)]">
                    {order.customer} · {t(order.courier)}
                  </span>
                </span>

                <span className="text-[0.8125rem] font-semibold tabular-nums">
                  {order.total}
                </span>

                {/*
                  The stepper. Four small segments, each a button, and the
                  filled ones are also the ones you can jump back to — an OMS
                  where you cannot undo a mistake is not a tool, it is a rumour.
                */}
                <span className="flex items-center gap-1">
                  {[0, 1, 2, 3].map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      aria-label={`${order.id}: ${t(ORDER_STAGE_LABEL[s as OrderStage])}`}
                      aria-pressed={i <= stage}
                      onClick={() =>
                        setStages((current) => ({
                          ...current,
                          [order.id]: s as OrderStage,
                        }))
                      }
                      className={`h-4 w-4 rounded-[2px] border transition-colors ${
                        i <= stage
                          ? "border-[var(--ph3-accent)] bg-[var(--ph3-accent)]"
                          : "border-[var(--ph3-line-2)] hover:border-[var(--ph3-muted-3)]"
                      }`}
                    />
                  ))}
                </span>

                <button
                  type="button"
                  onClick={() => advance(order.id)}
                  className="ph3-mono flex shrink-0 items-center gap-1.5 rounded-[var(--ph3-r-xs)] border border-[var(--ph3-line)] px-2 py-1.5 text-[0.5625rem] text-[var(--ph3-muted-2)] transition-colors hover:border-[var(--ph3-accent)] hover:text-[var(--ph3-accent)]"
                >
                  <Ico icon={solar_verified_check_bold} size={11} />
                  {copy.advance}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}