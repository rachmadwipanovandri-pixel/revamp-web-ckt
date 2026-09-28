export interface SheetTarget {
  spreadsheetId: string;
  /** gid from the copied URL (`#gid=0`); null = first tab. */
  gid: number | null;
}

export type WebhookCheck =
  | { ok: true; url: URL }
  | { ok: false; error: string };

export type DeliverTarget =
  | { kind: "empty" }
  | { kind: "sheet"; target: SheetTarget }
  | { kind: "webhook"; url: URL }
  | { kind: "error"; error: string };

const GUIDE_HINT =
  "Buka sheet → Ekstensi → Apps Script → Deploy sebagai Aplikasi web, lalu tempel URL yang diakhiri /exec. Panduannya ada di admin.";

/**
 * Extracts the spreadsheet id + tab gid from a Google Sheets link.
 * Returns null for non-sheet URLs (including `/d/e/…` publish links, whose
 * token cannot be used with the Sheets API).
 */
export function parseSheetUrl(raw: string): SheetTarget | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "docs.google.com") return null;
  const match = url.pathname.match(/^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
  if (!match) return null;
  const spreadsheetId = match[1];
  if (spreadsheetId === "e") return null; // /spreadsheets/d/e/2PACX-…/pub
  const gidMatch = `${url.search}${url.hash}`.match(/gid=(\d+)/);
  return {
    spreadsheetId,
    gid: gidMatch ? Number(gidMatch[1]) : null,
  };
}

/**
 * Validates a per-event sheet webhook before we ever POST to it.
 * The common mistake — pasting the spreadsheet's own edit URL — gets its own
 * actionable message instead of a generic upstream failure.
 */
export function checkWebhookUrl(raw: string): WebhookCheck {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Link sheet belum diisi." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Link sheet tidak valid — bukan URL." };
  }
  if (url.protocol !== "https:") {
    return { ok: false, error: "Link sheet harus https." };
  }

  const isSpreadsheet =
    url.hostname === "docs.google.com" &&
    (url.pathname.startsWith("/spreadsheets/") || url.pathname.startsWith("/forms/"));
  if (isSpreadsheet) {
    return {
      ok: false,
      error: `Itu link Google Sheet/Forms biasa — tidak bisa menerima kiriman form. ${GUIDE_HINT}`,
    };
  }

  return { ok: true, url };
}

/**
 * Decides how a stored link delivers registrations: a plain Sheets link goes
 * through the Sheets API (service account), anything else https is a webhook.
 */
export function resolveDeliverTarget(raw: string): DeliverTarget {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: "empty" };

  const sheet = parseSheetUrl(trimmed);
  if (sheet) return { kind: "sheet", target: sheet };

  if (
    trimmed.includes("docs.google.com/spreadsheets/d/e/") ||
    trimmed.includes("docs.google.com/spreadsheets/u/")
  ) {
    return {
      kind: "error",
      error:
        "Itu link sheet hasil Share/Publish. Buka sheet langsung, lalu salin link dari address bar (…/spreadsheets/d/…/edit).",
    };
  }

  const webhook = checkWebhookUrl(trimmed);
  if (webhook.ok) return { kind: "webhook", url: webhook.url };
  return { kind: "error", error: webhook.error };
}
