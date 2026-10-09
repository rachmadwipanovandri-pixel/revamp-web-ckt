"use client";

import { useEffect, useRef, useState } from "react";
import type { SandboxCopy } from "./copy";
import { Ico } from "../Icon";
import { solar_check_circle_bold } from "../icons";
import { QUESTIONS, type L, type Question } from "./data";

/**
 * Cekat Consultant Agent — asking the business a question.
 *
 * This is the module people most want to try, and the one most likely to
 * mislead. A visitor types "berapa piutku?" and gets a confident paragraph,
 * and the honest position is that *this is the product's real behaviour* — the
 * consultant answers from the business's own connected data, not from a general
 * model. So the demo does two things a mock usually skips:
 *
 *   - Every answer lists the sources it was drawn from, visibly, underneath. An
 *     answer with no sources is exactly what a hallucinating assistant looks
 *     like, and showing them is what separates this from one.
 *   - Free text is answered honestly too. If the question is not one of the
 *     five, the panel says it is outside the sample data rather than inventing a
 *     plausible number. That refusal is the feature: it is what "answers from
 *     your information" means when the answer is not in there.
 */
export function ConsultantSandbox({
  copy,
  en,
}: {
  copy: SandboxCopy["consultant"];
  en: boolean;
}) {
  const t = (l: L) => (en ? l.en : l.id);
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState<{ ask: L; answer: Question | null }[]>([]);
  const scroller = useRef<HTMLOListElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [log]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    /*
     * Matched on the suggestion set, loosely: the five canonical questions plus
     * anything containing a keyword. `null` for a miss, which the panel renders
     * as the refusal rather than a best-guess paragraph — see the note above.
     */
    const needle = trimmed.toLowerCase();
    const hit =
      QUESTIONS.find((q) => needle === q.ask.id.toLowerCase()) ??
      QUESTIONS.find((q) => {
        const words = {
          /*
           * `"berapa"` was in this list and had to come out. It matches almost
           * any question — "berapa piutku?" came back with a confident answer
           * about revenue, which is precisely the behaviour this module exists
           * to distinguish itself from. A refusal is a feature here, and an
           * over-broad keyword quietly removes it.
           */
          revenue: ["omzet", "penjualan", "jualan", "revenue", "sales", "bulan ini"],
          top: ["laku", "laris", "terlaris", "best", "top", "produk", "product"],
          todo: ["kerja", "todo", "hari ini", "today", "perlu", "next"],
          lapsed: ["kejar", "dingin", "chase", "cold", "lupa", "kembali"],
          stock: ["stok", "stock", "linen", "sisa", "habis"],
        }[q.id];
        return words?.some((w) => needle.includes(w)) ?? false;
      }) ?? null;

    setLog((current) => [
      ...current,
      { ask: { id: trimmed, en: trimmed }, answer: hit },
    ]);
    setDraft("");
  }

  return (
    <div className="flex min-h-[30rem] flex-col">
      <ol ref={scroller} className="flex list-none flex-col gap-5 overflow-y-auto p-4">
        {log.length === 0 ? (
          <li>
            <p className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
              {copy.suggested}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {QUESTIONS.map((question) => (
                <li key={question.id}>
                  <button
                    type="button"
                    onClick={() => ask(t(question.ask))}
                    className="rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] px-2.5 py-1.5 text-[0.75rem] text-[var(--ph3-muted)] transition-colors hover:border-[var(--ph3-accent)] hover:text-[var(--ph3-accent)]"
                  >
                    {t(question.ask)}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ) : null}

        {log.map((entry, index) => (
          <li key={index} className="flex flex-col gap-2.5">
            <p className="ph3-bubble ph3-bubble-in max-w-[80%] self-end is-in">
              {t(entry.ask)}
            </p>

            <div className="max-w-[92%] self-start rounded-[var(--ph3-r)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] p-3">
              {entry.answer ? (
                <>
                  <p className="text-[0.875rem] font-semibold tracking-tight text-[var(--ph3-ink)]">
                    {t(entry.answer.answer.headline)}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--ph3-muted)]">
                    {t(entry.answer.answer.body)}
                  </p>

                  <dl className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-line)]">
                    {entry.answer.answer.metrics.map((metric) => (
                      <div
                        key={metric.label.en}
                        className="bg-[var(--ph3-white)] px-2.5 py-2"
                      >
                        <dd className="text-[0.875rem] font-semibold tabular-nums tracking-tight text-[var(--ph3-ink)]">
                          {metric.value}
                        </dd>
                        <dt className="mt-0.5 text-[0.5625rem] leading-snug text-[var(--ph3-muted-3)]">
                          {t(metric.label)}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  {/*
                    The sources, always shown. This is the line that makes the
                    difference between "answers from your data" and "invents
                    something plausible" — and it is the only reason to believe
                    the number above it.
                  */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--ph3-line)] pt-2.5">
                    <span className="ph3-mono text-[0.5rem] text-[var(--ph3-muted-3)]">
                      {copy.sources}
                    </span>
                    {entry.answer.answer.sources.map((source) => (
                      <span
                        key={source.en}
                        className="ph3-mono inline-flex items-center gap-1 text-[0.5625rem] text-[var(--ph3-muted-2)]"
                      >
                        <Ico
                          icon={solar_check_circle_bold}
                          size={11}
                          className="text-[var(--ph3-accent)]"
                        />
                        {t(source)}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[0.875rem] font-semibold tracking-tight text-[var(--ph3-ink)]">
                    {t(copy.fallback)}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--ph3-muted)]">
                    {en
                      ? "Try one of the questions above — the answers come from a small sample dataset, and anything outside it is left unanswered on purpose."
                      : "Coba salah satu pertanyaan di atas — jawabannya berasal dari kumpulan data contoh, dan apa pun di luar itu sengaja tidak dijawab."}
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
        }}
        className="mt-auto border-t border-[var(--ph3-line)] p-3"
      >
        <label className="sr-only" htmlFor="ph3-ask">
          {copy.ask}
        </label>
        <div className="flex items-end gap-2">
          <input
            id="ph3-ask"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.placeholder}
            className="min-h-[2.5rem] min-w-0 flex-1 rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-3 py-2.5 text-[0.8125rem] outline-none transition-colors placeholder:text-[var(--ph3-muted-3)] focus:border-[var(--ph3-line-2)]"
          />
          <button
            type="submit"
            disabled={draft.trim().length === 0}
            className="h-10 shrink-0 rounded-[var(--ph3-r-sm)] bg-[var(--ph3-ink)] px-3 text-[0.75rem] font-medium text-white transition-opacity disabled:opacity-40"
          >
            {copy.send}
          </button>
        </div>
        <p className="ph3-mono mt-2 text-[0.5625rem] text-[var(--ph3-muted-3)]">
          {copy.askMore}
        </p>
      </form>
    </div>
  );
}