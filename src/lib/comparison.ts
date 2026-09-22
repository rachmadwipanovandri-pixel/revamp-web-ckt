import type { Locale } from "@/i18n/routing";

/**
 * Competitive comparison matrix, transcribed from the internal deck
 * "Competitive Comparison - Update per August 2026".
 *
 * Two deliberate omissions from that deck:
 *
 * 1. The "Core Product Details" summary slides are NOT here. They mark
 *    Marketing as absent for SleekFlow, Qontak, Qiscus and Halo AI, and CRM as
 *    absent for SleekFlow and Qiscus, while the deck's own detail tables give
 *    those same vendors a tick on most rows of both. Internally that shorthand
 *    means "not sold as a standalone product"; published as a bare cross next
 *    to a named competitor it reads as a claim their own sites disprove.
 *
 * 2. Competitor pricing is NOT here. It moves faster than this page will be
 *    revalidated, and a stale price attributed to a named rival is the single
 *    most complaint-prone thing a comparison page can carry.
 *
 * Everything below comes from the detail tables, which are internally
 * consistent. Cekat's own gaps are kept: we do not do Google Ads, and saying so
 * is what makes the rest of the table credible.
 */

export type Cell =
  | { kind: "yes"; note?: Record<Locale, string> }
  | { kind: "no"; note?: Record<Locale, string> }
  | { kind: "text"; value: Record<Locale, string> };

const y: Cell = { kind: "yes" };
const n: Cell = { kind: "no" };
const yn = (en: string, id: string): Cell => ({
  kind: "yes",
  note: { en, id },
});
const nn = (en: string, id: string): Cell => ({ kind: "no", note: { en, id } });
const tx = (en: string, id: string): Cell => ({
  kind: "text",
  value: { en, id },
});

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  /** Cekat's own column is rendered differently and always leads. */
  isUs?: boolean;
}

export const VENDORS: readonly Vendor[] = [
  { id: "cekat", name: "Cekat.AI", logo: "", isUs: true },
  {
    id: "sleekflow",
    name: "SleekFlow",
    logo: "/images/competitors/sleekflow.webp",
  },
  {
    id: "qontak",
    name: "Mekari Qontak",
    logo: "/images/competitors/mekari-qontak.webp",
  },
  { id: "qiscus", name: "Qiscus", logo: "/images/competitors/qiscus.svg" },
  { id: "haloai", name: "Halo AI", logo: "/images/competitors/halo-ai.png" },
  {
    id: "respondio",
    name: "respond.io",
    logo: "/images/competitors/respond.png",
  },
  {
    id: "yellowai",
    name: "yellow.ai",
    logo: "/images/competitors/yellow-ai.png",
  },
  { id: "sierra", name: "Sierra", logo: "/images/competitors/sierra.png" },
  { id: "odoo", name: "Odoo", logo: "/images/competitors/odoo.png" },
] as const;

export interface ComparisonRow {
  /** Message key under `comparison.tables.<table>.rows`. */
  key: string;
  /** One cell per vendor, in VENDORS order. */
  cells: readonly Cell[];
}

export interface ComparisonTable {
  /** Message key under `comparison.tables`. */
  key: string;
  rows: readonly ComparisonRow[];
}

