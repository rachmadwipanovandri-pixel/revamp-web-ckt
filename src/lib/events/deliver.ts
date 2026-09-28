import "server-only";
import { appendSheetRow, SheetSetupError } from "./sheets";
import { resolveDeliverTarget } from "./webhook";
import type { EventItem, RegisterSection } from "./types";

export interface DeliverInput {
  event: EventItem;
  section: RegisterSection | undefined;
  values: Record<string, string>;
  /** Overrides the row timestamp (tests pin a fixed value). */
  submittedAt?: string;
}

export type DeliverResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function sheetHeader(section: RegisterSection | undefined): string[] {
  const fields = section?.fields ?? [];
  return ["Waktu", "Judul Event", ...fields.map((f) => f.label || f.name)];
}

function sheetRow(
  event: EventItem,
  section: RegisterSection | undefined,
  values: Record<string, string>,
  submittedAt: string,
): string[] {
  const fields = section?.fields ?? [];
  return [
    submittedAt,
    event.title,
    ...fields.map((f) => values[f.name] ?? ""),
  ];
}

/**
 * Delivers one registration to wherever the event's link points: a plain
 * Google Sheets link (Sheets API) or a webhook URL (Apps Script etc).
 */
export async function deliverRegistration(
  input: DeliverInput,
): Promise<DeliverResult> {
  const { event, section, values } = input;
  const submittedAt = input.submittedAt ?? new Date().toISOString();
  const target = resolveDeliverTarget(event.registrationWebhook);

  switch (target.kind) {
    case "empty":
      return {
        ok: false,
        status: 503,
        error: "Link sheet belum diisi penyelenggara",
      };

    case "error":
      return { ok: false, status: 503, error: target.error };

    case "sheet": {
      try {
        await appendSheetRow(
          target.target,
          sheetHeader(section),
          sheetRow(event, section, values, submittedAt),
        );
        return { ok: true };
      } catch (error) {
        if (error instanceof SheetSetupError) {
          // Configuration problem (missing/invalid service account, no access)
          // — not a transient upstream failure.
          return { ok: false, status: 503, error: error.message };
        }
        return {
          ok: false,
          status: 502,
          error: "Gagal menulis ke sheet. Coba lagi.",
        };
      }
    }

    case "webhook": {
      const response = await fetch(target.url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          eventTitle: event.title,
          values,
          submittedAt,
        }),
      }).catch(() => null);

      if (!response) {
        return {
          ok: false,
          status: 502,
          error: "Tidak bisa menghubungi link sheet. Cek link-nya lalu coba lagi.",
        };
      }
      if (!response.ok) {
        return {
          ok: false,
          status: 502,
          error: `Link sheet menolak kiriman (HTTP ${response.status}). Pastikan link-nya URL Web App Apps Script yang di-Deploy sebagai “Siapa saja” (…/exec).`,
        };
      }
      return { ok: true };
    }
  }
}
