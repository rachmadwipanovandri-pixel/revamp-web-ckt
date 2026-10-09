"use client";

import { useState } from "react";
import type { SandboxCopy } from "./copy";
import { Ico } from "../Icon";
import {
  solar_check_circle_bold,
  solar_alt_arrow_up_bold,
  solar_bag_3_bold,
} from "../icons";
import {
  DEALS,
  STAGE_LABEL,
  money,
  type Deal,
  type L,
  type Stage,
} from "./data";

/**
 * CRM — the deal pipeline, and the thing you poke at.
 *
 * A pipeline that cannot be moved is a diagram. The single useful thing you can
 * do in a pipeline is advance a deal, so that is the single interaction here:
 * every card carries a control that steps it forward, and the board re-sorts.
 *
 * Stage lives in local state seeded from the data, so the demo survives a
 * contact being advanced without needing a server and without pretending to
 * persist anything.
 */
export function CrmSandbox({
  copy,
  en,
  hint,
}: {
  copy: SandboxCopy["crm"];
  en: boolean;
  hint: L;
}) {
  const t = (l: L) => (en ? l.en : l.id);
  const [stages, setStages] = useState<Record<string, Stage>>({});
  const [openId, setOpenId] = useState<string | null>(DEALS[0].id);
  const [query, setQuery] = useState("");

  const stageOf = (deal: Deal): Stage => stages[deal.id] ?? deal.stage;

  function advance(id: string) {
    setStages((current) => {
      const deal = DEALS.find((d) => d.id === id);
      if (!deal) return current;
      const next = (((current[id] ?? deal.stage) + 1) % 4) as Stage;
      return { ...current, [id]: next };
    });
  }

  const needle = query.trim().toLowerCase();
  const visible = DEALS.filter(
    (d) =>
      !needle ||
      d.customer.toLowerCase().includes(needle) ||
      d.title.id.toLowerCase().includes(needle) ||
      d.title.en.toLowerCase().includes(needle),
  );

  const open = DEALS.find((d) => d.id === openId) ?? null;
  const total = DEALS.filter((d) => stageOf(d) === 3).length;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
      <div className="border-b border-[var(--ph3-line)] lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 border-b border-[var(--ph3-line)] px-3 py-2.5">
          <label className="flex min-w-0 flex-1 items-center rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-2.5 py-1.5 focus-within:border-[var(--ph3-line-2)]">
            <span className="sr-only">{copy.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.search}
              className="min-w-0 flex-1 bg-transparent text-[0.8125rem] outline-none placeholder:text-[var(--ph3-muted-3)]"
            />
          </label>
          <span className="ph3-mono shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
            {total}/{DEALS.length} {t(hint)}
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="px-3 py-10 text-center text-[0.8125rem] text-[var(--ph3-muted-3)]">
            {copy.empty}
          </p>
        ) : (
          <div className="grid gap-px overflow-x-auto bg-[var(--ph3-line)] sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((column) => {
              const stage = column as Stage;
              const deals = visible.filter((d) => stageOf(d) === stage);
              return (
                <div key={stage} className="min-w-[13rem] bg-[var(--ph3-white)]">
                  <div className="flex items-baseline gap-2 border-b border-[var(--ph3-line)] px-3 py-2">
                    <span className="ph3-mono text-[0.5625rem] text-[var(--ph3-muted-3)]">
                      {String(stage + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate text-[0.6875rem] font-medium">
                      {t(STAGE_LABEL[stage])}
                    </span>
                    <span className="ph3-mono ml-auto text-[0.5625rem] text-[var(--ph3-muted-3)]">
                      {deals.length}
                    </span>
                  </div>

                  <ul className="list-none p-2">
                    {deals.length === 0 ? (
                      <li className="px-1 py-3 text-[0.6875rem] text-[var(--ph3-muted-3)]">
                        —
                      </li>
                    ) : (
                      deals.map((deal) => (
                        <li key={deal.id} className="mb-2 last:mb-0">
                          <div
                            className={`rounded-[var(--ph3-r-sm)] border p-2.5 transition-colors ${
                              openId === deal.id
                                ? "border-[var(--ph3-accent)]"
                                : "border-[var(--ph3-line)] hover:border-[var(--ph3-line-2)]"
                            }`}
                          >
                            <button
                              type="button"
                              aria-expanded={openId === deal.id}
                              onClick={() =>
                                setOpenId(openId === deal.id ? null : deal.id)
                              }
                              className="block w-full text-left"
                            >
                              <span className="block truncate text-[0.8125rem] font-medium text-[var(--ph3-ink)]">
                                {t(deal.title)}
                              </span>
                              <span className="mt-1 block text-[0.6875rem] text-[var(--ph3-muted-3)]">
                                {deal.customer}
                              </span>
                              <span className="mt-1.5 block text-[0.8125rem] font-semibold tabular-nums">
                                {money(deal.value, en)}
                              </span>
                            </button>

                            {/*
                              The control, not the whole card. Making the card
                              itself draggable would be nicer, but a drag is
                              unreachable by keyboard and this demo has to be
                              usable without a pointer.
                            */}
                            <button
                              type="button"
                              onClick={() => advance(deal.id)}
                              className="ph3-mono mt-2 flex w-full items-center justify-center gap-1.5 rounded-[var(--ph3-r-xs)] border border-[var(--ph3-line)] py-1.5 text-[0.5625rem] text-[var(--ph3-muted-2)] transition-colors hover:border-[var(--ph3-accent)] hover:text-[var(--ph3-accent)]"
                            >
                              <Ico icon={solar_alt_arrow_up_bold} size={10} />
                              {copy.advance}
                            </button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- deal detail ---- */}
      <aside className="p-4">
        {open ? (
          <div data-ph3-enter>
            <p className="ph3-mono text-[0.5625rem] text-[var(--ph3-muted-3)]">
              {copy.detail}
            </p>
            <p className="mt-2 text-[1rem] font-semibold tracking-tight text-[var(--ph3-ink)]">
              {t(open.title)}
            </p>
            <p className="mt-1 text-[0.8125rem] text-[var(--ph3-muted)]">
              {open.customer}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-line)]">
              <div className="bg-[var(--ph3-white)] px-3 py-2.5">
                <dt className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
                  {en ? "Value" : "Nilai"}
                </dt>
                <dd className="mt-1 text-[0.875rem] font-semibold tabular-nums">
                  {money(open.value, en)}
                </dd>
              </div>
              <div className="bg-[var(--ph3-white)] px-3 py-2.5">
                <dt className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
                  {copy.close}
                </dt>
                <dd className="mt-1 text-[0.875rem] font-semibold tabular-nums">
                  {open.close}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] p-3">
              <p className="text-[0.75rem] leading-relaxed text-[var(--ph3-muted)]">
                {t(open.note)}
              </p>
            </div>

            <div className="mt-4">
              <p className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
                {en ? "Stage" : "Tahap"}
              </p>
              <ol className="mt-2 list-none">
                {[0, 1, 2, 3].map((s, i) => {
                  const done = i <= stageOf(open);
                  return (
                    <li
                      key={s}
                      className={`flex items-center gap-2 py-1 text-[0.75rem] ${
                        done ? "text-[var(--ph3-ink)]" : "text-[var(--ph3-muted-3)]"
                      }`}
                    >
                      <Ico
                        icon={done ? solar_check_circle_bold : solar_bag_3_bold}
                        size={12}
                        className={
                          done
                            ? "text-[var(--ph3-accent)]"
                            : "text-[var(--ph3-muted-3)]"
                        }
                      />
                      {t(STAGE_LABEL[s as Stage])}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        ) : (
          <p className="text-[0.8125rem] text-[var(--ph3-muted-3)]">
            {copy.empty}
          </p>
        )}
      </aside>
    </div>
  );
}