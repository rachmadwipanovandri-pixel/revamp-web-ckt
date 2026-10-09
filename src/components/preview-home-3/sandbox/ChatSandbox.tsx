"use client";

import { useEffect, useRef, useState } from "react";
import type { SandboxCopy } from "./copy";
import { Ico } from "../Icon";
import {
  solar_check_circle_bold,
  solar_magnifer_bold,
  solar_send_square_bold,
  solar_user_rounded_bold,
  solar_users_group_rounded_bold,
} from "../icons";
import {
  CONTACTS,
  CHANNEL_LABEL,
  STAGE_LABEL,
  type Channel,
  type L,
  type Msg,
} from "./data";

/**
 * The shared inbox, and the one module a visitor will try first.
 *
 * A visitor typing here is the closest thing to the real product on the page, so
 * it is also the one where pretending would do the most damage. Three things are
 * therefore stated plainly rather than left to be discovered:
 *
 *   - The replies are scripted. A visitor typing "berapa harga iphone?" gets a
 *     canned line from this contact's pool. That is the actual product
 *     behaviour — the assistant answers from the business's own information — so
 *     the demo is showing the real thing, not a toy version of it.
 *   - Nothing is transmitted. No request is made with what is typed.
 *   - The badge and the line under the composer say both, in the two places a
 *     visitor actually looks: the chrome, and the field they are about to type
 *     into.
 */