//                       cekat sleek qontak qiscus halo  respond yellow sierra odoo
export const COMPARISON_TABLES: readonly ComparisonTable[] = [
  {
    key: "channels",
    rows: [
      { key: "whatsapp", cells: [y, y, y, y, y, y, y, y, y] },
      {
        key: "instagram",
        cells: [y, y, y, y, y, y, y, y, yn("DM only", "DM saja")],
      },
      { key: "tiktok", cells: [y, n, n, y, y, y, n, y, n] },
      { key: "sms", cells: [y, y, y, n, n, y, y, n, n] },
      {
        key: "otherChannels",
        cells: [yn("Custom", "Custom"), y, y, y, y, n, y, y, y],
      },
      { key: "webliveChat", cells: [y, y, y, y, n, y, y, y, n] },
      { key: "email", cells: [y, y, y, y, y, y, y, y, y] },
    ],
  },
  {
    key: "marketing",
    rows: [
      { key: "tiktokAds", cells: [y, y, n, y, y, y, n, n, n] },
      {
        key: "metaAds",
        cells: [y, y, y, y, y, y, yn("CTWA only", "CTWA saja"), n, y],
      },
      // Ours is a cross too. The deck is honest about it and so is this page.
      { key: "googleAds", cells: [n, n, n, n, y, n, n, n, n] },
      { key: "waBroadcast", cells: [y, y, y, y, y, y, y, y, y] },
      { key: "roasAnalytics", cells: [y, y, y, y, n, y, y, n, y] },
      { key: "segmentation", cells: [y, y, n, y, n, y, y, n, y] },
    ],
  },
  {
    key: "crm",
    rows: [
      { key: "customerData", cells: [y, y, y, y, y, y, y, n, y] },
      { key: "leadManagement", cells: [y, y, y, y, y, y, y, n, y] },
      { key: "pipelineManagement", cells: [y, y, y, y, y, n, n, n, y] },
      { key: "complaintManagement", cells: [y, y, y, y, n, y, y, y, n] },
    ],
  },
  {
    key: "support",
    rows: [
      {
        key: "freeOnboarding",
        cells: [
          y,
          y,
          y,
          yn("By ticket", "Lewat tiket"),
          yn("Paid below a 6-month term", "Berbayar di bawah kontrak 6 bulan"),
          y,
          n,
          yn("By ticket", "Lewat tiket"),
          yn("Paid below a 6-month term", "Berbayar di bawah kontrak 6 bulan"),
        ],
      },
      {
        key: "remoteDesktop",
        cells: [y, n, n, n, n, n, nn("Custom", "Custom"), n, n],
      },
      { key: "accountReview", cells: [y, n, n, n, n, n, n, n, n] },
      {
        key: "whatsappGroup",
        cells: [
          y,
          y,
          y,
          y,
          yn("Depends on business size", "Tergantung skala bisnis"),
          y,
          yn("Custom", "Custom"),
          n,
          y,
        ],
      },
      {
        key: "freeSetup",
        cells: [y, y, y, y, y, y, yn("Custom", "Custom"), y, y],
      },
      {
        key: "setupTime",
        cells: [
          tx("Under 1 week", "Di bawah 1 minggu"),
          tx("1 week", "1 minggu"),
          tx("3 weeks", "3 minggu"),
          tx("Not specified", "Tidak ditentukan"),
          tx("2 months", "2 bulan"),
          tx("Not specified", "Tidak ditentukan"),
          tx("Up to 5 months", "Hingga 5 bulan"),
          tx("6 months", "6 bulan"),
          tx("1 month", "1 bulan"),
        ],
      },
      {
        key: "minimumContract",
        cells: [
          tx("3 months", "3 bulan"),
          tx("3 months", "3 bulan"),
          tx("6 months", "6 bulan"),
          tx("6 months", "6 bulan"),
          tx("6 months", "6 bulan"),
          tx("None", "Tanpa minimum"),
          tx("1 year", "1 tahun"),
          tx("1 year", "1 tahun"),
          tx("1 month", "1 bulan"),
        ],
      },
    ],
  },
] as const;

/** Rows where Cekat ticks and at least half the field does not. */
/**
 * The three tables the Venn on /perbandingan is about: reach, conversation,
 * and the record that keeps a customer. Support is excluded, it is service
 * rather than product surface.
 */
const PILLAR_TABLES = ["channels", "marketing", "crm"] as const;

/**
 * How many pillar rows each vendor ticks, computed rather than written down.
 *
 * The section above the matrix says we cover more of it than anyone else on
 * the page. That has to be derived from the same array the table renders, or
 * it becomes a lie the first time a row changes: `usLeads` goes false on its
 * own if a competitor ever draws level, and the sentence stops claiming a
 * lead instead of claiming a stale one.
 */
export function pillarCoverage(): {
  total: number;
  ours: number;
  best: number;
  usLeads: boolean;
} {
  const tables = COMPARISON_TABLES.filter((table) =>
    (PILLAR_TABLES as readonly string[]).includes(table.key),
  );
  const total = tables.reduce((sum, table) => sum + table.rows.length, 0);
  const ticks = VENDORS.map((_, index) =>
    tables.reduce(
      (sum, table) =>
        sum +
        table.rows.filter((row) => row.cells[index]?.kind === "yes").length,
      0,
    ),
  );
  const usIndex = VENDORS.findIndex((vendor) => vendor.isUs);
  const ours = ticks[usIndex];
  const best = Math.max(...ticks);
  return {
    total,
    ours,
    best,
    usLeads: ours === best && ticks.filter((t) => t === best).length === 1,
  };
}

export function standoutRows(): { table: string; key: string }[] {
  const standouts: { table: string; key: string }[] = [];
  for (const table of COMPARISON_TABLES) {
    for (const row of table.rows) {
      const [ours, ...others] = row.cells;
      if (ours.kind !== "yes") continue;
      const missing = others.filter((cell) => cell.kind === "no").length;
      if (missing >= others.length / 2) {
        standouts.push({ table: table.key, key: row.key });
      }
    }
  }
  return standouts;
}
