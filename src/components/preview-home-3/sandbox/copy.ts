import type { L } from "./data";

/**
 * The shape of the hands-on demo's copy, in one place.
 *
 * It lives here rather than beside `Sandbox3` because five modules need a slice
 * of it. When each module declared its own inline prop type, the compiler had no
 * way to notice that `OmsSandbox` and the `oms` block in the copy file had
 * drifted — they did, twice, and it surfaced as a build error rather than as
 * something stranger. One exported type, imported by all six, means the two sides
 * cannot disagree.
 */
export type SandboxCopy = {
  eyebrow: string;
  heading: string;
  body: string;
  tablistLabel: string;
  demoBadge: string;
  footNote: string;
  modules: Record<"chat" | "crm" | "oms" | "marketing" | "consultant", L>;
  chat: {
    search: string;
    filterAll: string;
    composerLabel: string;
    composerPlaceholder: string;
    send: string;
    disclaimer: string;
    stageHint: string;
    empty: string;
  };
  crm: {
    search: string;
    empty: string;
    advance: string;
    detail: string;
    close: string;
    wonHint: L;
  };
  oms: {
    search: string;
    all: string;
    empty: string;
    advance: string;
    stuck: string;
  };
  marketing: {
    audience: string;
    send: string;
    sent: string;
    excluded: string;
    expected: string;
    note: string;
    why: string;
  };
  consultant: {
    ask: string;
    placeholder: string;
    send: string;
    suggested: string;
    sources: string;
    askMore: string;
    fallback: L;
  };
};