export function ChatSandbox({
  copy,
  en,
}: {
  copy: SandboxCopy["chat"];
  en: boolean;
}) {
  const t = (l: L) => (en ? l.en : l.id);

  const [selectedId, setSelectedId] = useState(CONTACTS[0].id);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<Channel | "all">("all");
  const [stages, setStages] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [draft, setDraft] = useState("");
  const [typingId, setTypingId] = useState<string | null>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  const needle = query.trim().toLowerCase();
  const filtered = CONTACTS.filter((contact) => {
    if (channel !== "all" && contact.channel !== channel) return false;
    if (!needle) return true;
    return (
      contact.name.toLowerCase().includes(needle) ||
      contact.place.id.toLowerCase().includes(needle) ||
      contact.place.en.toLowerCase().includes(needle)
    );
  });

  const selected =
    CONTACTS.find((contact) => contact.id === selectedId) ?? CONTACTS[0];
  const thread: Msg[] = [...selected.thread, ...(extra[selected.id] ?? [])];

  // The scripted reply is on a timer, so it must be cancellable: switching
  // contacts mid-flight would otherwise land the answer in the wrong thread.
  useEffect(
    () => () => {
      window.clearTimeout(replyTimer.current);
    },
    [selectedId],
  );

  function advanceStage(id: string) {
    setStages((current) => {
      const contact = CONTACTS.find((c) => c.id === id);
      if (!contact) return current;
      return { ...current, [id]: ((current[id] ?? contact.stage) + 1) % 4 };
    });
  }

  function send(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const contactId = selectedId;
    setExtra((current) => ({
      ...current,
      [contactId]: [
        ...(current[contactId] ?? []),
        { from: "you", text: { id: text, en: text } },
      ],
    }));
    setDraft("");
    setTypingId(contactId);

    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      const contact = CONTACTS.find((c) => c.id === contactId);
      if (!contact) return;
      setExtra((current) => {
        const list = current[contactId] ?? [];
        /*
         * Indexed off the visitor's own messages and computed *inside* the
         * updater. Reading it from the `extra` captured when send() ran is a
         * stale snapshot: two messages inside the 750ms window both saw length 0
         * and both got reply[0].
         */
        const sent = list.filter((m) => m.from === "you").length;
        return {
          ...current,
          [contactId]: [
            ...list,
            {
              from: "cekat" as const,
              text: contact.replies[sent % contact.replies.length],
              note: {
                id: "dari data bisnis Anda",
                en: "from your business data",
              },
            },
          ],
        };
      });
      setTypingId(null);
    }, 750);
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="flex flex-col border-b border-[var(--ph3-line)] lg:border-r lg:border-b-0">
        <div className="border-b border-[var(--ph3-line)] p-3">
          <label className="flex items-center gap-2 rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-2.5 py-2 focus-within:border-[var(--ph3-line-2)]">
            <Ico
              icon={solar_magnifer_bold}
              size={13}
              className="shrink-0 text-[var(--ph3-muted-3)]"
            />
            <span className="sr-only">{copy.search}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.search}
              className="min-w-0 flex-1 bg-transparent text-[0.8125rem] outline-none placeholder:text-[var(--ph3-muted-3)]"
            />
          </label>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {(["all", "whatsapp", "instagram", "tiktok", "web"] as const).map(
              (value) => {
                const on = channel === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setChannel(value)}
                    className={`ph3-tab-num h-6 rounded-[var(--ph3-r-xs)] border px-2 transition-colors ${
                      on
                        ? "border-[var(--ph3-accent)] text-[var(--ph3-accent)]"
                        : "border-[var(--ph3-line)] text-[var(--ph3-muted-3)] hover:border-[var(--ph3-line-2)]"
                    }`}
                  >
                    {value === "all" ? copy.filterAll : t(CHANNEL_LABEL[value])}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <ul className="max-h-[19rem] flex-1 list-none overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-[0.8125rem] text-[var(--ph3-muted-3)]">
              {copy.empty}
            </li>
          ) : (
            filtered.map((contact) => {
              const on = contact.id === selectedId;
              const stage = stages[contact.id] ?? contact.stage;
              return (
                <li key={contact.id}>
                  <button
                    type="button"
                    aria-current={on ? "true" : undefined}
                    onClick={() => setSelectedId(contact.id)}
                    className={`flex w-full items-center gap-2.5 border-b border-[var(--ph3-line)] px-3 py-2.5 text-left transition-colors ${
                      on
                        ? "bg-[var(--ph3-surface)]"
                        : "hover:bg-[var(--ph3-surface)]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                        on
                          ? "border-[var(--ph3-accent)] text-[var(--ph3-accent)]"
                          : "border-[var(--ph3-line)] text-[var(--ph3-muted-3)]"
                      }`}
                    >
                      <Ico icon={solar_users_group_rounded_bold} size={13} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="truncate text-[0.8125rem] font-medium text-[var(--ph3-ink)]">
                          {contact.name}
                        </span>
                        <span className="ph3-mono shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
                          {t(contact.place)}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-[0.6875rem] text-[var(--ph3-muted-3)]">
                        {t(CHANNEL_LABEL[contact.channel])} · {t(contact.value)}
                      </span>
                    </span>

                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`${copy.stageHint}: ${contact.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        advanceStage(contact.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          advanceStage(contact.id);
                        }
                      }}
                      className={`ph3-mono shrink-0 rounded-[var(--ph3-r-xs)] border px-1.5 py-1 text-[0.5625rem] ${
                        stage === 3
                          ? "border-[var(--ph3-accent)] text-[var(--ph3-accent)]"
                          : "border-[var(--ph3-line)] text-[var(--ph3-muted-3)]"
                      }`}
                    >
                      {t(STAGE_LABEL[stage as keyof typeof STAGE_LABEL])}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <div className="flex min-h-[28rem] flex-col">
        <div className="flex items-center gap-2.5 border-b border-[var(--ph3-line)] px-4 py-3">
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--ph3-line)] text-[var(--ph3-muted-3)]"
          >
            <Ico icon={solar_user_rounded_bold} size={15} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-medium text-[var(--ph3-ink)]">
              {selected.name}
            </p>
            <p className="ph3-mono mt-0.5 text-[0.5625rem]">
              {t(selected.place)} · {t(CHANNEL_LABEL[selected.channel])}
            </p>
          </div>
          <span className="ph3-mono ml-auto shrink-0 text-[0.5625rem] text-[var(--ph3-muted-3)]">
            {t(selected.value)}
          </span>
        </div>

        {/*
          `aria-live` here and nowhere else on this page. This region only changes
          because the visitor typed, which is what a live region is for; the
          looping hero deliberately has none.
        */}
        <ol
          aria-live="polite"
          aria-label={copy.composerLabel}
          className="flex flex-1 list-none flex-col gap-2.5 overflow-y-auto px-4 py-4"
        >
          {thread.map((msg, index) => (
            <li
              key={`${selectedId}-${index}`}
              className={`flex flex-col ${
                msg.from === "you" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`ph3-bubble max-w-[85%] is-in ${
                  msg.from === "cekat"
                    ? "ph3-bubble-ai self-end"
                    : msg.from === "you"
                      ? "ph3-bubble-in self-end bg-[var(--ph3-ink)] text-white"
                      : "ph3-bubble-in self-start"
                }`}
              >
                {t(msg.text)}
                {msg.note ? (
                  <span className="ph3-grounded flex items-center gap-1.5">
                    <Ico icon={solar_check_circle_bold} size={11} />
                    {t(msg.note)}
                  </span>
                ) : null}
              </span>
            </li>
          ))}

          {typingId === selectedId ? (
            <li className="flex flex-col items-end">
              <span aria-hidden className="ph3-bubble ph3-bubble-in max-w-[60%] self-end">
                <span className="ph3-typing">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            </li>
          ) : null}
        </ol>

        <form onSubmit={send} className="border-t border-[var(--ph3-line)] p-3">
          <label className="sr-only" htmlFor="ph3-composer">
            {copy.composerLabel}
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="ph3-composer"
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends, Shift+Enter breaks the line. Without this a
                // keyboard visitor cannot send at all, since the button sits
                // after the field in the tab order.
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(event);
                }
              }}
              placeholder={copy.composerPlaceholder}
              className="max-h-28 min-h-[2.5rem] min-w-0 flex-1 resize-none rounded-[var(--ph3-r-sm)] border border-[var(--ph3-line)] bg-[var(--ph3-surface)] px-3 py-2.5 text-[0.8125rem] outline-none transition-colors placeholder:text-[var(--ph3-muted-3)] focus:border-[var(--ph3-line-2)]"
            />
            <button
              type="submit"
              disabled={draft.trim().length === 0}
              aria-label={copy.send}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--ph3-r-sm)] bg-[var(--ph3-ink)] text-white transition-opacity disabled:opacity-40"
            >
              <Ico icon={solar_send_square_bold} size={16} />
            </button>
          </div>

          {/* The line that keeps the demo honest, right under the field. */}
          <p className="ph3-mono mt-2 text-[0.5625rem] text-[var(--ph3-muted-3)]">
            {copy.disclaimer}
          </p>
        </form>
      </div>
    </div>
  );
}