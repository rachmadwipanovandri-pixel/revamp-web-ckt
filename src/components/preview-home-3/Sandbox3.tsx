"use client";

import { useRef, useState } from "react";
import { Ico } from "./Icon";
import type { IconifyIcon } from "@iconify/react/offline";
import {
  solar_bag_3_bold,
  solar_case_minimalistic_bold,
  solar_chat_round_line_bold,
  solar_compass_bold,
  solar_users_group_rounded_bold,
} from "./icons";
import { Section, SectionHead, Shell } from "./ui";
import { ChatSandbox } from "./sandbox/ChatSandbox";
import { CrmSandbox } from "./sandbox/CrmSandbox";
import { OmsSandbox } from "./sandbox/OmsSandbox";
import { MarketingSandbox } from "./sandbox/MarketingSandbox";
import { ConsultantSandbox } from "./sandbox/ConsultantSandbox";
import type { L } from "./sandbox/data";
import type { SandboxCopy } from "./sandbox/copy";
export type { SandboxCopy };

/**
 * The hands-on demo — five modules, each one actually operable.
 *
 * Everything else on this page is drawn *for* the visitor: the hero window plays
 * on a timer whether or not anyone is watching, the feature grid swaps tabs
 * itself. A mock is worth a screenshot. This is the one band where the visitor
 * is the input — they search the book, advance a deal, step an order, retarget a
 * broadcast, ask a question — which is the difference between reading about a
 * product and finding out whether they like it.
 *
 * Five modules rather than one, because a company selling five products that
 * shows one of them has decided for the visitor which one to care about. Each
 * tab has a genuinely different interaction, so switching them is not the same
 * screen with a different heading:
 *
 *   chat        filter, pick, type, get a scripted answer
 *   crm         move a deal down the pipeline
 *   oms         narrow the order book, step a status
 *   marketing   choose an audience, watch the projection change
 *   consultant  ask, and see which sources the answer came from
 *
 * Three rules, because a demo that pretends to be a product is worse than none:
 *
 *   1. Nothing leaves the browser. No fetch, no form post, nothing derived from
 *      what is typed. The chat composer says so under the field, where someone
 *      about to type a real customer name will actually read it.
 *   2. Replies are scripted. That is the product's real behaviour — the
 *      assistant answers from the business's own information — so saying so is
 *      both honest and the actual claim.
 *   3. It is labelled a demo, in the chrome rather than a footnote, because the
 *      chrome is the part that survives switching tabs.
 *
 * Accessibility notes, which differ from the rest of the page on purpose:
 *
 *   - The module tablist is a real `tablist` with roving arrow-key focus, and it
 *     does *not* auto-rotate. Nothing here is time-driven, so WCAG 2.2.2 does not
 *     apply — unlike the hero window, which is why that one needs a pause button
 *     and this one does not.
 *   - The chat thread IS `aria-live`. Everywhere else on this page a live region
 *     would interrupt a screen-reader user forever; here the thread only changes
 *     because the visitor acted, which is exactly the case one is for.
 *   - The contact list uses `aria-current`, and each module's controls are real
 *     buttons, so nothing here needs a pointer.
 */

/** `compass` is only used by the consultant module's own icon below. */
type Module = {
  key: string;
  label: L;
  icon: IconifyIcon;
};

export function Sandbox3({
  copy,
  locale,
}: {
  copy: SandboxCopy;
  locale: string;
}) {
  const en = locale === "en";
  const t = (l: L) => (en ? l.en : l.id);

  const modules: Module[] = [
    { key: "chat", label: copy.modules.chat, icon: solar_chat_round_line_bold },
    { key: "crm", label: copy.modules.crm, icon: solar_users_group_rounded_bold },
    { key: "oms", label: copy.modules.oms, icon: solar_bag_3_bold },
    {
      key: "marketing",
      label: copy.modules.marketing,
      icon: solar_case_minimalistic_bold,
    },
    {
      key: "consultant",
      label: copy.modules.consultant,
      icon: solar_compass_bold,
    },
  ];

  const [active, setActive] = useState(modules[0].key);
  /*
   * Roving tabindex. Every tab has tabIndex 0 in a plain tablist, so Tab walks
   * through all five and then out of the band into the next thing on the page —
   * which turns a five-item tab strip into five extra stops. Arrow keys move
   * within it, which is what the ARIA pattern is for.
   */
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const here = modules.findIndex((m) => m.key === active);
    let next = -1;
    if (event.key === "ArrowRight") next = (here + 1) % modules.length;
    else if (event.key === "ArrowLeft") next = (here - 1 + modules.length) % modules.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = modules.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(modules[next].key);
    tabsRef.current[next]?.focus();
  }

  return (
    <Section id="sandbox" rule labelledBy="ph3-sandbox-title">
      <Shell>
        <SectionHead
          id="ph3-sandbox-title"
          eyebrow={copy.eyebrow}
          title={copy.heading}
          body={copy.body}
        />

        {/* ---- module tabs ---- */}
        <div
          role="tablist"
          aria-label={copy.tablistLabel}
          onKeyDown={onKeyDown}
          className="mt-10 flex gap-1 overflow-x-auto border-b border-[var(--ph3-line)] sm:mt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {modules.map((module, index) => {
            const on = module.key === active;
            return (
              <button
                key={module.key}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`ph3-sb-tab-${module.key}`}
                aria-selected={on}
                aria-controls={`ph3-sb-panel-${module.key}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(module.key)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[0.8125rem] transition-colors ${
                  on
                    ? "border-[var(--ph3-accent)] font-medium text-[var(--ph3-ink)]"
                    : "border-transparent text-[var(--ph3-muted)] hover:text-[var(--ph3-ink)]"
                }`}
              >
                <Ico
                  icon={module.icon}
                  size={14}
                  className={on ? "text-[var(--ph3-accent)]" : undefined}
                />
                <span className="whitespace-nowrap">{t(module.label)}</span>
              </button>
            );
          })}
        </div>

        {/* ---- the surface ---- */}
        <div
          id={`ph3-sb-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`ph3-sb-tab-${active}`}
          tabIndex={0}
          className="ph3-window"
          data-ph3-enter
        >
          <div className="ph3-window-bar">
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--ph3-line-2)]" />
            </span>
            <span className="ph3-window-url">
              app.cekat.ai / {active}
            </span>
            <span className="ph3-chip ph3-chip-accent ml-auto h-5 shrink-0">
              {copy.demoBadge}
            </span>
          </div>

          <div key={active}>
            {active === "chat" ? <ChatSandbox copy={copy.chat} en={en} /> : null}
            {active === "crm" ? <CrmSandbox copy={copy.crm} en={en} hint={copy.crm.wonHint} /> : null}
            {active === "oms" ? <OmsSandbox copy={copy.oms} en={en} /> : null}
            {active === "marketing" ? <MarketingSandbox copy={copy.marketing} en={en} /> : null}
            {active === "consultant" ? (
              <ConsultantSandbox copy={copy.consultant} en={en} />
            ) : null}
          </div>
        </div>

        <p className="ph3-mono mt-3 text-[0.5625rem] text-[var(--ph3-muted-3)]">
          {copy.footNote}
        </p>
      </Shell>
    </Section>
  );
}
